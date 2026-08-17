package com.infosys.realestate.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_valuations")
public class PropertyValuation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "estimated_value", precision = 15, scale = 2, nullable = false)
    private BigDecimal estimatedValue;

    @Column(name = "valuation_method", length = 100)
    private String valuationMethod; // e.g. COMPARABLE_SALES, AUTOMATED_VALUATION_MODEL, INCOME_APPROACH

    @Column(name = "valuation_date")
    private LocalDateTime valuationDate = LocalDateTime.now();

    @Column(name = "value_range_low", precision = 15, scale = 2)
    private BigDecimal valueRangeLow;

    @Column(name = "value_range_high", precision = 15, scale = 2)
    private BigDecimal valueRangeHigh;

    @Column(name = "confidence_score")
    private Double confidenceScore; // e.g. 0.85 (85%)

    @Column(name = "valuation_notes", length = 1000)
    private String valuationNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public PropertyValuation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
