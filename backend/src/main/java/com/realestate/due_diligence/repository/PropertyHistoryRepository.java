package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.propertyhistory.PropertyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyHistoryRepository extends JpaRepository<PropertyHistory, Long> {
}