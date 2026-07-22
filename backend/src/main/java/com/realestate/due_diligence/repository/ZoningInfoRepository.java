package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.zoning.ZoningInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZoningInfoRepository
        extends JpaRepository<ZoningInfo, Long> {

    List<ZoningInfo> findByPropertyId(Long propertyId);
}