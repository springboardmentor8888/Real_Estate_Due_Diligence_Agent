package com.infosys.realestate.service;

import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.Notification;

import java.util.List;

public interface NotificationService {

    /** Called on report completion or failure to persist a notification for the requesting user. */
    void sendReportNotification(DueDiligenceReport report);

    /** Creates a typed notification for a specific user email. */
    Notification createNotification(String userEmail, String title, String message, String type, Long reportId);

    /** Returns all notifications for the given user, newest first. */
    List<Notification> getNotificationsForUser(Long userId);

    /** Returns only unread notifications for the given user. */
    List<Notification> getUnreadNotifications(Long userId);

    /** Badge count of unread notifications. */
    long getUnreadCount(Long userId);

    /** Marks a single notification as read. */
    void markAsRead(Long notificationId);

    /** Marks ALL notifications for a user as read. */
    void markAllAsRead(Long userId);
}
