package com.infosys.realestate.repository;

import com.infosys.realestate.entity.DueDiligenceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DueDiligenceReportRepository extends JpaRepository<DueDiligenceReport, Long> {
    List<DueDiligenceReport> findByPropertyPropertyId(Long propertyId);
}
