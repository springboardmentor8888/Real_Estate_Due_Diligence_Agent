import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => ({
  ...config,
  headers: {
    ...(config.headers || {}),
    ...authHeaders(),
  },
}));

export function normalizeArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

export function unavailable(value) {
  return value === null || value === undefined || value === "" ? "Not available" : value;
}

export function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "Not available";
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

export async function getProperties() {
  const response = await api.get("/api/properties");
  return normalizeArray(response.data);
}

export async function getProperty(propertyId) {
  const response = await api.get(`/api/properties/${propertyId}`);
  return response.data;
}

export async function searchProperties(searchRequest) {
  const response = await api.post("/api/properties/search", {
    city: searchRequest.city || null,
    state: searchRequest.state || null,
    zipCode: searchRequest.zipCode || null,
    propertyType: searchRequest.propertyType || null,
  });
  return normalizeArray(response.data);
}

export async function validateAddress(addressRequest) {
  const response = await api.post("/api/properties/validate-address", {
    address: addressRequest.address,
    city: addressRequest.city,
    state: addressRequest.state,
    zipCode: addressRequest.zipCode,
  });
  return response.data;
}

async function collect(key, request) {
  try {
    const response = await request();
    return { key, data: response.data, error: "" };
  } catch (error) {
    return {
      key,
      data: null,
      error: error.response?.data?.message || "Unable to retrieve this data source.",
    };
  }
}

function collectArray(key, request) {
  return collect(key, request).then((result) => ({
    ...result,
    data: normalizeArray(result.data),
  }));
}

export async function getPropertyHistory(propertyId) {
  const response = await api.get(`/api/property-history/${propertyId}`);
  return normalizeArray(response.data);
}

export async function getOwnershipHistory(propertyId) {
  const response = await api.get(`/api/ownership/property/${propertyId}`);
  return normalizeArray(response.data);
}

export async function getTaxHistory(propertyId) {
  const response = await api.get(`/api/property-tax/property/${propertyId}`);
  return normalizeArray(response.data);
}

export async function getFloodZoneInfo(propertyId) {
  const response = await api.get(`/api/flood-zones/property/${propertyId}`);
  return normalizeArray(response.data);
}

export async function getPermitHistory(propertyId) {
  const response = await api.get(`/api/permits/property/${propertyId}`);
  return normalizeArray(response.data);
}

export async function getZoningInfo(propertyId) {
  const response = await api.get(`/api/zoning/property/${propertyId}`);
  return normalizeArray(response.data);
}

export async function getEnvironmentalRecords(propertyId) {
  const response = await api.get(`/api/environmental/${propertyId}`);
  return normalizeArray(response.data);
}

export async function getRiskAssessment(propertyId) {
  const response = await api.get(`/api/properties/${propertyId}/risk-assessment`);
  return response.data;
}

export async function getComparableProperties(propertyId) {
  const response = await api.get(`/api/properties/${propertyId}/comparables`);
  return normalizeArray(response.data);
}

export async function getPropertyValuation(propertyId) {
  const response = await api.get(`/api/properties/${propertyId}/valuation`);
  return response.data;
}

export async function getReport(propertyId) {
  const response = await api.get(`/api/reports/${propertyId}`);
  return response.data;
}

export async function getDueDiligenceBundle(propertyId) {
  let property = null;
  let propertyError = "";

  try {
    property = await getProperty(propertyId);
  } catch (error) {
    propertyError = error.response?.data?.message || "Unable to retrieve property details.";
  }

  const requests = await Promise.all([
    collectArray("ownership", () => api.get(`/api/ownership/property/${propertyId}`)),
    collectArray("tax", () => api.get(`/api/property-tax/property/${propertyId}`)),
    collectArray("flood", () => api.get(`/api/flood-zones/property/${propertyId}`)),
    collectArray("permits", () => api.get(`/api/permits/property/${propertyId}`)),
    collectArray("zoning", () => api.get(`/api/zoning/property/${propertyId}`)),
    collectArray("environmental", () => api.get(`/api/environmental/${propertyId}`)),
    collectArray("history", () => api.get(`/api/property-history/${propertyId}`)),
    collect("riskAssessment", () => api.get(`/api/properties/${propertyId}/risk-assessment`)),
    collect("valuation", () => api.get(`/api/properties/${propertyId}/valuation`)),
    collectArray("comparables", () => api.get(`/api/properties/${propertyId}/comparables`)),
  ]);

  const bundle = {
    property,
    errors: propertyError ? { property: propertyError } : {},
  };

  requests.forEach((result) => {
    bundle[result.key] = result.data;
    if (result.error) bundle.errors[result.key] = result.error;
  });

  return bundle;
}

export async function getComparisonBundle(propertyAId, propertyBId) {
  const [diligenceA, diligenceB] = await Promise.all([
    getDueDiligenceBundle(propertyAId),
    getDueDiligenceBundle(propertyBId),
  ]);

  return {
    propertyA: diligenceA,
    propertyB: diligenceB,
    a: diligenceA,
    b: diligenceB,
  };
}
