package com.infosys.realestate.service;

import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.RiskAssessment;

public interface ReportGenerationService {
    String generateReport(DueDiligenceReport report, RiskAssessment riskAssessment, String publicData);
    byte[] generatePdfReport(com.infosys.realestate.dto.PublicRecordsReportResponse data);
    byte[] generateExcelReport(com.infosys.realestate.dto.PublicRecordsReportResponse data);
}
