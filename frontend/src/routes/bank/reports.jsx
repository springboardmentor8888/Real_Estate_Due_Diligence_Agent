// src/routes/bank/reports.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { FileText, Download, Calendar, DollarSign } from 'lucide-react';

export default function BankFinancialReports() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Financial Reports" 
        subtitle="View and manage compliance and financial documents."
        actions={<Button className="bg-emerald-600 text-white"><Download className="mr-2 h-4 w-4" /> Export All</Button>}
      />
      
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Q3 Risk Assessment Report</h4>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Oct 2024</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> $2.4M Portfolio</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-slate-200"><Download className="mr-2 h-3 w-3" /> PDF</Button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Loan Performance Summary</h4>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Sep 2024</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> 12 Active Loans</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-slate-200"><Download className="mr-2 h-3 w-3" /> PDF</Button>
        </div>
      </div>
    </motion.div>
  );
}