package com.realestate.due_diligence.repository;

import com.realestate.due_diligence.property.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByCityAndPropertyType(String city, String propertyType);

}