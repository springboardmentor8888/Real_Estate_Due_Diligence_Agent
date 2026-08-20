package com.realestate.agent.controller;

import com.realestate.agent.entity.Property;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.enums.PropertyStatus;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/seller")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class SellerController {

    private final PropertyRepository propertyRepository;
    private final com.realestate.agent.service.DashboardService dashboardService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('SELLER', 'AGENT')")
    public ResponseEntity<?> getSellerDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        // Fallback endpoint to prevent 404, returns stats via dashboardService
        com.realestate.agent.dto.DashboardStatsResponse stats = dashboardService.getDashboardStats(userDetails.getUsername(), "SELLER");
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/my-properties")
    @PreAuthorize("hasAnyRole('SELLER', 'AGENT')")
    public ResponseEntity<Map<String, Object>> getMyProperties(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        // Find properties created by this user
        List<Property> properties = propertyRepository.findByCreatedByEmail(userDetails.getUsername());
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Property p : properties) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getPropertyId());
            String addrLine = p.getPrimaryAddress() != null ? p.getPrimaryAddress().getAddressLine1() : p.getPropertyName();
            String city = p.getPrimaryAddress() != null && p.getPrimaryAddress().getCity() != null ? p.getPrimaryAddress().getCity() : "";
            String state = p.getPrimaryAddress() != null && p.getPrimaryAddress().getState() != null ? p.getPrimaryAddress().getState() : "";
            map.put("address", addrLine);
            map.put("city", city);
            map.put("state", state);
            map.put("zipCode", p.getPrimaryAddress() != null ? p.getPrimaryAddress().getPostalCode() : "");
            map.put("price", p.getMarketValue());
            map.put("listingStatus", p.getStatus().name());
            map.put("createdAt", p.getCreatedAt());
            map.put("parcelId", p.getPropertyCode());
            map.put("propertyType", p.getPropertyType() != null ? p.getPropertyType().getTypeName() : "Property");
            result.add(map);
        }
        
        return ResponseEntity.ok(Map.of("success", true, "properties", result));
    }

    @DeleteMapping("/delete-property/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'AGENT')")
    public ResponseEntity<Map<String, Object>> deleteProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
            
        Property property = propertyRepository.findById(id).orElseThrow();
        if (!property.getCreatedBy().getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).build();
        }
        
        propertyRepository.delete(property);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PatchMapping("/update-status/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'AGENT')")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
            
        Property property = propertyRepository.findById(id).orElseThrow();
        if (!property.getCreatedBy().getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            PropertyStatus propStatus = PropertyStatus.valueOf(status);
            property.setStatus(propStatus);
            propertyRepository.save(property);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid status"));
        }
    }
}
