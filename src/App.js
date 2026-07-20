import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LandingPage from './routes/index';
import Dashboard from './routes/dashboard';
import LoginPage from './routes/login';
import RegisterPage from './routes/register';
import SelectRole from './routes/select-role';
import OAuth2Callback from './routes/oauth2-callback';
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
import ForgotPage from './routes/forgot-password';
import ResetPage from './routes/reset-password';
import VerifyEmail from './routes/verify-email';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/properties/PROP-10294" replace />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
           <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/oauth2/redirect" element={<OAuth2Callback />} />
          <Route path="/forgot-password" element={<ForgotPage />} />
          <Route path="/reset-password" element={<ResetPage />} />
          <Route path="/properties" element={<Navigate to="/properties/PROP-10294" replace />} />
          <Route path="/properties/search" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/comparables" element={<ComparablesPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;