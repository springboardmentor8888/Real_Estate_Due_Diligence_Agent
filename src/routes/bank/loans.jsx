// src/routes/bank/dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { 
  Landmark, FileText, Clock, ShieldCheck, AlertTriangle, 
  CheckCircle2, DollarSign, TrendingUp, Users
} from 'lucide-react';

export default function BankDashboard() {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Lender Dashboard" 
        subtitle="Welcome back, Archana Pakhale! Here's your workspace overview."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            
            {/* ✅ 1. REVIEW LOANS - EMERALD GREEN */}
            <button
              onClick={() => navigate('/bank/loans')}
              style={{
                backgroundColor: '#09ba7f',
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
              <DollarSign className="h-4 w-4" /> Review Loans
            </button>

            {/* ✅ 2. TRANSACTION HISTORY - ROYAL BLUE */}
            <button
              onClick={() => navigate('/bank/reports')}
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
              <Clock className="h-4 w-4" /> Transaction History
            </button>
            
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Loans</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Landmark className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
            <p className="mt-1 text-xs text-slate-500">Loans in portfolio</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Loans</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
            <p className="mt-1 text-xs text-slate-500">Awaiting approval</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Risk Assessments</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
            <p className="mt-1 text-xs text-slate-500">Properties under review</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Financial Reports</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
            <p className="mt-1 text-xs text-slate-500">Compliance documents</p>
          </div>
        </div>
      </div>

      {/* Activity & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">Loan Application Received</div>
                <div className="text-slate-500 text-[10.5px]">Property #10241 - $750k</div>
                <span className="text-[9px] text-slate-400">2 minutes ago</span>
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">Risk Flag Detected</div>
                <div className="text-slate-500 text-[10.5px]">High risk on pending loan</div>
                <span className="text-[9px] text-slate-400">1 hour ago</span>
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">Financial Report Generated</div>
                <div className="text-slate-500 text-[10.5px]">Q3 Risk Assessment #123</div>
                <span className="text-[9px] text-slate-400">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/bank/loans')}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-center"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 mx-auto w-fit">
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-slate-700 mt-2">Review Loans</p>
            </button>
            <button 
              onClick={() => navigate('/bank/risks')}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-center"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 mx-auto w-fit">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-slate-700 mt-2">Risk Assessments</p>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}