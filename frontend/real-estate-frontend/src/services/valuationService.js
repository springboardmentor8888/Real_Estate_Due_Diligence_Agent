import apiClient from "./apiClient";

// Get Property Valuation by Property ID
export const getValuationByProperty = async (propertyId) => {
  return apiClient.get(`/api/property-valuations/${propertyId}`);
};
