package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.userprofile.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}