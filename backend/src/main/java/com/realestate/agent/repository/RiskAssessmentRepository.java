package com.realestate.agent.repository;

import com.realestate.agent.entity.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {
    List<RiskAssessment> findByPropertyPropertyId(Long propertyId);
    List<RiskAssessment> findByRiskCategoryRiskCategoryId(Long riskCategoryId);
    List<RiskAssessment> findByAssessedByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(AVG(r.riskScore), 0.0) FROM RiskAssessment r WHERE r.riskScore IS NOT NULL")
    Double getAverageRiskScore();

    long countByRiskLevelIgnoreCase(String riskLevel);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM RiskAssessment r ORDER BY r.assessmentDate DESC")
    List<RiskAssessment> findTopRecentAssessments(org.springframework.data.domain.Pageable pageable);
}
