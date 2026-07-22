package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.environment.EnvironmentalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnvironmentalRecordRepository
        extends JpaRepository<EnvironmentalRecord, Long> {

    List<EnvironmentalRecord> findByPropertyId(Long propertyId);
}