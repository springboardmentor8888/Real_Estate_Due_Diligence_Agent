package com.realestate.due_diligence.property.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.dto.PropertySearchRequest;
import com.realestate.due_diligence.property.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;


    @GetMapping
    public List<PropertyResponse> getAllProperties() {
        return propertyService.getAllProperties();
    }


    @GetMapping("/{id}")
    public PropertyResponse getPropertyById(
            @PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PropertyResponse createProperty(
            @Valid @RequestBody AddressValidationRequest request) {

        return propertyService.performDueDiligence(request);
    }


    @PostMapping("/search")
    public List<PropertyResponse> searchProperties(
            @RequestBody PropertySearchRequest request) {
        return propertyService.searchProperties(request);
    }


    @PostMapping("/validate-address")
    public AddressValidationResponse validateAddress(
            @Valid @RequestBody AddressValidationRequest request) {
        return propertyService.validateAddress(request);
    }


    @PostMapping("/due-diligence")
    @ResponseStatus(HttpStatus.CREATED)
    public PropertyResponse performDueDiligence(
            @Valid @RequestBody AddressValidationRequest request) {

        return propertyService.performDueDiligence(request);
    }


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