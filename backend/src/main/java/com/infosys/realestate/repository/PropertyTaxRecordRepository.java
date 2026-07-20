package com.infosys.realestate.repository;

import com.infosys.realestate.entity.PropertyTaxRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyTaxRecordRepository extends JpaRepository<PropertyTaxRecord, Long> {
    List<PropertyTaxRecord> findByPropertyPropertyIdOrderByTaxYearDesc(Long propertyId);
    List<PropertyTaxRecord> findByPropertyPropertyIdAndPaymentStatus(Long propertyId, String paymentStatus);
}
