package com.infosys.realestate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "property_tax_history")
public class PropertyTaxHistory {
    public PropertyTaxHistory() {
}
    public PropertyTaxHistory(Long taxHistoryId, Integer taxYear, Double taxAmount, String paymentStatus,
            Property property) {
        this.taxHistoryId = taxHistoryId;
        this.taxYear = taxYear;
        this.taxAmount = taxAmount;
        this.paymentStatus = paymentStatus;
        this.property = property;
    }
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "tax_history_id")
private Long taxHistoryId;
@Column(name = "tax_year")
private Integer taxYear;

@Column(name = "tax_amount")
private Double taxAmount;

@Column(name = "payment_status")
private String paymentStatus;
@ManyToOne
@JoinColumn(name = "property_id", nullable = false)
private Property property;
public Long getTaxHistoryId() {
    return taxHistoryId;
}
public void setTaxHistoryId(Long taxHistoryId) {
    this.taxHistoryId = taxHistoryId;
}
public Integer getTaxYear() {
    return taxYear;
}
public void setTaxYear(Integer taxYear) {
    this.taxYear = taxYear;
}
public Double getTaxAmount() {
    return taxAmount;
}
public void setTaxAmount(Double taxAmount) {
    this.taxAmount = taxAmount;
}
public String getPaymentStatus() {
    return paymentStatus;
}
public void setPaymentStatus(String paymentStatus) {
    this.paymentStatus = paymentStatus;
}
public Property getProperty() {
    return property;
}
public void setProperty(Property property) {
    this.property = property;
}

}