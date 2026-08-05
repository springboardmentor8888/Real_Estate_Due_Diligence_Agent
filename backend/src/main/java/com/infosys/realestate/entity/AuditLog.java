package com.infosys.realestate.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Email of the user who performed the action */
    @Column(name = "actor_email", length = 150)
    private String actorEmail;

    /** Role of the actor at the time of the action */
    @Column(name = "actor_role", length = 50)
    private String actorRole;

    /**
     * High-level action name, e.g.:
     * PROCESS_DUE_DILIGENCE, EXPORT_PDF, EXPORT_EXCEL,
     * CREATE_PROPERTY, DELETE_USER, LOGIN, LOGOUT
     */
    @Column(nullable = false, length = 100)
    private String action;

    /** The type of entity affected, e.g. "Property", "DueDiligenceReport", "User" */
    @Column(name = "entity_type", length = 100)
    private String entityType;

    /** ID of the specific entity affected */
    @Column(name = "entity_id")
    private String entityId;

    /** Human-readable description of what happened */
    @Column(length = 1000)
    private String description;

    /** Client IP address (populated by the AOP aspect) */
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    /** SUCCESS or FAILURE */
    @Column(nullable = false, length = 20)
    private String outcome;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public AuditLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
