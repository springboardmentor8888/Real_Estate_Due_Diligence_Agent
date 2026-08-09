package com.realestate.due_diligence.notification.service;

import com.realestate.due_diligence.notification.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getMyNotifications();

    NotificationResponse markAsRead(Long notificationId);

    void markAllAsRead();

    void deleteNotification(Long notificationId);

    void clearReadNotifications();

    void createReportReadyNotification(
            Long propertyId,
            String propertyAddress
    );

    void createPropertyUpdateNotification(
        Long propertyId,
        String propertyAddress
    );
}