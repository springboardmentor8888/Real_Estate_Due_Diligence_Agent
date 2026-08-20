package com.realestate.agent.repository;

import com.realestate.agent.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    @Query("SELECT o FROM Offer o WHERE o.buyer.email = :email")
    List<Offer> findByBuyerEmail(@Param("email") String email);

    @Query("SELECT o FROM Offer o WHERE o.property.propertyId = :propertyId")
    List<Offer> findByPropertyId(@Param("propertyId") Long propertyId);
}
