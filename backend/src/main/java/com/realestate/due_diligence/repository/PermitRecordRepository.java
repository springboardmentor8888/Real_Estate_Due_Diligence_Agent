package com.realestate.due_diligence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.realestate.due_diligence.permit.PermitRecord;

public interface PermitRecordRepository
        extends JpaRepository<PermitRecord, Long> {

    List<PermitRecord> findByPropertyId(Long propertyId);

}