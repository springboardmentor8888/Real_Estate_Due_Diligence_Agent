/**
 * Live Data Store & Service Engine for Real Estate Due Diligence Agent
 * Provides persistent, reactive, real-time simulated live data updates across all 5 roles.
 * Dispatches 'live_data_updated' events for seamless reactive UI re-renders.
 */

import { MASTER_MOCK_PROPERTIES, UNIQUE_PROPERTY_IMAGES, getPropertyById } from "../data/mockPropertyData";
import { buyerDashboardData } from "../mock/buyerData";
import { agentDashboardData } from "../mock/agentData";
import { legalDashboardData } from "../mock/legalData";
import { financialDashboardData } from "../mock/financialData";
import { adminDashboardData } from "../mock/adminData";

// Storage Keys
const KEYS = {
  PROPERTIES: "live_properties_store",
  SAVED_PROPERTIES: "live_saved_properties_store",
  AGENT_CLIENTS: "live_agent_clients_store",
  AGENT_REQUESTS: "live_agent_requests_store",
  LEGAL_REVIEWS: "live_legal_reviews_store",
  LEGAL_DOCS: "live_legal_docs_store",
  FINANCIAL_LOANS: "live_financial_loans_store",
  AUDIT_LOGS: "live_audit_logs_store",
  NOTIFICATIONS: "live_notifications_store",
  ACTIVE_PROPERTY_ID: "active_property_id",
};

// Helper: Dispatch global live update event
export const notifyLiveUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("live_data_updated"));
    window.dispatchEvent(new Event("storage"));
  }
};

// Helper: Safe LocalStorage JSON parser/getter
const getStored = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) { }
  return fallback;
};

// Helper: Safe LocalStorage JSON setter
const setStored = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyLiveUpdate();
  } catch (e) { }
};

// --- INITIALIZERS ---
export const getLiveProperties = () => {
  return getStored(KEYS.PROPERTIES, MASTER_MOCK_PROPERTIES);
};

export const getLiveSavedProperties = () => {
  return getStored(KEYS.SAVED_PROPERTIES, MASTER_MOCK_PROPERTIES.slice(0, 6));
};

export const getLiveAgentClients = () => {
  return getStored(KEYS.AGENT_CLIENTS, [
    { id: "CLT-101", name: "Adani Realty Institutional Fund", contactPerson: "Rajiv Adani", email: "rajiv@adani.com", phone: "+91 98200 11223", propertiesCount: 4, activeAuditStage: "Final Review", status: "Active" },
    { id: "CLT-102", name: "DLF Cybercity Portfolio", contactPerson: "Vikram Singh", email: "vikram@dlf.in", phone: "+91 98111 44556", propertiesCount: 6, activeAuditStage: "Title Search", status: "Active" },
    { id: "CLT-103", name: "GMR Logistics Infrastructure", contactPerson: "Srinivas GMR", email: "srinivas@gmr.in", phone: "+91 98490 88776", propertiesCount: 2, activeAuditStage: "Environmental NOC", status: "Active" },
    { id: "CLT-104", name: "Prestige Capital Partners", contactPerson: "Meera Prestige", email: "meera@prestige.com", phone: "+91 98800 33445", propertiesCount: 3, activeAuditStage: "Zoning Audit", status: "Active" },
  ]);
};

export const getLiveAgentRequests = () => {
  return getStored(KEYS.AGENT_REQUESTS, agentDashboardData.assignedRequests);
};

export const getLiveLegalReviews = () => {
  return getStored(KEYS.LEGAL_REVIEWS, legalDashboardData.ownershipVerificationList);
};

export const getLiveLegalDocs = () => {
  return getStored(KEYS.LEGAL_DOCS, legalDashboardData.documentReviews);
};

export const getLiveFinancialLoans = () => {
  return getStored(KEYS.FINANCIAL_LOANS, [
    { id: "LOAN-401", borrower: "Cyber Towers Infra Pvt Ltd", property: "Cyber Towers Commercial", amount: "₹ 85.00 Cr", requestedLtv: 65, calculatedRisk: 92, dscr: "2.1x", status: "Sanction Recommended" },
    { id: "LOAN-402", borrower: "Financial District Developers", property: "Financial District Park", amount: "₹ 60.00 Cr", requestedLtv: 55, calculatedRisk: 88, dscr: "1.9x", status: "Sanction Recommended" },
    { id: "LOAN-403", borrower: "Whitefield Horizon Tech Ltd", property: "Whitefield Horizon Campus", amount: "₹ 110.00 Cr", requestedLtv: 70, calculatedRisk: 84, dscr: "1.8x", status: "Underwriting Review" },
  ]);
};

export const getLiveAuditLogs = () => {
  return getStored(KEYS.AUDIT_LOGS, adminDashboardData.auditLogs);
};

