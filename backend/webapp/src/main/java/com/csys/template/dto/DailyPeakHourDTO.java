package com.csys.template.dto;

/**
 * DTO for daily peak hour data
 */
public class DailyPeakHourDTO {
    
    private String date; // e.g., "2025-07-03"
    private String dayLabel; // e.g., "Mer 03/07"
    private String peakHour; // e.g., "09:00-10:00"
    private Long peakHourCount; // Number of entries during peak hour
    private Long totalDayEntries; // Total entries for the entire day
    private Double peakHourPercentage; // Percentage of daily entries during peak hour
    
    public DailyPeakHourDTO() {}
    
    public DailyPeakHourDTO(String date, String dayLabel, String peakHour, 
                           Long peakHourCount, Long totalDayEntries, Double peakHourPercentage) {
        this.date = date;
        this.dayLabel = dayLabel;
        this.peakHour = peakHour;
        this.peakHourCount = peakHourCount;
        this.totalDayEntries = totalDayEntries;
        this.peakHourPercentage = peakHourPercentage;
    }
    
    public String getDate() {
        return date;
    }
    
    public void setDate(String date) {
        this.date = date;
    }
    
    public String getDayLabel() {
        return dayLabel;
    }
    
    public void setDayLabel(String dayLabel) {
        this.dayLabel = dayLabel;
    }
    
    public String getPeakHour() {
        return peakHour;
    }
    
    public void setPeakHour(String peakHour) {
        this.peakHour = peakHour;
    }
    
    public Long getPeakHourCount() {
        return peakHourCount;
    }
    
    public void setPeakHourCount(Long peakHourCount) {
        this.peakHourCount = peakHourCount;
    }
    
    public Long getTotalDayEntries() {
        return totalDayEntries;
    }
    
    public void setTotalDayEntries(Long totalDayEntries) {
        this.totalDayEntries = totalDayEntries;
    }
    
    public Double getPeakHourPercentage() {
        return peakHourPercentage;
    }
    
    public void setPeakHourPercentage(Double peakHourPercentage) {
        this.peakHourPercentage = peakHourPercentage;
    }
    
    @Override
    public String toString() {
        return "DailyPeakHourDTO{" +
                "date='" + date + '\'' +
                ", dayLabel='" + dayLabel + '\'' +
                ", peakHour='" + peakHour + '\'' +
                ", peakHourCount=" + peakHourCount +
                ", totalDayEntries=" + totalDayEntries +
                ", peakHourPercentage=" + peakHourPercentage +
                '}';
    }
}
