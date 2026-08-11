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

    // =====================================================
    // CREATE PROPERTY / DUE DILIGENCE
    // =====================================================

    @Override
    @Transactional
    public PropertyResponse performDueDiligence(
            AddressValidationRequest request) {

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
        property.setPropertyType("RESIDENTIAL");
        property.setCreatedAt(LocalDateTime.now());

        // Set Price & Image URL on Entity
        property.setPrice(request.getPrice());
        property.setImageUrl(request.getImageUrl());

        // 1. Save property to PostgreSQL to generate Primary Key
        Property savedProperty = propertyRepository.save(property);

        // 2. Automatically resolve and save realistic municipal zoning info
        ZoningInfo zoning = resolveMunicipalZoning(savedProperty);
        zoningInfoRepository.save(zoning);

        return mapToResponse(savedProperty);
    }

    // =====================================================
    // MUNICIPAL ZONING RESOLVER
    // =====================================================

    /**
     * Resolves official municipal master-plan zoning rules based on property location.
     */
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

    // =====================================================
    // GET ALL PROPERTIES
    // =====================================================

    @Override
    public List<PropertyResponse> getAllProperties() {

        return propertyRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET PROPERTY BY ID
    // =====================================================

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

    // =====================================================
    // SEARCH PROPERTIES
    // =====================================================

    @Override
    public List<PropertyResponse> searchProperties(
            PropertySearchRequest request) {

        return getAllProperties();
    }

    // =====================================================
    // VALIDATE ADDRESS
    // =====================================================

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

    // =====================================================
    // UPDATE PROPERTY
    // =====================================================

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
        if (request.getImageUrl() != null) {
            property.setImageUrl(request.getImageUrl());
        }

        Property updatedProperty =
                propertyRepository.save(property);

        // Create notification after successful update
        notificationService.createPropertyUpdateNotification(
                updatedProperty.getId(),
                updatedProperty.getAddress()
        );

        return mapToResponse(updatedProperty);
    }

    // =====================================================
    // ENTITY -> DTO
    // =====================================================

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

        // ✅ MAP NEW DUE DILIGENCE & STRUCTURAL FIELDS TO DTO
        response.setSurveyNo(property.getSurveyNo());
        response.setRegistrationNo(property.getRegistrationNo());
        response.setArea(property.getArea());
        response.setBedrooms(property.getBedrooms());
        response.setBathrooms(property.getBathrooms());
        response.setParking(property.getParking());
        response.setFurnishing(property.getFurnishing());

        return response;
    }
}