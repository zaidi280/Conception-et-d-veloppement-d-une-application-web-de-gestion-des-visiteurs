package com.csys.template.service;



import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.csys.template.domain.TypeVisiteur;
import com.csys.template.domain.User;
import com.csys.template.domain.Visiteur;
import com.csys.template.dto.AverageVisitDurationChartDTO;
import com.csys.template.dto.DailyPeakHourDTO;
import com.csys.template.dto.EntryTimeChartDTO;
import com.csys.template.dto.VisitDurationChartDTO;
import com.csys.template.dto.VisiteurDTO;
import com.csys.template.dto.VisitorTypeChartDTO;
import com.csys.template.factory.VisiteurFactory;
import com.csys.template.repository.UserRepository;
import com.csys.template.repository.VisiteurRepository;
import com.google.common.base.Preconditions;

@Service
@Transactional
public class VisiteurService {

    private final Logger log = LoggerFactory.getLogger(VisiteurService.class);

    private final VisiteurRepository visiteurRepository;
    private final UserRepository userRepository;

    public VisiteurService(VisiteurRepository visiteurRepository, UserRepository userRepository) {
        this.visiteurRepository = visiteurRepository;
        this.userRepository = userRepository;
    }

    private void validateUser(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User '" + username + "' does not exist in the system");
        }
    }

    private void validateCinFormat(String cin) {
        if (cin == null || cin.trim().isEmpty()) {
            throw new IllegalArgumentException("CIN cannot be null or empty");
        }

        // CIN must be exactly 8 digits
        if (!cin.matches("^\\d{8}$")) {
            throw new IllegalArgumentException("CIN must be exactly 8 digits (numbers only). Current value: '" + cin + "'");
        }
    }

    private void validateMatriculeFiscaleFormat(String matriculeFiscale) {
        if (matriculeFiscale == null || matriculeFiscale.trim().isEmpty()) {
            throw new IllegalArgumentException("MatriculeFiscale is required and cannot be null or empty");
        }

        // MatriculeFiscale must be exactly 7 digits + 1 letter (8 characters total)
        if (!matriculeFiscale.matches("^\\d{7}[A-Za-z]$")) {
            throw new IllegalArgumentException("MatriculeFiscale must be exactly 7 digits followed by 1 letter (e.g., 1234567A). Current value: '" + matriculeFiscale + "'");
        }
    }

    private void validateCinUniqueness(String cin) {
        // Check if there's an active visiteur (not yet left) with the same CIN
        Optional<Visiteur> activeVisiteur = visiteurRepository.findActiveByCin(cin);
        if (activeVisiteur.isPresent()) {
            throw new IllegalArgumentException("CIN '" + cin + "' is already in use by an active visiteur (ID: " +
                activeVisiteur.get().getId() + "). The visiteur must leave before this CIN can be used again.");
        }
    }

    @Transactional
    public VisiteurDTO save(VisiteurDTO dto, String currentUser) {
        log.debug("Request to save Visiteur: {} by user: {}", dto, currentUser);

        // Validate that the user exists in the database
        validateUser(currentUser);

        // Validate CIN format (8 digits only)
        validateCinFormat(dto.getCin());

        // Validate MatriculeFiscale format (7 digits + 1 letter)
        validateMatriculeFiscaleFormat(dto.getMatriculeFiscale());

        // Validate CIN uniqueness for active visiteurs
        validateCinUniqueness(dto.getCin());

        Visiteur visiteur = VisiteurFactory.dtoToEntity(dto);

        // Automatically set dateEntree to current system date/time
        visiteur.setDateEntree(LocalDateTime.now());
        // Ensure dateSortie is null for new visiteurs
        visiteur.setDateSortie(null);
        // Set the user who added the entry
        visiteur.setUserEntree(currentUser);
        // Ensure userSortie is null for new visiteurs
        visiteur.setUserSortie(null);

        log.debug("Setting dateEntree to: {} by user: {}", visiteur.getDateEntree(), currentUser);

        visiteur = visiteurRepository.save(visiteur);
        return VisiteurFactory.entityToDto(visiteur);
    }

    public VisiteurDTO update(VisiteurDTO dto) {
        log.debug("Request to update Visiteur: {}", dto);
        Visiteur inBase = visiteurRepository.findById(dto.getId()).orElse(null);
        Preconditions.checkArgument(inBase != null, "visiteur.NotFound");

        Visiteur visiteur = VisiteurFactory.dtoToEntity(dto);
        visiteur = visiteurRepository.save(visiteur);
        return VisiteurFactory.entityToDto(visiteur);
    }

    @Transactional
    public VisiteurDTO markSortie(Long visiteurId, String currentUser) {
        log.debug("Request to mark sortie for Visiteur ID: {} by user: {}", visiteurId, currentUser);

        // Validate that the user exists in the database
        validateUser(currentUser);

        Visiteur visiteur = visiteurRepository.findById(visiteurId).orElse(null);
        Preconditions.checkArgument(visiteur != null, "visiteur.NotFound");
        Preconditions.checkArgument(visiteur.getDateSortie() == null, "visiteur.AlreadyLeft");

        // Set dateSortie to current system date/time
        visiteur.setDateSortie(LocalDateTime.now());
        // Set the user who marked the exit
        visiteur.setUserSortie(currentUser);
        visiteur = visiteurRepository.save(visiteur);

        return VisiteurFactory.entityToDto(visiteur);
    }

    @Transactional(readOnly = true)
    public VisiteurDTO findOne(Long id) {
        log.debug("Request to get Visiteur: {}", id);
        Visiteur entity = visiteurRepository.findById(id).orElse(null);
        return VisiteurFactory.entityToDto(entity);
    }

    @Transactional(readOnly = true)
    public List<VisiteurDTO> findAll() {
        log.debug("Request to get All Visiteurs");
        return visiteurRepository.findAll()
                .stream()
                .map(VisiteurFactory::entityToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VisiteurDTO> findVisiteursByFilter(String filterType, LocalDate dateFrom, LocalDate dateTo) {
        log.debug("Request to get Visiteurs with filter type: {}, dateFrom: {}, dateTo: {}",
                  filterType, dateFrom, dateTo);

        // Set default date range if not provided (last 30 days to today to capture more data)
        LocalDate today = LocalDate.now();
        LocalDate effectiveDateFrom = (dateFrom != null) ? dateFrom : today.minusDays(30);
        LocalDate effectiveDateTo = (dateTo != null) ? dateTo : today;

        LocalDateTime startOfDateFrom = effectiveDateFrom.atStartOfDay();
        LocalDateTime endOfDateTo = effectiveDateTo.atTime(23, 59, 59, 999999999);

        log.debug("Effective date range: {} to {}", startOfDateFrom, endOfDateTo);

        try {
            Specification<Visiteur> spec = buildFilterSpecification(filterType, startOfDateFrom, endOfDateTo);
            List<Visiteur> visiteurs = visiteurRepository.findAll(spec);

            log.debug("Found {} visiteurs with specification", visiteurs.size());
            for (Visiteur v : visiteurs) {
                log.debug("Visiteur: id={}, nom={}, dateEntree={}, dateSortie={}",
                         v.getId(), v.getNom(), v.getDateEntree(), v.getDateSortie());
            }

            return visiteurs.stream()
                    .map(VisiteurFactory::entityToDto)
                    .collect(Collectors.toList());

        } catch (UnsupportedOperationException e) {
            log.warn("Specification not supported, falling back to manual filtering");
            return findVisiteursByFilterManual(filterType, startOfDateFrom, endOfDateTo);
        }
    }

    private Specification<Visiteur> buildFilterSpecification(String filterType, LocalDateTime startOfDateFrom,
                                                           LocalDateTime endOfDateTo) {
        Specification<Visiteur> spec = Specification.where(null);

        switch (filterType.toLowerCase()) {
            case "entree":
                // Visiteurs who entered in the specified date range and haven't left yet (dateSortie = null)
                spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.and(
                        criteriaBuilder.between(root.get("dateEntree"), startOfDateFrom, endOfDateTo),
                        criteriaBuilder.isNull(root.get("dateSortie"))
                    ));
                break;

            case "sortie":
                // Visiteurs who entered in the specified date range AND also left within that same date range
                spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.and(
                        criteriaBuilder.between(root.get("dateEntree"), startOfDateFrom, endOfDateTo),
                        criteriaBuilder.between(root.get("dateSortie"), startOfDateFrom, endOfDateTo)
                    ));
                break;

            case "tous":
            default:
                // All visiteurs who entered OR left within the specified date range
                spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.or(
                        // Visiteurs who entered in the date range
                        criteriaBuilder.between(root.get("dateEntree"), startOfDateFrom, endOfDateTo),
                        // Visiteurs who left in the date range
                        criteriaBuilder.and(
                            criteriaBuilder.isNotNull(root.get("dateSortie")),
                            criteriaBuilder.between(root.get("dateSortie"), startOfDateFrom, endOfDateTo)
                        )
                    ));
                break;
        }

        return spec;
    }

    private List<VisiteurDTO> findVisiteursByFilterManual(String filterType, LocalDateTime startOfDateFrom,
                                                         LocalDateTime endOfDateTo) {
        log.debug("Using manual filtering for results");

        // Get all visiteurs and filter manually
        List<Visiteur> allVisiteurs = visiteurRepository.findAll();
        log.debug("Total visiteurs in database: {}", allVisiteurs.size());

        for (Visiteur v : allVisiteurs) {
            log.debug("DB Visiteur: id={}, nom={}, dateEntree={}, dateSortie={}",
                     v.getId(), v.getNom(), v.getDateEntree(), v.getDateSortie());
        }

        // Apply filters manually
        List<Visiteur> filteredVisiteurs = allVisiteurs.stream()
            .filter(visiteur -> {
                switch (filterType.toLowerCase()) {
                    case "entree":
                        // Visiteurs who entered in the specified date range and haven't left yet
                        boolean entreeMatch = visiteur.getDateEntree() != null &&
                               visiteur.getDateEntree().isAfter(startOfDateFrom.minusSeconds(1)) &&
                               visiteur.getDateEntree().isBefore(endOfDateTo.plusSeconds(1)) &&
                               visiteur.getDateSortie() == null;
                        log.debug("Entree filter for {}: dateEntree={}, dateSortie={}, match={}",
                                 visiteur.getNom(), visiteur.getDateEntree(), visiteur.getDateSortie(), entreeMatch);
                        return entreeMatch;

                    case "sortie":
                        // Visiteurs who entered in the specified date range AND also left within that same date range
                        boolean sortieMatch = visiteur.getDateEntree() != null &&
                               visiteur.getDateEntree().isAfter(startOfDateFrom.minusSeconds(1)) &&
                               visiteur.getDateEntree().isBefore(endOfDateTo.plusSeconds(1)) &&
                               visiteur.getDateSortie() != null &&
                               visiteur.getDateSortie().isAfter(startOfDateFrom.minusSeconds(1)) &&
                               visiteur.getDateSortie().isBefore(endOfDateTo.plusSeconds(1));
                        log.debug("Sortie filter for {}: dateEntree={}, dateSortie={}, match={}",
                                 visiteur.getNom(), visiteur.getDateEntree(), visiteur.getDateSortie(), sortieMatch);
                        return sortieMatch;

                    case "tous":
                    default:
                        // All visiteurs who entered OR left within the specified date range
                        boolean enteredInRange = visiteur.getDateEntree() != null &&
                               visiteur.getDateEntree().isAfter(startOfDateFrom.minusSeconds(1)) &&
                               visiteur.getDateEntree().isBefore(endOfDateTo.plusSeconds(1));

                        boolean leftInRange = visiteur.getDateSortie() != null &&
                               visiteur.getDateSortie().isAfter(startOfDateFrom.minusSeconds(1)) &&
                               visiteur.getDateSortie().isBefore(endOfDateTo.plusSeconds(1));

                        boolean tousMatch = enteredInRange || leftInRange;
                        log.debug("Tous filter for {}: dateEntree={}, dateSortie={}, enteredInRange={}, leftInRange={}, match={}",
                                 visiteur.getNom(), visiteur.getDateEntree(), visiteur.getDateSortie(),
                                 enteredInRange, leftInRange, tousMatch);
                        return tousMatch;
                }
            })
            .collect(Collectors.toList());

        log.debug("Filtered visiteurs count: {}", filteredVisiteurs.size());

        // Convert to DTOs and return
        return filteredVisiteurs.stream()
                .map(VisiteurFactory::entityToDto)
                .collect(Collectors.toList());
    }





    public void delete(Long id) {
        log.debug("Request to delete Visiteur: {}", id);
        visiteurRepository.deleteById(id);
    }

    /**
     * Get entry time analysis for chart data
     * @param dateFrom start date for analysis
     * @param dateTo end date for analysis
     * @return List of entry time chart data grouped by hour ranges
     */
    @Transactional(readOnly = true)
    public List<EntryTimeChartDTO> getEntryTimeAnalysis(LocalDate dateFrom, LocalDate dateTo) {
        log.debug("Request to get entry time analysis from {} to {}", dateFrom, dateTo);

        // Set default date range if not provided (last 7 days)
        LocalDate effectiveDateFrom = (dateFrom != null) ? dateFrom : LocalDate.now().minusDays(7);
        LocalDate effectiveDateTo = (dateTo != null) ? dateTo : LocalDate.now();

        LocalDateTime startOfDateFrom = effectiveDateFrom.atStartOfDay();
        LocalDateTime endOfDateTo = effectiveDateTo.atTime(23, 59, 59, 999999999);

        // Get all visiteurs in the date range
        List<Visiteur> visiteurs = visiteurRepository.findAll().stream()
            .filter(v -> v.getDateEntree() != null &&
                        v.getDateEntree().isAfter(startOfDateFrom.minusSeconds(1)) &&
                        v.getDateEntree().isBefore(endOfDateTo.plusSeconds(1)))
            .collect(Collectors.toList());

        // Group by hour ranges
        Map<String, Long> hourCounts = new HashMap<>();

        // Initialize all hour ranges with 0
        for (int hour = 0; hour < 24; hour++) {
            String timeRange = String.format("%02d:00-%02d:00", hour, (hour + 1) % 24);
            hourCounts.put(timeRange, 0L);
        }

        // Count entries by hour
        for (Visiteur visiteur : visiteurs) {
            int hour = visiteur.getDateEntree().getHour();
            String timeRange = String.format("%02d:00-%02d:00", hour, (hour + 1) % 24);
            hourCounts.put(timeRange, hourCounts.get(timeRange) + 1);
        }

        // Convert to DTO list
        List<EntryTimeChartDTO> chartData = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            String timeRange = String.format("%02d:00-%02d:00", hour, (hour + 1) % 24);
            String label = getTimeRangeLabel(hour);
            Long count = hourCounts.get(timeRange);

            chartData.add(new EntryTimeChartDTO(timeRange, count, label));
        }

        log.debug("Generated entry time analysis with {} time ranges", chartData.size());
        return chartData;
    }



    private String getTimeRangeLabel(int hour) {
        if (hour >= 6 && hour < 12) {
            return "Morning (" + String.format("%02d:00-%02d:00", hour, hour + 1) + ")";
        } else if (hour >= 12 && hour < 18) {
            return "Afternoon (" + String.format("%02d:00-%02d:00", hour, hour + 1) + ")";
        } else if (hour >= 18 && hour < 22) {
            return "Evening (" + String.format("%02d:00-%02d:00", hour, hour + 1) + ")";
        } else {
            return "Night (" + String.format("%02d:00-%02d:00", hour, hour + 1) + ")";
        }
    }

    /**
     * Get visit duration analysis for chart data
     * @param dateFrom start date for analysis
     * @param dateTo end date for analysis
     * @return List of visit duration chart data grouped by duration ranges
     */
    @Transactional(readOnly = true)
    public List<VisitDurationChartDTO> getVisitDurationAnalysis(LocalDate dateFrom, LocalDate dateTo) {
        log.debug("Request to get visit duration analysis from {} to {}", dateFrom, dateTo);

        // Set default date range if not provided (last 7 days)
        LocalDate effectiveDateFrom = (dateFrom != null) ? dateFrom : LocalDate.now().minusDays(7);
        LocalDate effectiveDateTo = (dateTo != null) ? dateTo : LocalDate.now();

        LocalDateTime startOfDateFrom = effectiveDateFrom.atStartOfDay();
        LocalDateTime endOfDateTo = effectiveDateTo.atTime(23, 59, 59, 999999999);

        // Get all completed visits (visiteurs who have both dateEntree and dateSortie)
        List<Visiteur> completedVisits = visiteurRepository.findAll().stream()
            .filter(v -> v.getDateEntree() != null &&
                        v.getDateSortie() != null &&
                        v.getDateEntree().isAfter(startOfDateFrom.minusSeconds(1)) &&
                        v.getDateEntree().isBefore(endOfDateTo.plusSeconds(1)))
            .collect(Collectors.toList());

        // Calculate durations and group by ranges
        Map<String, List<Long>> durationGroups = new HashMap<>();

        // Initialize duration ranges
        String[] ranges = {
            "0-30 min", "30-60 min", "1-2 hours", "2-4 hours",
            "4-8 hours", "8-12 hours", "12-24 hours", "24+ hours"
        };

        for (String range : ranges) {
            durationGroups.put(range, new ArrayList<>());
        }

        // Calculate duration for each visit and categorize
        for (Visiteur visiteur : completedVisits) {
            Duration duration = Duration.between(visiteur.getDateEntree(), visiteur.getDateSortie());
            long minutes = duration.toMinutes();

            String category = categorizeDuration(minutes);
            durationGroups.get(category).add(minutes);
        }

        // Convert to DTO list
        List<VisitDurationChartDTO> chartData = new ArrayList<>();
        for (String range : ranges) {
            List<Long> durations = durationGroups.get(range);
            long count = durations.size();
            double averageDuration = durations.isEmpty() ? 0.0 :
                durations.stream().mapToLong(Long::longValue).average().orElse(0.0);

            String label = getDurationRangeLabel(range);
            chartData.add(new VisitDurationChartDTO(range, count, label, averageDuration));
        }

        log.debug("Generated visit duration analysis with {} duration ranges", chartData.size());
        return chartData;
    }

    private String categorizeDuration(long minutes) {
        if (minutes < 30) {
            return "0-30 min";
        } else if (minutes < 60) {
            return "30-60 min";
        } else if (minutes < 120) {
            return "1-2 hours";
        } else if (minutes < 240) {
            return "2-4 hours";
        } else if (minutes < 480) {
            return "4-8 hours";
        } else if (minutes < 720) {
            return "8-12 hours";
        } else if (minutes < 1440) {
            return "12-24 hours";
        } else {
            return "24+ hours";
        }
    }

    private String getDurationRangeLabel(String range) {
        switch (range) {
            case "0-30 min":
                return "Quick Visit (0-30 min)";
            case "30-60 min":
                return "Short Visit (30-60 min)";
            case "1-2 hours":
                return "Medium Visit (1-2 hours)";
            case "2-4 hours":
                return "Long Visit (2-4 hours)";
            case "4-8 hours":
                return "Extended Visit (4-8 hours)";
            case "8-12 hours":
                return "Half Day (8-12 hours)";
            case "12-24 hours":
                return "Full Day (12-24 hours)";
            case "24+ hours":
                return "Multi-Day (24+ hours)";
            default:
                return range;
        }
    }

    /**
     * Get visitor type analysis for chart data
     * @param dateFrom start date for analysis
     * @param dateTo end date for analysis
     * @return List of visitor type chart data grouped by type
     */
    @Transactional(readOnly = true)
    public List<VisitorTypeChartDTO> getVisitorTypeAnalysis(LocalDate dateFrom, LocalDate dateTo) {
        log.debug("Request to get visitor type analysis from {} to {}", dateFrom, dateTo);

        // Set default date range if not provided (last 7 days)
        LocalDate effectiveDateFrom = (dateFrom != null) ? dateFrom : LocalDate.now().minusDays(7);
        LocalDate effectiveDateTo = (dateTo != null) ? dateTo : LocalDate.now();

        LocalDateTime startOfDateFrom = effectiveDateFrom.atStartOfDay();
        LocalDateTime endOfDateTo = effectiveDateTo.atTime(23, 59, 59, 999999999);

        // Get all visiteurs in the date range
        List<Visiteur> visiteurs = visiteurRepository.findAll().stream()
            .filter(v -> v.getDateEntree() != null &&
                        v.getDateEntree().isAfter(startOfDateFrom.minusSeconds(1)) &&
                        v.getDateEntree().isBefore(endOfDateTo.plusSeconds(1)))
            .collect(Collectors.toList());

        // Count by visitor type
        Map<TypeVisiteur, Long> typeCounts = new HashMap<>();

        // Initialize all types with 0
        for (TypeVisiteur type : TypeVisiteur.values()) {
            typeCounts.put(type, 0L);
        }

        // Count visits by type
        for (Visiteur visiteur : visiteurs) {
            if (visiteur.getTypeVisiteur() != null) {
                typeCounts.put(visiteur.getTypeVisiteur(),
                    typeCounts.get(visiteur.getTypeVisiteur()) + 1);
            }
        }

        // Calculate total for percentage calculation
        long totalVisits = typeCounts.values().stream().mapToLong(Long::longValue).sum();

        // Convert to DTO list
        List<VisitorTypeChartDTO> chartData = new ArrayList<>();
        for (TypeVisiteur type : TypeVisiteur.values()) {
            Long count = typeCounts.get(type);
            Double percentage = totalVisits > 0 ? (count * 100.0 / totalVisits) : 0.0;
            String label = getVisitorTypeLabel(type);

            chartData.add(new VisitorTypeChartDTO(
                type.name(), count, label, percentage));
        }

        // Sort by count descending
        chartData.sort((a, b) -> Long.compare(b.getCount(), a.getCount()));

        log.debug("Generated visitor type analysis with {} types, total visits: {}",
                 chartData.size(), totalVisits);
        return chartData;
    }

    private String getVisitorTypeLabel(TypeVisiteur type) {
        switch (type) {
            case DOCTEUR:
                return "Docteurs";
            case FOURNISSEUR:
                return "Fournisseurs";
            case VISITEUR_MALADE:
                return "Visiteurs Malades";
            default:
                return type.getValue();
        }
    }

    /**
     * Get average visit duration analysis for chart data (daily breakdown)
     * @param dateFrom start date for analysis
     * @param dateTo end date for analysis
     * @return List of average visit duration chart data grouped by day
     */
    @Transactional(readOnly = true)
    public List<AverageVisitDurationChartDTO> getAverageVisitDurationAnalysis(LocalDate dateFrom, LocalDate dateTo) {
        log.debug("Request to get average visit duration analysis from {} to {}", dateFrom, dateTo);

        // Set default date range if not provided (last 7 days)
        LocalDate effectiveDateFrom = (dateFrom != null) ? dateFrom : LocalDate.now().minusDays(7);
        LocalDate effectiveDateTo = (dateTo != null) ? dateTo : LocalDate.now();

        List<AverageVisitDurationChartDTO> chartData = new ArrayList<>();

        // Iterate through each day in the range
        LocalDate currentDate = effectiveDateFrom;
        while (!currentDate.isAfter(effectiveDateTo)) {
            LocalDateTime startOfDay = currentDate.atStartOfDay();
            LocalDateTime endOfDay = currentDate.atTime(23, 59, 59, 999999999);

            // Get completed visits for this day (based on entry date)
            List<Visiteur> dayVisits = visiteurRepository.findAll().stream()
                .filter(v -> v.getDateEntree() != null &&
                            v.getDateSortie() != null &&
                            v.getDateEntree().isAfter(startOfDay.minusSeconds(1)) &&
                            v.getDateEntree().isBefore(endOfDay.plusSeconds(1)))
                .collect(Collectors.toList());

            if (!dayVisits.isEmpty()) {
                // Calculate average duration for this day
                double totalMinutes = dayVisits.stream()
                    .mapToLong(v -> Duration.between(v.getDateEntree(), v.getDateSortie()).toMinutes())
                    .average()
                    .orElse(0.0);

                double totalHours = totalMinutes / 60.0;
                long visitCount = dayVisits.size();

                String period = currentDate.toString();
                String label = formatDateLabel(currentDate);

                chartData.add(new AverageVisitDurationChartDTO(
                    period, totalMinutes, totalHours, visitCount, label));
            } else {
                // No visits for this day
                String period = currentDate.toString();
                String label = formatDateLabel(currentDate);

                chartData.add(new AverageVisitDurationChartDTO(
                    period, 0.0, 0.0, 0L, label));
            }

            currentDate = currentDate.plusDays(1);
        }

        log.debug("Generated average visit duration analysis with {} days", chartData.size());
        return chartData;
    }

    private String formatDateLabel(LocalDate date) {
        // Format: "Lun 01/07" or "Mar 02/07"
        String dayOfWeek = getDayOfWeekInFrench(date.getDayOfWeek().getValue());
        String dayMonth = String.format("%02d/%02d", date.getDayOfMonth(), date.getMonthValue());
        return dayOfWeek + " " + dayMonth;
    }

    private String getDayOfWeekInFrench(int dayOfWeek) {
        switch (dayOfWeek) {
            case 1: return "Lun";
            case 2: return "Mar";
            case 3: return "Mer";
            case 4: return "Jeu";
            case 5: return "Ven";
            case 6: return "Sam";
            case 7: return "Dim";
            default: return "???";
        }
    }

    /**
     * Get daily peak hours analysis for card display
     * @param dateFrom start date for analysis
     * @param dateTo end date for analysis
     * @return List of daily peak hour data for each day
     */
    @Transactional(readOnly = true)
    public List<DailyPeakHourDTO> getDailyPeakHours(LocalDate dateFrom, LocalDate dateTo) {
        log.debug("Request to get daily peak hours from {} to {}", dateFrom, dateTo);

        // Set default date range if not provided (last 7 days)
        LocalDate effectiveDateFrom = (dateFrom != null) ? dateFrom : LocalDate.now().minusDays(7);
        LocalDate effectiveDateTo = (dateTo != null) ? dateTo : LocalDate.now();

        List<DailyPeakHourDTO> dailyPeakHours = new ArrayList<>();

        // Iterate through each day in the range
        LocalDate currentDate = effectiveDateFrom;
        while (!currentDate.isAfter(effectiveDateTo)) {
            LocalDateTime startOfDay = currentDate.atStartOfDay();
            LocalDateTime endOfDay = currentDate.atTime(23, 59, 59, 999999999);

            // Get all entries for this day
            List<Visiteur> dayEntries = visiteurRepository.findAll().stream()
                .filter(v -> v.getDateEntree() != null &&
                            v.getDateEntree().isAfter(startOfDay.minusSeconds(1)) &&
                            v.getDateEntree().isBefore(endOfDay.plusSeconds(1)))
                .collect(Collectors.toList());

            // Calculate peak hour for this day
            DailyPeakHourDTO dailyPeak = calculateDailyPeakHour(currentDate, dayEntries);
            dailyPeakHours.add(dailyPeak);

            currentDate = currentDate.plusDays(1);
        }

        log.debug("Generated daily peak hours analysis with {} days", dailyPeakHours.size());
        return dailyPeakHours;
    }

    private DailyPeakHourDTO calculateDailyPeakHour(LocalDate date, List<Visiteur> dayEntries) {
        String dateStr = date.toString();
        String dayLabel = formatDateLabel(date);

        if (dayEntries.isEmpty()) {
            return new DailyPeakHourDTO(dateStr, dayLabel, "Aucune entrée", 0L, 0L, 0.0);
        }

        // Count entries by hour
        Map<Integer, Long> hourCounts = new HashMap<>();

        // Initialize all hours with 0
        for (int hour = 0; hour < 24; hour++) {
            hourCounts.put(hour, 0L);
        }

        // Count entries by hour
        for (Visiteur visiteur : dayEntries) {
            int hour = visiteur.getDateEntree().getHour();
            hourCounts.put(hour, hourCounts.get(hour) + 1);
        }

        // Find peak hour
        int peakHour = hourCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(0);

        Long peakHourCount = hourCounts.get(peakHour);
        Long totalDayEntries = (long) dayEntries.size();
        Double peakHourPercentage = totalDayEntries > 0 ?
            (peakHourCount * 100.0 / totalDayEntries) : 0.0;

        String peakHourRange = String.format("%02d:00-%02d:00", peakHour, (peakHour + 1) % 24);

        return new DailyPeakHourDTO(dateStr, dayLabel, peakHourRange,
                                   peakHourCount, totalDayEntries, peakHourPercentage);
    }
}
