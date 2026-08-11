package com.realestate.due_diligence.property.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class PropertyResponse {
    private Long id;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String propertyType;

    private Double price;
    private String imageUrl;
    private LocalDateTime createdAt;

    // ✅ ADDED NEW DILIGENCE & STRUCTURAL FIELDS
    private String surveyNo;
    private String registrationNo;
    private String area;
    private Integer bedrooms;
    private Integer bathrooms;
    private String parking;
    private String furnishing;
}