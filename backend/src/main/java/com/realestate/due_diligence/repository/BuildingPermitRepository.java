package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.permit.BuildingPermitRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingPermitRepository
        extends JpaRepository<BuildingPermitRecord, Long> {

    List<BuildingPermitRecord> findByPropertyId(Long propertyId);
}