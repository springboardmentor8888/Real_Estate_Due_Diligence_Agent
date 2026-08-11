package com.realestate.due_diligence.riskassessment.dto;

import java.util.List;

public class RiskAssessmentResponse {

    private Long propertyId;
    private Integer riskScore;
    private String overallRisk;
    private List<String> riskFactors;
    private String recommendation;

    // ✅ ADDED DYNAMIC SUB-RISK SCORES
    private Integer legalScore;
    private Integer taxScore;
    private Integer floodScore;
    private Integer permitScore;
    private Integer zoningScore;
    private Integer ownershipScore;

    public RiskAssessmentResponse() {
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getOverallRisk() {
        return overallRisk;
    }

    public void setOverallRisk(String overallRisk) {
        this.overallRisk = overallRisk;
    }

    public List<String> getRiskFactors() {
        return riskFactors;
    }

    public void setRiskFactors(List<String> riskFactors) {
        this.riskFactors = riskFactors;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    // ✅ GETTERS & SETTERS FOR SUB-SCORES

    public Integer getLegalScore() {
        return legalScore;
    }

    public void setLegalScore(Integer legalScore) {
        this.legalScore = legalScore;
    }

    public Integer getTaxScore() {
        return taxScore;
    }

    public void setTaxScore(Integer taxScore) {
        this.taxScore = taxScore;
    }

    public Integer getFloodScore() {
        return floodScore;
    }

    public void setFloodScore(Integer floodScore) {
        this.floodScore = floodScore;
    }

    public Integer getPermitScore() {
        return permitScore;
    }

    public void setPermitScore(Integer permitScore) {
        this.permitScore = permitScore;
    }

    public Integer getZoningScore() {
        return zoningScore;
    }

    public void setZoningScore(Integer zoningScore) {
        this.zoningScore = zoningScore;
    }

    public Integer getOwnershipScore() {
        return ownershipScore;
    }

    public void setOwnershipScore(Integer ownershipScore) {
        this.ownershipScore = ownershipScore;
    }
}