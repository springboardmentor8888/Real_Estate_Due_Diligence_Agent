package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.propertyvaluation.PropertyValuationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyValuationHistoryRepository
        extends JpaRepository<PropertyValuationHistory, Long> {

    List<PropertyValuationHistory> findByPropertyIdOrderByValuationYearAsc(
            Long propertyId
    );
}