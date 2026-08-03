import apiClient from "./apiClient";

// Search Properties by Criteria (city, state, postalCode, propertyType, status, etc.)
export const searchProperties = async (criteria = {}) => {
  return apiClient.get("/api/properties/search", {
    params: criteria,
  });
};

// Backwards-compatible alias for searchProperty
export const searchProperty = async (searchParam) => {
  if (typeof searchParam === "string") {
    return apiClient.get("/api/properties/search", {
      params: { city: searchParam },
    });
  }
  return searchProperties(searchParam);
};

// Get All Properties with Pagination
export const getAllProperties = async (page = 0, size = 10) => {
  return apiClient.get("/api/properties", {
    params: { page, size },
  });
};

// Get Property Details by ID
export const getPropertyDetails = async (id) => {
  return apiClient.get(`/api/properties/${id}`);
};

// Create New Property
export const createProperty = async (propertyData) => {
  return apiClient.post("/api/properties", propertyData);
};

// Validate Address
export const validateAddress = async (addressId) => {
  return apiClient.post(`/api/addresses/${addressId}/validate`);
};

// Get Ownership Records for a Property
export const getOwnershipRecords = async (propertyId) => {
  return apiClient.get(`/api/ownership-records/property/${propertyId}`);
};

// Get Property Tax History for a Property
export const getPropertyTaxHistory = async (propertyId) => {
  return apiClient.get(`/api/verification/taxes/property/${propertyId}`);
};

// Get Zoning Information for a Property
export const getZoningInformation = async (propertyId) => {
  return apiClient.get(`/api/verification/zoning/property/${propertyId}`);
};

// Get Flood Zone Information for a Property
export const getFloodZoneInformation = async (propertyId) => {
  return apiClient.get(`/api/verification/flood/property/${propertyId}`);
};

// Get Environmental Records for a Property
export const getEnvironmentalRecords = async (propertyId) => {
  return apiClient.get(`/api/verification/environmental/property/${propertyId}`);
};

// Get Building Permit Records for a Property
export const getPermitRecords = async (propertyId) => {
  return apiClient.get(`/api/verification/permits/property/${propertyId}`);
};

// Get User Notifications
export const getMyNotifications = async () => {
  return apiClient.get("/api/notifications");
};

// Get User Unread Notifications Count
export const getUnreadNotificationsCount = async () => {
  return apiClient.get("/api/notifications/unread-count");
};

// Get Reports for Property
export const getReportsByProperty = async (propertyId) => {
  return apiClient.get(`/api/reports/property/${propertyId}`);
};

// Get Risk Assessments for Property
export const getRiskAssessmentsByProperty = async (propertyId) => {
  return apiClient.get(`/api/risk-assessments/property/${propertyId}`);
};

// Get Comparable Properties for Property
export const getComparableProperties = async (propertyId) => {
  return apiClient.get(`/api/market-analysis/property/${propertyId}`);
};

