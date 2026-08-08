// src/routes/legal/reports.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Badge } from '../../components/ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const reports = [
  { id: 1, property: '425 Market Street, SF', type: 'Due Diligence Report', date: '2024-01-15', status: 'Completed', score: 18 },
  { id: 2, property: '1200 Brickell Avenue, Miami', type: 'Risk Assessment', date: '2024-01-12', status: 'In Progress', score: 42 },
  { id: 3, property: '500 W 33rd Street, NY', type: 'Comparables Report', date: '2024-01-10', status: 'Completed', score: 12 },
];

export default function LegalReports() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Due Diligence Reports" 
        subtitle="View and manage all your property reports"
        actions={
          <button className="!bg-emerald-600 hover:!bg-emerald-700 !text-slate-900 font-bold py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/30">
            <FileText className="h-4 w-4 mr-2 inline" /> New Report
          </button>
        }
      />
      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{r.property}</h3>
                <p className="text-sm text-slate-500">{r.type}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.date}</span>
                  <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Risk Score: {r.score}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={r.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}>{r.status}</Badge>
              <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50">View</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}