package com.realestate.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "environmental_records")
public class EnvironmentalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String propertyAddress;

    @Column(nullable = false)
    private String hazardType;

    @Column(nullable = false)
    private String riskLevel;

    private LocalDate reportDate;

    private String remarks;

    public EnvironmentalRecord() {
    }

    public Long getId() {
        return id;
    }

    public String getPropertyAddress() {
        return propertyAddress;
    }

    public String getHazardType() {
        return hazardType;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPropertyAddress(String propertyAddress) {
        this.propertyAddress = propertyAddress;
    }

    public void setHazardType(String hazardType) {
        this.hazardType = hazardType;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}