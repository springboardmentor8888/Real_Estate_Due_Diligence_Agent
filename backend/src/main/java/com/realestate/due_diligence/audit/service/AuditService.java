package com.realestate.due_diligence.audit.service;

import com.realestate.due_diligence.audit.AuditAction;
import com.realestate.due_diligence.audit.AuditLog;
import com.realestate.due_diligence.audit.AuditModule;
import com.realestate.due_diligence.audit.dto.AuditLogResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditService {

    AuditLog saveAuditLog(AuditLog auditLog);

    List<AuditLogResponse> getAllLogs();

    List<AuditLogResponse> getLogsByUser(String username);

    List<AuditLogResponse> getLogsByModule(AuditModule module);

    List<AuditLogResponse> getLogsByAction(AuditAction action);

    List<AuditLogResponse> getLogsByApi(String apiEndpoint);

    List<AuditLogResponse> getLogsByReport(String reportName);

    List<AuditLogResponse> getLogsByDateRange(LocalDateTime start,
                                              LocalDateTime end);
}
