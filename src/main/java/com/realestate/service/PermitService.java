package com.realestate.service;

import com.realestate.entity.Permit;
import java.util.List;

public interface PermitService {

    Permit savePermit(Permit permit);

    List<Permit> getAllPermits();

    Permit getPermitById(Long id);

    List<Permit> getPermitsByPropertyAddress(String propertyAddress);

    void deletePermit(Long id);
}