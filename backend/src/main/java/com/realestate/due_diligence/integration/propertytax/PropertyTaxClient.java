package com.realestate.due_diligence.integration.propertytax;

import com.realestate.due_diligence.propertytax.dto.PropertyTaxHistoryResponse;

public interface PropertyTaxClient {
    PropertyTaxHistoryResponse getTaxHistory(String address);
}