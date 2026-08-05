package com.infosys.realestate.service;

import com.infosys.realestate.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {

    /** Persists an audit entry. */
    AuditLog log(String actorEmail, String actorRole, String action,
                 String entityType, String entityId,
                 String description, String ipAddress, String outcome);

    /** Paged list of all audit logs, newest first. Admin only. */
    Page<AuditLog> getAllLogs(Pageable pageable);

    /** Logs filtered by actor email. */
    Page<AuditLog> getLogsByActor(String actorEmail, Pageable pageable);

    /** Logs filtered by action name. */
    Page<AuditLog> getLogsByAction(String action, Pageable pageable);

    /** Logs filtered by entity type + entity ID. */
    Page<AuditLog> getLogsByEntity(String entityType, String entityId, Pageable pageable);
}
