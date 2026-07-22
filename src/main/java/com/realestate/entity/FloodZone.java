package com.realestate.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flood_zone")
public class FloodZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "flood_risk", nullable = false)
    private Boolean floodRisk;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "nearby_water_body")
    private String nearbyWaterBody;

    @Column(name = "last_flood_year")
    private Integer lastFloodYear;

    @Column(name = "recommendation")
    private String recommendation;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default Constructor
    public FloodZone() {
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public Boolean getFloodRisk() {
        return floodRisk;
    }

    public void setFloodRisk(Boolean floodRisk) {
        this.floodRisk = floodRisk;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getNearbyWaterBody() {
        return nearbyWaterBody;
    }

    public void setNearbyWaterBody(String nearbyWaterBody) {
        this.nearbyWaterBody = nearbyWaterBody;
    }

    public Integer getLastFloodYear() {
        return lastFloodYear;
    }

    public void setLastFloodYear(Integer lastFloodYear) {
        this.lastFloodYear = lastFloodYear;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}