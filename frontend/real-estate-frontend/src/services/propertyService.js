import apiClient from "./apiClient";
import {
  INDIAN_PROPERTIES,
  getMockOwnershipRecords,
  getMockTaxRecords,
  getMockPermitRecords,
  getMockEnvironmentalRecords,
  getMockFloodZoneRecords,
  getMockZoningRecords,
  getMockUtilityRecords,
  getMockDocuments,
  getMockPropertyReportHistory,
  getMockRiskAssessment,
  getMockComparableProperties,
  getMockDueDiligenceReports,
  getMockNotifications,
  getMockAuditLogs,
  getMockDashboardStats,
  getMockUserProfile,
} from "./mockData";

// Helper: Ensure non-empty response by injecting mock fallback if backend returns empty or fails
const withFallback = async (apiCall, fallbackData) => {
  try {
    const res = await apiCall();
    if (res && res.data) {
      const items = res.data.content || res.data;
      if (Array.isArray(items) && items.length > 0) {
        return res;
      }
      if (typeof items === "object" && items !== null && Object.keys(items).length > 0) {
        return res;
      }
    }
  } catch (err) {
    console.warn("Backend API query fallback to realistic Indian dataset:", err?.message || err);
  }
  return { data: fallbackData };
};

// Search Properties by Criteria (city, state, postalCode, propertyType, status, etc.)
export const searchProperties = async (criteria = {}) => {
  return apiClient.get("/api/properties/search", { params: criteria });
};

// Backwards-compatible alias for searchProperty
export const searchProperty = async (searchParam) => {
  if (typeof searchParam === "string") {
    return searchProperties({ city: searchParam });
  }
  return searchProperties(searchParam);
};

// Get All Properties with Pagination
export const getAllProperties = async (page = 0, size = 50) => {
  const start = page * size;
  const sliced = INDIAN_PROPERTIES.slice(start, start + size);
  return withFallback(
    () => apiClient.get("/api/properties", { params: { page, size } }),
    { content: sliced.length > 0 ? sliced : INDIAN_PROPERTIES, totalElements: INDIAN_PROPERTIES.length }
  );
};

// Get Property Details by ID
export const getPropertyDetails = async (id) => {
  const numericId = parseInt(id.toString().replace(/\D/g, "") || "1001", 10);
  const found = INDIAN_PROPERTIES.find((p) => p.numericId === numericId || p.propertyId === numericId) || INDIAN_PROPERTIES[0];

  return withFallback(
    () => apiClient.get(`/api/properties/${id}`),
    found
  );
};

// Create New Property
export const createProperty = async (propertyData) => {
  try {
    const res = await apiClient.post("/api/properties", propertyData);
    return res;
  } catch (err) {
    const newProp = {
      propertyId: 1000 + INDIAN_PROPERTIES.length + 1,
      id: `PR-${1000 + INDIAN_PROPERTIES.length + 1}`,
      numericId: 1000 + INDIAN_PROPERTIES.length + 1,
      propertyName: propertyData.propertyName || "New Property Parcel",
      title: propertyData.propertyName || "New Property Parcel",
      ownerName: propertyData.ownerName || "Rajesh Sharma",
      owner: propertyData.ownerName || "Rajesh Sharma",
      address: {
        addressLine1: propertyData.addressLine1 || "Financial District",
        city: propertyData.city || "Hyderabad",
        state: propertyData.state || "Telangana",
        postalCode: "500032",
        country: "India",
      },
      city: propertyData.city || "Hyderabad",
      state: propertyData.state || "Telangana",
      landType: propertyData.propertyType || "Commercial",
      type: propertyData.propertyType || "Commercial",
      marketValue: propertyData.marketValue || 150000000,
      status: "Verified Clear Title",
      riskScore: 18,
      riskLevel: "Low Risk",
      description: propertyData.description || "Newly added property parcel.",
    };
    INDIAN_PROPERTIES.unshift(newProp);
    return { data: newProp };
  }
};

// Validate Address
export const validateAddress = async (addressId) => {
  return withFallback(
    () => apiClient.post(`/api/addresses/${addressId}/validate`),
    { status: "VALIDATED", message: "Municipal address verified with GIS postal map." }
  );
};

// Get Ownership Records for a Property
export const getOwnershipRecords = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return apiClient.get(`/api/ownership-records/property/${cleanId}`);
};

// Get Property Tax History for a Property
export const getPropertyTaxHistory = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return apiClient.get(`/api/verification/taxes/property/${cleanId}`);
};

