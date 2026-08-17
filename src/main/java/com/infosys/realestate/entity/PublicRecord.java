package com.infosys.realestate.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "public_records")
public class PublicRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "record_type", nullable = false, length = 100)
    private String recordType; // e.g., LIEN, FORECLOSURE, COURT_JUDGMENT, BUILDING_VIOLATION, ENVIRONMENTAL_NOTICE

    @Column(name = "record_title", length = 200)
    private String recordTitle;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "filing_date")
    private LocalDate filingDate;

    @Column(name = "resolution_date")
    private LocalDate resolutionDate;

    @Column(name = "status", length = 50)
    private String status; // e.g., ACTIVE, RESOLVED, PENDING

    @Column(name = "source_agency", length = 200)
    private String sourceAgency;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "severity", length = 50)
    private String severity; // LOW, MEDIUM, HIGH

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public PublicRecord() {}

    public PublicRecord(Property property, String recordType, String recordTitle,
                        String description, LocalDate filingDate, LocalDate resolutionDate,
                        String status, String sourceAgency, String referenceNumber, String severity) {
        this.property = property;
        this.recordType = recordType;
        this.recordTitle = recordTitle;
        this.description = description;
        this.filingDate = filingDate;
        this.resolutionDate = resolutionDate;
        this.status = status;
        this.sourceAgency = sourceAgency;
        this.referenceNumber = referenceNumber;
        this.severity = severity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getRecordType() { return recordType; }
    public void setRecordType(String recordType) { this.recordType = recordType; }

    public String getRecordTitle() { return recordTitle; }
    public void setRecordTitle(String recordTitle) { this.recordTitle = recordTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getFilingDate() { return filingDate; }
    public void setFilingDate(LocalDate filingDate) { this.filingDate = filingDate; }

    public LocalDate getResolutionDate() { return resolutionDate; }
    public void setResolutionDate(LocalDate resolutionDate) { this.resolutionDate = resolutionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSourceAgency() { return sourceAgency; }
    public void setSourceAgency(String sourceAgency) { this.sourceAgency = sourceAgency; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
