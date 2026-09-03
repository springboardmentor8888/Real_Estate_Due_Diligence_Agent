package com.realestate.agent.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.realestate.agent.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationTokenHash(String verificationTokenHash);

    Optional<User> findByPasswordResetTokenHash(String passwordResetTokenHash);
}