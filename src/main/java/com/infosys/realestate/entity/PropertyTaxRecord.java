package com.infosys.realestate.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_tax_records")
public class PropertyTaxRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "tax_year", nullable = false)
    private Integer taxYear;

    @Column(name = "assessed_value")
    private Double assessedValue;

    @Column(name = "market_value")
    private Double marketValue;

    @Column(name = "tax_amount", nullable = false)
    private Double taxAmount;

    @Column(name = "tax_rate")
    private Double taxRate;

    @Column(name = "payment_status", length = 50)
    private String paymentStatus; // e.g., PAID, UNPAID, PARTIAL, DELINQUENT

    @Column(name = "payment_date")
    private String paymentDate;

    @Column(name = "tax_authority", length = 200)
    private String taxAuthority;

    @Column(name = "parcel_number", length = 100)
    private String parcelNumber;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public PropertyTaxRecord() {}

    public PropertyTaxRecord(Property property, Integer taxYear, Double assessedValue,
                             Double marketValue, Double taxAmount, Double taxRate,
                             String paymentStatus, String paymentDate,
                             String taxAuthority, String parcelNumber) {
        this.property = property;
        this.taxYear = taxYear;
        this.assessedValue = assessedValue;
        this.marketValue = marketValue;
        this.taxAmount = taxAmount;
        this.taxRate = taxRate;
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
        this.taxAuthority = taxAuthority;
        this.parcelNumber = parcelNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public Integer getTaxYear() { return taxYear; }
    public void setTaxYear(Integer taxYear) { this.taxYear = taxYear; }

    public Double getAssessedValue() { return assessedValue; }
    public void setAssessedValue(Double assessedValue) { this.assessedValue = assessedValue; }

    public Double getMarketValue() { return marketValue; }
    public void setMarketValue(Double marketValue) { this.marketValue = marketValue; }

    public Double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(Double taxAmount) { this.taxAmount = taxAmount; }

    public Double getTaxRate() { return taxRate; }
    public void setTaxRate(Double taxRate) { this.taxRate = taxRate; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

    public String getTaxAuthority() { return taxAuthority; }
    public void setTaxAuthority(String taxAuthority) { this.taxAuthority = taxAuthority; }

    public String getParcelNumber() { return parcelNumber; }
    public void setParcelNumber(String parcelNumber) { this.parcelNumber = parcelNumber; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
