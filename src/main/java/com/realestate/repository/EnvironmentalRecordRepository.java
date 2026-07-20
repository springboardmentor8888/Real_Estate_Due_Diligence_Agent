package com.realestate.repository;

import com.realestate.entity.EnvironmentalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnvironmentalRecordRepository extends JpaRepository<EnvironmentalRecord, Long> {

    List<EnvironmentalRecord> findByPropertyAddress(String propertyAddress);

}