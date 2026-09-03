package com.realestate.agent.service;

public interface ExcelReportService {
    byte[] generateDueDiligenceExcel(Long propertyId, Long reportId);
}