export const getLiveNotifications = () => {
  return getStored(KEYS.NOTIFICATIONS, [
    { id: "NOTIF-101", title: "Sub-Registrar Title Deed Verified", message: "Title search completed clear of encumbrances for Cyber Towers.", timestamp: "Just Now", type: "success", read: false },
    { id: "NOTIF-102", title: "Municipal Property Tax Receipt Confirmed", message: "AY 2025-26 tax payment receipts validated with municipal portal.", timestamp: "12 mins ago", type: "info", read: false },
    { id: "NOTIF-103", title: "Mortgage Loan Sanction Issued", message: "₹ 85 Cr commercial mortgage loan sanctioned for Cyber Towers Infra.", timestamp: "45 mins ago", type: "success", read: false },
  ]);
};

// --- ACTIVE PROPERTY CONTEXT SYNCHRONIZER ---
export const getLiveActiveProperty = (idFromUrl) => {
  let targetId = idFromUrl;

  if (!targetId && typeof window !== "undefined") {
    targetId = localStorage.getItem(KEYS.ACTIVE_PROPERTY_ID);
  }

  const rawStr = (targetId || "1").toString();
  const cleanNumeric = parseInt(rawStr.replace(/\D/g, "") || "1", 10);

  const allProps = getLiveProperties();
  const found = allProps.find(
    (p) =>
      p.propertyId === cleanNumeric ||
      p.numericId === cleanNumeric ||
      p.id === targetId ||
      p.id === `PROP-HYD-${String(cleanNumeric).padStart(3, "0")}` ||
      p.id === `PR-${cleanNumeric}`
  );

  if (found) {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.ACTIVE_PROPERTY_ID, String(cleanNumeric));
    }
    return found;
  }

  // Active Backend Property Fallback (for numeric IDs like 1, 2, etc. fetched from backend API)
  const activeObj = {
    propertyId: cleanNumeric,
    numericId: cleanNumeric,
    propertyCode: `PROP-HYD-${String(cleanNumeric).padStart(3, "0")}`,
    id: `PROP-HYD-${String(cleanNumeric).padStart(3, "0")}`,
    propertyName: "Gachibowli Luxury Villa",
    title: "Gachibowli Luxury Villa",
    address: "Plot 45, Sy. No. 112/A, Financial District, Gachibowli, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    type: "Villa",
    propertyType: "Villa",
    marketValue: 42500000,
    riskScore: 14,
    riskLevel: "Low Risk",
    status: "VERIFIED",
    builtYear: 2022,
    totalArea: "45,000 sq ft",
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.ACTIVE_PROPERTY_ID, String(cleanNumeric));
  }

  return activeObj;
};

export const setLiveActiveProperty = (propertyOrId) => {
  if (!propertyOrId) return;
  const id = typeof propertyOrId === "object" ? (propertyOrId.propertyId || propertyOrId.numericId || propertyOrId.id) : propertyOrId;
  const cleanNumeric = typeof id === "number" ? id : parseInt((id || "1").toString().replace(/\D/g, "") || "1", 10);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.ACTIVE_PROPERTY_ID, String(cleanNumeric));
    notifyLiveUpdate();
  }
};

// --- ACTIONS & MUTATORS ---

// Add a property to main properties & notify
export const addLiveProperty = (propertyData) => {
  const current = getLiveProperties();
  const newProp = {
    numericId: 1000 + current.length + 1,
    propertyId: 1000 + current.length + 1,
    id: `PR-${1000 + current.length + 1}`,
    propertyName: propertyData.propertyName || "New Property Parcel",
    title: propertyData.propertyName || "New Property Parcel",
    owner: propertyData.clientName || propertyData.owner || "Enterprise Portfolio",
    clientName: propertyData.clientName || propertyData.owner || "Enterprise Portfolio",
    address: propertyData.address || `${propertyData.propertyName}, ${propertyData.city || "Hyderabad"}`,
    city: propertyData.city || "Hyderabad",
    state: "Telangana",
    type: propertyData.type || "Commercial",
    landType: propertyData.type || "Commercial",
    price: propertyData.price || "₹ 85,00,00,000",
    riskScore: 18,
    riskLevel: "Low Risk",
    imageUrl: UNIQUE_PROPERTY_IMAGES[current.length % UNIQUE_PROPERTY_IMAGES.length],
    image: UNIQUE_PROPERTY_IMAGES[current.length % UNIQUE_PROPERTY_IMAGES.length],
  };

  const updatedProps = [newProp, ...current];
  setStored(KEYS.PROPERTIES, updatedProps);
  setLiveActiveProperty(newProp.numericId);

  // Auto-log audit event
  addLiveAuditEvent({
    user: getUserNameFromStorage(),
    action: `Registered New Property Parcel: ${newProp.propertyName}`,
    module: "PROPERTY",
  });

  // Auto-push notification
  addLiveNotification({
    title: `New Property Registered: ${newProp.propertyName}`,
    message: `Property parcel registered under ${newProp.clientName} in ${newProp.city}.`,
    type: "info",
  });

  return newProp;
};

