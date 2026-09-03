// src/routes/reports.jsx
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/app-shell';
import { Badge } from '../components/ui/badge';
import { FileText, Download, Eye, Clock, CheckCircle, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { dueDiligenceService } from '../services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dueDiligenceService.getReports();
      const list = Array.isArray(res.data) ? res.data : [];
      setReports(list);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReports([]);
      setError(err.response?.data?.message || 'Reports could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED' || status === 'GENERATED') {
      return <Badge className="bg-emerald-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
    } else if (status === 'IN_PROGRESS' || status === 'PENDING') {
      return <Badge className="bg-amber-500 text-white"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
    }
    return <Badge variant="outline">{status || 'Draft'}</Badge>;
  };

  const formatDate = (dStr) => {
    if (!dStr) return 'Recent';
    try {
      return new Date(dStr).toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />{error}</span><button type="button" onClick={fetchReports} className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium"><RefreshCw className="h-4 w-4" /> Retry</button></div>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Due Diligence Reports" 
        subtitle={`Total reports generated: ${reports.length}`}
        actions={
          <button
            onClick={() => window.location.href = '/properties'}
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
            <Plus className="h-4 w-4" />
            Generate from Property
          </button>
        }
      />

      <div className="space-y-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.reportId || report.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{report.reportName || report.propertyName || 'Due Diligence Report'}</h3>
                  <p className="text-sm text-slate-500">{report.propertyName ? `Property: ${report.propertyName}` : (report.executiveSummary || 'Real estate risk analysis')}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">{formatDate(report.generatedAt || report.createdAt)}</span>
                    {getStatusBadge(report.reportStatus || report.status)}
                    {report.overallRiskScore !== undefined && report.overallRiskScore !== null && (
                      <Badge variant="outline" className="text-xs bg-slate-100">
                        Risk Score: {report.overallRiskScore}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <button 
                  onClick={() => report.propertyId && (window.location.href = `/properties/${report.propertyId}`)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {reports.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800">No reports generated yet</h3>
            <p className="text-slate-500 mt-1">Select a property to generate its first due diligence report.</p>
          </div>
        )}
      </div>
    </>
  );
}