package com.csys.template.dto;

/**
 * DTO for entry time chart data
 */
public class EntryTimeChartDTO {
    
    private String timeRange; // e.g., "08:00-09:00", "09:00-10:00"
    private Long count; // Number of entries in this time range
    private String label; // Human-readable label for the chart
    
    public EntryTimeChartDTO() {}
    
    public EntryTimeChartDTO(String timeRange, Long count, String label) {
        this.timeRange = timeRange;
        this.count = count;
        this.label = label;
    }
    
    public String getTimeRange() {
        return timeRange;
    }
    
    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
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
    
    @Override
    public String toString() {
        return "EntryTimeChartDTO{" +
                "timeRange='" + timeRange + '\'' +
                ", count=" + count +
                ", label='" + label + '\'' +
                '}';
    }
}
