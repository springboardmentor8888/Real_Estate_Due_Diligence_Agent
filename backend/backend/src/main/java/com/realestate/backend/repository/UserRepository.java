package com.realestate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.realestate.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}