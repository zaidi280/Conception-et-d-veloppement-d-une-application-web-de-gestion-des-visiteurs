package com.csys.template.web.rest;

import com.csys.template.dto.ChatbotRequestDTO;
import com.csys.template.dto.ChatbotResponseDTO;
import com.csys.template.service.ChatbotService;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/chatbot")
@Slf4j
public class ChatbotController {

    private static final Logger log = LoggerFactory.getLogger(ChatbotController.class);

    private final ChatbotService chatbotService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatbotController(ChatbotService chatbotService, SimpMessagingTemplate messagingTemplate) {
        this.chatbotService = chatbotService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * HTTP endpoint for chatbot queries
     */
    @PostMapping("/query")
    public ResponseEntity<ChatbotResponseDTO> processQuery(@RequestBody ChatbotRequestDTO request) {
        log.info("Received chatbot query: {}", request.getMessage());
        
        // Generate session ID if not provided
        if (request.getSessionId() == null) {
            request.setSessionId(UUID.randomUUID().toString());
        }
        
        try {
            ChatbotResponseDTO response = chatbotService.processQuery(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing chatbot query", e);
            return ResponseEntity.badRequest()
                .body(ChatbotResponseDTO.builder()
                    .response("Une erreur s'est produite lors du traitement de votre demande.")
                    .sessionId(request.getSessionId())
                    .queryType("ERROR")
                    .confidence("LOW")
                    .build());
        }
    }

    /**
     * WebSocket endpoint for real-time chat
     */
    @MessageMapping("/chat")
    @SendTo("/topic/chatbot")
    public ChatbotResponseDTO handleWebSocketMessage(ChatbotRequestDTO request) {
        log.info("Received WebSocket message: {}", request.getMessage());
        
        // Generate session ID if not provided
        if (request.getSessionId() == null) {
            request.setSessionId(UUID.randomUUID().toString());
        }
        
        try {
            return chatbotService.processQuery(request);
        } catch (Exception e) {
            log.error("Error processing WebSocket message", e);
            return ChatbotResponseDTO.builder()
                .response("Une erreur s'est produite lors du traitement de votre demande.")
                .sessionId(request.getSessionId())
                .queryType("ERROR")
                .confidence("LOW")
                .build();
        }
    }

    /**
     * Send message to specific user session
     */
    @MessageMapping("/chat/private")
    public void handlePrivateMessage(ChatbotRequestDTO request) {
        log.info("Received private message: {}", request.getMessage());
        
        if (request.getSessionId() == null) {
            request.setSessionId(UUID.randomUUID().toString());
        }
        
        try {
            ChatbotResponseDTO response = chatbotService.processQuery(request);
            messagingTemplate.convertAndSendToUser(
                request.getSessionId(),
                "/queue/chatbot",
                response
            );
        } catch (Exception e) {
            log.error("Error processing private message", e);
            ChatbotResponseDTO errorResponse = ChatbotResponseDTO.builder()
                .response("Une erreur s'est produite lors du traitement de votre demande.")
                .sessionId(request.getSessionId())
                .queryType("ERROR")
                .confidence("LOW")
                .build();
            
            messagingTemplate.convertAndSendToUser(
                request.getSessionId(),
                "/queue/chatbot",
                errorResponse
            );
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Chatbot service is running");
    }

    /**
     * Get available query types
     */
    @GetMapping("/capabilities")
    public ResponseEntity<String> getCapabilities() {
        String capabilities = """
            🤖 **Capacités du Chatbot Visiteur:**
            
            📊 **Statistiques:**
            - Nombre de visiteurs aujourd'hui
            - Statistiques sur une période
            - Répartition par type de visiteur
            
            🔍 **Recherche:**
            - Rechercher un visiteur par nom/CIN
            - Historique des visites d'un visiteur
            - Fréquence de visite
            
            📈 **Analyses:**
            - Heures de pointe
            - Durée des visites
            - Analyse temporelle
            
            🟢 **État actuel:**
            - Visiteurs actuellement présents
            - Statut des visiteurs
            
            💡 **Exemples de questions:**
            - "Combien de visiteurs aujourd'hui?"
            - "Chercher le visiteur Jean Dupont"
            - "Heures de pointe"
            - "Visiteurs actuellement présents"
            """;
        
        return ResponseEntity.ok(capabilities);
    }
} 