package com.realestate.due_diligence.userprofile;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_profiles")
public class UserProfile extends BaseEntity {

    private String phone;

    private String address;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}