package com.infosys.realestate.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "due_diligence_reports")
public class DueDiligenceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private String status;

    private String reportUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public DueDiligenceReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReportUrl() { return reportUrl; }
    public void setReportUrl(String reportUrl) { this.reportUrl = reportUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
