package com.realestate.due_diligence.property.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

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

    // ✅ ADD THESE TWO FIELDS
    private Double price;
    
    private String imageUrl;
}