import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";

import Dashboard from "../pages/Dashboard";
import SearchProperty from "../pages/SearchProperty";
import PropertyDetails from "../pages/PropertyDetails";
import PropertyHistory from "../pages/PropertyHistory";
import Layout from "../components/common/Layout";
import SavedProperties from "../pages/SavedProperties";
import PropertyComparison from "../pages/PropertyComparison";
import RiskAssessment from "../pages/RiskAssessment";
import ComparableAnalysis from "../pages/ComparableAnalysis";
import DueDiligenceReport from "../pages/DueDiligenceReport";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search-property" element={<SearchProperty />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        <Route path="/property-details/:propertyId" element={<PropertyDetails />} />
        <Route path="/property-history" element={<PropertyHistory />} />
        <Route path="/property-history/:propertyId" element={<PropertyHistory />} />
        <Route path="/reports" element={<DueDiligenceReport />} />
        <Route path="/reports/:propertyId" element={<DueDiligenceReport />} />
        <Route path="/saved-properties" element={<SavedProperties />} />
        <Route path="/property-comparison" element={<PropertyComparison />} />
        <Route path="/property-comparison/:propertyId" element={<PropertyComparison />} />
        <Route path="/property-comparison/:propertyId/:compareId" element={<PropertyComparison />} />
        <Route path="/risk-assessment/:propertyId" element={<RiskAssessment />} />
        <Route path="/comparable-analysis" element={<ComparableAnalysis />} />
        <Route path="/comparable-analysis/:propertyId" element={<ComparableAnalysis />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;

function Alerts() {
  return <h1 className="text-3xl font-bold">Alerts & Notifications</h1>;
}

function AuditLogs() {
  return <h1 className="text-3xl font-bold">Audit Logs</h1>;
}

function Settings() {
  return <h1 className="text-3xl font-bold">Settings</h1>;
}

function Help() {
  return <h1 className="text-3xl font-bold">Help & Support</h1>;
}
