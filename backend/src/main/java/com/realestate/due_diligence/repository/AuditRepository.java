package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.audit.AuditAction;
import com.realestate.due_diligence.audit.AuditLog;
import com.realestate.due_diligence.audit.AuditModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByCreatedAtDesc();

    List<AuditLog> findByUsernameOrderByCreatedAtDesc(String username);

    List<AuditLog> findByModuleOrderByCreatedAtDesc(AuditModule module);

    List<AuditLog> findByActionOrderByCreatedAtDesc(AuditAction action);

    List<AuditLog> findByApiEndpointOrderByCreatedAtDesc(String apiEndpoint);

    List<AuditLog> findByEntityNameOrderByCreatedAtDesc(String entityName);

    List<AuditLog> findByReportNameOrderByCreatedAtDesc(String reportName);

    List<AuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime start,
            LocalDateTime end);
}