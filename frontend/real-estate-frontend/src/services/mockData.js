// Master Indian Real Estate Data Store
// Provides realistic enterprise-grade Indian real estate data for all 20+ pages and fallback service integration.

import { MASTER_MOCK_PROPERTIES, getPropertyById } from "../data/mockPropertyData";

export const INDIAN_CITIES = [
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Mumbai",
  "Pune",
  "Delhi",
  "Noida",
  "Gurugram",
  "Kolkata",
  "Ahmedabad",
  "Visakhapatnam",
  "Vijayawada",
  "Warangal",
  "Mysuru",
  "Coimbatore",
  "Jaipur",
  "Lucknow",
  "Indore",
  "Bhopal",
  "Nagpur"
];

export const INDIAN_PROPERTIES = MASTER_MOCK_PROPERTIES;

// Ownership Chain of Title Records Generator
export const getMockOwnershipRecords = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  return prop.ownershipRecords || [];
};

// Municipal Tax Audit History Generator
export const getMockTaxRecords = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  return prop.taxHistory || [];
};

// Building Permit Records Generator
export const getMockPermitRecords = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  return prop.permitRecords || [];
};

// Environmental Hazards Audit Generator
export const getMockEnvironmentalRecords = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  return prop.environmentalInfo ? [prop.environmentalInfo] : [];
};

// Flood Plain & Elevation Survey Generator
export const getMockFloodZoneRecords = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  return prop.floodZoneInfo || {};
};

// Municipal Zoning Information Generator
export const getMockZoningRecords = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  return prop.zoningInfo || {};
};

// Property Documents Generator
export const getMockDocuments = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  return prop.documents || [];
};

// Property Report History Generator
export const getMockPropertyReportHistory = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  return prop.reportHistory || [];
};

// Vector Risk Assessment Generator
export const getMockRiskAssessment = (propertyId = "1001") => {
  const currentProp = getPropertyById(propertyId);

  return {
    propertyId: `PR-${currentProp.numericId}`,
    propertyName: currentProp.propertyName,
    address: `${currentProp.address}`,
    overallScore: 100 - currentProp.riskScore,
    riskLevel: currentProp.riskLevel,
    recommendation: currentProp.riskScore > 60 ? "FLAGGED FOR SPECIAL REVIEW" : currentProp.riskScore > 35 ? "CONDITIONAL APPROVAL" : "APPROVED FOR ACQUISITION",
    verdictDescription: `Land title search and sub-registrar verification completed for ${currentProp.propertyName}. Title clear of encumbrances and litigation.`,
    categories: [
      { id: "legal", title: "Legal & Litigation Risk", score: 95 - (currentProp.riskScore / 2), status: currentProp.riskLevel, variant: currentProp.variant, details: "Court search clear." },
      { id: "ownership", title: "Ownership & Encumbrance", score: 92 - (currentProp.riskScore / 2), status: "Low Risk", variant: "success", details: "Deed verified." },
      { id: "tax", title: "Municipal Property Tax", score: 96, status: "Low Risk", variant: "success", details: "Tax receipts clear." },
      { id: "flood", title: "Flood & Elevation Risk", score: currentProp.floodZoneInfo?.riskLevel === "High Risk" ? 45 : 88, status: currentProp.floodZoneInfo?.riskLevel || "Low Risk", variant: currentProp.floodZoneInfo?.riskLevel === "High Risk" ? "danger" : "success", details: "Flood map evaluated." },
      { id: "environmental", title: "Environmental Hazards", score: 90, status: "Low Risk", variant: "success", details: "Pollution NOC clear." },
      { id: "zoning", title: "Zoning & Permit Compliance", score: 85, status: "Low Risk", variant: "success", details: "Zoning FAR verified." },
    ],
  };
};

// Comparable Market Properties Generator
export const getMockComparableProperties = (propertyId = "1001") => {
  const currentProp = getPropertyById(propertyId);
  const sameCity = MASTER_MOCK_PROPERTIES.filter((p) => p.city === currentProp.city && p.numericId !== currentProp.numericId);
  if (sameCity.length > 0) return sameCity.slice(0, 6);
  return MASTER_MOCK_PROPERTIES.filter((p) => p.numericId !== currentProp.numericId).slice(0, 6);
};

// Generated Due Diligence Audit Reports Archive
export const getMockDueDiligenceReports = () => {
  return MASTER_MOCK_PROPERTIES.map((p, idx) => ({
    id: `RPT-2024-${p.numericId}`,
    name: `Comprehensive Diligence Audit - ${p.propertyName}`,
    propertyName: p.propertyName,
    city: p.city,
    date: p.reportHistory?.[0]?.generatedDate || "15 May 2024",
    status: p.reportHistory?.[0]?.status || "Completed",
    variant: p.reportHistory?.[0]?.status === "Failed" ? "danger" : p.reportHistory?.[0]?.status === "Processing" ? "warning" : "success",
    score: 100 - p.riskScore,
  }));
};

// System Notifications & Real-Time Alerts
export const getMockNotifications = () => {
  return [
    { id: 1, title: "Title Deed Verification Completed", message: "Sub-Registrar clearance certificate generated for PR-1001.", timestamp: "10 mins ago", type: "success", read: false },
    { id: 2, title: "Municipal Tax Assessment Verified", message: "Tax receipts paid up to assessment year 2024.", timestamp: "1 hour ago", type: "info", read: false },
    { id: 3, title: "Environmental Clearance Confirmed", message: "State Pollution Control Board approved Phase I audit.", timestamp: "3 hours ago", type: "success", read: true },
    { id: 4, title: "New High-Value Property Added", message: "BKC Corporate Tower parcel added to active watch list.", timestamp: "Yesterday", type: "info", read: true },
    { id: 5, title: "Zoning Variance Audit Complete", message: "FAR permissions confirmed for Whitefield Tech Hub.", timestamp: "2 days ago", type: "success", read: true },
  ];
};

