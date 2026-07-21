package com.infosys.realestate.repository;

import com.infosys.realestate.entity.OwnershipRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OwnershipRecordRepository extends JpaRepository<OwnershipRecord, Long> {
    List<OwnershipRecord> findByPropertyPropertyIdOrderByAcquisitionDateDesc(Long propertyId);
    List<OwnershipRecord> findByPropertyPropertyIdAndIsCurrentOwnerTrue(Long propertyId);
}
