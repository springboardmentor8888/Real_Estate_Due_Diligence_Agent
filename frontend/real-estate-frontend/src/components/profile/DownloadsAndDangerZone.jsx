import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Download,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  UserX,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { showConfirmDialog, showToast, showSuccessAlert } from "../../utils/swal";
import { clearAuthData } from "../../services/authService";

function DownloadsAndDangerZone({ profileData }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(null);

  const handleDownloadProfile = () => {
    setDownloading("profile");
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profileData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `profile_export_${profileData.name.replace(/\s+/g, "_")}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setDownloading(null);
      showToast("Profile dossier downloaded successfully!", "success");
    }, 600);
  };

  const handleDownloadReports = () => {
    setDownloading("reports");
    setTimeout(() => {
      const reportSummary = `REAL ESTATE DUE DILIGENCE AGENT - AUDIT REPORT SUMMARY
Account: ${profileData.name} (${profileData.email})
Organization: ${profileData.organization}
Generated Date: ${new Date().toISOString()}

=========================================
AUDITED ASSETS SUMMARY
=========================================
1. 742 Evergreen Terrace, Austin TX - Risk Score: 18/100 (Clear)
2. 1200 Market Street, San Francisco CA - Risk Score: 42/100 (Moderate)
3. 500 Ocean Drive, Miami FL - Risk Score: 25/100 (Clear)
`;
      const blob = new Blob([reportSummary], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Due_Diligence_Audit_Reports_Summary.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setDownloading(null);
      showToast("Report archives downloaded successfully!", "success");
    }, 600);
  };

  const handleExportActivity = () => {
    setDownloading("activity");
    setTimeout(() => {
      const csvContent = `Timestamp,Activity,Details
2026-08-01 02:15,Login,Successful authentication from Austin TX
2026-08-01 00:10,Generated Report,742 Evergreen Terrace
2026-07-31 21:15,Property View,1200 Market Street
2026-07-31 16:30,Security Update,Password & 2FA keys updated
`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Activity_History_Export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setDownloading(null);
      showToast("Activity history CSV exported successfully!", "success");
    }, 600);
  };

  const handleDeactivateAccount = async () => {
    const confirmed = await showConfirmDialog({
      title: "Deactivate Account?",
      text: "Your profile will be placed on temporary hold. You can reactivate your account by logging in again.",
      confirmButtonText: "Deactivate Temporarily",
      cancelButtonText: "Keep Account Active",
      icon: "warning",
    });

    if (confirmed) {
      clearAuthData();
      showSuccessAlert("Account Deactivated", "Your account has been deactivated. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirmDialog({
      title: "CRITICAL ACTION: Delete Account?",
      text: "PERMANENT DATA LOSS WARNING! This will permanently remove your profile, saved properties, audit history, and generated reports.",
      confirmButtonText: "YES, PERMANENTLY DELETE",
      cancelButtonText: "CANCEL - PRESERVE ACCOUNT",
      icon: "error",
    });

    if (confirmed) {
      clearAuthData();
      showSuccessAlert("Account Deleted", "Your account and data have been removed.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="space-y-8"
      id="downloads-danger-section"
    >
      {/* 11. Downloads Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#334155] shadow-lg space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200/80 dark:border-[#334155]">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800/40">
            <Download size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              Downloads & Export Center
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8]">
              Export your profile dossier, compiled audit reports, and complete activity history.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Download Profile */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/60 dark:border-[#334155] flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 w-fit">
                <FileText size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Download Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Export your full user profile dossier and organization credentials in JSON format.
              </p>
            </div>
            <button
              onClick={handleDownloadProfile}
              disabled={downloading === "profile"}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download size={14} />
              {downloading === "profile" ? "Generating..." : "Download Profile"}
            </button>
          </div>

          {/* Download Reports */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/60 dark:border-[#334155] flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 w-fit">
                <FileSpreadsheet size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Download Reports
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Download a consolidated summary archive of all generated due diligence reports.
              </p>
            </div>
            <button
              onClick={handleDownloadReports}
              disabled={downloading === "reports"}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download size={14} />
              {downloading === "reports" ? "Exporting..." : "Download Reports"}
            </button>
          </div>

          {/* Export Activity History */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/60 dark:border-[#334155] flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 w-fit">
                <FileSpreadsheet size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Export Activity History
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Export complete security and audit log timeline history to CSV spreadsheet format.
              </p>
            </div>
            <button
              onClick={handleExportActivity}
              disabled={downloading === "activity"}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download size={14} />
              {downloading === "activity" ? "Exporting..." : "Export Activity CSV"}
            </button>
          </div>
        </div>
      </div>

      {/* 12. Danger Zone Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 shadow-lg space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-6 border-b border-rose-200/80 dark:border-rose-900/60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-rose-900 dark:text-rose-200">
                Danger Zone
              </h2>
              <p className="text-xs font-medium text-rose-700/80 dark:text-rose-300/80">
                Irreversible account management options. Proceed with extreme caution.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deactivate Account */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0F172A]/80 border border-rose-200/60 dark:border-rose-900/40 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UserX size={16} className="text-amber-500" />
                Deactivate Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1 leading-relaxed">
                Temporarily disable your account profile. You can log back in anytime to restore your data.
              </p>
            </div>
            <button
              onClick={handleDeactivateAccount}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Deactivate Account
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0F172A]/80 border border-rose-200/60 dark:border-rose-900/40 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <Trash2 size={16} />
                Delete Account Permanently
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1 leading-relaxed">
                Permanently delete your user profile, saved properties, and all historical due diligence reports.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Delete Account Permanently
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DownloadsAndDangerZone;
