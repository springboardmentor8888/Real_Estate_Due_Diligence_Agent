package com.realestate.due_diligence.audit.service;

import com.realestate.due_diligence.audit.AuditAction;
import com.realestate.due_diligence.audit.AuditLog;
import com.realestate.due_diligence.audit.AuditModule;
import com.realestate.due_diligence.audit.dto.AuditLogResponse;
import com.realestate.due_diligence.repository.AuditRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditRepository auditRepository;

    @Override
    @Transactional
    public AuditLog saveAuditLog(AuditLog auditLog) {
        return auditRepository.save(auditLog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAllLogs() {

        return auditRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByUser(String username) {
        return auditRepository.findByUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByModule(AuditModule module) {
        return auditRepository.findByModuleOrderByCreatedAtDesc(module)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByAction(AuditAction action) {
        return auditRepository.findByActionOrderByCreatedAtDesc(action)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByApi(String apiEndpoint) {

        return auditRepository.findByApiEndpointOrderByCreatedAtDesc(apiEndpoint)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByReport(String reportName) {

        return auditRepository.findByReportNameOrderByCreatedAtDesc(reportName)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByDateRange(
            LocalDateTime start,
            LocalDateTime end) {

        return auditRepository
                .findByCreatedAtBetweenOrderByCreatedAtDesc(start, end)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }




    private AuditLogResponse mapToResponse(AuditLog auditLog) {

        return AuditLogResponse.builder()
                .id(auditLog.getId())
                .username(auditLog.getUsername())
                .action(auditLog.getAction())
                .module(auditLog.getModule())
                .status(auditLog.getStatus())
                .requestMethod(auditLog.getRequestMethod())
                .apiEndpoint(auditLog.getApiEndpoint())
                .entityName(auditLog.getEntityName())
                .entityId(auditLog.getEntityId())
                .ipAddress(auditLog.getIpAddress())
                .responseStatus(auditLog.getResponseStatus())
                .reportName(auditLog.getReportName())
                .description(auditLog.getDescription())
                .createdAt(auditLog.getCreatedAt())
                .build();
    }
}
