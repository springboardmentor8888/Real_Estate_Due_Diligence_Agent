import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Badge } from '../../components/ui/badge';
import { FileText, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { dueDiligenceService, triggerBlobDownload } from '../../services/api';

export default function LegalReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dueDiligenceService.getReports();
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      console.error('Error fetching legal reports:', requestError);
      setReports([]);
      setError(requestError.response?.data?.message || 'Reports could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Due Diligence Reports" subtitle="Reports currently stored in the application database" />
      {loading && <p className="py-12 text-center text-slate-500">Loading reports...</p>}
      {!loading && error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <span className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />{error}</span>
          <button type="button" onClick={fetchReports} className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}
      {!loading && !error && reports.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-500">No due-diligence reports are available for this account.</div>
      )}
      {!loading && !error && reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.reportId || report.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
              <div className="flex gap-4">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-600"><FileText className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-semibold text-slate-900">{report.reportName || 'Due Diligence Report'}</h3>
                  <p className="text-sm text-slate-500">{report.propertyName || report.executiveSummary || 'Property report'}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : 'Date unavailable'}</span>
                    {report.overallRiskScore != null && <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" />Risk Score: {report.overallRiskScore}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={report.reportStatus === 'COMPLETED' || report.reportStatus === 'GENERATED' ? 'bg-emerald-500' : 'bg-amber-500'}>{report.reportStatus || 'UNKNOWN'}</Badge>

                <button
                  onClick={async () => {
                    try {
                      const res = await dueDiligenceService.downloadPdf(report.reportId || report.id);
                      triggerBlobDownload(res.data, `Due_Diligence_Report_${report.reportId || report.id}.pdf`);
                    } catch {
                      alert('Unable to download PDF report.');
                    }
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                  title="Download PDF"
                >
                  PDF
                </button>

                <button
                  onClick={async () => {
                    try {
                      const res = await dueDiligenceService.downloadExcel(report.reportId || report.id);
                      triggerBlobDownload(res.data, `Due_Diligence_Report_${report.reportId || report.id}.xlsx`);
                    } catch {
                      alert('Unable to download Excel report.');
                    }
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                  title="Download Excel"
                >
                  Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
