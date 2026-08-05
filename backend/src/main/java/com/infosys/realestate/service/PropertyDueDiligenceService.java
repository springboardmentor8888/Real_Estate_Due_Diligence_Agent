package com.infosys.realestate.service;

import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.entity.DueDiligenceReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PropertyDueDiligenceService {

    DueDiligenceReport processDueDiligence(Long propertyId);

    byte[] exportReportPdf(Long propertyId);

    byte[] exportReportExcel(Long propertyId);

    /** All reports, newest first (ADMIN). */
    Page<ReportHistoryDTO> getAllReportHistory(Pageable pageable);

    /** Reports created by the requesting user. */
    Page<ReportHistoryDTO> getMyReportHistory(String userEmail, Pageable pageable);

    /** Single report detail by report ID. */
    ReportHistoryDTO getReportById(Long reportId);
}
