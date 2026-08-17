package com.infosys.realestate.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "comparable_properties")
public class ComparableProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_property_id", nullable = false)
    private Property subjectProperty;

    @Column(name = "comp_property_name", length = 150)
    private String compPropertyName;

    @Column(name = "comp_address", nullable = false, length = 255)
    private String compAddress;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(name = "zip_code", length = 20)
    private String zipCode;

    @Column(name = "sale_price", precision = 15, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "sale_date")
    private LocalDate saleDate;

    @Column(name = "square_footage")
    private Double squareFootage;

    @Column(name = "price_per_sq_ft", precision = 10, scale = 2)
    private BigDecimal pricePerSqFt;

    @Column(name = "distance_in_miles")
    private Double distanceInMiles;

    @Column(name = "similarity_score")
    private Integer similarityScore;

    @Column(name = "property_type", length = 100)
    private String propertyType;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ComparableProperty() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getSubjectProperty() { return subjectProperty; }
    public void setSubjectProperty(Property subjectProperty) { this.subjectProperty = subjectProperty; }

    public String getCompPropertyName() { return compPropertyName; }
    public void setCompPropertyName(String compPropertyName) { this.compPropertyName = compPropertyName; }

    public String getCompAddress() { return compAddress; }
    public void setCompAddress(String compAddress) { this.compAddress = compAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }

    public LocalDate getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }

    public Double getSquareFootage() { return squareFootage; }
    public void setSquareFootage(Double squareFootage) { this.squareFootage = squareFootage; }

    public BigDecimal getPricePerSqFt() { return pricePerSqFt; }
    public void setPricePerSqFt(BigDecimal pricePerSqFt) { this.pricePerSqFt = pricePerSqFt; }

    public Double getDistanceInMiles() { return distanceInMiles; }
    public void setDistanceInMiles(Double distanceInMiles) { this.distanceInMiles = distanceInMiles; }

    public Integer getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Integer similarityScore) { this.similarityScore = similarityScore; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
