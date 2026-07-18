package com.infosys.realestate.service;

import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.RiskAssessment;

public interface ReportGenerationService {
    String generateReport(DueDiligenceReport report, RiskAssessment riskAssessment, String publicData);
}
