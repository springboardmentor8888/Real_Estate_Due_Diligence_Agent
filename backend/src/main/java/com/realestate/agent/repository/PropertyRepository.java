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
}
