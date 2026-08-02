package com.realestate.due_diligence.audit;

import com.realestate.due_diligence.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "audit_logs")
public class AuditLog extends BaseEntity {

    private String username;

    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Enumerated(EnumType.STRING)
    private AuditModule module;

    @Enumerated(EnumType.STRING)
    private AuditStatus status;

    private String requestMethod;

    private String apiEndpoint;

    private String entityName;

    private Long entityId;

    private String ipAddress;

    private String reportName;

    @Column(length = 1000)
    private String description;

    private Integer responseStatus;
}