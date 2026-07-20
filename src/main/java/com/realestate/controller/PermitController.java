package com.realestate.controller;

import com.realestate.entity.Permit;
import com.realestate.service.PermitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permits")
public class PermitController {

    @Autowired
    private PermitService permitService;

    @PostMapping
public Permit savePermit(@RequestBody Permit permit) {
    System.out.println("===== Permit API Called =====");
    return permitService.savePermit(permit);
}

    @GetMapping
    public List<Permit> getAllPermits() {
        return permitService.getAllPermits();
    }

    @GetMapping("/{id}")
    public Permit getPermitById(@PathVariable Long id) {
        return permitService.getPermitById(id);
    }

    @GetMapping("/address/{address}")
    public List<Permit> getByAddress(@PathVariable String address) {
        return permitService.getPermitsByPropertyAddress(address);
    }

    @DeleteMapping("/{id}")
    public String deletePermit(@PathVariable Long id) {
        permitService.deletePermit(id);
        return "Permit deleted successfully";
    }
}