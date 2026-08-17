package com.infosys.realestate.dto;

import java.time.LocalDateTime;

public class RiskAssessmentDTO {

    private Long id;
    private Long propertyId;
    private String riskLevel;
    private Integer riskScore;
    private Integer titleRiskScore;
    private Integer taxRiskScore;
    private Integer zoningRiskScore;
    private Integer floodRiskScore;
    private Integer environmentalRiskScore;
    private Integer overallRiskScore;
    private String mitigationRecommendations;
    private String comments;
    private LocalDateTime assessedAt;

    public RiskAssessmentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public Integer getTitleRiskScore() { return titleRiskScore; }
    public void setTitleRiskScore(Integer titleRiskScore) { this.titleRiskScore = titleRiskScore; }

    public Integer getTaxRiskScore() { return taxRiskScore; }
    public void setTaxRiskScore(Integer taxRiskScore) { this.taxRiskScore = taxRiskScore; }

    public Integer getZoningRiskScore() { return zoningRiskScore; }
    public void setZoningRiskScore(Integer zoningRiskScore) { this.zoningRiskScore = zoningRiskScore; }

    public Integer getFloodRiskScore() { return floodRiskScore; }
    public void setFloodRiskScore(Integer floodRiskScore) { this.floodRiskScore = floodRiskScore; }

    public Integer getEnvironmentalRiskScore() { return environmentalRiskScore; }
    public void setEnvironmentalRiskScore(Integer environmentalRiskScore) { this.environmentalRiskScore = environmentalRiskScore; }

    public Integer getOverallRiskScore() { return overallRiskScore; }
    public void setOverallRiskScore(Integer overallRiskScore) { this.overallRiskScore = overallRiskScore; }

    public String getMitigationRecommendations() { return mitigationRecommendations; }
    public void setMitigationRecommendations(String mitigationRecommendations) { this.mitigationRecommendations = mitigationRecommendations; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getAssessedAt() { return assessedAt; }
    public void setAssessedAt(LocalDateTime assessedAt) { this.assessedAt = assessedAt; }
}
