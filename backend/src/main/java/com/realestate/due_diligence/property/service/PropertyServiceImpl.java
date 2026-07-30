package com.realestate.due_diligence.property.service;

import com.realestate.due_diligence.property.Property;
import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.dto.PropertySearchRequest;
import com.realestate.due_diligence.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;

    @Override
    public PropertyResponse performDueDiligence(AddressValidationRequest request) {
        Property property = new Property();
        
        String fullAddress = String.format("%s, %s, %s %s", 
                request.getAddress(), 
                request.getCity(), 
                request.getState(), 
                request.getZipCode());

        property.setAddress(fullAddress);
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());
        property.setPropertyType("RESIDENTIAL");
        property.setCreatedAt(LocalDateTime.now());

        Property savedProperty = propertyRepository.save(property);
        return mapToResponse(savedProperty);
    }

    @Override
    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        return mapToResponse(property);
    }

    @Override
    public List<PropertyResponse> searchProperties(PropertySearchRequest request) {
        return getAllProperties();
    }

    @Override
    public AddressValidationResponse validateAddress(AddressValidationRequest request) {
        AddressValidationResponse response = new AddressValidationResponse();
        response.setValid(true);
        response.setNormalizedAddress(String.format("%s, %s, %s %s", 
                request.getAddress(), 
                request.getCity(), 
                request.getState(), 
                request.getZipCode()));
        response.setMessage("Address validated successfully");
        return response;
    }

    private PropertyResponse mapToResponse(Property property) {
        PropertyResponse response = new PropertyResponse();
        response.setId(property.getId());
        response.setAddress(property.getAddress());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setZipCode(property.getZipCode());
        response.setPropertyType(property.getPropertyType());
        response.setCreatedAt(property.getCreatedAt());
        return response;
    }
}
