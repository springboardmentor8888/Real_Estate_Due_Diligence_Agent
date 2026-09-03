package com.realestate.agent.service;

public interface PdfReportService {
    byte[] generateDueDiligencePdf(Long propertyId, Long reportId);
}
