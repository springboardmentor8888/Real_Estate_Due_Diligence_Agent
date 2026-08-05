package com.infosys.realestate.service.impl;

import com.infosys.realestate.entity.AuditLog;
import com.infosys.realestate.repository.AuditLogRepository;
import com.infosys.realestate.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public AuditLog log(String actorEmail, String actorRole, String action,
                        String entityType, String entityId,
                        String description, String ipAddress, String outcome) {
        AuditLog entry = new AuditLog();
        entry.setActorEmail(actorEmail);
        entry.setActorRole(actorRole);
        entry.setAction(action);
        entry.setEntityType(entityType);
        entry.setEntityId(entityId);
        entry.setDescription(description);
        entry.setIpAddress(ipAddress);
        entry.setOutcome(outcome);
        return auditLogRepository.save(entry);
    }

    @Override
    public Page<AuditLog> getAllLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    public Page<AuditLog> getLogsByActor(String actorEmail, Pageable pageable) {
        return auditLogRepository.findByActorEmailOrderByCreatedAtDesc(actorEmail, pageable);
    }

    @Override
    public Page<AuditLog> getLogsByAction(String action, Pageable pageable) {
        return auditLogRepository.findByActionOrderByCreatedAtDesc(action, pageable);
    }

    @Override
    public Page<AuditLog> getLogsByEntity(String entityType, String entityId, Pageable pageable) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
                entityType, entityId, pageable);
    }
}
