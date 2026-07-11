package com.realestate.due_diligence.property.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertySearchRequest {

    private String city;

    private String state;

    private String zipCode;

    private String propertyType;
}