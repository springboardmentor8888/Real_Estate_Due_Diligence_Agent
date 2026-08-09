package com.realestate.due_diligence.property.mapper;

import com.realestate.due_diligence.property.Property;
import com.realestate.due_diligence.property.dto.PropertyRequest;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import org.springframework.stereotype.Component;

@Component
public class PropertyMapper {

    public PropertyResponse toResponse(Property property) {

        PropertyResponse response = new PropertyResponse();

        response.setId(property.getId());
        response.setAddress(property.getAddress());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setZipCode(property.getZipCode());
        response.setPropertyType(property.getPropertyType());
        
        // ✅ MAP PRICE & IMAGE URL TO RESPONSE DTO FOR REACT
        response.setPrice(property.getPrice());
        response.setImageUrl(property.getImageUrl());
        
        response.setCreatedAt(property.getCreatedAt());

        return response;
    }

    public Property toEntity(PropertyRequest request) {

        Property property = new Property();

        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());
        property.setPropertyType(request.getPropertyType());
        
        // ✅ MAP PRICE & IMAGE URL TO ENTITY FOR POSTGRESQL
        property.setPrice(request.getPrice());
        property.setImageUrl(request.getImageUrl());

        return property;
    }
}