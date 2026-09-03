package com.realestate.agent.controller;

import com.realestate.agent.entity.Offer;
import com.realestate.agent.entity.Property;
import com.realestate.agent.entity.User;
import com.realestate.agent.repository.OfferRepository;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.repository.UserRepository;
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
@RequestMapping("/api/buyer/offers")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class OfferController {

    private final OfferRepository offerRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    @GetMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<List<Map<String, Object>>> getOffers(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        List<Offer> offers = offerRepository.findByBuyerEmail(userDetails.getUsername());
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Offer o : offers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", o.getOfferId());
            map.put("amount", o.getAmount());
            map.put("status", o.getStatus());
            map.put("createdAt", o.getCreatedAt());
            
            Map<String, Object> propMap = new HashMap<>();
            propMap.put("id", o.getProperty().getPropertyId());
            String addrStr = o.getProperty().getPrimaryAddress() != null ? o.getProperty().getPrimaryAddress().getAddressLine1() : o.getProperty().getPropertyName();
            propMap.put("address", addrStr);
            propMap.put("price", o.getProperty().getMarketValue());
            
            map.put("property", propMap);
            result.add(map);
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = {"/{propertyId}", "/{propertyId}/offer"})
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Map<String, Object>> createOffer(
            @PathVariable Long propertyId,
            @RequestBody(required = false) Map<String, Object> payload,
            @RequestParam(value = "amount", required = false) Double queryAmount,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
            
        User buyer = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Property property = propertyRepository.findById(propertyId).orElseThrow();
        
        Double amount = queryAmount;
        if (amount == null && payload != null && payload.get("amount") != null) {
            amount = Double.valueOf(payload.get("amount").toString());
        }
        if (amount == null) {
            amount = property.getMarketValue() != null ? property.getMarketValue().doubleValue() : 0.0;
        }
        
        Offer offer = Offer.builder()
                .buyer(buyer)
                .property(property)
                .amount(amount)
                .status("PENDING")
                .build();
                
        offerRepository.save(offer);
        
        return ResponseEntity.ok(Map.of("success", true, "offerId", offer.getOfferId()));
    }
}
