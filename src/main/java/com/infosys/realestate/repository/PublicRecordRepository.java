package com.infosys.realestate.repository;

import com.infosys.realestate.entity.PublicRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicRecordRepository extends JpaRepository<PublicRecord, Long> {
    List<PublicRecord> findByPropertyPropertyIdOrderByFilingDateDesc(Long propertyId);
    List<PublicRecord> findByPropertyPropertyIdAndStatus(Long propertyId, String status);
    List<PublicRecord> findByPropertyPropertyIdAndRecordType(Long propertyId, String recordType);
}
