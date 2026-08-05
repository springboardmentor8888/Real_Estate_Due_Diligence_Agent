package com.infosys.realestate.dto;

import java.util.List;
import java.util.Map;

public class DashboardAnalyticsDTO {

    // System-wide counts
    private long totalProperties;
    private long totalReports;
    private long totalUsers;

    // Report breakdown by status
    private Map<String, Long> reportsByStatus;

    // Last 10 reports
    private List<ReportHistoryDTO> recentReports;

    // Report counts per month (last 6 months), key = "YYYY-MM"
    private Map<String, Long> reportsByMonth;

    // Risk distribution across all risk assessments
    private Map<String, Long> riskDistribution;

    // Average report processing time in ms (COMPLETED reports only)
    private Long averageProcessingTimeMs;

    // Top 5 properties by number of due-diligence reports
    private List<Map<String, Object>> topPropertiesByReportCount;

    // Audit log outcome stats
    private Map<String, Long> auditOutcomes;

    public DashboardAnalyticsDTO() {}

    public long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(long totalProperties) { this.totalProperties = totalProperties; }

    public long getTotalReports() { return totalReports; }
    public void setTotalReports(long totalReports) { this.totalReports = totalReports; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public Map<String, Long> getReportsByStatus() { return reportsByStatus; }
    public void setReportsByStatus(Map<String, Long> reportsByStatus) { this.reportsByStatus = reportsByStatus; }

    public List<ReportHistoryDTO> getRecentReports() { return recentReports; }
    public void setRecentReports(List<ReportHistoryDTO> recentReports) { this.recentReports = recentReports; }

    public Map<String, Long> getReportsByMonth() { return reportsByMonth; }
    public void setReportsByMonth(Map<String, Long> reportsByMonth) { this.reportsByMonth = reportsByMonth; }

    public Map<String, Long> getRiskDistribution() { return riskDistribution; }
    public void setRiskDistribution(Map<String, Long> riskDistribution) { this.riskDistribution = riskDistribution; }

    public Long getAverageProcessingTimeMs() { return averageProcessingTimeMs; }
    public void setAverageProcessingTimeMs(Long averageProcessingTimeMs) { this.averageProcessingTimeMs = averageProcessingTimeMs; }

    public List<Map<String, Object>> getTopPropertiesByReportCount() { return topPropertiesByReportCount; }
    public void setTopPropertiesByReportCount(List<Map<String, Object>> topPropertiesByReportCount) { this.topPropertiesByReportCount = topPropertiesByReportCount; }

    public Map<String, Long> getAuditOutcomes() { return auditOutcomes; }
    public void setAuditOutcomes(Map<String, Long> auditOutcomes) { this.auditOutcomes = auditOutcomes; }
}
