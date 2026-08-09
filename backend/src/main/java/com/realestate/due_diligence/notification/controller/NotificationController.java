package com.realestate.due_diligence.notification.controller;

import com.realestate.due_diligence.notification.dto.NotificationResponse;
import com.realestate.due_diligence.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;


    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getMyNotifications() {

        return ResponseEntity.ok(
                notificationService
                        .getMyNotifications()
        );
    }


    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse>
    markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(id)
        );
    }


    @PutMapping("/read-all")
    public ResponseEntity<Void>
    markAllAsRead() {

        notificationService
                .markAllAsRead();

        return ResponseEntity.noContent()
                .build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteNotification(
            @PathVariable Long id) {

        notificationService
                .deleteNotification(id);

        return ResponseEntity.noContent()
                .build();
    }


    @DeleteMapping("/read")
    public ResponseEntity<Void>
    clearReadNotifications() {

        notificationService
                .clearReadNotifications();

        return ResponseEntity.noContent()
                .build();
    }
}