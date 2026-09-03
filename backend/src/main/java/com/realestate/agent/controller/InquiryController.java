package com.realestate.agent.controller;

import com.realestate.agent.entity.Inquiry;
import com.realestate.agent.entity.Property;
import com.realestate.agent.repository.InquiryRepository;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.security.CustomUserDetails;
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

@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
@RestController
@RequestMapping("/api/agent/inquiries")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('AGENT', 'SELLER')")
    public ResponseEntity<List<Map<String, Object>>> getMyInquiries(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        List<Inquiry> inquiries = inquiryRepository.findByPropertyCreatedByEmail(userDetails.getUsername());
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Inquiry inq : inquiries) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", inq.getInquiryId());
            map.put("senderName", inq.getSenderName());
            map.put("senderEmail", inq.getSenderEmail());
            map.put("senderPhone", inq.getSenderPhone());
            map.put("message", inq.getMessage());
            map.put("response", inq.getResponse());
            map.put("respondedAt", inq.getRespondedAt());
            map.put("status", inq.getStatus());
            map.put("createdAt", inq.getCreatedAt());
            Map<String, Object> propMap = new HashMap<>();
            propMap.put("id", inq.getProperty().getPropertyId());
            String addrStr = inq.getProperty().getPrimaryAddress() != null ? inq.getProperty().getPrimaryAddress().getAddressLine1() : inq.getProperty().getPropertyName();
            propMap.put("address", addrStr);
            
            map.put("property", propMap);
            result.add(map);
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{propertyId}")
        @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Map<String, Object>> createInquiry(
            @PathVariable Long propertyId,
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
            
        Property property = propertyRepository.findById(propertyId).orElseThrow();
        
        Inquiry inquiry = Inquiry.builder()
                .property(property)
                .senderName(payload.getOrDefault("name", userDetails.getUsername()).toString())
                .senderEmail(userDetails.getUsername())
                .senderPhone(payload.getOrDefault("phone", "").toString())
                .message(payload.getOrDefault("message", "").toString())
                .status("NEW")
                .build();
                
        inquiryRepository.save(inquiry);
        
        return ResponseEntity.ok(Map.of("success", true, "inquiryId", inquiry.getInquiryId()));
    }

    @PostMapping("/{id}/respond")
    @PreAuthorize("hasAnyRole('AGENT', 'SELLER')")
    public ResponseEntity<Map<String, Object>> respondToInquiry(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Inquiry inquiry = inquiryRepository.findById(id).orElseThrow();
        if (!inquiry.getProperty().getCreatedBy().getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).build();
        }

        String response = payload.get("response");
        if (response == null || response.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Response text is required"));
        }

        inquiry.setResponse(response.trim());
        inquiry.setRespondedAt(java.time.LocalDateTime.now());
        inquiry.setStatus("RESPONDED");
        inquiryRepository.save(inquiry);
        return ResponseEntity.ok(Map.of("success", true, "status", inquiry.getStatus()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('AGENT', 'SELLER')")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
            
        Inquiry inquiry = inquiryRepository.findById(id).orElseThrow();
        // Check ownership
        if (!inquiry.getProperty().getCreatedBy().getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).build();
        }
        
        inquiry.setStatus(status);
        inquiryRepository.save(inquiry);
        
        return ResponseEntity.ok(Map.of("success", true));
    }
}
