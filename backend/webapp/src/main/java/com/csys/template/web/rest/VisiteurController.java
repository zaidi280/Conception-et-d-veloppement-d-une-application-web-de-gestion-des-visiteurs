package com.csys.template.web.rest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.csys.template.domain.TypeVisiteur;
import com.csys.template.dto.AverageVisitDurationChartDTO;
import com.csys.template.dto.DailyPeakHourDTO;
import com.csys.template.dto.EntryTimeChartDTO;
import com.csys.template.dto.VisitDurationChartDTO;
import com.csys.template.dto.VisiteurDTO;
import com.csys.template.dto.VisitorTypeChartDTO;
import com.csys.template.service.VisiteurService;

@RestController
@RequestMapping("/api/visiteurs")
public class VisiteurController {

    private final VisiteurService visiteurService;

    // Constructor for dependency injection
    public VisiteurController(VisiteurService visiteurService) {
        this.visiteurService = visiteurService;
    }

    private String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    private void validateCurrentUser(String currentUser) {
        String authenticatedUser = getAuthenticatedUsername();
        if (authenticatedUser == null) {
            throw new IllegalArgumentException("No authenticated user found");
        }
        if (currentUser == null || !currentUser.equals(authenticatedUser)) {
            throw new IllegalArgumentException("Current user '" + currentUser + "' does not match authenticated user '" + authenticatedUser + "'");
        }
    }

