package com.realestate.due_diligence.comparableproperty.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestate.due_diligence.comparableproperty.dto.ComparablePropertyResponse;
import com.realestate.due_diligence.comparableproperty.service.ComparablePropertyService;
import com.realestate.due_diligence.property.Property;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.service.PropertyService;
import com.realestate.due_diligence.repository.PropertyRepository;

@Service
public class ComparablePropertyServiceImpl implements ComparablePropertyService {

    private final PropertyService propertyService;
    private final PropertyRepository propertyRepository;

    public ComparablePropertyServiceImpl(
            PropertyService propertyService,
            PropertyRepository propertyRepository) {

        this.propertyService = propertyService;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public List<ComparablePropertyResponse> getComparableProperties(Long propertyId) {

        PropertyResponse property =
                propertyService.getPropertyById(propertyId);

        List<Property> comparableProperties =
                propertyRepository.findByCityAndPropertyType(
                        property.getCity(),
                        property.getPropertyType());

        List<ComparablePropertyResponse> response = new ArrayList<>();

        for (Property comparable : comparableProperties) {

            if (comparable.getId().equals(propertyId)) {
                continue;
            }

            ComparablePropertyResponse dto =
                    new ComparablePropertyResponse();

            dto.setPropertyId(comparable.getId());
            dto.setAddress(comparable.getAddress());
            dto.setCity(comparable.getCity());
            dto.setState(comparable.getState());
            dto.setZipCode(comparable.getZipCode());
            dto.setPropertyType(comparable.getPropertyType());

            response.add(dto);
        }

        return response;
    }
}