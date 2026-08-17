package com.infosys.realestate.dto;

import java.time.LocalDateTime;

public class PropertyInformationResponse {

    private Long propertyId;
    private String propertyName;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String propertyType;
    private String ownerName;
    private LocalDateTime createdDate;
    private String dueDiligenceStatus;
    private String riskLevel;
    private Integer riskScore;

    public PropertyInformationResponse() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyName() { return propertyName; }
    public void setPropertyName(String propertyName) { this.propertyName = propertyName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public String getDueDiligenceStatus() { return dueDiligenceStatus; }
    public void setDueDiligenceStatus(String dueDiligenceStatus) { this.dueDiligenceStatus = dueDiligenceStatus; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
}