// Toggle Save / Unsave Property
export const toggleSaveProperty = (property) => {
  const saved = getLiveSavedProperties();
  const pid = property.numericId || property.id;
  const exists = saved.some((p) => p.numericId === pid || p.id === pid);

  let updated;
  if (exists) {
    updated = saved.filter((p) => p.numericId !== pid && p.id !== pid);
  } else {
    updated = [property, ...saved];
  }
  setStored(KEYS.SAVED_PROPERTIES, updated);
  return !exists;
};

// Check if Property is Saved
export const isPropertySaved = (targetId) => {
  const saved = getLiveSavedProperties();
  if (!targetId) return false;
  const cleanId = targetId.toString().replace(/\D/g, "");
  return saved.some(
    (p) =>
      p.numericId === targetId ||
      p.propertyId === targetId ||
      p.id === targetId ||
      (cleanId && (p.numericId?.toString() === cleanId || p.propertyId?.toString() === cleanId))
  );
};

// Add Client Request
export const addLiveAgentRequest = (requestData) => {
  const current = getLiveAgentRequests();
  const created = {
    id: `REQ-${900 + current.length + 1}`,
    client: requestData.client,
    property: requestData.property,
    requestType: requestData.requestType,
    priority: requestData.priority || "HIGH",
    dueDate: requestData.dueDate || "15 Aug 2026",
    status: "In Review",
  };
  setStored(KEYS.AGENT_REQUESTS, [created, ...current]);

  addLiveAuditEvent({
    user: getUserNameFromStorage(),
    action: `Created Due Diligence Request: ${created.requestType}`,
    module: "REPORTS",
  });

  return created;
};

// Update Legal Review Verdict
export const updateLegalReviewVerdict = (reviewId, verdict) => {
  const current = getLiveLegalReviews();
  const updated = current.map((r) =>
    r.id === reviewId ? { ...r, legalVerdict: verdict, statusVariant: "success" } : r
  );
  setStored(KEYS.LEGAL_REVIEWS, updated);

  addLiveAuditEvent({
    user: getUserNameFromStorage(),
    action: `Sealed Legal Approval for ${reviewId}`,
    module: "LEGAL",
  });
};

// Update Loan Application Status
export const updateLoanStatus = (loanId, status) => {
  const current = getLiveFinancialLoans();
  const updated = current.map((l) =>
    l.id === loanId ? { ...l, status } : l
  );
  setStored(KEYS.FINANCIAL_LOANS, updated);

  addLiveAuditEvent({
    user: getUserNameFromStorage(),
    action: `Issued Loan Sanction Letter for ${loanId}`,
    module: "FINANCIAL",
  });
};

// Add Audit Event Log
export const addLiveAuditEvent = ({ user, action, module }) => {
  const logs = getLiveAuditLogs();
  const newLog = {
    id: `LOG-${9900 + logs.length + 1}`,
    user: user || getUserNameFromStorage(),
    action,
    module: module || "SYSTEM",
    timestamp: "Just Now",
    status: "SUCCESS",
  };
  setStored(KEYS.AUDIT_LOGS, [newLog, ...logs]);
};

// Add Live Notification
export const addLiveNotification = ({ title, message, type = "info" }) => {
  const notifs = getLiveNotifications();
  const newNotif = {
    id: `NOTIF-${100 + notifs.length + 1}`,
    title,
    message,
    timestamp: "Just Now",
    type,
    read: false,
  };
  setStored(KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
};

// Helper: Get user name from local storage
const getUserNameFromStorage = () => {
  try {
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);
      return u.firstName ? `${u.firstName} ${u.lastName || ""}`.trim() : u.name || "Rama Charan";
    }
  } catch (e) { }
  return "Rama Charan";
};

// --- LIVE HEARTBEAT TELEMETRY SIMULATOR ---
let heartbeatStarted = false;
export const startLiveHeartbeat = () => {
  if (heartbeatStarted || typeof window !== "undefined") return;
  heartbeatStarted = true;

  const mockEvents = [
    { title: "Automated Title Search Completed", message: "Sub-Registrar deed query verified clear for PR-1003.", module: "PROPERTY", type: "success" },
    { title: "Municipal Tax Receipt Revalidated", message: "GHMC Hyderabad tax challan verified AY 2025-26.", module: "TAX", type: "info" },
    { title: "Zoning FAR Permission Verified", message: "3.5 FAR commercial zoning permission validated.", module: "ZONING", type: "success" },
    { title: "Environmental NOC Clearance Sealed", message: "State Pollution Control Board Phase I clearance issued.", module: "ENVIRONMENTAL", type: "success" },
  ];

  let idx = 0;
  setInterval(() => {
    const ev = mockEvents[idx % mockEvents.length];
    idx++;

    // Push live event
    addLiveAuditEvent({
      user: "System AI Engine",
      action: ev.title,
      module: ev.module,
    });

    addLiveNotification({
      title: ev.title,
      message: ev.message,
      type: ev.type,
    });
  }, 25000);
};

// Auto-start heartbeat on import
startLiveHeartbeat();
