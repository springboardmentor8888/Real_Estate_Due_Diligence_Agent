package com.realestate.due_diligence.notification;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {

    private String title;

    private String message;

    private String category;

    private String severity;

    private boolean read = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}