    @GetMapping
    public ResponseEntity<List<VisiteurDTO>> getAllVisiteurs(
            @RequestParam(defaultValue = "tous") String filterType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {

        // Get filtered results based on radio button selection
        List<VisiteurDTO> visiteurs = visiteurService.findVisiteursByFilter(filterType, dateFrom, dateTo);

        return ResponseEntity.ok(visiteurs);
    }



    @GetMapping("/types")
    public ResponseEntity<List<String>> getValidTypeVisiteurValues() {
        List<String> validTypes = List.of(
            TypeVisiteur.VISITEUR_MALADE.getValue(),
            TypeVisiteur.DOCTEUR.getValue(),
            TypeVisiteur.FOURNISSEUR.getValue()
        );
        return ResponseEntity.ok(validTypes);
    }

    @GetMapping("/filters")
    public ResponseEntity<List<String>> getValidFilterTypes() {
        List<String> validFilters = List.of("entree", "sortie", "tous");
        return ResponseEntity.ok(validFilters);
    }

    @GetMapping("/debug")
    public ResponseEntity<List<VisiteurDTO>> getAllVisiteursDebug() {
        return ResponseEntity.ok(visiteurService.findAll());
    }

    @GetMapping("/test-date")
    public ResponseEntity<String> testCurrentDate() {
        return ResponseEntity.ok("Current system time: " + java.time.LocalDateTime.now());
    }

    @PutMapping("/{id}/sortie")
    public ResponseEntity<?> markVisiteurSortie(@PathVariable Long id,
                                               @RequestParam(required = false) String currentUser) {
        try {
            // If currentUser is not provided, use the authenticated user
            if (currentUser == null) {
                currentUser = getAuthenticatedUsername();
            } else {
                // If currentUser is provided, validate it matches the authenticated user
                validateCurrentUser(currentUser);
            }

            VisiteurDTO updatedVisiteur = visiteurService.markSortie(id, currentUser);
            return ResponseEntity.ok(updatedVisiteur);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("NotFound")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("AlreadyLeft")) {
                return ResponseEntity.badRequest()
                    .body("Visiteur has already left");
            } else if (e.getMessage().contains("does not exist in the system")) {
                return ResponseEntity.badRequest()
                    .body("User validation error: " + e.getMessage());
            } else if (e.getMessage().contains("Username cannot be null")) {
                return ResponseEntity.badRequest()
                    .body("Username is required");
            } else if (e.getMessage().contains("does not match authenticated user")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Authentication error: " + e.getMessage());
            } else if (e.getMessage().contains("No authenticated user found")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
            }
            return ResponseEntity.badRequest()
                .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error marking sortie: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisiteurDTO> getVisiteurById(@PathVariable Long id) {
        VisiteurDTO dto = visiteurService.findOne(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/createvis")
    public ResponseEntity<?> createVisiteur(@RequestBody VisiteurDTO dto,
                                           @RequestParam(required = false) String currentUser) {
        try {
            // If currentUser is not provided, use the authenticated user
            if (currentUser == null) {
                currentUser = getAuthenticatedUsername();
            } else {
                // If currentUser is provided, validate it matches the authenticated user
                validateCurrentUser(currentUser);
            }

            // Validate typeVisiteur if provided
            if (dto.getTypeVisiteur() != null) {
                // The enum validation happens automatically during deserialization
                // If invalid enum value is provided, it will throw an exception
            }

            VisiteurDTO created = visiteurService.save(dto, currentUser);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("does not exist in the system")) {
                return ResponseEntity.badRequest()
                    .body("User validation error: " + e.getMessage());
            } else if (e.getMessage().contains("Username cannot be null")) {
                return ResponseEntity.badRequest()
                    .body("Username is required");
            } else if (e.getMessage().contains("does not match authenticated user")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Authentication error: " + e.getMessage());
            } else if (e.getMessage().contains("No authenticated user found")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
            } else if (e.getMessage().contains("is already in use by an active visiteur")) {
                return ResponseEntity.badRequest()
                    .body("CIN validation error: " + e.getMessage());
            } else if (e.getMessage().contains("CIN cannot be null")) {
                return ResponseEntity.badRequest()
                    .body("CIN is required");
            } else if (e.getMessage().contains("CIN must be exactly 8 digits")) {
                return ResponseEntity.badRequest()
                    .body("CIN format error: " + e.getMessage());
            } else if (e.getMessage().contains("MatriculeFiscale is required")) {
                return ResponseEntity.badRequest()
                    .body("MatriculeFiscale is required");
            } else if (e.getMessage().contains("MatriculeFiscale must be exactly 7 digits")) {
                return ResponseEntity.badRequest()
                    .body("MatriculeFiscale format error: " + e.getMessage());
            } else {
                return ResponseEntity.badRequest()
                    .body("Invalid typeVisiteur value. Valid values are: visiteurMalade, docteur, fournisseur");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating visiteur: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVisiteur(@PathVariable Long id, @RequestBody VisiteurDTO dto) {
        try {
            dto.setId(id);
            VisiteurDTO updated = visiteurService.update(dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body("Invalid typeVisiteur value. Valid values are: visiteurMalade, docteur, fournisseur");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating visiteur: " + e.getMessage());
        }
    }

    @GetMapping("/charts/entry-time-analysis")
    public ResponseEntity<List<EntryTimeChartDTO>> getEntryTimeAnalysis(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {

        List<EntryTimeChartDTO> chartData = visiteurService.getEntryTimeAnalysis(dateFrom, dateTo);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/charts/visit-duration-analysis")
    public ResponseEntity<List<VisitDurationChartDTO>> getVisitDurationAnalysis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {

        List<VisitDurationChartDTO> chartData = visiteurService.getVisitDurationAnalysis(dateFrom, dateTo);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/charts/visitor-type-analysis")
    public ResponseEntity<List<VisitorTypeChartDTO>> getVisitorTypeAnalysis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {

        List<VisitorTypeChartDTO> chartData = visiteurService.getVisitorTypeAnalysis(dateFrom, dateTo);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/charts/average-visit-duration")
    public ResponseEntity<List<AverageVisitDurationChartDTO>> getAverageVisitDurationAnalysis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {

        List<AverageVisitDurationChartDTO> chartData = visiteurService.getAverageVisitDurationAnalysis(dateFrom, dateTo);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/daily-peak-hours")
    public ResponseEntity<List<DailyPeakHourDTO>> getDailyPeakHours(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {

        List<DailyPeakHourDTO> dailyPeakHours = visiteurService.getDailyPeakHours(dateFrom, dateTo);
        return ResponseEntity.ok(dailyPeakHours);
    }

}

