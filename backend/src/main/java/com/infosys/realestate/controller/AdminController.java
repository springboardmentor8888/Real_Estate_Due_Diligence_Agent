package com.infosys.realestate.controller;

import com.infosys.realestate.dto.DashboardAnalyticsDTO;
import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    /**
     * GET /api/admin/dashboard
     * Full dashboard snapshot: totals, recent reports, risk distribution, monthly trends.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardAnalyticsDTO> getDashboard() {
        return ResponseEntity.ok(adminAnalyticsService.getDashboard());
    }

    /**
     * GET /api/admin/reports?status=COMPLETED&page=0&size=20
     * Paged report management with optional status filter.
     */
    @GetMapping("/reports")
    public ResponseEntity<Page<ReportHistoryDTO>> getReports(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                adminAnalyticsService.getReports(status, PageRequest.of(page, size)));
    }
}
