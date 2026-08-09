package com.realestate.agent.service.impl;

import com.realestate.agent.dto.AdminDashboardResponse;
import com.realestate.agent.repository.AuditLogRepository;
import com.realestate.agent.repository.DueDiligenceReportRepository;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.repository.RiskAssessmentRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.service.AdminDashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final DueDiligenceReportRepository dueDiligenceReportRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminDashboardServiceImpl(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            DueDiligenceReportRepository dueDiligenceReportRepository,
            RiskAssessmentRepository riskAssessmentRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.dueDiligenceReportRepository = dueDiligenceReportRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardAnalytics() {

        long totalUsers = userRepository.count();

        long totalProperties = propertyRepository.count();

        long totalReports = dueDiligenceReportRepository.count();

        long totalRiskAssessments = riskAssessmentRepository.count();

        long totalAuditLogs = auditLogRepository.count();

        return new AdminDashboardResponse(
                totalUsers,
                totalProperties,
                totalReports,
                totalRiskAssessments,
                totalAuditLogs
        );
    }
}