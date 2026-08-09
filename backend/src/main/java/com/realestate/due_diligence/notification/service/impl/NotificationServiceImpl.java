package com.realestate.due_diligence.notification.service.impl;

import com.realestate.due_diligence.notification.Notification;
import com.realestate.due_diligence.notification.dto.NotificationResponse;
import com.realestate.due_diligence.notification.service.NotificationService;
import com.realestate.due_diligence.repository.NotificationRepository;
import com.realestate.due_diligence.repository.UserRepository;
import com.realestate.due_diligence.user.User;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // =====================================================
    // GET CURRENT USER
    // =====================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        ));
    }

    // =====================================================
    // GET NOTIFICATIONS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications() {

        User user = getCurrentUser();

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =====================================================
    // MARK ONE AS READ
    // =====================================================

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {

        User user = getCurrentUser();

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                ));

        if (notification.getUser() == null ||
                notification.getUser().getId() == null ||
                !notification.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to modify this notification"
            );
        }

        notification.setRead(true);

        Notification saved =
                notificationRepository.save(notification);

        return mapToResponse(saved);
    }

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    @Override
    @Transactional
    public void markAllAsRead() {

        User user = getCurrentUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserOrderByCreatedAtDesc(user);

        notifications.forEach(notification ->
                notification.setRead(true)
        );

        notificationRepository.saveAll(notifications);
    }

    // =====================================================
    // DELETE ONE
    // =====================================================

    @Override
    @Transactional
    public void deleteNotification(Long notificationId) {

        User user = getCurrentUser();

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                ));

        if (notification.getUser() == null ||
                notification.getUser().getId() == null ||
                !notification.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to delete this notification"
            );
        }

        notificationRepository.delete(notification);
    }

    // =====================================================
    // CLEAR READ NOTIFICATIONS
    // =====================================================

    @Override
    @Transactional
    public void clearReadNotifications() {

        User user = getCurrentUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserOrderByCreatedAtDesc(user);

        List<Notification> readNotifications =
                notifications.stream()
                        .filter(Notification::isRead)
                        .toList();

        if (!readNotifications.isEmpty()) {
            notificationRepository.deleteAll(readNotifications);
        }
    }

    // =====================================================
    // CREATE REPORT READY NOTIFICATION
    // =====================================================

    @Override
    @Transactional
    public void createReportReadyNotification(
            Long propertyId,
            String propertyAddress) {

        User user = getCurrentUser();

        String message =
                "Comprehensive Due Diligence Report for "
                        + propertyAddress
                        + " has completed generation.";

        // -------------------------------------------------
        // PREVENT DUPLICATE REPORT NOTIFICATIONS
        // -------------------------------------------------

        boolean alreadyExists =
                notificationRepository
                        .existsByUserAndCategoryAndMessage(
                                user,
                                "REPORT",
                                message
                        );

        if (alreadyExists) {
            return;
        }

        // -------------------------------------------------
        // CREATE NEW NOTIFICATION
        // -------------------------------------------------

        Notification notification =
                new Notification();

        notification.setTitle(
                "Due Diligence Report Ready"
        );

        notification.setMessage(message);

        notification.setCategory(
                "REPORT"
        );

        notification.setSeverity(
                "SUCCESS"
        );

        notification.setRead(false);

        notification.setUser(user);

        notificationRepository.save(notification);

    }

    // =====================================================
    // CREATE PROPERTY UPDATE NOTIFICATION
    // =====================================================

    @Override
    @Transactional
    public void createPropertyUpdateNotification(
            Long propertyId,
            String propertyAddress) {

        User user = getCurrentUser();

        String message =
                "Property information for "
                        + propertyAddress
                        + " has been updated.";

        // Prevent duplicate property update notifications
        boolean alreadyExists =
                notificationRepository
                        .existsByUserAndCategoryAndMessage(
                                user,
                                "PROPERTY",
                                message
                        );

        if (alreadyExists) {
            return;
        }

        Notification notification =
                new Notification();

        notification.setTitle(
                "Property Updated"
        );

        notification.setMessage(message);

        notification.setCategory(
                "PROPERTY"
        );

        notification.setSeverity(
                "INFO"
        );

        notification.setRead(false);

        notification.setUser(user);

        notificationRepository.save(notification);
    }

    // =====================================================
    // ENTITY -> DTO
    // =====================================================

    private NotificationResponse mapToResponse(
            Notification notification) {

        NotificationResponse response =
                new NotificationResponse();

        response.setId(
                notification.getId()
        );

        response.setTitle(
                notification.getTitle()
        );

        response.setMessage(
                notification.getMessage()
        );

        response.setCategory(
                notification.getCategory()
        );

        response.setSeverity(
                notification.getSeverity()
        );

        response.setRead(
                notification.isRead()
        );

        response.setCreatedAt(
                notification.getCreatedAt()
        );

        return response;
    }
}