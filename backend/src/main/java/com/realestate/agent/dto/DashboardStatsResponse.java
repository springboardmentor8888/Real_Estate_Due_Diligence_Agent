package com.realestate.agent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private String role;
    private String userFullName;
    private String userEmail;

    // Standard 4 KPI stats
    private long totalProperties;
    private long activeTransactions;
    private long pendingReviews;
    private long reportsGenerated;
    private long watchlistCount;
    private long unreadNotificationsCount;

    // Role-specific stats
    private long activeListings;
    private long underContract;
    private long soldProperties;
    private long totalInquiries;
    private long totalLoans;
    private long pendingLoans;
    private long approvedLoans;
    private long totalDocuments;
    private long verifiedDocuments;
    private long highRiskAlerts;

    // Real dynamic recent activity items directly from PostgreSQL
    private List<ActivityItem> recentActivities;

    // Real collections from PostgreSQL for rich dashboard cards and tables
    private List<Map<String, Object>> properties;
    private List<Map<String, Object>> offers;
    private List<Map<String, Object>> watchlist;
    private List<Map<String, Object>> reports;
    private List<Map<String, Object>> pendingReviewItems;
    private List<Map<String, Object>> comparableProperties;
    private List<Map<String, Object>> notifications;
    private Map<String, Object> riskOverview;
    private Map<String, Object> analytics;

    // Quick stats breakdown map
    private Map<String, Object> extraMetrics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityItem {
        private String id;
        private String type; // 'PROPERTY', 'OFFER', 'REPORT', 'RISK', 'DOCUMENT', 'NOTIFICATION', 'WATCHLIST'
        private String title;
        private String description;
        private String timeAgo;
        private LocalDateTime timestamp;
        private String status;
        private String entityId;
    }
}

