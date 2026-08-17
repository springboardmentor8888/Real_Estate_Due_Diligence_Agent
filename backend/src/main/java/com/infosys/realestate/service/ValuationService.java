package com.infosys.realestate.service;

import com.infosys.realestate.dto.ValuationDTO;
import java.util.List;

public interface ValuationService {
    ValuationDTO getLatestValuation(Long propertyId);
    ValuationDTO calculatePropertyValuation(Long propertyId);
    List<ValuationDTO> getValuationHistory(Long propertyId);
}
