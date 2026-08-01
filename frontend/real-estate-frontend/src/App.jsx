import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import PropertySearch from "./pages/PropertySearch";
import PropertyDetails from "./pages/PropertyDetails";
import Ownership from "./pages/Ownership";
import TaxHistory from "./pages/TaxHistory";
import Zoning from "./pages/Zoning";
import FloodZone from "./pages/FloodZone";
import Environmental from "./pages/Environmental";
import PermitRecords from "./pages/PermitRecords";
import Utilities from "./pages/Utilities";
import Profile from "./pages/Profile";

// Milestone 3 Pages
import RiskAssessment from "./pages/RiskAssessment";
import ComparableProperties from "./pages/ComparableProperties";
import DueDiligenceReport from "./pages/DueDiligenceReport";
import NotificationCenter from "./pages/NotificationCenter";
import ReportHistory from "./pages/ReportHistory";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Diligence & Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property-search"
        element={
          <ProtectedRoute>
            <PropertySearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property-details"
        element={
          <ProtectedRoute>
            <PropertyDetails />
          </ProtectedRoute>
        }
      />

      {/* Milestone 3 Feature Routes */}
      <Route
        path="/risk-assessment"
        element={
          <ProtectedRoute>
            <RiskAssessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/comparable-properties"
        element={
          <ProtectedRoute>
            <ComparableProperties />
          </ProtectedRoute>
        }
      />
      <Route
        path="/due-diligence-report"
        element={
          <ProtectedRoute>
            <DueDiligenceReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-history"
        element={
          <ProtectedRoute>
            <ReportHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Milestone 2 Views */}
      <Route
        path="/ownership"
        element={
          <ProtectedRoute>
            <Ownership />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tax-history"
        element={
          <ProtectedRoute>
            <TaxHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/zoning"
        element={
          <ProtectedRoute>
            <Zoning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flood-zone"
        element={
          <ProtectedRoute>
            <FloodZone />
          </ProtectedRoute>
        }
      />
      <Route
        path="/environmental"
        element={
          <ProtectedRoute>
            <Environmental />
          </ProtectedRoute>
        }
      />
      <Route
        path="/permit-records"
        element={
          <ProtectedRoute>
            <PermitRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/utilities"
        element={
          <ProtectedRoute>
            <Utilities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;