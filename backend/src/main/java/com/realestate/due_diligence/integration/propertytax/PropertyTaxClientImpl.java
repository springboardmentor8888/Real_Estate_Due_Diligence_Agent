package com.realestate.due_diligence.integration.propertytax;

import com.realestate.due_diligence.propertytax.dto.PropertyTaxHistoryResponse;
import org.springframework.stereotype.Service;

@Service
public class PropertyTaxClientImpl implements PropertyTaxClient {

    @Override
    public PropertyTaxHistoryResponse getTaxHistory(String address) {
        // Mock data response for testing
        PropertyTaxHistoryResponse response = new PropertyTaxHistoryResponse();
        // Set fields according to your PropertyTaxHistoryResponse class definition
        return response;
    }
}