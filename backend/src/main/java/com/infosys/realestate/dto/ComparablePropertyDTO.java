package com.infosys.realestate.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ComparablePropertyDTO {

    private Long id;
    private Long subjectPropertyId;
    private String compPropertyName;
    private String compAddress;
    private String city;
    private String state;
    private String zipCode;
    private BigDecimal salePrice;
    private LocalDate saleDate;
    private Double squareFootage;
    private BigDecimal pricePerSqFt;
    private Double distanceInMiles;
    private Integer similarityScore;
    private String propertyType;

    public ComparablePropertyDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSubjectPropertyId() { return subjectPropertyId; }
    public void setSubjectPropertyId(Long subjectPropertyId) { this.subjectPropertyId = subjectPropertyId; }

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
}
