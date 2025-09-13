package com.csys.template.service;

import com.csys.template.domain.TypeVisiteur;
import com.csys.template.domain.Visiteur;
import com.csys.template.dto.*;
import com.csys.template.factory.VisiteurFactory;
import com.csys.template.repository.VisiteurRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ChatbotService {

    private static final Logger log = LoggerFactory.getLogger(ChatbotService.class);
    
    private final VisiteurService visiteurService;
    private final VisiteurRepository visiteurRepository;

    public ChatbotService(VisiteurService visiteurService, VisiteurRepository visiteurRepository) {
        this.visiteurService = visiteurService;
        this.visiteurRepository = visiteurRepository;
    }

    public ChatbotResponseDTO processQuery(ChatbotRequestDTO request) {
        log.info("Processing chatbot query: {}", request.getMessage());
        
        String message = request.getMessage().toLowerCase();
        String sessionId = request.getSessionId();
        
        // Extract date range from request or use defaults
        LocalDate dateFrom = request.getDateFrom() != null ? request.getDateFrom() : LocalDate.now().minusDays(7);
        LocalDate dateTo = request.getDateTo() != null ? request.getDateTo() : LocalDate.now();
        
        // Log the date range being used for debugging
        log.info("Request date range: {} to {}", request.getDateFrom(), request.getDateTo());
        log.info("Using date range: {} to {}", dateFrom, dateTo);
        
        try {
            // Analyze the query type
            QueryAnalysis analysis = analyzeQuery(message);
            
            switch (analysis.getQueryType()) {
                case "TODAY_VISITORS":
                    return handleTodayVisitorsQuery(sessionId, analysis);
                    
                case "VISITOR_COUNT":
                    return handleVisitorCountQuery(sessionId, dateFrom, dateTo, analysis);
                    
                case "SEARCH_VISITOR":
                    return handleSearchVisitorQuery(sessionId, analysis.getSearchTerm());
                    
                case "VISITOR_HISTORY":
                    return handleVisitorHistoryQuery(sessionId, analysis.getSearchTerm());
                    
                case "VISITOR_TYPE_ANALYSIS":
                    return handleVisitorTypeAnalysisQuery(sessionId, dateFrom, dateTo);
                    
                case "ENTRY_TIME_ANALYSIS":
                    return handleEntryTimeAnalysisQuery(sessionId, dateFrom, dateTo);
                    
                case "VISIT_DURATION_ANALYSIS":
                    return handleVisitDurationAnalysisQuery(sessionId, dateFrom, dateTo);
                    
                case "PEAK_HOURS":
                    return handlePeakHoursQuery(sessionId, dateFrom, dateTo);
                    
                case "ACTIVE_VISITORS":
                    return handleActiveVisitorsQuery(sessionId);
                    
                case "GENERAL_HELP":
                    return handleGeneralHelpQuery(sessionId);
                    
                case "CHART_ANALYSIS":
                    return handleChartAnalysisQuery(sessionId, analysis.getSearchTerm(), dateFrom, dateTo);
                    
                default:
                    return handleUnknownQuery(sessionId, message);
            }
            
        } catch (Exception e) {
            log.error("Error processing chatbot query", e);
            return ChatbotResponseDTO.builder()
                .response("Désolé, j'ai rencontré une erreur en traitant votre demande. Veuillez réessayer.")
                .sessionId(sessionId)
                .queryType("ERROR")
                .confidence("LOW")
                .build();
        }
    }

    private QueryAnalysis analyzeQuery(String message) {
        QueryAnalysis analysis = new QueryAnalysis();
        
        // Today's visitors
        if (containsAny(message, "aujourd'hui", "today", "visiteurs aujourd'hui", "combien aujourd'hui")) {
            analysis.setQueryType("TODAY_VISITORS");
            analysis.setConfidence("HIGH");
        }
        // Visitor count
        else if (containsAny(message, "combien", "nombre", "count", "total", "visiteurs")) {
            analysis.setQueryType("VISITOR_COUNT");
            analysis.setConfidence("HIGH");
        }
        // Search specific visitor
        else if (containsAny(message, "chercher", "search", "trouver", "find", "visiteur", "cin")) {
            analysis.setQueryType("SEARCH_VISITOR");
            analysis.setSearchTerm(extractSearchTerm(message));
            analysis.setConfidence("MEDIUM");
        }
        // Visitor history
        else if (containsAny(message, "historique", "history", "fréquence", "frequent", "combien de fois")) {
            analysis.setQueryType("VISITOR_HISTORY");
            analysis.setSearchTerm(extractSearchTerm(message));
            analysis.setConfidence("MEDIUM");
        }
        // Visitor type analysis
        else if (containsAny(message, "type", "docteur", "fournisseur", "malade", "catégorie")) {
            analysis.setQueryType("VISITOR_TYPE_ANALYSIS");
            analysis.setConfidence("HIGH");
        }
        // Entry time analysis
        else if (containsAny(message, "heure", "time", "entrée", "entry", "pic", "peak")) {
            analysis.setQueryType("ENTRY_TIME_ANALYSIS");
            analysis.setConfidence("HIGH");
        }
        // Visit duration
        else if (containsAny(message, "durée", "duration", "temps", "long", "court")) {
            analysis.setQueryType("VISIT_DURATION_ANALYSIS");
            analysis.setConfidence("HIGH");
        }
        // Peak hours
        else if (containsAny(message, "pic", "peak", "heure de pointe", "busy")) {
            analysis.setQueryType("PEAK_HOURS");
            analysis.setConfidence("HIGH");
        }
        // Active visitors
        else if (containsAny(message, "actif", "active", "présent", "present", "encore")) {
            analysis.setQueryType("ACTIVE_VISITORS");
            analysis.setConfidence("HIGH");
        }
        // Chart analysis
        else if (containsAny(message, "graphique", "chart", "graph", "diagramme", "analyse", "expliquer", "explain", "montrer", "show")) {
            analysis.setQueryType("CHART_ANALYSIS");
            analysis.setSearchTerm(extractChartType(message));
            analysis.setConfidence("HIGH");
        }
        // Help
        else if (containsAny(message, "aide", "help", "que puis-je", "what can")) {
            analysis.setQueryType("GENERAL_HELP");
            analysis.setConfidence("HIGH");
        }
        else {
            analysis.setQueryType("UNKNOWN");
            analysis.setConfidence("LOW");
        }
        
        return analysis;
    }

    private ChatbotResponseDTO handleTodayVisitorsQuery(String sessionId, QueryAnalysis analysis) {
        LocalDate today = LocalDate.now();
        List<VisiteurDTO> todayVisitors = visiteurService.findVisiteursByFilter("tous", today, today);
        
        long totalVisitors = todayVisitors.size();
        long activeVisitors = todayVisitors.stream()
            .filter(v -> v.getDateSortie() == null)
            .count();
        
        String response = String.format(
            "📊 **Visiteurs d'aujourd'hui (%s):**\n\n" +
            "• **Total des visiteurs:** %d\n" +
            "• **Visiteurs actuellement présents:** %d\n" +
            "• **Visiteurs partis:** %d\n\n" +
            "Voulez-vous voir les détails des visiteurs ou une analyse par type?",
            today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            totalVisitors,
            activeVisitors,
            totalVisitors - activeVisitors
        );
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .visitors(todayVisitors)
            .queryType("TODAY_VISITORS")
            .confidence(analysis.getConfidence())
            .suggestions(Arrays.asList("Voir les détails", "Analyse par type", "Heures de pointe"))
            .build();
    }

    private ChatbotResponseDTO handleVisitorCountQuery(String sessionId, LocalDate dateFrom, LocalDate dateTo, QueryAnalysis analysis) {
        List<VisiteurDTO> visitors = visiteurService.findVisiteursByFilter("tous", dateFrom, dateTo);
        
        long totalVisitors = visitors.size();
        long activeVisitors = visitors.stream()
            .filter(v -> v.getDateSortie() == null)
            .count();
        
        Map<String, Long> typeCounts = visitors.stream()
            .collect(Collectors.groupingBy(
                v -> v.getTypeVisiteur() != null ? v.getTypeVisiteur().getValue() : "Non spécifié",
                Collectors.counting()
            ));
        
        String response = String.format(
            "📈 **Statistiques des visiteurs (%s - %s):**\n\n" +
            "• **Total des visiteurs:** %d\n" +
            "• **Visiteurs actifs:** %d\n" +
            "• **Visiteurs partis:** %d\n\n" +
            "**Répartition par type:**\n",
            dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            totalVisitors,
            activeVisitors,
            totalVisitors - activeVisitors
        );
        
        for (Map.Entry<String, Long> entry : typeCounts.entrySet()) {
            response += String.format("• %s: %d\n", entry.getKey(), entry.getValue());
        }
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalVisitors", totalVisitors);
        analytics.put("activeVisitors", activeVisitors);
        analytics.put("typeCounts", typeCounts);
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .visitors(visitors)
            .analytics(analytics)
            .queryType("VISITOR_COUNT")
            .confidence(analysis.getConfidence())
            .suggestions(Arrays.asList("Voir les détails", "Analyse temporelle", "Graphiques"))
            .build();
    }

    private ChatbotResponseDTO handleSearchVisitorQuery(String sessionId, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return ChatbotResponseDTO.builder()
                .response("Veuillez spécifier un terme de recherche (nom, prénom, CIN, ou matricule fiscal).")
                .sessionId(sessionId)
                .queryType("SEARCH_VISITOR")
                .confidence("LOW")
                .build();
        }
        
        List<Visiteur> allVisitors = visiteurRepository.findAll();
        List<VisiteurDTO> matchingVisitors = allVisitors.stream()
            .filter(v -> matchesSearchTerm(v, searchTerm))
            .map(VisiteurFactory::entityToDto)
            .collect(Collectors.toList());
        
        if (matchingVisitors.isEmpty()) {
            return ChatbotResponseDTO.builder()
                .response("Aucun visiteur trouvé pour le terme de recherche: '" + searchTerm + "'")
                .sessionId(sessionId)
                .queryType("SEARCH_VISITOR")
                .confidence("MEDIUM")
                .build();
        }
        
        String response = String.format(
            "🔍 **Résultats de recherche pour '%s':**\n\n" +
            "**%d visiteur(s) trouvé(s):**\n\n",
            searchTerm,
            matchingVisitors.size()
        );
        
        for (VisiteurDTO visitor : matchingVisitors) {
            String status = visitor.getDateSortie() == null ? "🟢 Actif" : "🔴 Parti";
            response += String.format(
                "• **%s %s** (%s) - %s\n" +
                "  Entrée: %s\n" +
                "  Type: %s\n\n",
                visitor.getPrenom(),
                visitor.getNom(),
                visitor.getCin(),
                status,
                visitor.getDateEntree() != null ? 
                    visitor.getDateEntree().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : "N/A",
                visitor.getTypeVisiteur() != null ? visitor.getTypeVisiteur().getValue() : "Non spécifié"
            );
        }
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .visitors(matchingVisitors)
            .queryType("SEARCH_VISITOR")
            .confidence("HIGH")
            .build();
    }

    private ChatbotResponseDTO handleVisitorHistoryQuery(String sessionId, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return ChatbotResponseDTO.builder()
                .response("Veuillez spécifier un visiteur pour voir son historique (nom, prénom, ou CIN).")
                .sessionId(sessionId)
                .queryType("VISITOR_HISTORY")
                .confidence("LOW")
                .build();
        }
        
        List<Visiteur> allVisitors = visiteurRepository.findAll();
        List<VisiteurDTO> visitorHistory = allVisitors.stream()
            .filter(v -> matchesSearchTerm(v, searchTerm))
            .map(VisiteurFactory::entityToDto)
            .sorted((v1, v2) -> v2.getDateEntree().compareTo(v1.getDateEntree()))
            .collect(Collectors.toList());
        
        if (visitorHistory.isEmpty()) {
            return ChatbotResponseDTO.builder()
                .response("Aucun historique trouvé pour: '" + searchTerm + "'")
                .sessionId(sessionId)
                .queryType("VISITOR_HISTORY")
                .confidence("MEDIUM")
                .build();
        }
        
        String visitorName = visitorHistory.get(0).getPrenom() + " " + visitorHistory.get(0).getNom();
        String response = String.format(
            "📋 **Historique de %s (%s):**\n\n" +
            "**%d visite(s) trouvée(s):**\n\n",
            visitorName,
            visitorHistory.get(0).getCin(),
            visitorHistory.size()
        );
        
        for (int i = 0; i < Math.min(visitorHistory.size(), 10); i++) {
            VisiteurDTO visit = visitorHistory.get(i);
            String duration = "";
            if (visit.getDateEntree() != null && visit.getDateSortie() != null) {
                long minutes = java.time.Duration.between(visit.getDateEntree(), visit.getDateSortie()).toMinutes();
                duration = String.format(" (Durée: %d min)", minutes);
            }
            
            response += String.format(
                "%d. **%s** - %s%s\n" +
                "   Type: %s\n\n",
                i + 1,
                visit.getDateEntree() != null ? 
                    visit.getDateEntree().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : "N/A",
                visit.getDateSortie() != null ? 
                    visit.getDateSortie().format(DateTimeFormatter.ofPattern("HH:mm")) : "En cours",
                duration,
                visit.getTypeVisiteur() != null ? visit.getTypeVisiteur().getValue() : "Non spécifié"
            );
        }
        
        if (visitorHistory.size() > 10) {
            response += String.format("\n... et %d visite(s) supplémentaire(s)", visitorHistory.size() - 10);
        }
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .visitors(visitorHistory)
            .queryType("VISITOR_HISTORY")
            .confidence("HIGH")
            .build();
    }

    private ChatbotResponseDTO handleVisitorTypeAnalysisQuery(String sessionId, LocalDate dateFrom, LocalDate dateTo) {
        List<VisitorTypeChartDTO> typeAnalysis = visiteurService.getVisitorTypeAnalysis(dateFrom, dateTo);
        
        String response = String.format(
            "📊 **Analyse par type de visiteur (%s - %s):**\n\n",
            dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );
        
        for (VisitorTypeChartDTO type : typeAnalysis) {
            if (type.getCount() > 0) {
                response += String.format(
                    "• **%s:** %d visiteurs (%.1f%%)\n",
                    type.getLabel(),
                    type.getCount(),
                    type.getPercentage()
                );
            }
        }
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .charts(Arrays.asList(typeAnalysis))
            .queryType("VISITOR_TYPE_ANALYSIS")
            .confidence("HIGH")
            .build();
    }

    private ChatbotResponseDTO handleEntryTimeAnalysisQuery(String sessionId, LocalDate dateFrom, LocalDate dateTo) {
        List<EntryTimeChartDTO> entryAnalysis = visiteurService.getEntryTimeAnalysis(dateFrom, dateTo);
        
        String response = String.format(
            "⏰ **Analyse des heures d'entrée (%s - %s):**\n\n",
            dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );
        
        // Find peak hours
        EntryTimeChartDTO peakHour = entryAnalysis.stream()
            .max((a, b) -> Long.compare(a.getCount(), b.getCount()))
            .orElse(null);
        
        if (peakHour != null && peakHour.getCount() > 0) {
            response += String.format("**Heure de pointe:** %s (%d visiteurs)\n\n", peakHour.getTimeRange(), peakHour.getCount());
        }
        
        response += "**Répartition par heure:**\n";
        for (EntryTimeChartDTO entry : entryAnalysis) {
            if (entry.getCount() > 0) {
                response += String.format("• %s: %d visiteurs\n", entry.getTimeRange(), entry.getCount());
            }
        }
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .charts(Arrays.asList(entryAnalysis))
            .queryType("ENTRY_TIME_ANALYSIS")
            .confidence("HIGH")
            .build();
    }

    private ChatbotResponseDTO handleVisitDurationAnalysisQuery(String sessionId, LocalDate dateFrom, LocalDate dateTo) {
        List<VisitDurationChartDTO> durationAnalysis = visiteurService.getVisitDurationAnalysis(dateFrom, dateTo);
        
        String response = String.format(
            "⏱️ **Analyse de la durée des visites (%s - %s):**\n\n",
            dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );
        
        for (VisitDurationChartDTO duration : durationAnalysis) {
            if (duration.getCount() > 0) {
                response += String.format(
                    "• **%s:** %d visiteurs (durée moyenne: %.1f min)\n",
                    duration.getLabel(),
                    duration.getCount(),
                    duration.getAverageDurationMinutes()
                );
            }
        }
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .charts(Arrays.asList(durationAnalysis))
            .queryType("VISIT_DURATION_ANALYSIS")
            .confidence("HIGH")
            .build();
    }

    private ChatbotResponseDTO handlePeakHoursQuery(String sessionId, LocalDate dateFrom, LocalDate dateTo) {
        List<DailyPeakHourDTO> peakHours = visiteurService.getDailyPeakHours(dateFrom, dateTo);
        
        String response = String.format(
            "📈 **Heures de pointe quotidiennes (%s - %s):**\n\n",
            dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );
        
        for (DailyPeakHourDTO peak : peakHours) {
            if (peak.getTotalDayEntries() > 0) {
                response += String.format(
                    "• **%s:** %s (%d visiteurs, %.1f%%)\n",
                    peak.getDayLabel(),
                    peak.getPeakHour(),
                    peak.getPeakHourCount(),
                    peak.getPeakHourPercentage()
                );
            }
        }
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .charts(Arrays.asList(peakHours))
            .queryType("PEAK_HOURS")
            .confidence("HIGH")
            .build();
    }

    private ChatbotResponseDTO handleActiveVisitorsQuery(String sessionId) {
        List<VisiteurDTO> activeVisitors = visiteurService.findVisiteursByFilter("entree", LocalDate.now(), LocalDate.now());
        
        String response = String.format(
            "🟢 **Visiteurs actuellement présents:**\n\n" +
            "**%d visiteur(s) actif(s):**\n\n",
            activeVisitors.size()
        );
        
        for (VisiteurDTO visitor : activeVisitors) {
            String duration = "";
            if (visitor.getDateEntree() != null) {
                long minutes = java.time.Duration.between(visitor.getDateEntree(), LocalDateTime.now()).toMinutes();
                duration = String.format(" (Présent depuis %d min)", minutes);
            }
            
            response += String.format(
                "• **%s %s** (%s) - %s%s\n" +
                "  Entrée: %s\n\n",
                visitor.getPrenom(),
                visitor.getNom(),
                visitor.getCin(),
                visitor.getTypeVisiteur() != null ? visitor.getTypeVisiteur().getValue() : "Non spécifié",
                duration,
                visitor.getDateEntree() != null ? 
                    visitor.getDateEntree().format(DateTimeFormatter.ofPattern("HH:mm")) : "N/A"
            );
        }
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .visitors(activeVisitors)
            .queryType("ACTIVE_VISITORS")
            .confidence("HIGH")
            .build();
    }

    private ChatbotResponseDTO handleChartAnalysisQuery(String sessionId, String chartType, LocalDate dateFrom, LocalDate dateTo) {
        if (chartType == null || chartType.trim().isEmpty()) {
            return ChatbotResponseDTO.builder()
                .response("Quel graphique souhaitez-vous analyser? Je peux expliquer:\n\n" +
                    "📊 **Types de graphiques disponibles:**\n" +
                    "• **Type de visiteurs** - Répartition par catégorie\n" +
                    "• **Heures d'entrée** - Analyse temporelle des arrivées\n" +
                    "• **Durée des visites** - Temps passé par les visiteurs\n" +
                    "• **Heures de pointe** - Périodes les plus fréquentées\n\n" +
                    "Exemples: \"Expliquer le graphique des types de visiteurs\", \"Analyser les heures de pointe\"\n\n" +
                    "📅 **Période actuelle:** " + dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + " - " + dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .sessionId(sessionId)
                .queryType("CHART_ANALYSIS")
                .confidence("LOW")
                .suggestions(Arrays.asList("Type de visiteurs", "Heures d'entrée", "Durée des visites", "Heures de pointe"))
                .build();
        }
        
        String chartTypeLower = chartType.toLowerCase();
        String response = "";
        List<Object> chartData = new ArrayList<>();
        
        if (containsAny(chartTypeLower, "type", "visiteur", "catégorie", "category")) {
            // Visitor type analysis
            List<VisitorTypeChartDTO> typeAnalysis = visiteurService.getVisitorTypeAnalysis(dateFrom, dateTo);
            chartData.add(typeAnalysis);
            
            response = String.format(
                "📊 **Analyse du graphique \"Types de visiteurs\" (%s - %s):**\n\n" +
                "Ce graphique montre la répartition des visiteurs selon leur catégorie pour la période sélectionnée:\n\n",
                dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            );
            
            long totalVisitors = typeAnalysis.stream().mapToLong(VisitorTypeChartDTO::getCount).sum();
            
            for (VisitorTypeChartDTO type : typeAnalysis) {
                if (type.getCount() > 0) {
                    response += String.format(
                        "• **%s:** %d visiteurs (%.1f%% du total)\n" +
                        "  _Cette catégorie représente %s du trafic_\n\n",
                        type.getLabel(),
                        type.getCount(),
                        type.getPercentage(),
                        type.getPercentage() > 50 ? "la majorité" : 
                        type.getPercentage() > 25 ? "une part importante" : 
                        type.getPercentage() > 10 ? "une part modérée" : "une petite part"
                    );
                }
            }
            
            response += "**💡 Insights:**\n";
            VisitorTypeChartDTO dominantType = typeAnalysis.stream()
                .max((a, b) -> Long.compare(a.getCount(), b.getCount()))
                .orElse(null);
            
            if (dominantType != null && dominantType.getCount() > 0) {
                response += String.format("• Le type dominant est **%s** avec %d visiteurs\n", 
                    dominantType.getLabel(), dominantType.getCount());
            }
            
        } else if (containsAny(chartTypeLower, "heure", "entrée", "entry", "time", "arrivée")) {
            // Entry time analysis
            List<EntryTimeChartDTO> entryAnalysis = visiteurService.getEntryTimeAnalysis(dateFrom, dateTo);
            chartData.add(entryAnalysis);
            
            response = String.format(
                "⏰ **Analyse du graphique \"Heures d'entrée\" (%s - %s):**\n\n" +
                "Ce graphique montre la distribution des arrivées de visiteurs par heure pour la période sélectionnée:\n\n",
                dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            );
            
            // Find peak hours
            EntryTimeChartDTO peakHour = entryAnalysis.stream()
                .max((a, b) -> Long.compare(a.getCount(), b.getCount()))
                .orElse(null);
            
            if (peakHour != null && peakHour.getCount() > 0) {
                response += String.format("**🏆 Heure de pointe:** %s avec %d visiteurs\n\n", 
                    peakHour.getTimeRange(), peakHour.getCount());
            }
            
            response += "**📈 Répartition par heure:**\n";
            for (EntryTimeChartDTO entry : entryAnalysis) {
                if (entry.getCount() > 0) {
                    response += String.format("• **%s:** %d visiteurs\n", entry.getTimeRange(), entry.getCount());
                }
            }
            
            response += "\n**💡 Insights:**\n";
            if (peakHour != null && peakHour.getCount() > 0) {
                response += String.format("• L'heure de pointe est %s (%d visiteurs)\n", peakHour.getTimeRange(), peakHour.getCount());
            }
            
            long totalEntries = entryAnalysis.stream().mapToLong(EntryTimeChartDTO::getCount).sum();
            if (totalEntries > 0) {
                response += String.format("• Total des entrées: %d visiteurs\n", totalEntries);
            }
            
        } else if (containsAny(chartTypeLower, "durée", "duration", "temps", "long", "court", "visite")) {
            // Visit duration analysis
            List<VisitDurationChartDTO> durationAnalysis = visiteurService.getVisitDurationAnalysis(dateFrom, dateTo);
            chartData.add(durationAnalysis);
            
            response = String.format(
                "⏱️ **Analyse du graphique \"Durée des visites\" (%s - %s):**\n\n" +
                "Ce graphique montre la répartition des visiteurs selon la durée de leur séjour:\n\n",
                dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            );
            
            for (VisitDurationChartDTO duration : durationAnalysis) {
                if (duration.getCount() > 0) {
                    response += String.format(
                        "• **%s:** %d visiteurs\n" +
                        "  _Durée moyenne: %.1f minutes_\n\n",
                        duration.getLabel(),
                        duration.getCount(),
                        duration.getAverageDurationMinutes()
                    );
                }
            }
            
            response += "**💡 Insights:**\n";
            VisitDurationChartDTO mostCommonDuration = durationAnalysis.stream()
                .max((a, b) -> Long.compare(a.getCount(), b.getCount()))
                .orElse(null);
            
            if (mostCommonDuration != null && mostCommonDuration.getCount() > 0) {
                response += String.format("• La durée la plus fréquente est **%s** (%d visiteurs)\n", 
                    mostCommonDuration.getLabel(), mostCommonDuration.getCount());
            }
            
        } else if (containsAny(chartTypeLower, "pic", "peak", "pointe", "busy", "occupé")) {
            // Peak hours analysis
            List<DailyPeakHourDTO> peakHours = visiteurService.getDailyPeakHours(dateFrom, dateTo);
            chartData.add(peakHours);
            
            response = String.format(
                "📈 **Analyse du graphique \"Heures de pointe\" (%s - %s):**\n\n" +
                "Ce graphique montre les heures les plus fréquentées pour chaque jour de la semaine:\n\n",
                dateFrom.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                dateTo.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            );
            
            for (DailyPeakHourDTO peak : peakHours) {
                if (peak.getTotalDayEntries() > 0) {
                    response += String.format(
                        "• **%s:** %s (%d visiteurs, %.1f%%)\n" +
                        "  _Jour le plus actif de la semaine_\n\n",
                        peak.getDayLabel(),
                        peak.getPeakHour(),
                        peak.getPeakHourCount(),
                        peak.getPeakHourPercentage()
                    );
                }
            }
            
            response += "**💡 Insights:**\n";
            DailyPeakHourDTO busiestDay = peakHours.stream()
                .max((a, b) -> Long.compare(a.getTotalDayEntries(), b.getTotalDayEntries()))
                .orElse(null);
            
            if (busiestDay != null && busiestDay.getTotalDayEntries() > 0) {
                response += String.format("• Le jour le plus actif est **%s** (%d entrées totales)\n", 
                    busiestDay.getDayLabel(), busiestDay.getTotalDayEntries());
            }
            
        } else {
            response = "Je ne reconnais pas ce type de graphique. Voici les graphiques disponibles:\n\n" +
                "📊 **Types de graphiques:**\n" +
                "• **Type de visiteurs** - Répartition par catégorie\n" +
                "• **Heures d'entrée** - Analyse temporelle des arrivées\n" +
                "• **Durée des visites** - Temps passé par les visiteurs\n" +
                "• **Heures de pointe** - Périodes les plus fréquentées\n\n" +
                "Exemples: \"Expliquer le graphique des types\", \"Analyser les heures d'entrée\"";
        }
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .charts(chartData)
            .queryType("CHART_ANALYSIS")
            .confidence("HIGH")
            .suggestions(Arrays.asList("Type de visiteurs", "Heures d'entrée", "Durée des visites", "Heures de pointe"))
            .build();
    }

    private ChatbotResponseDTO handleGeneralHelpQuery(String sessionId) {
        String response = "🤖 **Assistant Visiteur - Guide d'utilisation:**\n\n" +
            "Je peux vous aider avec les questions suivantes:\n\n" +
            "📊 **Statistiques:**\n" +
            "• \"Combien de visiteurs aujourd'hui?\"\n" +
            "• \"Statistiques de la semaine\"\n" +
            "• \"Nombre de visiteurs par type\"\n\n" +
            "🔍 **Recherche:**\n" +
            "• \"Chercher le visiteur [nom/CIN]\"\n" +
            "• \"Historique de [nom]\"\n" +
            "• \"Combien de fois [nom] est venu?\"\n\n" +
            "📈 **Analyses:**\n" +
            "• \"Heures de pointe\"\n" +
            "• \"Durée des visites\"\n" +
            "• \"Répartition par type\"\n\n" +
            "📊 **Graphiques:**\n" +
            "• \"Expliquer le graphique des types\"\n" +
            "• \"Analyser les heures d'entrée\"\n" +
            "• \"Montrer la durée des visites\"\n\n" +
            "🟢 **État actuel:**\n" +
            "• \"Visiteurs actuellement présents\"\n" +
            "• \"Qui est encore là?\"\n\n" +
            "Posez votre question en français ou en anglais!";
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .queryType("GENERAL_HELP")
            .confidence("HIGH")
            .build();
    }

    private ChatbotResponseDTO handleUnknownQuery(String sessionId, String message) {
        String response = "Je ne comprends pas votre demande. Voici quelques exemples de questions que je peux traiter:\n\n" +
            "• \"Combien de visiteurs aujourd'hui?\"\n" +
            "• \"Chercher le visiteur [nom]\"\n" +
            "• \"Heures de pointe\"\n" +
            "• \"Visiteurs actuellement présents\"\n\n" +
            "Tapez \"aide\" pour voir toutes mes fonctionnalités.";
        
        return ChatbotResponseDTO.builder()
            .response(response)
            .sessionId(sessionId)
            .queryType("UNKNOWN")
            .confidence("LOW")
            .suggestions(Arrays.asList("Aide", "Statistiques", "Recherche"))
            .build();
    }

    // Helper methods
    private boolean containsAny(String text, String... keywords) {
        return Arrays.stream(keywords).anyMatch(text::contains);
    }

    private String extractSearchTerm(String message) {
        // Extract search term after keywords like "chercher", "trouver", etc.
        String[] searchKeywords = {"chercher", "search", "trouver", "find", "visiteur", "cin"};
        
        for (String keyword : searchKeywords) {
            if (message.contains(keyword)) {
                String afterKeyword = message.substring(message.indexOf(keyword) + keyword.length()).trim();
                // Extract first word or quoted phrase
                if (afterKeyword.startsWith("\"") && afterKeyword.contains("\"")) {
                    return afterKeyword.substring(1, afterKeyword.indexOf("\"", 1));
                } else {
                    // Remove common words that might appear after the keyword
                    String[] commonWords = {"le", "la", "les", "un", "une", "des", "avec", "par", "pour", "de", "du", "visiteur", "visiteurs", "matricule","CIN"};
                    String[] words = afterKeyword.split("\\s+");
                    StringBuilder result = new StringBuilder();
                    
                    for (String word : words) {
                        if (!Arrays.asList(commonWords).contains(word.toLowerCase())) {
                            if (result.length() > 0) result.append(" ");
                            result.append(word);
                        }
                    }
                    
                    return result.toString().trim();
                }
            }
        }
        return "";
    }

    private String extractChartType(String message) {
        // Extract chart type from message
        String[] chartKeywords = {"graphique", "chart", "graph", "diagramme", "analyse", "expliquer", "explain", "montrer", "show"};
        
        for (String keyword : chartKeywords) {
            if (message.contains(keyword)) {
                String afterKeyword = message.substring(message.indexOf(keyword) + keyword.length()).trim();
                // Remove common words
                String[] commonWords = {"le", "la", "les", "un", "une", "des", "de", "du", "des", "graphique", "graphiques", "chart", "charts"};
                String[] words = afterKeyword.split("\\s+");
                StringBuilder result = new StringBuilder();
                
                for (String word : words) {
                    if (!Arrays.asList(commonWords).contains(word.toLowerCase())) {
                        if (result.length() > 0) result.append(" ");
                        result.append(word);
                    }
                }
                
                return result.toString().trim();
            }
        }
        return "";
    }

    private boolean matchesSearchTerm(Visiteur visitor, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) return false;
        
        String term = searchTerm.toLowerCase().trim();
        
        // Check individual fields
        boolean matchesIndividualFields = (visitor.getNom() != null && visitor.getNom().toLowerCase().contains(term)) ||
               (visitor.getPrenom() != null && visitor.getPrenom().toLowerCase().contains(term)) ||
               (visitor.getCin() != null && visitor.getCin().contains(term)) ||
               (visitor.getMatriculeFiscale() != null && visitor.getMatriculeFiscale().toLowerCase().contains(term));
        
        // Check full name combination
        boolean matchesFullName = false;
        if (visitor.getPrenom() != null && visitor.getNom() != null) {
            String fullName = (visitor.getPrenom() + " " + visitor.getNom()).toLowerCase();
            matchesFullName = fullName.contains(term);
        }
        
        // Check reverse full name (nom + prenom)
        boolean matchesReverseFullName = false;
        if (visitor.getNom() != null && visitor.getPrenom() != null) {
            String reverseFullName = (visitor.getNom() + " " + visitor.getPrenom()).toLowerCase();
            matchesReverseFullName = reverseFullName.contains(term);
        }
        
        return matchesIndividualFields || matchesFullName || matchesReverseFullName;
    }

    // Inner class for query analysis
    private static class QueryAnalysis {
        private String queryType;
        private String confidence;
        private String searchTerm;
        
        public String getQueryType() { return queryType; }
        public void setQueryType(String queryType) { this.queryType = queryType; }
        
        public String getConfidence() { return confidence; }
        public void setConfidence(String confidence) { this.confidence = confidence; }
        
        public String getSearchTerm() { return searchTerm; }
        public void setSearchTerm(String searchTerm) { this.searchTerm = searchTerm; }
    }
} 