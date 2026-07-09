package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.role.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}