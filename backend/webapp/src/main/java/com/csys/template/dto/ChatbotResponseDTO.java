package com.csys.template.dto;

import java.util.List;
import java.util.Map;

public class ChatbotResponseDTO {
    private String response;
    private String sessionId;
    private List<VisiteurDTO> visitors;
    private Map<String, Object> analytics;
    private List<Object> charts;
    private String queryType;
    private String confidence;
    private List<String> suggestions;
    
    // Default constructor for Jackson
    public ChatbotResponseDTO() {
    }
    
    // Full constructor
    public ChatbotResponseDTO(String response, String sessionId, List<VisiteurDTO> visitors,
			Map<String, Object> analytics, List<Object> charts, String queryType, String confidence,
			List<String> suggestions) {
		this.response = response;
		this.sessionId = sessionId;
		this.visitors = visitors;
		this.analytics = analytics;
		this.charts = charts;
		this.queryType = queryType;
		this.confidence = confidence;
		this.suggestions = suggestions;
	}
	
	// Manual builder pattern since Lombok @Builder might not work
    public static ChatbotResponseDTOBuilder builder() {
        return new ChatbotResponseDTOBuilder();
    }
    
    public static class ChatbotResponseDTOBuilder {
        private String response;
        private String sessionId;
        private List<VisiteurDTO> visitors;
        private Map<String, Object> analytics;
        private List<Object> charts;
        private String queryType;
        private String confidence;
        private List<String> suggestions;
        
        public ChatbotResponseDTOBuilder response(String response) {
            this.response = response;
            return this;
        }
        
        public ChatbotResponseDTOBuilder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }
        
        public ChatbotResponseDTOBuilder visitors(List<VisiteurDTO> visitors) {
            this.visitors = visitors;
            return this;
        }
        
        public ChatbotResponseDTOBuilder analytics(Map<String, Object> analytics) {
            this.analytics = analytics;
            return this;
        }
        
        public ChatbotResponseDTOBuilder charts(List<Object> charts) {
            this.charts = charts;
            return this;
        }
        
        public ChatbotResponseDTOBuilder queryType(String queryType) {
            this.queryType = queryType;
            return this;
        }
        
        public ChatbotResponseDTOBuilder confidence(String confidence) {
            this.confidence = confidence;
            return this;
        }
        
        public ChatbotResponseDTOBuilder suggestions(List<String> suggestions) {
            this.suggestions = suggestions;
            return this;
        }
        
        public ChatbotResponseDTO build() {
            return new ChatbotResponseDTO(response, sessionId, visitors, analytics, charts, queryType, confidence, suggestions);
        }
    }
    
	public String getResponse() {
		return response;
	}
	public void setResponse(String response) {
		this.response = response;
	}
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public List<VisiteurDTO> getVisitors() {
		return visitors;
	}
	public void setVisitors(List<VisiteurDTO> visitors) {
		this.visitors = visitors;
	}
	public Map<String, Object> getAnalytics() {
		return analytics;
	}
	public void setAnalytics(Map<String, Object> analytics) {
		this.analytics = analytics;
	}
	public List<Object> getCharts() {
		return charts;
	}
	public void setCharts(List<Object> charts) {
		this.charts = charts;
	}
	public String getQueryType() {
		return queryType;
	}
	public void setQueryType(String queryType) {
		this.queryType = queryType;
	}
	public String getConfidence() {
		return confidence;
	}
	public void setConfidence(String confidence) {
		this.confidence = confidence;
	}
	public List<String> getSuggestions() {
		return suggestions;
	}
	public void setSuggestions(List<String> suggestions) {
		this.suggestions = suggestions;
	}
    
} 