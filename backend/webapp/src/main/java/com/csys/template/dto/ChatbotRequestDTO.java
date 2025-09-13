package com.csys.template.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

import java.time.LocalDate;
import java.util.List;

public class ChatbotRequestDTO {
    private String message;
    private String sessionId;
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate dateFrom;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate dateTo;
    private String visitorType;
    private String searchTerm;
    private List<String> context;
    
    // Default constructor for Jackson
    public ChatbotRequestDTO() {
    }
    
    // Full constructor
    public ChatbotRequestDTO(String message, String sessionId, LocalDate dateFrom, LocalDate dateTo, String visitorType,
			String searchTerm, List<String> context) {
		this.message = message;
		this.sessionId = sessionId;
		this.dateFrom = dateFrom;
		this.dateTo = dateTo;
		this.visitorType = visitorType;
		this.searchTerm = searchTerm;
		this.context = context;
	}
	
	// Manual builder pattern since Lombok @Builder might not work
    public static ChatbotRequestDTOBuilder builder() {
        return new ChatbotRequestDTOBuilder();
    }
    
    public static class ChatbotRequestDTOBuilder {
        private String message;
        private String sessionId;
        private LocalDate dateFrom;
        private LocalDate dateTo;
        private String visitorType;
        private String searchTerm;
        private List<String> context;
        
        public ChatbotRequestDTOBuilder message(String message) {
            this.message = message;
            return this;
        }
        
        public ChatbotRequestDTOBuilder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }
        
        public ChatbotRequestDTOBuilder dateFrom(LocalDate dateFrom) {
            this.dateFrom = dateFrom;
            return this;
        }
        
        public ChatbotRequestDTOBuilder dateTo(LocalDate dateTo) {
            this.dateTo = dateTo;
            return this;
        }
        
        public ChatbotRequestDTOBuilder visitorType(String visitorType) {
            this.visitorType = visitorType;
            return this;
        }
        
        public ChatbotRequestDTOBuilder searchTerm(String searchTerm) {
            this.searchTerm = searchTerm;
            return this;
        }
        
        public ChatbotRequestDTOBuilder context(List<String> context) {
            this.context = context;
            return this;
        }
        
        public ChatbotRequestDTO build() {
            return new ChatbotRequestDTO(message, sessionId, dateFrom, dateTo, visitorType, searchTerm, context);
        }
    }
    
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public LocalDate getDateFrom() {
		return dateFrom;
	}
	public void setDateFrom(LocalDate dateFrom) {
		this.dateFrom = dateFrom;
	}
	public LocalDate getDateTo() {
		return dateTo;
	}
	public void setDateTo(LocalDate dateTo) {
		this.dateTo = dateTo;
	}
	public String getVisitorType() {
		return visitorType;
	}
	public void setVisitorType(String visitorType) {
		this.visitorType = visitorType;
	}
	public String getSearchTerm() {
		return searchTerm;
	}
	public void setSearchTerm(String searchTerm) {
		this.searchTerm = searchTerm;
	}
	public List<String> getContext() {
		return context;
	}
	public void setContext(List<String> context) {
		this.context = context;
	}
    
} 