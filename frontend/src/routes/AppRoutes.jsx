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
import AddProperty from "../pages/AddProperty";
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

  const AGENT_ROLES = [
    "REAL_ESTATE_AGENT",
    "ADMIN",
    "ROLE_REAL_ESTATE_AGENT",
    "ROLE_ADMIN",
  ];

  const ADMIN_ROLES = [
    "ADMIN",
    "ROLE_ADMIN",
  ];

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/oauth2/success"
        element={<OAuth2Success />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={ADMIN_ROLES}
              />
            }
          >
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/audit-logs"
              element={<AuditLogs />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={AGENT_ROLES}
              />
            }
          >
            <Route
              path="/add-property"
              element={<AddProperty />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={PRO_ROLES}
              />
            }
          >
            <Route
              path="/property-comparison"
              element={<PropertyComparison />}
            />

            <Route
              path="/property-comparison/:propertyId"
              element={<PropertyComparison />}
            />

            <Route
              path="/property-comparison/:propertyId/:compareId"
              element={<PropertyComparison />}
            />

            <Route
              path="/comparable-analysis"
              element={<ComparableAnalysis />}
            />

            <Route
              path="/comparable-analysis/:propertyId"
              element={<ComparableAnalysis />}
            />
          </Route>

          <Route
            path="/search-property"
            element={<SearchProperty />}
          />

          <Route
            path="/property-details"
            element={<PropertyDetails />}
          />

          <Route
            path="/property-details/:propertyId"
            element={<PropertyDetails />}
          />

          <Route
            path="/property-history"
            element={<PropertyHistory />}
          />

          <Route
            path="/property-history/:propertyId"
            element={<PropertyHistory />}
          />

          <Route
            path="/reports"
            element={
              <Navigate
                to="/reports/1"
                replace
              />
            }
          />

          <Route
            path="/reports/:propertyId"
            element={<DueDiligenceReport />}
          />

          <Route
            path="/saved-properties"
            element={<SavedProperties />}
          />

          <Route
            path="/risk-assessment/:propertyId"
            element={<RiskAssessment />}
          />

          <Route
            path="/alerts"
            element={<Alerts />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/help"
            element={<Help />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default AppRouter;

function Settings() {
  return (
    <div>Settings</div>
  );
}

function Help() {
  return (
    <div>Help & Support</div>
  );
}