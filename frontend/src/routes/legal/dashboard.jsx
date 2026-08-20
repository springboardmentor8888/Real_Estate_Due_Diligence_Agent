// src/routes/legal/dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { 
  FileCheck, Scale, AlertTriangle, CheckCircle2, 
  Clock, Home, FileText, Search, Settings, TrendingUp, Building2
} from 'lucide-react';
import api, { dashboardService } from '../../services/api';

export default function LegalDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeTransactions: 0,
    pendingReviews: 0,
    reportsGenerated: 0,
    totalDocuments: 0,
    verifiedDocuments: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchLegalStats();
  }, []);

  const fetchLegalStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats('LEGAL_REVIEWER');
      const data = res.data || {};
      setStats({
        totalProperties: data.totalProperties || 0,
        activeTransactions: data.activeTransactions || 0,
        pendingReviews: data.pendingReviews || 0,
        reportsGenerated: data.reportsGenerated || 0,
        totalDocuments: data.totalDocuments || 0,
        verifiedDocuments: data.verifiedDocuments || 0
      });
      setActivities(data.recentActivities || []);
    } catch (error) {
      console.error('Error fetching legal dashboard:', error);
      setStats({
        totalProperties: 0,
        activeTransactions: 0,
        pendingReviews: 0,
        reportsGenerated: 0,
        totalDocuments: 0,
        verifiedDocuments: 0
      });
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'DOCUMENT':
        return (
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
            <FileCheck className="h-3.5 w-3.5" />
          </div>
        );
      case 'REPORT':
        return (
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <FileText className="h-3.5 w-3.5" />
          </div>
        );
      case 'RISK':
        return (
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        );
      case 'PROPERTY':
        return (
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
            <Building2 className="h-3.5 w-3.5" />
          </div>
        );
      default:
        return (
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Legal Reviewer Dashboard" 
        subtitle={`Welcome back, ${user?.fullName || 'Legal Reviewer'}! Here's your workspace overview.`}
        actions={
          <div className="flex gap-3">
            {/* ✅ VERIFY DOCUMENTS - GREEN */}
            <button
              onClick={() => navigate('/legal/documents')}
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
                fontSize: '14px',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              <FileCheck className="h-4 w-4" /> Verify Documents
            </button>

            {/* ✅ REVIEW TRANSACTIONS - BLUE */}
            <Button 
              onClick={() => navigate('/legal/transactions')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25"
            >
              <Scale className="h-4 w-4 mr-2" /> Review Transactions
            </Button>
          </div>
        }
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Properties</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Home className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{stats.totalProperties}</h3>
            <p className="mt-1 text-xs text-slate-500">Total properties</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Transactions</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{stats.activeTransactions}</h3>
            <p className="mt-1 text-xs text-slate-500">In progress</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Reviews</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{stats.pendingReviews}</h3>
            <p className="mt-1 text-xs text-slate-500">Awaiting action</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Reports Generated</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <FileCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{stats.reportsGenerated}</h3>
            <p className="mt-1 text-xs text-slate-500">Total reports</p>
          </div>
        </div>
      </div>

      {/* ACTIVITY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h4>
          <div className="space-y-3">
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
                <p className="text-xs font-medium">No legal document activity recorded yet.</p>
                <p className="text-[10px] text-slate-400 mt-1">Document uploads and compliance reviews will appear here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h4>
          <div className="flex justify-center items-center gap-6 pt-2">
            {/* Search Properties Circle */}
            <button 
              onClick={() => navigate('/properties')}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
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
              <Search className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-medium">Search</span>
            </button>

            {/* View Reports Circle */}
            <button 
              onClick={() => navigate('/reports')}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
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
              <TrendingUp className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-medium">Reports</span>
            </button>

            {/* Settings Circle */}
            <button 
              onClick={() => navigate('/settings')}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
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
              <Settings className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}