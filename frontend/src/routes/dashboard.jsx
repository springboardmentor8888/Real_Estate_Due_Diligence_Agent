// src/routes/dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, ShieldCheck, FileText, Zap, TrendingUp, 
  AlertTriangle, CheckCircle2, Clock, PlusCircle, 
  Home, Briefcase, Scale, Landmark, Search, Users,
  Eye, FileCheck, DollarSign, Bell, ArrowRight, CheckCircle,
  ExternalLink, BarChart3, ShieldAlert
} from 'lucide-react';
import api, { dashboardService } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeTransactions: 0,
    pendingReviews: 0,
    reportsGenerated: 0,
    watchlistCount: 0,
    unreadNotificationsCount: 0
  });
  const [activities, setActivities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [offers, setOffers] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [reports, setReports] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [riskOverview, setRiskOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const role = (userData.role || '').toUpperCase();
    setUser(userData);

    // Auto-redirect role to its dedicated dashboard path if accessed via generic /dashboard
    if (role === 'AGENT') {
      navigate('/agent/dashboard', { replace: true });
      return;
    }
    if (role === 'LEGAL_REVIEWER') {
      navigate('/legal/dashboard', { replace: true });
      return;
    }
    if (role === 'BANK') {
      navigate('/bank/dashboard', { replace: true });
      return;
    }

    fetchDashboardData(role || 'BUYER');
  }, [navigate]);

  const fetchDashboardData = async (role) => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getStats(role);
      const data = res.data || {};
      setStats({
        totalProperties: data.totalProperties || 0,
        activeTransactions: data.activeTransactions || 0,
        pendingReviews: data.pendingReviews || 0,
        reportsGenerated: data.reportsGenerated || 0,
        watchlistCount: data.watchlistCount || 0,
        unreadNotificationsCount: data.unreadNotificationsCount || 0
      });
      setActivities(data.recentActivities || []);
      setProperties(data.properties || []);
      setOffers(data.offers || []);
      setWatchlist(data.watchlist || []);
      setReports(data.reports || []);
      setPendingReviews(data.pendingReviewItems || []);
      setRiskOverview(data.riskOverview || null);
      setAnalytics(data.analytics || null);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Error fetching dashboard stats from backend:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch dashboard data';
      setError(`API Error (${err.config?.url || '/api/dashboard/stats'}): ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch(role?.toUpperCase()) {
      case 'BUYER': return <Home className="h-6 w-6" />;
      case 'AGENT': return <Briefcase className="h-6 w-6" />;
      case 'SELLER': return <Building2 className="h-6 w-6" />;
      case 'LEGAL_REVIEWER': return <Scale className="h-6 w-6" />;
      case 'BANK': return <Landmark className="h-6 w-6" />;
      default: return <Building2 className="h-6 w-6" />;
    }
  };

  const getRoleActions = (role) => {
    switch(role?.toUpperCase()) {
      case 'BUYER':
        return {
          primary: { label: 'Search Properties', icon: Search, path: '/properties' },
          secondary: { label: 'View Watchlist', icon: Eye, path: '/watchlist' },
          tertiary: { label: 'My Offers', icon: DollarSign, path: '/buyer/offers' }
        };
      case 'AGENT':
        return {
          primary: { label: 'List Property', icon: PlusCircle, path: '/agent/list-property' },
          secondary: { label: 'View Listings', icon: FileText, path: '/agent/properties' }
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
      case 'SELLER':
        return {
          primary: { label: 'My Listings', icon: Building2, path: '/agent/properties' },
          secondary: { label: 'Inquiries', icon: Eye, path: '/agent/inquiries' }
        };
      default:
        return {
          primary: { label: 'Dashboard', icon: Building2, path: '/dashboard' },
          secondary: { label: 'Settings', icon: Building2, path: '/settings' }
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
      case 'BUYER': return 'Buyer Intelligence Dashboard';
      case 'SELLER': return 'Seller Dashboard';
      case 'AGENT': return 'Agent Dashboard';
      case 'LEGAL_REVIEWER': return 'Legal Reviewer Dashboard';
      case 'BANK': return 'Lender Dashboard';
      default: return 'Workspace Overview';
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'OFFER':
        return (
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
            <DollarSign className="h-3.5 w-3.5" />
          </div>
        );
      case 'WATCHLIST':
        return (
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <Eye className="h-3.5 w-3.5" />
          </div>
        );
      case 'PROPERTY':
      case 'LISTING':
        return (
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">
            <Building2 className="h-3.5 w-3.5" />
          </div>
        );
      case 'REPORT':
        return (
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600">
            <FileText className="h-3.5 w-3.5" />
          </div>
        );
      case 'RISK':
        return (
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        );
      case 'DOCUMENT':
        return (
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
            <FileCheck className="h-3.5 w-3.5" />
          </div>
        );
      case 'NOTIFICATION':
      default:
        return (
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return '$' + Number(amount).toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'ACCEPTED':
      case 'VERIFIED':
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
      case 'UNDER_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED':
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{getRoleTitle(user?.role)}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Live PostgreSQL Data
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.fullName || 'User'}! Here is your live due diligence & property portfolio overview.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {actions?.primary && (
            <button
              onClick={() => actions.primary.path && navigate(actions.primary.path)}
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
                const Icon = actions.primary.icon || Building2;
                return <Icon className="h-4 w-4" />;
              })()}
              {actions.primary.label}
            </button>
          )}

          {actions?.secondary && (
            <button
              onClick={() => actions.secondary.path && navigate(actions.secondary.path)}
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
                const Icon = actions.secondary.icon || Building2;
                return <Icon className="h-4 w-4" />;
              })()}
              {actions.secondary.label}
            </button>
          )}

          {actions?.tertiary && (
            <button
              onClick={() => actions.tertiary.path && navigate(actions.tertiary.path)}
              style={{
                backgroundColor: '#6366f1',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
            >
              {(() => {
                const Icon = actions.tertiary.icon || Building2;
                return <Icon className="h-4 w-4" />;
              })()}
              {actions.tertiary.label}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button 
            onClick={() => fetchDashboardData(user?.role || 'BUYER')}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/properties')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Available Properties</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              {getRoleIcon(user?.role)}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.totalProperties || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-500">Total properties in database</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/buyer/offers')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Transactions</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.activeTransactions || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{offers.length} offers submitted by you</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/watchlist')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Watchlist & Reviews</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Eye className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.watchlistCount || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{stats.pendingReviews || 0} items pending review</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/reports')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Reports Generated</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <FileCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.reportsGenerated || 0}
            </h3>
            <p className="mt-1 text-xs text-slate-500">Due diligence audits completed</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side (Transactions + Reports + Watchlist), Right side (Risk Overview + Activity + Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Offers / Transactions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Active Transactions & Offers</h3>
                <p className="text-xs text-slate-500">Real-time offers submitted from your account</p>
              </div>
              <button 
                onClick={() => navigate('/buyer/offers')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View All ({offers.length}) <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {offers.length > 0 ? (
              <div className="space-y-3">
                {offers.slice(0, 4).map((offer) => (
                  <div 
                    key={offer.id}
                    onClick={() => offer.property?.id && navigate(`/properties/${offer.property.id}`)}
                    className="p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-slate-50/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{offer.property?.address || 'Property Offer'}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>Offer Amount: <strong className="text-emerald-600">{formatCurrency(offer.amount)}</strong></span>
                          {offer.property?.price && <span>| List: {formatCurrency(offer.property.price)}</span>}
                          <span>| {offer.timeAgo || 'Recently'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(offer.status)}`}>
                        {offer.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                <DollarSign className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No active offers submitted yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Explore available properties and submit an offer to track it here.</p>
                <button 
                  onClick={() => navigate('/properties')}
                  className="mt-3 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Explore Properties
                </button>
              </div>
            )}
          </div>

          {/* Due Diligence Reports Ready */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Due Diligence Reports</h3>
                <p className="text-xs text-slate-500">Comprehensive legal, financial, and environmental audits</p>
              </div>
              <button 
                onClick={() => navigate('/reports')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                View All ({reports.length}) <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.slice(0, 4).map((rep) => (
                  <div 
                    key={rep.id}
                    className="p-4 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{rep.reportName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{rep.propertyAddress || 'Property Audit'}</p>
                        {rep.executiveSummary && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{rep.executiveSummary}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {rep.overallRiskScore != null && (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-800">
                          Risk: {rep.overallRiskScore}/100
                        </span>
                      )}
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(rep.reportStatus)}`}>
                        {rep.reportStatus || 'COMPLETED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No due diligence reports generated yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Initiate a due diligence audit from any property details page.</p>
              </div>
            )}
          </div>

          {/* Saved Watchlist Properties */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Saved Properties (Watchlist)</h3>
                <p className="text-xs text-slate-500">Properties you are tracking for price and status changes</p>
              </div>
              <button 
                onClick={() => navigate('/watchlist')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Manage Watchlist ({watchlist.length}) <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {watchlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {watchlist.slice(0, 4).map((w) => (
                  <div 
                    key={w.id}
                    onClick={() => w.propertyId && navigate(`/properties/${w.propertyId}`)}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{w.propertyName || w.address}</span>
                      <span className="text-xs font-extrabold text-blue-600">{formatCurrency(w.price)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">{w.address}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span>Status: {w.status || 'AVAILABLE'}</span>
                      <span className="text-blue-600 font-semibold flex items-center gap-0.5">View <ExternalLink className="h-2.5 w-2.5" /></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <Eye className="h-7 w-7 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-600">Your watchlist is empty.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click the bookmark icon on any property to save it here.</p>
              </div>
            )}
          </div>

          {/* Recent Properties from PostgreSQL */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Properties in Database</h3>
                <p className="text-xs text-slate-500">Latest listings retrieved live from PostgreSQL</p>
              </div>
              <button 
                onClick={() => navigate('/properties')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Browse All ({properties.length}) <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {properties.length > 0 ? (
              <div className="space-y-3">
                {properties.slice(0, 4).map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => navigate(`/properties/${p.id}`)}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-slate-50/50 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-xs">{p.title || p.address}</span>
                          {p.code && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">{p.code}</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-slate-900">{formatCurrency(p.price)}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getStatusBadgeClass(p.status)}`}>
                        {p.status || 'AVAILABLE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <Building2 className="h-7 w-7 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-600">No properties available in database.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Properties added to the system will automatically appear here.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Risk Overview + Recent Activity + Database Analytics) */}
        <div className="space-y-6">

          {/* Risk Overview Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Due Diligence Risk Index</h3>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>

            {riskOverview && riskOverview.totalAssessments > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">Avg Portfolio Risk Score</span>
                    <span className="text-xl font-extrabold text-slate-900">{riskOverview.averageRiskScore} / 100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Assessments</span>
                    <span className="text-sm font-bold text-emerald-600">{riskOverview.totalAssessments} Audited</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="block font-bold text-base">{riskOverview.lowRiskCount || 0}</span>
                    <span className="text-[10px]">Low Risk</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                    <span className="block font-bold text-base">{riskOverview.mediumRiskCount || 0}</span>
                    <span className="text-[10px]">Moderate</span>
                  </div>
                  <div className="p-2 rounded-lg bg-red-50 text-red-700 border border-red-100">
                    <span className="block font-bold text-base">{riskOverview.highRiskCount || 0}</span>
                    <span className="text-[10px]">High Alerts</span>
                  </div>
                </div>

                {riskOverview.categoryScores && Object.keys(riskOverview.categoryScores).length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 block">Category Breakdown</span>
                    {Object.entries(riskOverview.categoryScores).map(([cat, score]) => (
                      <div key={cat} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{cat}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full ${Number(score) > 60 ? 'bg-red-500' : Number(score) > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(100, Number(score))}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-800 w-6 text-right">{score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <ShieldCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Risk profile is clean.</p>
                <p className="text-[10px] text-slate-400 mt-1">Assessments will appear once property reviews are completed.</p>
              </div>
            )}
          </div>

          {/* Live Recent Activity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Live Activity Feed</h3>
              <Clock className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {activities.length > 0 ? (
                activities.map((item, idx) => (
                  <div key={item.id || idx} className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    {getActivityIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-[11.5px] truncate">
                        {item.title}
                      </div>
                      <div className="text-slate-500 text-[10.5px] truncate">
                        {item.description}
                      </div>
                      <span className="text-[9px] text-slate-400">{item.timeAgo}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">No recent activity recorded yet.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Your actions in the system will automatically stream here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Database Analytics */}
          {analytics && (
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Market Analytics</h3>
                <BarChart3 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Average Property Price</span>
                  <span className="font-bold text-slate-800">{formatCurrency(analytics.averageMarketValue)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Total Market Value</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(analytics.totalMarketValue)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Total System Reports</span>
                  <span className="font-semibold text-slate-800">{analytics.totalReports || 0}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Active Due Diligence Checks</span>
                  <span className="font-semibold text-slate-800">{analytics.totalRiskAssessments || 0}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

