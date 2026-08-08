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
            
            {/* Button 1 */}
            <Button 
              onClick={() => navigate('/bank/loans')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 transform hover:scale-105"
            >
              <DollarSign className="mr-2 h-4 w-4" /> Review Loans
            </Button>

            {/* Button 2 */}
            <Button 
              onClick={() => navigate('/bank/reports')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 transform hover:scale-105"
            >
              <Clock className="mr-2 h-4 w-4" /> Transaction History
            </Button>
            
          </div>
        }
      />

      {/* KPI Cards - Adding animation & depth */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        
        {/* Card 1 */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Loans</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 animate-pulse">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800">0</h3>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">Loans in portfolio</p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Loans</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 animate-pulse">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800">0</h3>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">Awaiting approval</p>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Risk Assessments</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 animate-pulse">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800">0</h3>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">Properties under review</p>
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Financial Reports</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 animate-pulse">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800">0</h3>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">Compliance documents</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Sections */}
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
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-center group"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 mx-auto w-fit group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-slate-700 mt-2">Review Loans</p>
            </button>
            <button 
              onClick={() => navigate('/bank/risks')}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-center group"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 mx-auto w-fit group-hover:scale-110 transition-transform">
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