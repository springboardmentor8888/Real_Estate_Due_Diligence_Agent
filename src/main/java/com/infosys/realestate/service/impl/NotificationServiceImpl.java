package com.infosys.realestate.service.impl;

import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Override
    public void sendReportNotification(DueDiligenceReport report) {
        // Placeholder for sending email/SMS notifications
        System.out.println("Notification sent for report ID: " + report.getId());
    }
}
