import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import SearchProperty from "../pages/SearchProperty";
import AddProperty from "../pages/AddProperty"; // 📸 Imported AddProperty page
import PropertyDetails from "../pages/PropertyDetails";
import PropertyHistory from "../pages/PropertyHistory";
import Layout from "../components/common/Layout";
import SavedProperties from "../pages/SavedProperties";
import PropertyComparison from "../pages/PropertyComparison";
import RiskAssessment from "../pages/RiskAssessment";
import ComparableAnalysis from "../pages/ComparableAnalysis";
import DueDiligenceReport from "../pages/DueDiligenceReport";
import AuditLogs from "../pages/AuditLogs";
import Analytics from "../pages/Analytics";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Alerts from "../pages/Alerts";
import OAuth2Success from "../components/auth/OAuth2Success";

function AppRouter() {
  // Define Role Groups for Route Guards (Supports standard and Spring Boot "ROLE_" formats)
  const PRO_ROLES = [
    "REAL_ESTATE_AGENT",
    "LEGAL_REVIEWER",
    "FINANCIAL_INSTITUTION",
    "ADMIN",
    "ROLE_REAL_ESTATE_AGENT",
    "ROLE_LEGAL_REVIEWER",
    "ROLE_FINANCIAL_INSTITUTION",
    "ROLE_ADMIN",
  ];

  // 👔 Posting Roles: Restricted to Agents and Admins
  const AGENT_ROLES = [
    "REAL_ESTATE_AGENT",
    "ADMIN",
    "ROLE_REAL_ESTATE_AGENT",
    "ROLE_ADMIN",
  ];

  const ADMIN_ROLES = ["ADMIN", "ROLE_ADMIN"];

  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/success" element={<OAuth2Success />} />

      {/* 🔒 PROTECTED APP ROUTES (Requires Valid JWT Token) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 🛡️ Protected Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={ADMIN_ROLES} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
          </Route>

          {/* 👔 Protected Agent/Admin Only Routes (Property Posting) */}
          <Route element={<ProtectedRoute allowedRoles={AGENT_ROLES} />}>
            <Route path="/add-property" element={<AddProperty />} />
          </Route>

          {/* ⚖️ Protected Pro-Tier Tools (Restricted from Standard BUYER role) */}
          <Route element={<ProtectedRoute allowedRoles={PRO_ROLES} />}>
            <Route path="/property-comparison" element={<PropertyComparison />} />
            <Route
              path="/property-comparison/:propertyId"
              element={<PropertyComparison />}
            />
            <Route
              path="/property-comparison/:propertyId/:compareId"
              element={<PropertyComparison />}
            />
            <Route path="/comparable-analysis" element={<ComparableAnalysis />} />
            <Route
              path="/comparable-analysis/:propertyId"
              element={<ComparableAnalysis />}
            />
          </Route>

          {/* 🌐 Common Routes (Accessible to All Authenticated Roles) */}
          <Route path="/search-property" element={<SearchProperty />} />
          <Route path="/property-details" element={<PropertyDetails />} />
          <Route
            path="/property-details/:propertyId"
            element={<PropertyDetails />}
          />
          <Route path="/property-history" element={<PropertyHistory />} />
          <Route
            path="/property-history/:propertyId"
            element={<PropertyHistory />}
          />
          <Route path="/reports" element={<DueDiligenceReport />} />
          <Route path="/reports/:propertyId" element={<DueDiligenceReport />} />
          <Route path="/saved-properties" element={<SavedProperties />} />
          <Route
            path="/risk-assessment/:propertyId"
            element={<RiskAssessment />}
          />

          {/* System Alerts & Notifications */}
          <Route path="/alerts" element={<Alerts />} />

          {/* Miscellaneous */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;

// Temporary Placeholder Components
function Settings() {
  return <h1 className="text-3xl font-bold p-6">Settings</h1>;
}

function Help() {
  return <h1 className="text-3xl font-bold p-6">Help & Support</h1>;
}