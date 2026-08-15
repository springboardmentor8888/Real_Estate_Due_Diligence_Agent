package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.propertyhistory.PropertyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyHistoryRepository extends JpaRepository<PropertyHistory, Long> {
    List<PropertyHistory> findByPropertyIdOrderByEventDateDesc(Long propertyId);
}