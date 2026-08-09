package com.realestate.due_diligence.notification.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificationResponse {

    private Long id;

    private String title;

    private String message;

    private String category;

    private String severity;

    private boolean read;

    private LocalDateTime createdAt;
}