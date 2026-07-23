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

function App() {
  return (
    <Routes>

      {/* Authentication */}

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Milestone 2 */}

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/property-search"
        element={<PropertySearch />}
      />

      <Route
        path="/property-details"
        element={<PropertyDetails />}
      />

      <Route
        path="/ownership"
        element={<Ownership />}
      />

      <Route
        path="/tax-history"
        element={<TaxHistory />}
      />

      <Route
        path="/zoning"
        element={<Zoning />}
      />

      <Route
        path="/flood-zone"
        element={<FloodZone />}
      />

      <Route
        path="/environmental"
        element={<Environmental />}
      />

      <Route
        path="/permit-records"
        element={<PermitRecords />}
      />

      <Route
        path="/utilities"
        element={<Utilities />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

    </Routes>
  );
}

export default App;