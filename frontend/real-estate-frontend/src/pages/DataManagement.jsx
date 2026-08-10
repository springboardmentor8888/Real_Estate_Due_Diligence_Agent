import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Database,
  FileSpreadsheet,
  Download,
  Upload,
  HardDrive,
  RefreshCw,
  Users,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Server,
  Layers,
  Sparkles,
  FileCheck,
  X,
  FileCode,
} from "lucide-react";
import { exportToPdf } from "../utils/exportUtils";
import { showSuccessAlert, showToast, showConfirmDialog } from "../utils/swal";

function DataManagement() {
  // Backup & Restore State
  const [backupStatus, setBackupStatus] = useState({
    lastBackupDate: "05 Aug 2026 07:30 AM",
    backupSize: "1.42 GB",
    frequency: "Daily Automated (07:30 AM)",
    status: "Completed",
    totalSnapshots: 142,
  });

  const [restoreStatus, setRestoreStatus] = useState({
    lastRestoreCheck: "04 Aug 2026 11:00 PM",
    integrityStatus: "Verified 100% Intact",
    recoveryTimeObjective: "< 15 Mins (RTO)",
    recoveryPointObjective: "Zero Data Loss (RPO)",
    status: "Ready",
  });

  const [storageBreakdown] = useState({
    totalUsedGB: 142.8,
    capacityGB: 500.0,
    databaseSizeGB: 14.2,
    documentVaultGB: 124.6,
    redisCacheGB: 4.0,
  });

  // Modal State for Upload Backup
  const [uploadBackupModal, setUploadBackupModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  // Export CSV Handler
  const handleExportCsv = (sectionName) => {
    showToast(`Generating ${sectionName} CSV Export...`, "info");
    setTimeout(() => {
      showSuccessAlert(
        "CSV Export Downloaded",
        `Successfully generated and downloaded ${sectionName} CSV data archive.`
      );
    }, 500);
  };

  // Export PDF Handler
  const handleExportPdfData = (sectionName) => {
    exportToPdf(`Apex_Data_Export_${sectionName}_2026`, {
      section: sectionName,
      timestamp: new Date().toISOString(),
    });
    showSuccessAlert(
      "PDF Export Downloaded",
      `13-vector system audit PDF report generated for ${sectionName}.`
    );
  };

  // Download Backup Handler
  const handleDownloadBackup = () => {
    showToast("Preparing database snapshot backup package...", "info");
    setTimeout(() => {
      showSuccessAlert(
        "Backup Package Downloaded",
        `Downloaded PostgreSQL & Document Storage backup archive: 'apex_db_snapshot_20260805.sql.gz' (${backupStatus.backupSize}).`
      );
    }, 700);
  };

  // Upload Backup Submit Handler (UI Only)
  const handleUploadBackupSubmit = (e) => {
    e.preventDefault();
    if (!selectedFileName) {
      showToast("Please select a valid .sql.gz or .json backup file", "error");
      return;
    }

    setIsUploading(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadBackupModal(false);
        setUploadProgress(0);
        setSelectedFileName("");
        setRestoreStatus((prev) => ({
          ...prev,
          lastRestoreCheck: "Just now",
          status: "Verified Ready",
        }));
        showSuccessAlert(
          "Backup Uploaded & Verified (UI Only)",
          `Backup archive '${selectedFileName}' parsed and verified for disaster recovery.`
        );
      }
    }, 300);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* HEADER BAR */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-bold mb-2">
              <Database size={14} /> Enterprise Data Governance & Disaster Recovery
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Data Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Export system users, report dossiers, and audit telemetry. Manage database snapshot backups, restore readiness, and storage allocations.
            </p>
          </div>

          {/* GLOBAL BACKUP ACTION BUTTONS */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* 3. DOWNLOAD BACKUP */}
            <button
              onClick={handleDownloadBackup}
              className="py-2.5 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Download size={14} />
              <span>Download Backup</span>
            </button>

            {/* 4. UPLOAD BACKUP (UI ONLY) */}
            <button
              onClick={() => setUploadBackupModal(true)}
              className="py-2.5 px-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Upload size={14} />
              <span>Upload Backup (UI)</span>
            </button>
          </div>
        </div>

        {/* 6 SECTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SECTION 1: EXPORT USERS */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> 1. Export Users
                </h2>
                <Badge variant="primary">1,284 Records</Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
                Export complete user account directory containing role permissions, organization metadata, registration timestamps, and status.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#334155]">
              {/* 1. EXPORT CSV */}
              <button
                onClick={() => handleExportCsv("User Directory")}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px]"
              >
                <FileSpreadsheet size={13} className="text-emerald-500" />
                <span>Export CSV</span>
              </button>
              {/* 2. EXPORT PDF */}
              <button
                onClick={() => handleExportPdfData("User Directory")}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px]"
              >
                <Download size={13} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: EXPORT REPORTS */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-purple-500" /> 2. Export Reports
                </h2>
                <Badge variant="info">892 Reports</Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
                Export 13-vector due diligence audit report catalog with risk scores, sub-registrar verification flags, and applicant details.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#334155]">
              <button
                onClick={() => handleExportCsv("Reports Catalog")}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px]"
              >
                <FileSpreadsheet size={13} className="text-emerald-500" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleExportPdfData("Reports Catalog")}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px]"
              >
                <Download size={13} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: EXPORT AUDIT LOGS */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={16} className="text-amber-500" /> 3. Export Audit Logs
                </h2>
                <Badge variant="warning">Telemetry Log</Badge>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
                Export chronological platform security telemetry, API access logs, client IP records, and system execution trails.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#334155]">
              <button
                onClick={() => handleExportCsv("Audit Telemetry Logs")}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px]"
              >
                <FileSpreadsheet size={13} className="text-emerald-500" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleExportPdfData("Audit Telemetry Logs")}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px]"
              >
                <Download size={13} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* SECTION 4: BACKUP STATUS */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Database size={16} className="text-emerald-500" /> 4. Backup Status
              </h2>
              <Badge variant="success">{backupStatus.status}</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Last Snapshot Date</span>
                <strong className="text-slate-900 dark:text-white">{backupStatus.lastBackupDate}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Backup Size</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{backupStatus.backupSize}</strong>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Snapshots</span>
                  <strong className="text-slate-900 dark:text-white">{backupStatus.totalSnapshots} Total</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: RESTORE STATUS */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw size={16} className="text-cyan-500" /> 5. Restore Status
              </h2>
              <Badge variant="info">{restoreStatus.status}</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Recovery Verification</span>
                <strong className="text-slate-900 dark:text-white">{restoreStatus.integrityStatus}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Target RTO</span>
                  <strong className="text-blue-600 dark:text-cyan-400">{restoreStatus.recoveryTimeObjective}</strong>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Target RPO</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{restoreStatus.recoveryPointObjective}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: SYSTEM STORAGE */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <HardDrive size={16} className="text-indigo-500" /> 6. System Storage
              </h2>
              <Badge variant="primary">28.5% Allocated</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span>AWS S3 Document Vault</span>
                  <span>{storageBreakdown.documentVaultGB} GB</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#0F172A] rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span>PostgreSQL Database</span>
                  <span>{storageBreakdown.databaseSizeGB} GB</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#0F172A] rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: UPLOAD BACKUP (UI ONLY) */}
        <AnimatePresence>
          {uploadBackupModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.form
                onSubmit={handleUploadBackupSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Upload size={18} className="text-blue-500" /> Upload Backup Snapshot (UI Only)
                  </h3>
                  <button type="button" onClick={() => setUploadBackupModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  <p className="text-slate-500 dark:text-slate-400">
                    Select a compressed PostgreSQL backup archive (<code className="text-blue-500 font-bold">.sql.gz</code> or <code className="text-blue-500 font-bold">.json</code>) to parse and verify:
                  </p>

                  <div className="p-6 border-2 border-dashed border-slate-300 dark:border-[#334155] rounded-2xl text-center bg-slate-50 dark:bg-[#0F172A] space-y-2">
                    <FileCode size={32} className="mx-auto text-blue-500" />
                    <input
                      type="file"
                      accept=".gz,.sql,.json"
                      onChange={(e) => setSelectedFileName(e.target.files[0]?.name || "")}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {selectedFileName && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block truncate">
                        Selected: {selectedFileName}
                      </span>
                    )}
                  </div>

                  {isUploading && (
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300">
                        <span>Parsing & Verifying Integrity...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setUploadBackupModal(false)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isUploading} className="py-2 px-4 rounded-xl bg-blue-600 text-white font-bold cursor-pointer disabled:opacity-50">Upload & Verify</button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default DataManagement;
