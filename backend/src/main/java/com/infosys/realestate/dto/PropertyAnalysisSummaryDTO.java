package com.infosys.realestate.dto;

import java.util.List;

public class PropertyAnalysisSummaryDTO {

    private Long propertyId;
    private String propertyName;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String propertyType;
    private ValuationDTO currentValuation;
    private RiskAssessmentDTO latestRiskAssessment;
    private List<ComparablePropertyDTO> comparableProperties;

    public PropertyAnalysisSummaryDTO() {}

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

    public ValuationDTO getCurrentValuation() { return currentValuation; }
    public void setCurrentValuation(ValuationDTO currentValuation) { this.currentValuation = currentValuation; }

    public RiskAssessmentDTO getLatestRiskAssessment() { return latestRiskAssessment; }
    public void setLatestRiskAssessment(RiskAssessmentDTO latestRiskAssessment) { this.latestRiskAssessment = latestRiskAssessment; }

    public List<ComparablePropertyDTO> getComparableProperties() { return comparableProperties; }
    public void setComparableProperties(List<ComparablePropertyDTO> comparableProperties) { this.comparableProperties = comparableProperties; }
}
