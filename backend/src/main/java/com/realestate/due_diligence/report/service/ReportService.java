package com.realestate.due_diligence.report.service;

import com.realestate.due_diligence.report.dto.ReportResponse;

public interface ReportService {

    ReportResponse generateReport(Long propertyId);

}