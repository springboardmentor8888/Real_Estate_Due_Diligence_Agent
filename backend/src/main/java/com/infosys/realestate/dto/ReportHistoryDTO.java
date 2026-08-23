package com.infosys.realestate.dto;

import java.time.LocalDateTime;

public class ReportHistoryDTO {

    private Long id;
    private Long reportId;
    private Long propertyId;

    private String propertyName;
    private String propertyAddress;
    private String propertyCity;
    private String propertyState;

    private String status;
    private String reportUrl;

    private String requestedByEmail;
    private String requestedByName;

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    private Long durationMs;
    private String errorMessage;

    private String exportFormat;
    private String summary;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ReportHistoryDTO() {
    }

    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // =====================================================
    // REPORT ID
    // =====================================================

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    // =====================================================
    // PROPERTY ID
    // =====================================================

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    // =====================================================
    // PROPERTY NAME
    // =====================================================

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    // =====================================================
    // PROPERTY ADDRESS
    // =====================================================

    public String getPropertyAddress() {
        return propertyAddress;
    }

    public void setPropertyAddress(String propertyAddress) {
        this.propertyAddress = propertyAddress;
    }

    // =====================================================
    // CITY
    // =====================================================

    public String getPropertyCity() {
        return propertyCity;
    }

    public void setPropertyCity(String propertyCity) {
        this.propertyCity = propertyCity;
    }

    // =====================================================
    // STATE
    // =====================================================

    public String getPropertyState() {
        return propertyState;
    }

    public void setPropertyState(String propertyState) {
        this.propertyState = propertyState;
    }

    // =====================================================
    // STATUS
    // =====================================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // =====================================================
    // REPORT URL
    // =====================================================

    public String getReportUrl() {
        return reportUrl;
    }

    public void setReportUrl(String reportUrl) {
        this.reportUrl = reportUrl;
    }

    // =====================================================
    // REQUESTED BY EMAIL
    // =====================================================

    public String getRequestedByEmail() {
        return requestedByEmail;
    }

    public void setRequestedByEmail(String requestedByEmail) {
        this.requestedByEmail = requestedByEmail;
    }

    // =====================================================
    // REQUESTED BY NAME
    // =====================================================

    public String getRequestedByName() {
        return requestedByName;
    }

    public void setRequestedByName(String requestedByName) {
        this.requestedByName = requestedByName;
    }

    // =====================================================
    // CREATED AT
    // =====================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // =====================================================
    // COMPLETED AT
    // =====================================================

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    // =====================================================
    // DURATION
    // =====================================================

    public Long getDurationMs() {
        return durationMs;
    }

    public void setDurationMs(Long durationMs) {
        this.durationMs = durationMs;
    }

    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    // =====================================================
    // EXPORT FORMAT
    // =====================================================

    public String getExportFormat() {
        return exportFormat;
    }

    public void setExportFormat(String exportFormat) {
        this.exportFormat = exportFormat;
    }

    // =====================================================
    // SUMMARY
    // =====================================================

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}