package com.realestate.agent.controller;

import com.realestate.agent.dto.PropertyCreateRequest;
import com.realestate.agent.dto.PropertyResponse;
import com.realestate.agent.dto.PropertySearchCriteria;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.service.PropertyService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/properties")
@SecurityRequirement(name = "bearerAuth")
@Validated
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // -------------------------------------------------------------
    // EMERGENCY MOCK DATA FOR YOUR PRESENTATION (No missing file errors!)
    // -------------------------------------------------------------
    @GetMapping("/test-data")
    public ResponseEntity<List<Map<String, Object>>> getMockData() {
        List<Map<String, Object>> mockData = new ArrayList<>();

        // Creating 3 dummy properties using standard Java Maps (No DTO class needed!)
        for (int i = 1; i <= 3; i++) {
            Map<String, Object> mock = new HashMap<>();
            mock.put("id", (long) i);
            mock.put("address", "456 Oak Ave, SF, CA " + i);
            mock.put("price", 800000 + (i * 10000));
            mock.put("sqft", 1800 + (i * 100));
            mock.put("score", 85 + i);
            mockData.add(mock);
        }

        return ResponseEntity.ok(mockData);
    }

    // -------------------------------------------------------------
    // REAL BACKEND METHODS (Kept intact)
    // -------------------------------------------------------------
    @PostMapping
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestBody PropertyCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        PropertyResponse response = propertyService.createProperty(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PropertyResponse>> searchProperties(
            PropertySearchCriteria criteria
    ) {
        Page<PropertyResponse> response = propertyService.searchProperties(criteria);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = {"", "/", "/all"})
    public ResponseEntity<Page<PropertyResponse>> getAllProperties(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        PropertySearchCriteria criteria = PropertySearchCriteria.builder()
                .page(page)
                .size(size)
                .build();
        Page<PropertyResponse> response = propertyService.searchProperties(criteria);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(
            @PathVariable("id") Long id
    ) {
        PropertyResponse response = propertyService.getPropertyById(id);
        return ResponseEntity.ok(response);
    }
}