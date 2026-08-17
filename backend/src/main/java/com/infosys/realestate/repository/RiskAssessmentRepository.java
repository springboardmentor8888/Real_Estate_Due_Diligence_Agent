package com.infosys.realestate.repository;

import com.infosys.realestate.entity.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {

    List<RiskAssessment> findByPropertyPropertyId(Long propertyId);

    List<RiskAssessment> findByPropertyPropertyIdOrderByCreatedAtDesc(Long propertyId);

    Optional<RiskAssessment> findTopByPropertyPropertyIdOrderByCreatedAtDesc(Long propertyId);

    @Query("SELECT r.riskLevel, COUNT(r) FROM RiskAssessment r GROUP BY r.riskLevel")
    List<Object[]> countByRiskLevel();
}
