package com.infosys.realestate.service;

import com.infosys.realestate.dto.ComparablePropertyDTO;
import java.util.List;

public interface ComparablePropertyService {
    List<ComparablePropertyDTO> getComparableProperties(Long propertyId);
    List<ComparablePropertyDTO> generateComparableProperties(Long propertyId);
}
