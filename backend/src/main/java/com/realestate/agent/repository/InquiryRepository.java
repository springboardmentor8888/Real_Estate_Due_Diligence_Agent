package com.realestate.agent.repository;

import com.realestate.agent.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    @Query("SELECT i FROM Inquiry i WHERE i.property.propertyId = :propertyId")
    List<Inquiry> findByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT i FROM Inquiry i WHERE i.property.createdBy.email = :email")
    List<Inquiry> findByPropertyCreatedByEmail(@Param("email") String email);
}
