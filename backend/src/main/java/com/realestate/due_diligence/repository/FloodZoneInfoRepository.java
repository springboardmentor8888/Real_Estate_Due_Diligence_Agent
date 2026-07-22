package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.floodzone.FloodZoneInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FloodZoneInfoRepository
        extends JpaRepository<FloodZoneInfo, Long> {

    List<FloodZoneInfo> findByPropertyId(Long propertyId);
}