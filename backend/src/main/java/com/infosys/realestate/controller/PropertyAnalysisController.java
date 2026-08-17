package com.infosys.realestate.controller;

import com.infosys.realestate.dto.ComparablePropertyDTO;
import com.infosys.realestate.dto.PropertyAnalysisSummaryDTO;
import com.infosys.realestate.dto.RiskAssessmentDTO;
import com.infosys.realestate.dto.ValuationDTO;
import com.infosys.realestate.service.ComparablePropertyService;
import com.infosys.realestate.service.PropertyAnalysisService;
import com.infosys.realestate.service.RiskAssessmentService;
import com.infosys.realestate.service.ValuationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
@PreAuthorize("isAuthenticated()")
public class PropertyAnalysisController {

    @Autowired
    private PropertyAnalysisService propertyAnalysisService;

    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @Autowired
    private ComparablePropertyService comparablePropertyService;

    @Autowired
    private ValuationService valuationService;

    @GetMapping("/properties/{propertyId}/summary")
    public ResponseEntity<PropertyAnalysisSummaryDTO> getPropertyAnalysisSummary(@PathVariable Long propertyId) {
        PropertyAnalysisSummaryDTO summary = propertyAnalysisService.getPropertyAnalysisSummary(propertyId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/properties/{propertyId}/summary/run")
    public ResponseEntity<PropertyAnalysisSummaryDTO> runFullPropertyAnalysis(@PathVariable Long propertyId) {
        PropertyAnalysisSummaryDTO summary = propertyAnalysisService.runFullPropertyAnalysis(propertyId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/properties/{propertyId}/risk")
    public ResponseEntity<RiskAssessmentDTO> getLatestRiskAssessment(@PathVariable Long propertyId) {
        RiskAssessmentDTO risk = riskAssessmentService.getLatestRiskAssessment(propertyId);
        return ResponseEntity.ok(risk);
    }

    @GetMapping("/properties/{propertyId}/risk/history")
    public ResponseEntity<List<RiskAssessmentDTO>> getRiskAssessmentHistory(@PathVariable Long propertyId) {
        List<RiskAssessmentDTO> history = riskAssessmentService.getRiskAssessmentHistory(propertyId);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/properties/{propertyId}/risk")
    public ResponseEntity<RiskAssessmentDTO> performRiskAssessment(@PathVariable Long propertyId) {
        RiskAssessmentDTO risk = riskAssessmentService.performComprehensiveRiskAssessment(propertyId);
        return ResponseEntity.ok(risk);
    }

    @GetMapping("/properties/{propertyId}/comps")
    public ResponseEntity<List<ComparablePropertyDTO>> getComparableProperties(@PathVariable Long propertyId) {
        List<ComparablePropertyDTO> comps = comparablePropertyService.getComparableProperties(propertyId);
        return ResponseEntity.ok(comps);
    }

    @PostMapping("/properties/{propertyId}/comps")
    public ResponseEntity<List<ComparablePropertyDTO>> generateComparableProperties(@PathVariable Long propertyId) {
        List<ComparablePropertyDTO> comps = comparablePropertyService.generateComparableProperties(propertyId);
        return ResponseEntity.ok(comps);
    }

    @GetMapping("/properties/{propertyId}/valuation")
    public ResponseEntity<ValuationDTO> getLatestValuation(@PathVariable Long propertyId) {
        ValuationDTO valuation = valuationService.getLatestValuation(propertyId);
        return ResponseEntity.ok(valuation);
    }

    @GetMapping("/properties/{propertyId}/valuation/history")
    public ResponseEntity<List<ValuationDTO>> getValuationHistory(@PathVariable Long propertyId) {
        List<ValuationDTO> history = valuationService.getValuationHistory(propertyId);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/properties/{propertyId}/valuation")
    public ResponseEntity<ValuationDTO> calculateValuation(@PathVariable Long propertyId) {
        ValuationDTO valuation = valuationService.calculatePropertyValuation(propertyId);
        return ResponseEntity.ok(valuation);
    }
}
