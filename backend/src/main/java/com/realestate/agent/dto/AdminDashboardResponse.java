package com.realestate.agent.dto;

public class AdminDashboardResponse {

    private long totalUsers;
    private long totalProperties;
    private long totalReports;
    private long totalRiskAssessments;
    private long totalAuditLogs;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(
            long totalUsers,
            long totalProperties,
            long totalReports,
            long totalRiskAssessments,
            long totalAuditLogs
    ) {
        this.totalUsers = totalUsers;
        this.totalProperties = totalProperties;
        this.totalReports = totalReports;
        this.totalRiskAssessments = totalRiskAssessments;
        this.totalAuditLogs = totalAuditLogs;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalProperties() {
        return totalProperties;
    }

    public void setTotalProperties(long totalProperties) {
        this.totalProperties = totalProperties;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getTotalRiskAssessments() {
        return totalRiskAssessments;
    }

    public void setTotalRiskAssessments(long totalRiskAssessments) {
        this.totalRiskAssessments = totalRiskAssessments;
    }

    public long getTotalAuditLogs() {
        return totalAuditLogs;
    }

    public void setTotalAuditLogs(long totalAuditLogs) {
        this.totalAuditLogs = totalAuditLogs;
    }
}