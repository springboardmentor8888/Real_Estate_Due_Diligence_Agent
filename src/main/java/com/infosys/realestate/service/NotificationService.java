package com.infosys.realestate.service;

import com.infosys.realestate.entity.DueDiligenceReport;

public interface NotificationService {
    void sendReportNotification(DueDiligenceReport report);
}
