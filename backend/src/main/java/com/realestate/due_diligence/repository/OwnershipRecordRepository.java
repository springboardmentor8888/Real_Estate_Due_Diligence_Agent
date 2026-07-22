package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.ownership.OwnershipRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OwnershipRecordRepository
        extends JpaRepository<OwnershipRecord, Long> {

    List<OwnershipRecord> findByPropertyId(Long propertyId);
}