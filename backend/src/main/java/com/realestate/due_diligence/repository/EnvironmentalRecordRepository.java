package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.environmental.EnvironmentalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnvironmentalRecordRepository extends JpaRepository<EnvironmentalRecord, Long> {
    List<EnvironmentalRecord> findByPropertyId(Long propertyId);
}
