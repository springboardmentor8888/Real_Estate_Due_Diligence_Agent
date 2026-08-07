// src/routes/bank/loans.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function LoanApplications() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Loan Applications"
        subtitle="Review and manage pending property loan requests."
        actions={<Button className="bg-emerald-600 text-white">+ New Loan Request</Button>}
      />
      
      <div className="space-y-4">
        {/* Example Loan Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">Property #10241 - $750,000</h3>
              <p className="text-sm text-slate-500">123 Main Street, SF</p>
              <div className="flex gap-4 mt-2 text-xs text-slate-400">
                <span>Requested: 2 days ago</span>
                <span>Risk Score: 68</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-green-600 border-green-200"><CheckCircle size={16} className="mr-1"/> Approve</Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200"><XCircle size={16} className="mr-1"/> Reject</Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}