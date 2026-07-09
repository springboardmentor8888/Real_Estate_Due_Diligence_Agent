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

    private LocalDateTime createdAt;
}