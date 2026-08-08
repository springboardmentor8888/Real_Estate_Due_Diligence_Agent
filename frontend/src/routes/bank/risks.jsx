// src/routes/bank/risks.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Badge } from '../../components/ui/badge';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RiskAssessments() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Risk Assessments" 
        subtitle="Analyze property and loan risks."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900">123 Main Street</h3>
              <p className="text-sm text-slate-500 mt-1">San Francisco, CA</p>
            </div>
            <Badge className="bg-amber-500 text-white">Medium Risk</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-green-50 text-green-700 flex items-center gap-1"><CheckCircle size={14}/> Flood Zone: X</div>
            <div className="p-2 rounded-lg bg-green-50 text-green-700 flex items-center gap-1"><CheckCircle size={14}/> Title: Clear</div>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
            <span>Loan Amount: $750,000</span>
            <span className="font-medium text-slate-700">Risk Score: 68</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-900">456 Oak Avenue</h3>
              <p className="text-sm text-slate-500 mt-1">Los Angeles, CA</p>
            </div>
            <Badge className="bg-emerald-500 text-white">Low Risk</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-green-50 text-green-700 flex items-center gap-1"><CheckCircle size={14}/> Zoning: Commercial</div>
            <div className="p-2 rounded-lg bg-green-50 text-green-700 flex items-center gap-1"><CheckCircle size={14}/> Environmental: Clean</div>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
            <span>Loan Amount: $1,200,000</span>
            <span className="font-medium text-slate-700">Risk Score: 22</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}