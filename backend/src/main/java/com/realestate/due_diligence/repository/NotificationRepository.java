package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.notification.Notification;
import com.realestate.due_diligence.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    boolean existsByUserAndCategoryAndMessage(
            User user,
            String category,
            String message
    );
}