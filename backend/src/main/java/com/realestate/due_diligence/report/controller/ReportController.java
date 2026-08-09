package com.realestate.due_diligence.report.controller;

import com.realestate.due_diligence.report.dto.ReportResponse;
import com.realestate.due_diligence.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/{propertyId}")
    public ReportResponse generateReport(
            @PathVariable Long propertyId) {

        return reportService.generateReport(propertyId);
    }
}