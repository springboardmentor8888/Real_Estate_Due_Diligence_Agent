package com.infosys.realestate.repository;

import com.infosys.realestate.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByCity(String city);

    List<Property> findByState(String state);

    List<Property> findByZipCode(String zipCode);

    List<Property> findByPropertyType(String propertyType);

}