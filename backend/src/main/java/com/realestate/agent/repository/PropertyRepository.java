package com.realestate.agent.repository;

import com.realestate.agent.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    Optional<Property> findByPropertyCode(String propertyCode);

    boolean existsByPropertyCode(String propertyCode);

    @Query("SELECT p FROM Property p WHERE p.createdBy.email = :email")
    List<Property> findByCreatedByEmail(@Param("email") String email);

    @Query("SELECT p FROM Property p WHERE p.createdBy.userId = :userId")
    List<Property> findByCreatedByUserId(@Param("userId") Long userId);

    long countByStatus(com.realestate.agent.enums.PropertyStatus status);

    long countByCreatedByUserId(Long userId);

    long countByCreatedByUserIdAndStatus(Long userId, com.realestate.agent.enums.PropertyStatus status);

    @Query("SELECT COALESCE(SUM(p.marketValue), 0) FROM Property p")
    java.math.BigDecimal sumMarketValue();

    @Query("SELECT p.status, COUNT(p) FROM Property p GROUP BY p.status")
    List<Object[]> countPropertiesByStatus();

    @Query("SELECT p FROM Property p ORDER BY p.createdAt DESC")
    List<Property> findTopRecentProperties(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.createdBy.userId = :userId ORDER BY p.createdAt DESC")
    List<Property> findRecentByCreatedByUserId(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<Property> findRecentByStatus(@Param("status") com.realestate.agent.enums.PropertyStatus status, org.springframework.data.domain.Pageable pageable);
}
