// src/routes/bank/reports.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { FileText, Download, Calendar, DollarSign, Eye, CheckCircle2 } from 'lucide-react';
import { dueDiligenceService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function BankFinancialReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await dueDiligenceService.getReports();
      const list = Array.isArray(res.data) ? res.data : [];
      setReports(list);
    } catch (err) {
      console.error('Error fetching bank reports:', err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      return new Date(dateStr).toLocaleDateString();
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Financial & Due Diligence Reports" 
        subtitle="Compliance audits, risk reviews, and underwriting documentation from PostgreSQL"
        actions={
          <Button 
            onClick={() => navigate('/properties')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <FileText className="mr-2 h-4 w-4" /> Browse Properties
          </Button>
        }
      />
      
      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div 
              key={report.reportId || report.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start gap-4 w-full md:w-auto flex-1">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-base">{report.reportName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{report.executiveSummary || 'Compliance and due diligence assessment'}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(report.generatedAt || report.createdAt)}
                    </span>
                    {report.overallRiskScore != null && (
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        Risk Score: {report.overallRiskScore}/100
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      {report.reportStatus || 'COMPLETED'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                {report.propertyId && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/properties/${report.propertyId}`)}
                    className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> View Property
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No financial reports found in database</h3>
            <p className="text-xs text-slate-500 mt-1">Due diligence and underwriting reports generated will appear here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}