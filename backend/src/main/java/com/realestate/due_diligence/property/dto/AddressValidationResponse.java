package com.realestate.due_diligence.property.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressValidationResponse {

    private boolean valid;

    private String normalizedAddress;

    private String message;
}