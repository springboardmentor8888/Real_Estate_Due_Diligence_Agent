package com.infosys.realestate.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ownership_records")
public class OwnershipRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "owner_name", nullable = false, length = 200)
    private String ownerName;

    @Column(name = "owner_type", length = 100)
    private String ownerType; // e.g., INDIVIDUAL, CORPORATION, TRUST

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @Column(name = "sale_date")
    private LocalDate saleDate;

    @Column(name = "purchase_price")
    private Double purchasePrice;

    @Column(name = "deed_reference", length = 100)
    private String deedReference;

    @Column(name = "is_current_owner")
    private Boolean isCurrentOwner;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public OwnershipRecord() {}

    public OwnershipRecord(Property property, String ownerName, String ownerType,
                           LocalDate acquisitionDate, LocalDate saleDate, Double purchasePrice,
                           String deedReference, Boolean isCurrentOwner) {
        this.property = property;
        this.ownerName = ownerName;
        this.ownerType = ownerType;
        this.acquisitionDate = acquisitionDate;
        this.saleDate = saleDate;
        this.purchasePrice = purchasePrice;
        this.deedReference = deedReference;
        this.isCurrentOwner = isCurrentOwner;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerType() { return ownerType; }
    public void setOwnerType(String ownerType) { this.ownerType = ownerType; }

    public LocalDate getAcquisitionDate() { return acquisitionDate; }
    public void setAcquisitionDate(LocalDate acquisitionDate) { this.acquisitionDate = acquisitionDate; }

    public LocalDate getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }

    public Double getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(Double purchasePrice) { this.purchasePrice = purchasePrice; }

    public String getDeedReference() { return deedReference; }
    public void setDeedReference(String deedReference) { this.deedReference = deedReference; }

    public Boolean getIsCurrentOwner() { return isCurrentOwner; }
    public void setIsCurrentOwner(Boolean isCurrentOwner) { this.isCurrentOwner = isCurrentOwner; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
