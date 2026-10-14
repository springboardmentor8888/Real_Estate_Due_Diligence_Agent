package com.realestate.agent.repository;

import com.realestate.agent.entity.DueDiligenceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DueDiligenceReportRepository extends JpaRepository<DueDiligenceReport, Long> {
    List<DueDiligenceReport> findByPropertyPropertyId(Long propertyId);
    List<DueDiligenceReport> findByGeneratedByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM DueDiligenceReport r ORDER BY r.generatedAt DESC")
    List<DueDiligenceReport> findTopRecentReports(org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(r) FROM DueDiligenceReport r WHERE r.property.createdBy.userId = :sellerId")
    long countByPropertyCreatedByUserId(@org.springframework.data.repository.query.Param("sellerId") Long sellerId);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM DueDiligenceReport r WHERE r.reportStatus IN ('PENDING', 'IN_PROGRESS') ORDER BY r.generatedAt DESC")
    List<DueDiligenceReport> findPendingReviewReports(org.springframework.data.domain.Pageable pageable);
}
