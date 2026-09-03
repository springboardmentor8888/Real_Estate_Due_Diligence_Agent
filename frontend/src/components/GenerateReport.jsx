import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  ArrowRight,
  Calendar,
  ShieldCheck,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dueDiligenceService, triggerBlobDownload } from '../services/api';

export default function GenerateReport({ propertyId, propertyDetails }) {
  const defaultTitle = propertyDetails?.propertyName
    ? `${propertyDetails.propertyName} Due Diligence Report`
    : `Property #${propertyId} Due Diligence Report`;

  const [existingReports, setExistingReports] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [reportName, setReportName] = useState(defaultTitle);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [justGeneratedReport, setJustGeneratedReport] = useState(null);
  const [error, setError] = useState(null);

  const fetchExistingReports = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoadingExisting(true);
      const res = await dueDiligenceService.getReportsByProperty(propertyId);
      const list = Array.isArray(res.data) ? res.data : [];
      setExistingReports(list);
    } catch (err) {
      console.error('Failed to fetch existing reports for property:', err);
      setExistingReports([]);
    } finally {
      setLoadingExisting(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchExistingReports();
  }, [fetchExistingReports]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!reportName.trim()) return;

    setGenerating(true);
    setError(null);

    try {
      const payload = {
        propertyId: Number(propertyId),
        reportName: reportName.trim(),
        executiveSummary: executiveSummary.trim() || undefined,
        reportStatus: 'COMPLETED',
      };

      const res = await dueDiligenceService.createReport(payload);
      setJustGeneratedReport(res.data);
      // Refresh list so it immediately appears in the generated reports table
      await fetchExistingReports();
    } catch (err) {
      console.error('Failed to generate report:', err);
      let errorMsg = 'Failed to generate report. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async (reportId) => {
    const actionKey = `pdf-${reportId || 'prop'}`;
    setDownloadingId(actionKey);
    try {
      let res;
      if (reportId) {
        res = await dueDiligenceService.downloadPdf(reportId);
      } else {
        res = await dueDiligenceService.downloadPropertyPdf(propertyId);
      }
      triggerBlobDownload(
        res.data,
        reportId ? `Due_Diligence_Report_${reportId}.pdf` : `Property_${propertyId}_Due_Diligence.pdf`,
        'application/pdf'
      );
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Unable to download PDF report. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadExcel = async (reportId) => {
    const actionKey = `excel-${reportId || 'prop'}`;
    setDownloadingId(actionKey);
    try {
      let res;
      if (reportId) {
        res = await dueDiligenceService.downloadExcel(reportId);
      } else {
        res = await dueDiligenceService.downloadPropertyExcel(propertyId);
      }
      triggerBlobDownload(
        res.data,
        reportId ? `Due_Diligence_Report_${reportId}.xlsx` : `Property_${propertyId}_Due_Diligence.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    } catch (err) {
      console.error('Failed to download Excel:', err);
      alert('Unable to download Excel report. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return 'Recent';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* SECTION 1: Persisted Reports in PostgreSQL for this property */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Generated Due Diligence Reports for this Property
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Official audit documents saved in PostgreSQL database for Property #{propertyId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {existingReports.length} {existingReports.length === 1 ? 'Report' : 'Reports'} Available
            </span>
            <button
              type="button"
              onClick={fetchExistingReports}
              disabled={loadingExisting}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              title="Refresh reports"
            >
              <RefreshCw className={`h-4 w-4 ${loadingExisting ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          {loadingExisting ? (
            <div className="flex items-center justify-center py-10 text-slate-500 text-sm gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              Loading property reports from database...
            </div>
          ) : existingReports.length > 0 ? (
            <div className="space-y-3">
              {existingReports.map((report) => {
                const repId = report.reportId || report.id;
                const isPdfDownloading = downloadingId === `pdf-${repId}`;
                const isExcelDownloading = downloadingId === `excel-${repId}`;

                return (
                  <div
                    key={repId}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">
                            {report.reportName || `Due Diligence Report #${repId}`}
                          </h4>
                          <span className="font-mono text-xs text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded">
                            #{repId}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            {report.reportStatus || 'COMPLETED'}
                          </span>
                          {report.overallRiskScore != null && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Risk Score: {report.overallRiskScore}/100
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {report.executiveSummary || 'Official due diligence investigation with title, tax, environmental, and valuation audits.'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(report.generatedAt || report.createdAt)}
                          </span>
                          {report.generatedByUserEmail && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <UserCheck className="h-3 w-3 text-emerald-600" />
                              {report.generatedByUserEmail}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(repId)}
                        disabled={isPdfDownloading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50 transition"
                      >
                        {isPdfDownloading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        Download PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadExcel(repId)}
                        disabled={isExcelDownloading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 shadow-sm disabled:opacity-50 transition"
                      >
                        {isExcelDownloading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        Download Excel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">No reports generated for this property yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Fill out the form below to generate and persist an official due diligence report in PostgreSQL.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Generate New Report Form */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-500/5 p-6 shadow-sm">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-emerald-600" />
              Generate New Due Diligence Report
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Aggregates property specifications, legal title, tax records, zoning, FEMA hazard zones, risk scores, and comparables into a signed audit.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Audit Ready
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {justGeneratedReport && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-emerald-900">
                    Report Successfully Created & Persisted (ID: #{justGeneratedReport.reportId})
                  </h4>
                  <p className="mt-0.5 text-xs text-emerald-700">
                    Status: <span className="font-semibold">{justGeneratedReport.reportStatus}</span> &bull; Overall Risk Score: <span className="font-semibold">{justGeneratedReport.overallRiskScore || 'N/A'}/100</span>.
                    The report has been added to the list above and to the global Reports dashboard.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(justGeneratedReport.reportId)}
                      disabled={downloadingId === `pdf-${justGeneratedReport.reportId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF Now
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadExcel(justGeneratedReport.reportId)}
                      disabled={downloadingId === `excel-${justGeneratedReport.reportId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" /> Download Excel Now
                    </button>
                    <Link
                      to="/reports"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
                    >
                      View All Reports <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="reportName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Report Title
            </label>
            <input
              id="reportName"
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Commercial Due Diligence Audit"
            />
          </div>

          <div>
            <label htmlFor="executiveSummary" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Executive Summary / Assessor Comments (Optional)
            </label>
            <textarea
              id="executiveSummary"
              rows={3}
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter key observations, title verification notes, or physical condition assessment..."
            />
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700">Audit Content Compiled From PostgreSQL:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-500 pt-1">
              <div>&bull; Physical specs & parcel identifier</div>
              <div>&bull; Title status & deed records</div>
              <div>&bull; Tax history & payment compliance</div>
              <div>&bull; FEMA flood & zoning classification</div>
              <div>&bull; Multi-factor risk categories</div>
              <div>&bull; Market comparables & valuation</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {generating ? 'Compiling & Persisting Report...' : 'Generate & Save Report'}
            </button>

            <button
              type="button"
              onClick={() => handleDownloadPdf(null)}
              disabled={downloadingId === 'pdf-prop'}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              {downloadingId === 'pdf-prop' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 text-slate-500" />}
              Direct Property PDF
            </button>

            <button
              type="button"
              onClick={() => handleDownloadExcel(null)}
              disabled={downloadingId === 'excel-prop'}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              {downloadingId === 'excel-prop' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 text-emerald-600" />}
              Direct Property Excel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
