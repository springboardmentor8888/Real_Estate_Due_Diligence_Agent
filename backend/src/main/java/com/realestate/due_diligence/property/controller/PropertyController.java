package com.realestate.due_diligence.property.controller;

import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.dto.PropertySearchRequest;
import com.realestate.due_diligence.property.service.PropertyService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    // =====================================================
    // GET ALL PROPERTIES
    // =====================================================

    @GetMapping
    public List<PropertyResponse> getAllProperties() {

        return propertyService.getAllProperties();
    }

    // =====================================================
    // GET PROPERTY BY ID
    // =====================================================

    @GetMapping("/{id}")
    public PropertyResponse getPropertyById(
            @PathVariable Long id) {

        return propertyService.getPropertyById(id);
    }

    // =====================================================
    // SEARCH PROPERTIES
    // =====================================================

    @PostMapping("/search")
    public List<PropertyResponse> searchProperties(
            @RequestBody PropertySearchRequest request) {

        return propertyService.searchProperties(request);
    }

    // =====================================================
    // VALIDATE ADDRESS
    // =====================================================

    @PostMapping("/validate-address")
    public AddressValidationResponse validateAddress(
            @Valid @RequestBody AddressValidationRequest request) {

        return propertyService.validateAddress(request);
    }

    // =====================================================
    // CREATE / DUE DILIGENCE
    // =====================================================

    @PostMapping("/due-diligence")
    public PropertyResponse performDueDiligence(
            @Valid @RequestBody AddressValidationRequest request) {

        return propertyService.performDueDiligence(request);
    }

    // =====================================================
    // UPDATE PROPERTY
    // =====================================================

    @PutMapping("/{id}")
    public PropertyResponse updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody AddressValidationRequest request) {

        return propertyService.updateProperty(
                id,
                request
        );
    }
}