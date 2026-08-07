// src/routes/dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, ShieldCheck, FileText, Zap, TrendingUp, 
  AlertTriangle, CheckCircle2, Clock, PlusCircle, 
  Home, Briefcase, Scale, Landmark, Search, Users,
  Eye, FileCheck, DollarSign
} from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    if (userData.role) {
      fetchDashboardData(userData.role);
    }
  }, []);

  const fetchDashboardData = async (role) => {
    try {
      setLoading(true);
      const response = await api.get(`/${role.toLowerCase()}/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        totalProperties: 0,
        activeTransactions: 0,
        pendingReviews: 0,
        reportsGenerated: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch(role?.toUpperCase()) {
      case 'BUYER': return <Home className="h-6 w-6" />;
      case 'AGENT': return <Briefcase className="h-6 w-6" />;
      case 'LEGAL_REVIEWER': return <Scale className="h-6 w-6" />;
      case 'BANK': return <Landmark className="h-6 w-6" />;
      case 'ADMIN': return <ShieldCheck className="h-6 w-6" />;
      default: return <Building2 className="h-6 w-6" />;
    }
  };

  const getRoleActions = (role) => {
    switch(role?.toUpperCase()) {
      case 'BUYER':
        return {
          primary: { label: 'Search Properties', icon: Search, path: '/properties' },
          secondary: { label: 'View Watchlist', icon: Eye, path: '/watchlist' }
        };
      case 'AGENT':
        return {
          primary: { label: 'List Property', icon: PlusCircle, path: '/properties/new' },
          secondary: { label: 'View Listings', icon: FileText, path: '/properties' }
        };
      case 'LEGAL_REVIEWER':
        return {
          primary: { label: 'Verify Documents', icon: FileCheck, path: '/legal/documents' },
          secondary: { label: 'Review Transactions', icon: Scale, path: '/legal/transactions' }
        };
      case 'BANK':
        return {
          primary: { label: 'Review Loans', icon: DollarSign, path: '/bank/loans' },
          secondary: { label: 'Transaction History', icon: Clock, path: '/bank/reports' }
        };
      case 'ADMIN':
        return {
          primary: { label: 'Manage Users', icon: Users, path: '/admin' },
          secondary: { label: 'Analytics', icon: TrendingUp, path: '/analytics' }
        };
      default:
        return {
          primary: { label: 'Dashboard', icon: Building2, path: '/dashboard' },
          secondary: { label: 'Settings', icon: ShieldCheck, path: '/settings' }
        };
    }
  };

  const actions = getRoleActions(user?.role);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const getRoleTitle = (role) => {
    switch(role?.toUpperCase()) {
      case 'BUYER': return 'Buyer Dashboard';
      case 'AGENT': return 'Agent Dashboard';
      case 'LEGAL_REVIEWER': return 'Legal Reviewer Dashboard';
      case 'BANK': return 'Lender Dashboard';
      case 'ADMIN': return 'Admin Dashboard';
      default: return 'Workspace Overview';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{getRoleTitle(user?.role)}</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.fullName || 'User'}! Here's your workspace overview.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* ✅ CRASH-PROOF BUTTON 1 */}
          <button
            onClick={() => navigate(actions.primary.path)}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            {(() => {
              const Icon = actions.primary.icon;
              return <Icon className="h-4 w-4" />;
            })()}
            {actions.primary.label}
          </button>

          {/* ✅ CRASH-PROOF BUTTON 2 */}
          <button
            onClick={() => navigate(actions.secondary.path)}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            {(() => {
              const Icon = actions.secondary.icon;
              return <Icon className="h-4 w-4" />;
            })()}
            {actions.secondary.label}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {user?.role === 'BANK' ? 'Active Loans' : 'Properties'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              {getRoleIcon(user?.role)}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.totalProperties || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {user?.role === 'BANK' ? 'Loans in portfolio' : 'Total properties'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {user?.role === 'BANK' ? 'Pending Loans' : 'Active Transactions'}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.activeTransactions || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {user?.role === 'BANK' ? 'Awaiting approval' : 'In progress'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {user?.role === 'BANK' ? 'Risk Assessments' : 'Pending Reviews'}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.pendingReviews || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {user?.role === 'BANK' ? 'Properties under review' : 'Awaiting action'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {user?.role === 'BANK' ? 'Financial Reports' : 'Reports Generated'}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <FileCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.reportsGenerated || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {user?.role === 'BANK' ? 'Compliance documents' : 'Total reports'}
            </p>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">
                  {user?.role === 'BANK' ? 'Loan Application Received' : 'Property Viewed'}
                </div>
                <div className="text-slate-500 text-[10.5px]">
                  {user?.role === 'BANK' ? 'Property #10241 - $750k' : '123 Main Street'}
                </div>
                <span className="text-[9px] text-slate-400">2 minutes ago</span>
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">
                  {user?.role === 'BANK' ? 'Risk Flag Detected' : 'Risk Alert'}
                </div>
                <div className="text-slate-500 text-[10.5px]">
                  {user?.role === 'BANK' ? 'High risk on pending loan' : 'New lien detected on property'}
                </div>
                <span className="text-[9px] text-slate-400">1 hour ago</span>
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">
                  {user?.role === 'BANK' ? 'Financial Report Generated' : 'Report Generated'}
                </div>
                <div className="text-slate-500 text-[10.5px]">
                  {user?.role === 'BANK' ? 'Q3 Risk Assessment #123' : 'Due Diligence Report #1234'}
                </div>
                <span className="text-[9px] text-slate-400">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate(actions.primary.path)}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                padding: '16px 0',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e2e8f0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            >
              {(() => {
                const Icon = actions.primary.icon;
                return <Icon className="h-5 w-5" />;
              })()}
              <p className="text-xs font-medium text-slate-700 mt-2">{actions.primary.label}</p>
            </button>
            <button 
              onClick={() => navigate(actions.secondary.path)}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                padding: '16px 0',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e2e8f0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            >
              {(() => {
                const Icon = actions.secondary.icon;
                return <Icon className="h-5 w-5" />;
              })()}
              <p className="text-xs font-medium text-slate-700 mt-2">{actions.secondary.label}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}