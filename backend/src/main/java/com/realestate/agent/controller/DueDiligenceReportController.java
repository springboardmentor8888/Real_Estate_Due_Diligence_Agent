package com.realestate.agent.controller;

import com.realestate.agent.dto.DueDiligenceReportRequest;
import com.realestate.agent.dto.DueDiligenceReportResponse;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Report Controller", description = "CRUD APIs for Managing Due Diligence Reports")
public class DueDiligenceReportController {

    private final ReportService reportService;

    public DueDiligenceReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
        @PreAuthorize("hasAnyRole('LEGAL_REVIEWER', 'AGENT')")
    @Operation(summary = "Generate a due diligence report", description = "Generates a new property due diligence report.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Report created successfully",
                    content = @Content(schema = @Schema(implementation = DueDiligenceReportResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "404", description = "Property or User not found")
    })
    public ResponseEntity<DueDiligenceReportResponse> generateReport(
            @Valid @RequestBody DueDiligenceReportRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        DueDiligenceReportResponse response = reportService.generateReport(request, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all reports", description = "Retrieves all due diligence reports in the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reports retrieved successfully")
    })
    public ResponseEntity<List<DueDiligenceReportResponse>> getAllReports() {
        List<DueDiligenceReportResponse> response = reportService.getAllReports();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get report by ID", description = "Retrieves details of a specific report by ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report details retrieved",
                    content = @Content(schema = @Schema(implementation = DueDiligenceReportResponse.class))),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<DueDiligenceReportResponse> getReportById(@PathVariable("id") Long id) {
        DueDiligenceReportResponse response = reportService.getReportById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/property/{propertyId}")
    @Operation(summary = "Get reports for a property", description = "Lists all reports associated with a specific property ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reports list retrieved"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    public ResponseEntity<List<DueDiligenceReportResponse>> getReportsByProperty(@PathVariable("propertyId") Long propertyId) {
        List<DueDiligenceReportResponse> response = reportService.getReportsByProperty(propertyId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('LEGAL_REVIEWER', 'AGENT')")
    @Operation(summary = "Update report details", description = "Updates details of an existing report.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report updated successfully",
                    content = @Content(schema = @Schema(implementation = DueDiligenceReportResponse.class))),
            @ApiResponse(responseCode = "404", description = "Report or Property not found")
    })
    public ResponseEntity<DueDiligenceReportResponse> updateReport(
            @PathVariable("id") Long id,
            @Valid @RequestBody DueDiligenceReportRequest request
    ) {
        DueDiligenceReportResponse response = reportService.updateReport(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
        @PreAuthorize("hasAnyRole('LEGAL_REVIEWER', 'AGENT')")
    @Operation(summary = "Delete report", description = "Deletes a report by ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Report deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<Void> deleteReport(@PathVariable("id") Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
