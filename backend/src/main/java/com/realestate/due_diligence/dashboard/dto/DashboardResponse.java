package com.realestate.due_diligence.dashboard.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Long totalUsers;

    private Long totalProperties;

    private Long totalReports;

    private Long totalAuditLogs;

    private Long pendingReports;

    private Long completedReports;

    private Long highRiskProperties;

    private Long unreadNotifications;

    private List<RecentActivityResponse> recentActivities;
}