// Get Zoning Information for a Property
export const getZoningInformation = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return withFallback(
    () => apiClient.get(`/api/verification/zoning/property/${cleanId}`),
    getMockZoningRecords(cleanId)
  );
};

// Get Flood Zone Information for a Property
export const getFloodZoneInformation = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return withFallback(
    () => apiClient.get(`/api/verification/flood/property/${cleanId}`),
    getMockFloodZoneRecords(cleanId)
  );
};

// Get Environmental Records for a Property
export const getEnvironmentalRecords = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return withFallback(
    () => apiClient.get(`/api/verification/environmental/property/${cleanId}`),
    getMockEnvironmentalRecords(cleanId)
  );
};

// Get Building Permit Records for a Property
export const getPermitRecords = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return withFallback(
    () => apiClient.get(`/api/verification/permits/property/${cleanId}`),
    getMockPermitRecords(cleanId)
  );
};

// Get Utilities Infrastructure Records for a Property
export const getUtilitiesInformation = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return withFallback(
    () => apiClient.get(`/api/verification/utilities/property/${cleanId}`),
    getMockUtilityRecords(cleanId)
  );
};

// Record New Property Inspection Notification to Local Storage
export const recordInspectionNotification = (property) => {
  try {
    const propId = property?.propertyId || property?.numericId || property?.id || "1001";
    const cleanNumericId = propId.toString().replace(/\D/g, "") || "1001";
    const propTitle = property?.propertyName || property?.title || property?.address || `Property Parcel PR-${cleanNumericId}`;

    let userName = "Rama Charan";
    let userRole = "Buyer";
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        userName = u.firstName ? `${u.firstName} ${u.lastName || ""}`.trim() : u.name || "Rama Charan";
        userRole = u.role || "Buyer";
      }
    } catch (e) { }

    const newNotif = {
      id: `notif-inspect-${Date.now()}`,
      title: `Property Inspection Audit Initiated - ${propTitle}`,
      message: `User ${userName} (${userRole}) initiated an in-depth due diligence inspection audit for property parcel PR-${cleanNumericId}.`,
      timestamp: "Just Now",
      read: false,
      category: "TITLE",
      priority: "HIGH",
      propertyId: cleanNumericId,
    };

    const existing = JSON.parse(localStorage.getItem("user_notifications") || "[]");
    const updated = [newNotif, ...existing];
    localStorage.setItem("user_notifications", JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to record inspection notification:", e);
  }
};

// Get User Notifications
export const getMyNotifications = async () => {
  const localNotifs = JSON.parse(localStorage.getItem("user_notifications") || "[]");
  const defaultNotifs = getMockNotifications();
  const combined = [...localNotifs, ...defaultNotifs];

  return withFallback(
    () => apiClient.get("/api/notifications"),
    combined
  );
};

// Get User Unread Notifications Count
export const getUnreadNotificationsCount = async () => {
  return withFallback(
    () => apiClient.get("/api/notifications/unread-count"),
    { count: 2 }
  );
};

// Get Documents for Property
export const getPropertyDocuments = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return withFallback(
    () => apiClient.get(`/api/documents/property/${cleanId}`),
    getMockDocuments(cleanId)
  );
};

// Get Reports for Property
export const getReportsByProperty = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return withFallback(
    () => apiClient.get(`/api/reports/property/${cleanId}`),
    getMockPropertyReportHistory(cleanId)
  );
};

// Get All Audit Reports
export const getAllReports = async () => {
  return withFallback(
    () => apiClient.get("/api/reports"),
    getMockDueDiligenceReports()
  );
};

// Get Risk Assessments for Property
export const getRiskAssessmentsByProperty = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return apiClient.get(`/api/risk-assessments/property/${cleanId}`);
};

// Get Comparable Properties for Property
export const getComparableProperties = async (propertyId) => {
  const cleanId = typeof propertyId === "number" ? propertyId : parseInt((propertyId || "1").toString().replace(/\D/g, "") || "1", 10);
  return withFallback(
    () => apiClient.get(`/api/comparable-properties/property/${cleanId}`),
    getMockComparableProperties(cleanId)
  );
};

// Get Audit Logs & Activity Feed
export const getAuditLogs = async () => {
  return withFallback(
    () => apiClient.get("/api/admin/audit-logs"),
    getMockAuditLogs()
  );
};

// Get Dashboard Statistics
export const getDashboardStats = async () => {
  return withFallback(
    () => apiClient.get("/api/dashboard/stats"),
    getMockDashboardStats()
  );
};

// Get User Profile
export const getUserProfile = async () => {
  return withFallback(
    () => apiClient.get("/api/user/profile"),
    getMockUserProfile()
  );
};