import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/app-shell';

// Import Route Components
import Landing from './routes/index';
import Login from './routes/login';
import Register from './routes/register';
import ForgotPassword from './routes/forgot-password';
import ResetPassword from './routes/reset-password';
import VerifyEmail from './routes/verify-email';
import OAuth2Callback from './routes/oauth2-callback';
import SelectRole from './routes/select-role';

import Dashboard from './routes/dashboard';
import Properties from './routes/properties';
import PropertyDetails from './routes/property-details';
import Reports from './routes/reports';
import Analytics from './routes/analytics';
import Comparables from './routes/comparables';
import Watchlist from './routes/watchlist';
import Notifications from './routes/notifications';
import Settings from './routes/settings';
import Profile from './routes/profile';
import UserManagement from './routes/users';
// Agent Routes
import AgentDashboard from './routes/agent/AgentDashboard';
import ListProperty from './routes/agent/ListProperty';
import MyProperties from './routes/agent/MyProperties';
import Inquiries from './routes/agent/Inquiries';

// Bank Routes
import BankDashboard from './routes/bank/dashboard';
import BankLoans from './routes/bank/loans';
import BankRisks from './routes/bank/risks';
import BankReports from './routes/bank/reports';

// Buyer Routes
import BuyerOffers from './routes/buyer/OfferHistory';

// Legal Routes
import LegalDashboard from './routes/legal/dashboard';
import LegalReports from './routes/legal/reports';
import LegalComparables from './routes/legal/comparables';
import LegalPropertySearch from './routes/legal/property-search';
import LegalDocuments from './routes/legal/documents';
import LegalTransactions from './routes/legal/transactions';

// Re-export services for backwards compatibility
export { authService, userService, propertyService, dueDiligenceService, notificationService, dashboardService } from './services/api';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing & Auth Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/oauth2-callback" element={<OAuth2Callback />} />
        <Route path="/select-role" element={<SelectRole />} />

        {/* Protected App Routes wrapped inside AppShell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/comparables" element={<Comparables />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<UserManagement />} />
          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/list-property" element={<ListProperty />} />
          <Route path="/agent/properties" element={<MyProperties />} />
          <Route path="/agent/inquiries" element={<Inquiries />} />

          {/* Bank Routes */}
          <Route path="/bank/dashboard" element={<BankDashboard />} />
          <Route path="/bank/loans" element={<BankLoans />} />
          <Route path="/bank/risks" element={<BankRisks />} />
          <Route path="/bank/reports" element={<BankReports />} />

          {/* Buyer Routes */}
          <Route path="/buyer/offers" element={<BuyerOffers />} />

          {/* Legal Routes */}
          <Route path="/legal/dashboard" element={<LegalDashboard />} />
          <Route path="/legal/reports" element={<LegalReports />} />
          <Route path="/legal/comparables" element={<LegalComparables />} />
          <Route path="/legal/property-search" element={<LegalPropertySearch />} />
          <Route path="/legal/documents" element={<LegalDocuments />} />
          <Route path="/legal/transactions" element={<LegalTransactions />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;