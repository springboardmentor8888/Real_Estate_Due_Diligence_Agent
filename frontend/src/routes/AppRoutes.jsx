import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard"; // Added AdminDashboard import
import SearchProperty from "../pages/SearchProperty";
import PropertyDetails from "../pages/PropertyDetails";
import PropertyHistory from "../pages/PropertyHistory";
import Layout from "../components/common/Layout";
import SavedProperties from "../pages/SavedProperties";
import PropertyComparison from "../pages/PropertyComparison";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Main App Routes with Shared Navbar/Sidebar Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Milestone 3 Admin & Analytics Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/analytics" element={<Analytics />} />

        <Route path="/search-property" element={<SearchProperty />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        <Route path="/property-history" element={<PropertyHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/saved-properties" element={<SavedProperties />} />
        <Route path="/property-comparison" element={<PropertyComparison />} />
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

// Temporary Placeholder Components (We will move these to separate page files as we build them)
function Analytics() {
  return <h1 className="text-3xl font-bold p-6">Analytics Dashboard</h1>;
}

function Reports() {
  return <h1 className="text-3xl font-bold p-6">My Reports</h1>;
}

function Alerts() {
  return <h1 className="text-3xl font-bold p-6">Alerts & Notifications</h1>;
}

function AuditLogs() {
  return <h1 className="text-3xl font-bold p-6">Audit Logs</h1>;
}

function Settings() {
  return <h1 className="text-3xl font-bold p-6">Settings</h1>;
}

function Help() {
  return <h1 className="text-3xl font-bold p-6">Help & Support</h1>;
}