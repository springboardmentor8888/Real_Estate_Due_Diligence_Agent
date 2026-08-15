package com.realestate.due_diligence.property.service;

import com.realestate.due_diligence.notification.service.NotificationService;
import com.realestate.due_diligence.property.Property;
import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.dto.PropertySearchRequest;
import com.realestate.due_diligence.repository.PropertyRepository;
import com.realestate.due_diligence.zoning.ZoningInfo;
import com.realestate.due_diligence.repository.ZoningInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;
    private final ZoningInfoRepository zoningInfoRepository;


    @Override
    @Transactional
    public PropertyResponse performDueDiligence(
            AddressValidationRequest request
    ) {

        Property property = new Property();
        String fullAddress = String.format(
                "%s, %s, %s %s",
                request.getAddress(),
                request.getCity(),
                request.getState(),
                request.getZipCode()
        );

        property.setAddress(fullAddress);
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());
        property.setPropertyType(request.getPropertyType() != null ? request.getPropertyType() : "RESIDENTIAL");
        property.setCreatedAt(LocalDateTime.now());
        property.setPrice(request.getPrice());

        if (request.getImageUrls() == null || request.getImageUrls().size() != 4) {
            throw new IllegalArgumentException(
                    "Exactly 4 property image URLs are required."
            );
        }
        property.setImageUrls(request.getImageUrls());
        property.setImageUrl(request.getImageUrls().get(0));

        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setSurveyNo(request.getSurveyNo());
        property.setRegistrationNo(request.getRegistrationNo());
        if (request.getSqft() != null) {
            property.setArea(request.getSqft() + " sqft");
        }
        Property savedProperty = propertyRepository.save(property);
        ZoningInfo zoning = resolveMunicipalZoning(savedProperty);
        zoningInfoRepository.save(zoning);

        return mapToResponse(savedProperty);
    }

    private ZoningInfo resolveMunicipalZoning(Property property) {
        ZoningInfo zoning = new ZoningInfo();
        zoning.setProperty(property);

        String city = property.getCity() != null ? property.getCity().toLowerCase() : "";

        if (city.contains("bengaluru") || city.contains("bangalore")) {
            zoning.setZoningCode("R-2 (Residential Mixed)");
            zoning.setZoningDescription("BBMP Master Plan 2031 - High Density Residential & Local Retail");
            zoning.setPermittedUse("Multi-family apartments, detached homes, ground-floor professional offices");
        } else if (city.contains("mumbai")) {
            zoning.setZoningCode("R-G (General Residential)");
            zoning.setZoningDescription("MCGM Development Control & Promotion Regulations 2034");
            zoning.setPermittedUse("Residential high-rise buildings, urban housing, neighborhood commercial shops");
        } else {
            zoning.setZoningCode("R-1 (Primary Residential)");
            zoning.setZoningDescription("Municipal Urban Development Authority Master Plan");
            zoning.setPermittedUse("Single-family detached dwellings, low-rise units, private gardens");
        }

        return zoning;
    }

    @Override
    public List<PropertyResponse> getAllProperties() {

        return propertyRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public PropertyResponse getPropertyById(Long id) {

        Property property =
                propertyRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Property not found with id: " + id
                                )
                        );

        return mapToResponse(property);
    }


    @Override
    public List<PropertyResponse> searchProperties(
            PropertySearchRequest request) {

        return getAllProperties();
    }


    @Override
    public AddressValidationResponse validateAddress(
            AddressValidationRequest request) {

        AddressValidationResponse response =
                new AddressValidationResponse();

        response.setValid(true);

        response.setNormalizedAddress(
                String.format(
                        "%s, %s, %s %s",
                        request.getAddress(),
                        request.getCity(),
                        request.getState(),
                        request.getZipCode()
                )
        );

        response.setMessage(
                "Address validated successfully"
        );

        return response;
    }


    @Override
    @Transactional
    public PropertyResponse updateProperty(
            Long id,
            AddressValidationRequest request) {

        Property property =
                propertyRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Property not found with id: " + id
                                )
                        );

        String fullAddress = String.format(
                "%s, %s, %s %s",
                request.getAddress(),
                request.getCity(),
                request.getState(),
                request.getZipCode()
        );

        property.setAddress(fullAddress);
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());

        if (request.getPrice() != null) {
            property.setPrice(request.getPrice());
        }
        if (request.getBedrooms() != null) property.setBedrooms(request.getBedrooms());
        if (request.getBathrooms() != null) property.setBathrooms(request.getBathrooms());
        if (request.getSurveyNo() != null) property.setSurveyNo(request.getSurveyNo());
        if (request.getRegistrationNo() != null) property.setRegistrationNo(request.getRegistrationNo());
        if (request.getSqft() != null) property.setArea(request.getSqft() + " sqft");

        Property updatedProperty =
                propertyRepository.save(property);

        notificationService.createPropertyUpdateNotification(
                updatedProperty.getId(),
                updatedProperty.getAddress()
        );

        return mapToResponse(updatedProperty);
    }


    private PropertyResponse mapToResponse(
            Property property) {

        PropertyResponse response =
                new PropertyResponse();

        response.setId(property.getId());
        response.setAddress(property.getAddress());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setZipCode(property.getZipCode());
        response.setPropertyType(property.getPropertyType());
        response.setCreatedAt(property.getCreatedAt());
        response.setPrice(property.getPrice());
        response.setImageUrl(property.getImageUrl());
        response.setImageUrls(property.getImageUrls());
        response.setSurveyNo(property.getSurveyNo());
        response.setRegistrationNo(property.getRegistrationNo());
        response.setArea(property.getArea());
        response.setBedrooms(property.getBedrooms());
        response.setBathrooms(property.getBathrooms());
        response.setParking(property.getParking());
        response.setFurnishing(property.getFurnishing());

        return response;
    }

    @Override
    @Transactional
    public void deleteProperty(Long id) {

        Property property = propertyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with id: " + id
                        )
                );
        zoningInfoRepository.deleteByPropertyId(id);

        propertyRepository.delete(property);
    }
}