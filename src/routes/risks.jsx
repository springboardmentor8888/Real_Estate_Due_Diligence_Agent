// src/routes/bank/risks.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export default function RiskAssessments() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Risk Assessments"
        subtitle="Evaluate the financial and structural risks of loan properties."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between">
            <h3 className="font-bold">123 Main Street</h3>
            <Badge className="bg-amber-500">Medium Risk</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-2">Flood Zone X, Clean Title, Cap Rate 5.8%</p>
          <div className="mt-4 text-xs flex gap-4">
            <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> LTV: 72%</span>
            <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={14}/> DCR: 1.2</span>
          </div>
        </div>
        {/* Add more risk assessment cards here */}
      </div>
    </motion.div>
  );
}