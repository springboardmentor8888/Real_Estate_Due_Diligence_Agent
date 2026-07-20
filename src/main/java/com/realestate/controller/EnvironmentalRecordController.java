package com.realestate.controller;

import com.realestate.entity.EnvironmentalRecord;
import com.realestate.service.EnvironmentalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/environment")
public class EnvironmentalRecordController {

    @Autowired
    private EnvironmentalRecordService environmentalRecordService;

    @PostMapping
    public EnvironmentalRecord saveRecord(@RequestBody EnvironmentalRecord record) {
        return environmentalRecordService.saveRecord(record);
    }

    @GetMapping
    public List<EnvironmentalRecord> getAllRecords() {
        return environmentalRecordService.getAllRecords();
    }

    @GetMapping("/{id}")
    public EnvironmentalRecord getRecordById(@PathVariable Long id) {
        return environmentalRecordService.getRecordById(id);
    }

    @GetMapping("/address/{address}")
    public List<EnvironmentalRecord> getByAddress(@PathVariable String address) {
        return environmentalRecordService.getRecordsByPropertyAddress(address);
    }

    @DeleteMapping("/{id}")
    public String deleteRecord(@PathVariable Long id) {
        environmentalRecordService.deleteRecord(id);
        return "Environmental record deleted successfully";
    }
}