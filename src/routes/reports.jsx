// src/routes/reports.jsx
import React, { useState } from 'react';
import { PageHeader } from '../components/app-shell';
import { Badge } from '../components/ui/badge';
import { FileText, Download, Eye, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const [reports] = useState([
    {
      id: 1,
      property: '425 Market Street, SF',
      type: 'Due Diligence Report',
      date: '2024-01-15',
      status: 'Completed',
      riskScore: 18,
    },
    {
      id: 2,
      property: '1200 Brickell Avenue, Miami',
      type: 'Risk Assessment',
      date: '2024-01-12',
      status: 'In Progress',
      riskScore: 42,
    },
    {
      id: 3,
      property: '500 W 33rd Street, NY',
      type: 'Comparables Report',
      date: '2024-01-10',
      status: 'Completed',
      riskScore: 12,
    },
  ]);

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return <Badge className="bg-emerald-500"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
    } else if (status === 'In Progress') {
      return <Badge className="bg-amber-500"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <>
      <PageHeader 
        title="Due Diligence Reports" 
        subtitle="View and manage all your property reports"
        actions={
          // ✅ GUARANTEED GREEN BUTTON
          <button
            onClick={() => alert('New Report workflow clicked!')}
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
            <FileText className="h-4 w-4" />
            New Report
          </button>
        }
      />

      <div className="space-y-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{report.property}</h3>
                  <p className="text-sm text-slate-500">{report.type}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">{report.date}</span>
                    {getStatusBadge(report.status)}
                    <Badge variant="outline" className="text-xs bg-slate-100">
                      Risk Score: {report.riskScore}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Eye className="h-4 w-4" /> View
                </button>
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Download className="h-4 w-4" /> PDF
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}