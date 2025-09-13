package com.csys.template.dto;

/**
 * DTO for visit duration chart data
 */
public class VisitDurationChartDTO {
    
    private String durationRange; // e.g., "0-30 min", "30-60 min", "1-2 hours"
    private Long count; // Number of visits in this duration range
    private String label; // Human-readable label for the chart
    private Double averageDurationMinutes; // Average duration in minutes for this range
    
    public VisitDurationChartDTO() {}
    
    public VisitDurationChartDTO(String durationRange, Long count, String label, Double averageDurationMinutes) {
        this.durationRange = durationRange;
        this.count = count;
        this.label = label;
        this.averageDurationMinutes = averageDurationMinutes;
    }
    
    public String getDurationRange() {
        return durationRange;
    }
    
    public void setDurationRange(String durationRange) {
        this.durationRange = durationRange;
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
    
    public Double getAverageDurationMinutes() {
        return averageDurationMinutes;
    }
    
    public void setAverageDurationMinutes(Double averageDurationMinutes) {
        this.averageDurationMinutes = averageDurationMinutes;
    }
    
    @Override
    public String toString() {
        return "VisitDurationChartDTO{" +
                "durationRange='" + durationRange + '\'' +
                ", count=" + count +
                ", label='" + label + '\'' +
                ", averageDurationMinutes=" + averageDurationMinutes +
                '}';
    }
}
