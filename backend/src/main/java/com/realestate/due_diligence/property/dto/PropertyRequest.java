package com.realestate.due_diligence.property.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PropertyRequest {

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String zipCode;

    @NotBlank
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
}