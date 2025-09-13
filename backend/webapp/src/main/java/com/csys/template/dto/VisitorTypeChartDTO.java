package com.csys.template.dto;

/**
 * DTO for visitor type chart data
 */
public class VisitorTypeChartDTO {
    
    private String typeVisiteur; // e.g., "DOCTEUR", "FOURNISSEUR", "VISITEUR_MALADE"
    private Long count; // Number of visits for this type
    private String label; // Human-readable label for the chart
    private Double percentage; // Percentage of total visits
    
    public VisitorTypeChartDTO() {}
    
    public VisitorTypeChartDTO(String typeVisiteur, Long count, String label, Double percentage) {
        this.typeVisiteur = typeVisiteur;
        this.count = count;
        this.label = label;
        this.percentage = percentage;
    }
    
    public String getTypeVisiteur() {
        return typeVisiteur;
    }
    
    public void setTypeVisiteur(String typeVisiteur) {
        this.typeVisiteur = typeVisiteur;
    }
    
    public Long getCount() {
        return count;
    }
    
    public void setCount(Long count) {
        this.count = count;
    }
    
    public String getLabel() {
        return label;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }
    
    public Double getPercentage() {
        return percentage;
    }
    
    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
    
    @Override
    public String toString() {
        return "VisitorTypeChartDTO{" +
                "typeVisiteur='" + typeVisiteur + '\'' +
                ", count=" + count +
                ", label='" + label + '\'' +
                ", percentage=" + percentage +
                '}';
    }
}
