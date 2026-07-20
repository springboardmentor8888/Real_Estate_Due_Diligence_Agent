package com.realestate.service;

import com.realestate.entity.EnvironmentalRecord;
import java.util.List;

public interface EnvironmentalRecordService {

    EnvironmentalRecord saveRecord(EnvironmentalRecord record);

    List<EnvironmentalRecord> getAllRecords();

    EnvironmentalRecord getRecordById(Long id);

    List<EnvironmentalRecord> getRecordsByPropertyAddress(String propertyAddress);

    void deleteRecord(Long id);
}