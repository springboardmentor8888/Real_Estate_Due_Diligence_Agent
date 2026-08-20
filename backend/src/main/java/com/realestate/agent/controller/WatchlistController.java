package com.realestate.agent.controller;

import com.realestate.agent.entity.Property;
import com.realestate.agent.entity.User;
import com.realestate.agent.entity.Watchlist;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.repository.WatchlistRepository;
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
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/buyer/watchlist")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('BUYER', 'AGENT')")
    public ResponseEntity<Map<String, Object>> getWatchlist(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        List<Watchlist> watchlists = watchlistRepository.findByUserEmail(userDetails.getUsername());
        
        List<Map<String, Object>> watchlistData = new ArrayList<>();
        for (Watchlist w : watchlists) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", w.getProperty().getPropertyId());
            String addrStr = w.getProperty().getPrimaryAddress() != null ? w.getProperty().getPrimaryAddress().getAddressLine1() : w.getProperty().getPropertyName();
            map.put("address", addrStr);
            map.put("price", w.getProperty().getMarketValue());
            map.put("alertsEnabled", w.getAlertsEnabled());
            map.put("addedAt", w.getAddedAt());
            watchlistData.add(map);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("watchlist", watchlistData);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{propertyId}")
    @PreAuthorize("hasAnyRole('BUYER', 'AGENT')")
    public ResponseEntity<Map<String, Object>> getWatchlistStatus(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        boolean isInWatchlist = watchlistRepository.existsByUserEmailAndPropertyId(userDetails.getUsername(), propertyId);
        return ResponseEntity.ok(Map.of("success", true, "isInWatchlist", isInWatchlist));
    }

    @PostMapping("/{propertyId}")
    @PreAuthorize("hasAnyRole('BUYER', 'AGENT')")
    public ResponseEntity<Map<String, Object>> addToWatchlist(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
            
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Property property = propertyRepository.findById(propertyId).orElseThrow();
        
        if (!watchlistRepository.existsByUserEmailAndPropertyId(user.getEmail(), propertyId)) {
            Watchlist watchlist = Watchlist.builder()
                    .user(user)
                    .property(property)
                    .alertsEnabled(true)
                    .build();
            watchlistRepository.save(watchlist);
        }
        
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{propertyId}")
    @PreAuthorize("hasAnyRole('BUYER', 'AGENT')")
    public ResponseEntity<Map<String, Object>> removeFromWatchlist(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
            
        List<Watchlist> watchlists = watchlistRepository.findByUserEmail(userDetails.getUsername());
        for (Watchlist w : watchlists) {
            if (w.getProperty().getPropertyId().equals(propertyId)) {
                watchlistRepository.delete(w);
                break;
            }
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PatchMapping("/{propertyId}/alerts")
    @PreAuthorize("hasAnyRole('BUYER', 'AGENT')")
    public ResponseEntity<Map<String, Object>> toggleAlerts(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
            
        List<Watchlist> watchlists = watchlistRepository.findByUserEmail(userDetails.getUsername());
        for (Watchlist w : watchlists) {
            if (w.getProperty().getPropertyId().equals(propertyId)) {
                w.setAlertsEnabled(!w.getAlertsEnabled());
                watchlistRepository.save(w);
                return ResponseEntity.ok(Map.of("success", true, "alertsEnabled", w.getAlertsEnabled()));
            }
        }
        return ResponseEntity.notFound().build();
    }
}
