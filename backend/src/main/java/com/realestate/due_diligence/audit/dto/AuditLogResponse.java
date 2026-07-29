package com.realestate.due_diligence.audit.dto;

import com.realestate.due_diligence.audit.AuditAction;
import com.realestate.due_diligence.audit.AuditModule;
import com.realestate.due_diligence.audit.AuditStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AuditLogResponse {

    private Long id;

    private String username;

    private AuditAction action;

    private AuditModule module;

    private AuditStatus status;

    private String requestMethod;

    private String apiEndpoint;

    private String entityName;

    private Long entityId;

    private String ipAddress;

    private String reportName;

    private String description;

    private Integer responseStatus;

    private LocalDateTime createdAt;
}
