package com.csys.template.dto;

/**
 * DTO for average visit duration chart data
 */
public class AverageVisitDurationChartDTO {
    
    private String period; // e.g., "2025-07-01", "Week 27", "July 2025"
    private Double averageDurationMinutes; // Average duration in minutes
    private Double averageDurationHours; // Average duration in hours
    private Long totalVisits; // Total number of completed visits in this period
    private String label; // Human-readable label for the chart
    
    public AverageVisitDurationChartDTO() {}
    
    public AverageVisitDurationChartDTO(String period, Double averageDurationMinutes, 
                                       Double averageDurationHours, Long totalVisits, String label) {
        this.period = period;
        this.averageDurationMinutes = averageDurationMinutes;
        this.averageDurationHours = averageDurationHours;
        this.totalVisits = totalVisits;
        this.label = label;
    }
    
    public String getPeriod() {
        return period;
    }
    
    public void setPeriod(String period) {
        this.period = period;
    }
    
    public Double getAverageDurationMinutes() {
        return averageDurationMinutes;
    }
    
    public void setAverageDurationMinutes(Double averageDurationMinutes) {
        this.averageDurationMinutes = averageDurationMinutes;
    }
    
    public Double getAverageDurationHours() {
        return averageDurationHours;
    }
    
    public void setAverageDurationHours(Double averageDurationHours) {
        this.averageDurationHours = averageDurationHours;
    }
    
    public Long getTotalVisits() {
        return totalVisits;
    }
    
    public void setTotalVisits(Long totalVisits) {
        this.totalVisits = totalVisits;
    }
    
    public String getLabel() {
        return label;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }
    
    @Override
    public String toString() {
        return "AverageVisitDurationChartDTO{" +
                "period='" + period + '\'' +
                ", averageDurationMinutes=" + averageDurationMinutes +
                ", averageDurationHours=" + averageDurationHours +
                ", totalVisits=" + totalVisits +
                ", label='" + label + '\'' +
                '}';
    }
}
