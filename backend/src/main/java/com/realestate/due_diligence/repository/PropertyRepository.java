package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.property.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {
}