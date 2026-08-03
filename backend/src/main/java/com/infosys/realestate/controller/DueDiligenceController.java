package com.infosys.realestate.controller;

import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.service.PropertyDueDiligenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/due-diligence")
@CrossOrigin(origins = "*")
public class DueDiligenceController {

    @Autowired
    private PropertyDueDiligenceService dueDiligenceService;


    @PostMapping("/{propertyId}/process")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public DueDiligenceReport processDueDiligence(@PathVariable Long propertyId) {
        return dueDiligenceService.processDueDiligence(propertyId);
    }

    @GetMapping("/{propertyId}/export/pdf")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public org.springframework.http.ResponseEntity<byte[]> exportPdf(@PathVariable Long propertyId) {
        byte[] pdfBytes = dueDiligenceService.exportReportPdf(propertyId);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDisposition(org.springframework.http.ContentDisposition.attachment()
            .filename("DueDiligenceReport_" + propertyId + ".pdf").build());
        return new org.springframework.http.ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
    }

    @GetMapping("/{propertyId}/export/excel")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public org.springframework.http.ResponseEntity<byte[]> exportExcel(@PathVariable Long propertyId) {
        byte[] excelBytes = dueDiligenceService.exportReportExcel(propertyId);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDisposition(org.springframework.http.ContentDisposition.attachment()
            .filename("DueDiligenceReport_" + propertyId + ".xlsx").build());
        return new org.springframework.http.ResponseEntity<>(excelBytes, headers, org.springframework.http.HttpStatus.OK);
    }
}
