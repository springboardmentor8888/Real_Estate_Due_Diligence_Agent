package com.realestate.agent;

import com.realestate.agent.entity.Notification;
import com.realestate.agent.entity.User;
import com.realestate.agent.mapper.NotificationMapper;
import com.realestate.agent.repository.DueDiligenceReportRepository;
import com.realestate.agent.repository.NotificationRepository;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOwnershipTest {

    @Mock private NotificationRepository notificationRepository;
    @Mock private UserRepository userRepository;
    @Mock private PropertyRepository propertyRepository;
    @Mock private DueDiligenceReportRepository reportRepository;
    @Mock private NotificationMapper notificationMapper;

    @InjectMocks
    private NotificationServiceImpl service;

    @Test
    void markAsReadRejectsAnotherUsersNotification() {
        User owner = new User();
        owner.setEmail("owner@example.com");
        Notification notification = Notification.builder().notificationId(1L).user(owner).isRead(false).build();
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));

        assertThrows(org.springframework.security.access.AccessDeniedException.class,
                () -> service.markAsRead(1L, "other@example.com"));
        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    void deleteRejectsAnotherUsersNotification() {
        User owner = new User();
        owner.setEmail("owner@example.com");
        Notification notification = Notification.builder().notificationId(1L).user(owner).build();
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));

        assertThrows(org.springframework.security.access.AccessDeniedException.class,
                () -> service.deleteNotification(1L, "other@example.com"));
        verify(notificationRepository, never()).delete(any(Notification.class));
    }
}
