package com.realestate.agent.controller;

import com.realestate.agent.dto.DashboardStatsResponse;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
@RestController
@RequestMapping("/api/dashboard")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard Controller", description = "Real database-driven statistics and recent activities for all 5 roles")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping(value = {"", "/", "/stats", "/summary"})
    @Operation(summary = "Get real-time dashboard statistics and summary",
               description = "Returns live metrics calculated directly from PostgreSQL tables based on user role and data ownership")
    public ResponseEntity<DashboardStatsResponse> getStats(
            @RequestParam(value = "role", required = false) String requestedRole,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userEmail, requestedRole);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/property-status")
    @Operation(summary = "Get property status summary counts from PostgreSQL")
    public ResponseEntity<?> getPropertyStatusSummary(
            @RequestParam(value = "role", required = false) String requestedRole,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userEmail, requestedRole);
        Object statusBreakdown = stats.getAnalytics() != null ? stats.getAnalytics().get("statusBreakdown") : Map.of();
        return ResponseEntity.ok(statusBreakdown);
    }

    @GetMapping("/risk-summary")
    @Operation(summary = "Get risk assessments breakdown and scores from PostgreSQL")
    public ResponseEntity<?> getRiskSummary(
            @RequestParam(value = "role", required = false) String requestedRole,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userEmail, requestedRole);
        return ResponseEntity.ok(stats.getRiskOverview() != null ? stats.getRiskOverview() : Map.of());
    }

    @GetMapping("/recent-properties")
    @Operation(summary = "Get recent properties from PostgreSQL")
    public ResponseEntity<List<Map<String, Object>>> getRecentProperties(
            @RequestParam(value = "role", required = false) String requestedRole,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userEmail, requestedRole);
        return ResponseEntity.ok(stats.getProperties() != null ? stats.getProperties() : List.of());
    }

    @GetMapping("/recent-reports")
    @Operation(summary = "Get recent due diligence reports from PostgreSQL")
    public ResponseEntity<List<Map<String, Object>>> getRecentReports(
            @RequestParam(value = "role", required = false) String requestedRole,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userEmail, requestedRole);
        return ResponseEntity.ok(stats.getReports() != null ? stats.getReports() : List.of());
    }
}

