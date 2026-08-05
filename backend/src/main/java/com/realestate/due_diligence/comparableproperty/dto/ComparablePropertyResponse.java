package com.realestate.due_diligence.comparableproperty.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComparablePropertyResponse {

    private Long propertyId;

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String propertyType;
}