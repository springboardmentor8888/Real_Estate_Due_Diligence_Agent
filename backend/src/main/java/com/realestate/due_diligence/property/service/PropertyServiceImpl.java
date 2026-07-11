package com.realestate.due_diligence.property.service;

import com.realestate.due_diligence.integration.address.AddressValidationService;
import com.realestate.due_diligence.property.Property;
import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.dto.PropertySearchRequest;
import com.realestate.due_diligence.property.mapper.PropertyMapper;
import com.realestate.due_diligence.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;
    private final AddressValidationService addressValidationService;

    @Override
    public List<PropertyResponse> getAllProperties() {

        return propertyRepository.findAll()
                .stream()
                .map(propertyMapper::toResponse)
                .toList();
    }

    @Override
    public PropertyResponse getPropertyById(Long id) {

        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        return propertyMapper.toResponse(property);
    }

    @Override
    public List<PropertyResponse> searchProperties(PropertySearchRequest request) {

        return propertyRepository.findAll()
                .stream()
                .filter(property -> {

                    boolean city = request.getCity() == null
                            || request.getCity().isBlank()
                            || property.getCity().equalsIgnoreCase(request.getCity());

                    boolean state = request.getState() == null
                            || request.getState().isBlank()
                            || property.getState().equalsIgnoreCase(request.getState());

                    boolean zipCode = request.getZipCode() == null
                            || request.getZipCode().isBlank()
                            || property.getZipCode().equalsIgnoreCase(request.getZipCode());

                    boolean propertyType = request.getPropertyType() == null
                            || request.getPropertyType().isBlank()
                            || property.getPropertyType().equalsIgnoreCase(request.getPropertyType());

                    return city && state && zipCode && propertyType;
                })
                .map(propertyMapper::toResponse)
                .toList();
    }

    @Override
    public AddressValidationResponse validateAddress(AddressValidationRequest request) {

        return addressValidationService.validateAddress(request);
    }
}