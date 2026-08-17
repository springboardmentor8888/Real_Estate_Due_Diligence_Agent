package com.infosys.realestate.repository;

import com.infosys.realestate.entity.PropertyValuation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ValuationRepository extends JpaRepository<PropertyValuation, Long> {

    Optional<PropertyValuation> findTopByPropertyPropertyIdOrderByValuationDateDesc(Long propertyId);

    List<PropertyValuation> findByPropertyPropertyIdOrderByValuationDateDesc(Long propertyId);

    @Query("SELECT AVG(v.estimatedValue) FROM PropertyValuation v WHERE v.property.city = :city")
    BigDecimal findAverageValuationByCity(@Param("city") String city);
}
