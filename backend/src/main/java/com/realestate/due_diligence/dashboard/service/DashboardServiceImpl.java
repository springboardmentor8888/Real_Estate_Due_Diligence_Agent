package com.realestate.due_diligence.dashboard.service;

import com.realestate.due_diligence.audit.AuditLog;
import com.realestate.due_diligence.dashboard.dto.DashboardResponse;
import com.realestate.due_diligence.dashboard.dto.RecentActivityResponse;
import com.realestate.due_diligence.repository.AuditRepository;
import com.realestate.due_diligence.repository.PropertyRepository;
import com.realestate.due_diligence.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final AuditRepository auditRepository;

    @Override
    public DashboardResponse getDashboard() {

        List<RecentActivityResponse> recentActivities =
                auditRepository.findAllByOrderByCreatedAtDesc()
                        .stream()
                        .limit(10)
                        .map(this::mapToRecentActivity)
                        .toList();

        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalProperties(propertyRepository.count())
                .totalAuditLogs(auditRepository.count())
                .totalReports(0L)
                .pendingReports(0L)
                .completedReports(0L)
                .highRiskProperties(0L)
                .unreadNotifications(0L)

                .recentActivities(recentActivities)
                .build();
    }

    private RecentActivityResponse mapToRecentActivity(AuditLog auditLog) {

        return RecentActivityResponse.builder()
                .username(auditLog.getUsername())
                .action(auditLog.getAction().name())
                .module(auditLog.getModule().name())
                .description(auditLog.getDescription())
                .createdAt(auditLog.getCreatedAt())
                .build();
    }
}
