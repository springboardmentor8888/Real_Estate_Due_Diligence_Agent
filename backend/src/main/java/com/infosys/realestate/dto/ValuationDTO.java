package com.infosys.realestate.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ValuationDTO {

    private Long id;
    private Long propertyId;
    private BigDecimal estimatedValue;
    private String valuationMethod;
    private LocalDateTime valuationDate;
    private BigDecimal valueRangeLow;
    private BigDecimal valueRangeHigh;
    private Double confidenceScore;
    private String valuationNotes;

    public ValuationDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public BigDecimal getEstimatedValue() { return estimatedValue; }
    public void setEstimatedValue(BigDecimal estimatedValue) { this.estimatedValue = estimatedValue; }

    public String getValuationMethod() { return valuationMethod; }
    public void setValuationMethod(String valuationMethod) { this.valuationMethod = valuationMethod; }

    public LocalDateTime getValuationDate() { return valuationDate; }
    public void setValuationDate(LocalDateTime valuationDate) { this.valuationDate = valuationDate; }

    public BigDecimal getValueRangeLow() { return valueRangeLow; }
    public void setValueRangeLow(BigDecimal valueRangeLow) { this.valueRangeLow = valueRangeLow; }

    public BigDecimal getValueRangeHigh() { return valueRangeHigh; }
    public void setValueRangeHigh(BigDecimal valueRangeHigh) { this.valueRangeHigh = valueRangeHigh; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getValuationNotes() { return valuationNotes; }
    public void setValuationNotes(String valuationNotes) { this.valuationNotes = valuationNotes; }
}
