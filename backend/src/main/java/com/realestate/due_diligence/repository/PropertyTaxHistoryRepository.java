package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.propertytax.PropertyTaxHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyTaxHistoryRepository
        extends JpaRepository<PropertyTaxHistory, Long> {

    List<PropertyTaxHistory> findByPropertyId(Long propertyId);
}