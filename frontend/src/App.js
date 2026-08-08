// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import LandingPage from './routes/index';
import Dashboard from './routes/dashboard';
import LoginPage from './routes/login';
import RegisterPage from './routes/register';
import SelectRole from './routes/select-role';
import PropertiesPage from './routes/properties';
import PropertyDetails from './routes/property-details';
import ReportsPage from './routes/reports';
import AnalyticsPage from './routes/analytics';
import ComparablesPage from './routes/comparables';
import WatchlistPage from './routes/watchlist';
import NotificationsPage from './routes/notifications';
import ProfilePage from './routes/profile';
import SettingsPage from './routes/settings';
import AdminPage from './routes/admin';
import UserManagement from './routes/users'; // ✅ Manual retype ensures it works
import ForgotPage from './routes/forgot-password';
import ResetPage from './routes/reset-password';
import VerifyEmail from './routes/verify-email';
import OAuth2Callback from './routes/oauth2-callback';

// Agent Routes
import AgentListProperty from './routes/agent/ListProperty';
import AgentMyProperties from './routes/agent/MyProperties';
import AgentInquiries from './routes/agent/Inquiries';
import AgentDashboard from './routes/agent/AgentDashboard';

// Buyer Routes
import BuyerOfferHistory from './routes/buyer/OfferHistory';

// Bank Routes
import BankDashboard from './routes/bank/dashboard';
import LoanApplications from './routes/bank/loans';
import RiskAssessments from './routes/bank/risks';
import BankFinancialReports from './routes/bank/reports';

// Legal Routes
import LegalDashboard from './routes/legal/dashboard';
import LegalReports from './routes/legal/reports';
import LegalComparables from './routes/legal/comparables';
import LegalPropertySearch from './routes/legal/property-search';
import VerifyDocuments from './routes/legal/documents';
import ReviewTransactions from './routes/legal/transactions';

// ✅ FIXED: Importing AppShell and renaming it to Layout
import { AppShell as Layout } from './components/app-shell';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userData.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/oauth2/redirect" element={<OAuth2Callback />} />
            <Route path="/forgot-password" element={<ForgotPage />} />
            <Route path="/reset-password" element={<ResetPage />} />

            {/* General Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><Layout><PropertiesPage /></Layout></ProtectedRoute>} />
            <Route path="/properties/:id" element={<ProtectedRoute><Layout><PropertyDetails /></Layout></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
            <Route path="/comparables" element={<ProtectedRoute><Layout><ComparablesPage /></Layout></ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute><Layout><WatchlistPage /></Layout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationsPage /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
            
            {/* ✅ Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><Layout><AdminPage /></Layout></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><Layout><UserManagement /></Layout></ProtectedRoute>} />

            {/* Agent Routes */}
            <Route path="/agent/dashboard" element={<ProtectedRoute requiredRole="AGENT"><Layout><AgentDashboard /></Layout></ProtectedRoute>} />
            <Route path="/agent/list-property" element={<ProtectedRoute requiredRole="AGENT"><Layout><AgentListProperty /></Layout></ProtectedRoute>} />
            <Route path="/agent/properties" element={<ProtectedRoute requiredRole="AGENT"><Layout><AgentMyProperties /></Layout></ProtectedRoute>} />
            <Route path="/agent/inquiries" element={<ProtectedRoute requiredRole="AGENT"><Layout><AgentInquiries /></Layout></ProtectedRoute>} />

            {/* Buyer Routes */}
            <Route path="/buyer/offers" element={<ProtectedRoute requiredRole="BUYER"><Layout><BuyerOfferHistory /></Layout></ProtectedRoute>} />

            {/* Bank Routes */}
            <Route path="/bank/dashboard" element={<ProtectedRoute requiredRole="BANK"><Layout><BankDashboard /></Layout></ProtectedRoute>} />
            <Route path="/bank/loans" element={<ProtectedRoute requiredRole="BANK"><Layout><LoanApplications /></Layout></ProtectedRoute>} />
            <Route path="/bank/risks" element={<ProtectedRoute requiredRole="BANK"><Layout><RiskAssessments /></Layout></ProtectedRoute>} />
            <Route path="/bank/reports" element={<ProtectedRoute requiredRole="BANK"><Layout><BankFinancialReports /></Layout></ProtectedRoute>} />

            {/* Legal Routes */}
            <Route path="/legal/dashboard" element={<ProtectedRoute requiredRole="LEGAL_REVIEWER"><Layout><LegalDashboard /></Layout></ProtectedRoute>} />
            <Route path="/legal/reports" element={<ProtectedRoute requiredRole="LEGAL_REVIEWER"><Layout><LegalReports /></Layout></ProtectedRoute>} />
            <Route path="/legal/comparables" element={<ProtectedRoute requiredRole="LEGAL_REVIEWER"><Layout><LegalComparables /></Layout></ProtectedRoute>} />
            <Route path="/legal/property-search" element={<ProtectedRoute requiredRole="LEGAL_REVIEWER"><Layout><LegalPropertySearch /></Layout></ProtectedRoute>} />
            <Route path="/legal/documents" element={<ProtectedRoute requiredRole="LEGAL_REVIEWER"><Layout><VerifyDocuments /></Layout></ProtectedRoute>} />
            <Route path="/legal/transactions" element={<ProtectedRoute requiredRole="LEGAL_REVIEWER"><Layout><ReviewTransactions /></Layout></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;