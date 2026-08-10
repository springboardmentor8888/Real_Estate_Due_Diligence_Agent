import apiClient from "./apiClient";

// Get Risk Assessment by ID
export const getRiskAssessmentById = async (id) => {
  return apiClient.get(`/api/risk-assessments/${id}`);
};

// Get Risk Assessments for a Property
export const getRiskAssessmentsByProperty = async (propertyId) => {
  return apiClient.get(`/api/risk-assessments/property/${propertyId}`);
};

// Create Risk Assessment (Only for explicit user-initiated actions)
export const createRiskAssessment = async (riskData) => {
  return apiClient.post("/api/risk-assessments", riskData);
};

// Update Risk Assessment
export const updateRiskAssessment = async (id, riskData) => {
  return apiClient.put(`/api/risk-assessments/${id}`, riskData);
};

// Delete Risk Assessment
export const deleteRiskAssessment = async (id) => {
  return apiClient.delete(`/api/risk-assessments/${id}`);
};
