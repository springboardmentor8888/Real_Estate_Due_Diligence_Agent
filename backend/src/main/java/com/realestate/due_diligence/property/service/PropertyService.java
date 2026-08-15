package com.realestate.due_diligence.property.service;

import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.dto.PropertySearchRequest;

import java.util.List;

public interface PropertyService {

    PropertyResponse performDueDiligence(
            AddressValidationRequest request
    );

    List<PropertyResponse> getAllProperties();

    PropertyResponse getPropertyById(Long id);

    List<PropertyResponse> searchProperties(
            PropertySearchRequest request
    );

    AddressValidationResponse validateAddress(
            AddressValidationRequest request
    );

    PropertyResponse updateProperty(
            Long id,
            AddressValidationRequest request
    );

    void deleteProperty(Long id);
}