package com.infosys.realestate.service;

import com.infosys.realestate.dto.DashboardAnalyticsDTO;
import com.infosys.realestate.dto.ReportHistoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminAnalyticsService {

    /** Full dashboard snapshot for the admin home screen. */
    DashboardAnalyticsDTO getDashboard();

    /** Paged report list with optional status filter. */
    Page<ReportHistoryDTO> getReports(String status, Pageable pageable);
}
