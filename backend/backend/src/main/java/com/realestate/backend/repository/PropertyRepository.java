package com.realestate.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.realestate.backend.entity.Property;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByCity(String city);

    List<Property> findByState(String state);

    List<Property> findByPincode(String pincode);

    List<Property> findByPropertyType(String propertyType);

}