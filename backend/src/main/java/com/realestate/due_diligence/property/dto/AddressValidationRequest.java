package com.realestate.due_diligence.property.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddressValidationRequest {

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String zipCode;

    private String propertyType;

    private Double price;

    private String imageUrl;

    private List<String> imageUrls;

    // Physical Specifications
    private Integer bedrooms;

    private Integer bathrooms;

    private Integer sqft;

    // Legal Identifiers
    private String surveyNo;

    private String registrationNo;

    // Explicit Getters (Fixes IDE red lines if Lombok fails to process)
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getZipCode() { return zipCode; }
    public String getPropertyType() { return propertyType; }
    public Double getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public List<String> getImageUrls() { return imageUrls; }
    public Integer getBedrooms() { return bedrooms; }
    public Integer getBathrooms() { return bathrooms; }
    public Integer getSqft() { return sqft; }
    public String getSurveyNo() { return surveyNo; }
    public String getRegistrationNo() { return registrationNo; }

    // Explicit Setters
    public void setAddress(String address) { this.address = address; }
    public void setCity(String city) { this.city = city; }
    public void setState(String state) { this.state = state; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }
    public void setPrice(Double price) { this.price = price; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }
    public void setSqft(Integer sqft) { this.sqft = sqft; }
    public void setSurveyNo(String surveyNo) { this.surveyNo = surveyNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }
}