// Audit Logs & Activity Event Feeds
export const getMockAuditLogs = () => {
  return [
    { id: "LOG-9901", user: "Rajesh Sharma", action: "Executed Title Deed Verification", module: "Sub-Registrar Registry", timestamp: "Today, 10:45 AM", ip: "192.168.1.104", status: "SUCCESS" },
    { id: "LOG-9902", user: "Ananya Rao", action: "Exported Due Diligence PDF Report", module: "Report Engine", timestamp: "Today, 09:30 AM", ip: "192.168.1.108", status: "SUCCESS" },
    { id: "LOG-9903", user: "Venkatesh Iyer", action: "Queried Municipal Tax Receipts", module: "Tax Assessment", timestamp: "Yesterday, 04:15 PM", ip: "192.168.1.112", status: "SUCCESS" },
    { id: "LOG-9904", user: "Suresh Patel", action: "Ran Environmental Hazard Assessment", module: "SPCB Audit Engine", timestamp: "Yesterday, 02:20 PM", ip: "192.168.1.115", status: "SUCCESS" },
    { id: "LOG-9905", user: "Aditi Deshmukh", action: "Updated Property Watch List", module: "Portfolio Manager", timestamp: "2 days ago", ip: "192.168.1.120", status: "SUCCESS" },
  ];
};

// Executive Dashboard & Telemetry KPI Statistics
export const getMockDashboardStats = () => {
  return {
    totalProperties: MASTER_MOCK_PROPERTIES.length,
    completedReports: 1240,
    pendingReports: 182,
    highRiskProperties: MASTER_MOCK_PROPERTIES.filter(p => p.riskScore > 60).length,
    mediumRiskProperties: MASTER_MOCK_PROPERTIES.filter(p => p.riskScore > 35 && p.riskScore <= 60).length,
    lowRiskProperties: MASTER_MOCK_PROPERTIES.filter(p => p.riskScore <= 35).length,
    recentSearchesCount: 384,
    savedPropertiesCount: 28,
    activeAuditsCount: 14,
    riskDistribution: [
      { name: "Low Risk", value: 1340, percentage: "90%" },
      { name: "Medium Risk", value: 118, percentage: "8%" },
      { name: "High Risk", value: 24, percentage: "2%" },
    ],
    propertyTypesDistribution: [
      { name: "Commercial", value: MASTER_MOCK_PROPERTIES.filter(p => p.category === "Commercial").length },
      { name: "Residential", value: MASTER_MOCK_PROPERTIES.filter(p => p.category === "Residential").length },
      { name: "Industrial", value: MASTER_MOCK_PROPERTIES.filter(p => p.category === "Industrial").length },
      { name: "Mixed-Use", value: MASTER_MOCK_PROPERTIES.filter(p => p.category === "Mixed-Use").length },
    ],
    monthlyReportTrends: [
      { month: "Jan", reports: 85, verified: 80 },
      { month: "Feb", reports: 92, verified: 88 },
      { month: "Mar", reports: 110, verified: 104 },
      { month: "Apr", reports: 125, verified: 118 },
      { month: "May", reports: 140, verified: 132 },
      { month: "Jun", reports: 165, verified: 158 },
    ],
  };
};

// Master Indian Utility Infrastructure Records Generator
export const getMockUtilityRecords = (propertyId = "1001") => {
  const prop = getPropertyById(propertyId);
  const numericId = prop.numericId;
  return [
    { serviceType: "Electricity Grid Connection", provider: "State Electricity Distribution Corp", connectionStatus: "Connected & Active", meterNumber: `MTR-ELE-${numericId}-9981`, loadCapacity: "500 KVA High Tension", statusVariant: "success" },
    { serviceType: "Municipal Water Supply", provider: "Metro Water Supply & Sewerage Board", connectionStatus: "Connected & Active", meterNumber: `MTR-WTR-${numericId}-4412`, loadCapacity: "100,000 Litres/Day", statusVariant: "success" },
    { serviceType: "Sewage & Effluent System", provider: "Municipal Corporation Sewerage Division", connectionStatus: "Connected & Certified", meterNumber: `SEW-${numericId}-1102`, loadCapacity: "Grade A Underground Network", statusVariant: "success" },
    { serviceType: "High-Speed Fiber Broadband", provider: "Airtel / Jio Enterprise Fiber Network", connectionStatus: "Active Dual-Path Fiber", meterNumber: `FBR-${numericId}-8810`, loadCapacity: "10 Gbps Redundant Line", statusVariant: "success" },
  ];
};

// Master Indian User Profile
export const getMockUserProfile = () => {
  return {
    name: "Rajesh Sharma",
    email: "rajesh.sharma@apexdiligence.in",
    role: "Senior Diligence Architect & Legal Lead",
    organization: "Apex Due Diligence Advisors India Pvt. Ltd.",
    phone: "+91 98490 12345",
    address: "Plot 45, Sy. No. 112/A, Financial District, Nanakramguda",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    department: "Land Records & Legal Compliance",
    completedReportsCount: 142,
    savedPropertiesCount: 28,
    totalSearchesCount: 1240,
    riskAssessmentsCount: 980,
  };
};
