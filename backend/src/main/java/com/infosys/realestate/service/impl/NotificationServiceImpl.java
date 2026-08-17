package com.infosys.realestate.service.impl;

import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.Notification;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.repository.NotificationRepository;
import com.infosys.realestate.repository.UserRepository;
import com.infosys.realestate.service.AuditLogService;
import com.infosys.realestate.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    @Transactional
    public void sendReportNotification(DueDiligenceReport report) {
        if (report.getRequestedBy() == null) return;

        boolean isCompleted = "COMPLETED".equalsIgnoreCase(report.getStatus());
        String type    = isCompleted ? "REPORT_COMPLETED" : "REPORT_FAILED";
        String title   = isCompleted
                ? "Report Ready: Property #" + report.getProperty().getPropertyId()
                : "Report Failed: Property #" + report.getProperty().getPropertyId();
        String message = isCompleted
                ? "Your due diligence report for property at "
                    + report.getProperty().getAddress()
                    + " has been completed successfully."
                : "The due diligence report for property at "
                    + report.getProperty().getAddress()
                    + " could not be generated. Please try again or contact support.";

        Notification n = buildNotification(report.getRequestedBy(), title, message, type, report.getId());
        Notification saved = notificationRepository.save(n);

        auditLogService.log(
                report.getRequestedBy().getEmail(),
                report.getRequestedBy().getRole() != null ? report.getRequestedBy().getRole().getName() : "USER",
                "CREATE_NOTIFICATION",
                "Notification",
                String.valueOf(saved.getId()),
                "Notification created: " + title,
                null,
                "SUCCESS"
        );
    }

    @Override
    @Transactional
    public Notification createNotification(String userEmail, String title, String message,
                                           String type, Long reportId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        Notification n = buildNotification(user, title, message, type, reportId);
        Notification saved = notificationRepository.save(n);

        auditLogService.log(
                userEmail,
                user.getRole() != null ? user.getRole().getName() : "USER",
                "CREATE_NOTIFICATION",
                "Notification",
                String.valueOf(saved.getId()),
                "Notification created: " + title,
                null,
                "SUCCESS"
        );

        return saved;
    }

    @Override
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);

            String userEmail = n.getUser() != null ? n.getUser().getEmail() : "system";
            String userRole = n.getUser() != null && n.getUser().getRole() != null ? n.getUser().getRole().getName() : "USER";
            auditLogService.log(userEmail, userRole, "MARK_NOTIFICATION_READ", "Notification",
                    String.valueOf(notificationId), "Notification #" + notificationId + " marked as read", null, "SUCCESS");
        });
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository
                .findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);

        User user = userRepository.findById(userId).orElse(null);
        String userEmail = user != null ? user.getEmail() : "user_" + userId;
        String userRole = user != null && user.getRole() != null ? user.getRole().getName() : "USER";
        auditLogService.log(userEmail, userRole, "MARK_ALL_NOTIFICATIONS_READ", "User",
                String.valueOf(userId), "All notifications marked as read for user " + userId, null, "SUCCESS");
    }

    // ---- helpers --------------------------------------------------------

    private Notification buildNotification(User user, String title, String message,
                                           String type, Long reportId) {
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setReportId(reportId);
        return n;
    }
}

