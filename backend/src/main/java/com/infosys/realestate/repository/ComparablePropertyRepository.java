package com.infosys.realestate.repository;

import com.infosys.realestate.entity.ComparableProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ComparablePropertyRepository extends JpaRepository<ComparableProperty, Long> {

    List<ComparableProperty> findBySubjectPropertyPropertyIdOrderBySimilarityScoreDesc(Long propertyId);

    List<ComparableProperty> findBySubjectPropertyPropertyIdAndDistanceInMilesLessThanEqual(Long propertyId, Double maxDistance);

    @Query("SELECT AVG(c.pricePerSqFt) FROM ComparableProperty c WHERE c.subjectProperty.propertyId = :propertyId")
    BigDecimal calculateAveragePricePerSqFt(@Param("propertyId") Long propertyId);
}
