import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Globe,
  Radio,
  UserX,
  Clock,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Download,
  X,
  CheckCircle2,
  Terminal,
  Activity,
  Sparkles,
  Server,
} from "lucide-react";
import { showSuccessAlert, showToast, showConfirmDialog } from "../utils/swal";
import { exportToPdf } from "../utils/exportUtils";

// 1. FAILED LOGIN ATTEMPTS MOCK DATA
const INITIAL_FAILED_LOGINS = [
  { id: "FL-101", ip: "198.51.100.42", location: "Mumbai, MH, India", targetEmail: "admin@enterprise.in", attempts: 4, timestamp: "12 mins ago", risk: "High Risk" },
  { id: "FL-102", ip: "103.22.45.12", location: "Hyderabad, TS, India", targetEmail: "rajesh.legal@lexjuris.in", attempts: 3, timestamp: "45 mins ago", risk: "Moderate Risk" },
  { id: "FL-103", ip: "49.207.18.22", location: "Bengaluru, KA, India", targetEmail: "buyer.test@realty.com", attempts: 2, timestamp: "2 hours ago", risk: "Low Risk" },
];

// 2. LOCKED ACCOUNTS MOCK DATA
const INITIAL_LOCKED_ACCOUNTS = [
  { id: "LOCK-201", name: "Suresh Reddy", email: "suresh.reddy@realtyprime.in", role: "Real Estate Agent", reason: "Max Brute-Force Attempts (5/5)", lockedAt: "Today at 08:30 AM" },
  { id: "LOCK-202", name: "Kavitah Pillai", email: "kavitah.legal@lexjuris.in", role: "Legal Reviewer", reason: "Suspicious Geo-Location Jump", lockedAt: "Yesterday at 11:15 PM" },
];

// 3. ACTIVE SESSIONS MOCK DATA
const INITIAL_ACTIVE_SESSIONS = [
  { id: "SESS-301", user: "V Bharath (Administrator)", email: "bharath@gmail.com", device: "Chrome 127 (Windows 11)", ip: "192.168.1.104", location: "Hyderabad, TS", startedAt: "Active Now" },
  { id: "SESS-302", user: "Adv. Rajesh Sharma", email: "rajesh.legal@lexjuris.in", device: "Firefox 128 (macOS)", ip: "10.0.4.15", location: "Mumbai, MH", startedAt: "45 mins ago" },
  { id: "SESS-303", user: "Dr. Arvind Swamy", email: "arvind.swamy@capital.in", device: "Safari 17.5 (iOS)", ip: "122.170.4.11", location: "Bengaluru, KA", startedAt: "1 hour ago" },
  { id: "SESS-304", user: "Adani Realty Institutional", email: "contact@adanirealty.in", device: "Edge 126 (Windows 10)", ip: "49.207.18.22", location: "New Delhi, DL", startedAt: "3 hours ago" },
];

// 4. PASSWORD RESET REQUESTS MOCK DATA
const INITIAL_RESET_REQUESTS = [
  { id: "RESET-401", user: "Ananya Rao", email: "ananya.agent@realtyprime.in", requestedAt: "20 mins ago", status: "Pending Verification" },
  { id: "RESET-402", user: "Venkatesh Iyer", email: "venkatesh.iyer@hdfc.com", requestedAt: "2 hours ago", status: "Token Dispatched" },
];

// 5. RECENT SECURITY EVENTS MOCK DATA
const INITIAL_SECURITY_EVENTS = [
  { id: "SEC-501", event: "RBAC Role Permission Matrix Updated", user: "V Bharath (Admin)", timestamp: "05 Aug 2026 09:42 AM", status: "Success" },
  { id: "SEC-502", event: "PostgreSQL Database Snapshot Backup Completed", user: "System Cron", timestamp: "05 Aug 2026 07:30 AM", status: "Success" },
  { id: "SEC-503", event: "OAuth2 Refresh Token Revoked", user: "Adv. Rajesh Sharma", timestamp: "04 Aug 2026 06:15 PM", status: "Success" },
];

// 6. SUSPICIOUS ACTIVITIES MOCK DATA
const INITIAL_SUSPICIOUS_ACTIVITIES = [
  { id: "SUSP-601", title: "Impossible Travel Velocity Flagged", detail: "Session jumped from Hyderabad (192.168.1.104) to Frankfurt (185.220.101.5) in 2 mins.", severity: "Critical", time: "15 mins ago" },
  { id: "SUSP-602", title: "Sub-Registrar OAuth2 Endpoint Probe", detail: "Rapid API request burst (140 req/sec) targeting unauthenticated land deed endpoint.", severity: "High Risk", time: "1 hour ago" },
];

function SecurityCenter() {
  const [failedLogins] = useState(INITIAL_FAILED_LOGINS);
  const [lockedAccounts, setLockedAccounts] = useState(INITIAL_LOCKED_ACCOUNTS);
  const [activeSessions, setActiveSessions] = useState(INITIAL_ACTIVE_SESSIONS);
  const [resetRequests, setResetRequests] = useState(INITIAL_RESET_REQUESTS);
  const [securityEvents] = useState(INITIAL_SECURITY_EVENTS);
  const [suspiciousActivities] = useState(INITIAL_SUSPICIOUS_ACTIVITIES);

  // Modal Control States
  const [viewDetailsModal, setViewDetailsModal] = useState(null);

  // REQUIRED ACTION 1: UNLOCK ACCOUNT
  const handleUnlockAccount = (acc) => {
    setLockedAccounts((prev) => prev.filter((a) => a.id !== acc.id));
    showSuccessAlert(
      "Account Unlocked",
      `User account for '${acc.name}' (${acc.email}) has been unlocked successfully.`
    );
  };

  // REQUIRED ACTION 2: TERMINATE SESSION
  const handleTerminateSession = async (sess) => {
    const confirmed = await showConfirmDialog(
      "Terminate Active Session?",
      `Are you sure you want to terminate session ${sess.id} for '${sess.user}' (${sess.ip})?`,
      "Terminate Session",
      "Cancel"
    );
    if (confirmed) {
      setActiveSessions((prev) => prev.filter((s) => s.id !== sess.id));
      showToast(`Terminated active session for ${sess.user}`, "success");
    }
  };

  // REQUIRED ACTION 3: RESET PASSWORD
  const handleResetPassword = (email, name) => {
    showSuccessAlert(
      "Password Reset Link Dispatched",
      `Emergency password reset email dispatched to ${name || email} (${email}).`
    );
  };

  const handleExportSecurityDossier = () => {
    exportToPdf("Security_Center_Audit_Dossier_2026", {
      failedLogins: failedLogins.length,
      lockedAccounts: lockedAccounts.length,
      activeSessions: activeSessions.length,
      suspiciousActivities: suspiciousActivities.length,
    });
    showSuccessAlert(
      "Security Dossier Exported",
      "Comprehensive system security audit report PDF generated."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* HEADER BAR */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold mb-2">
              <ShieldAlert size={14} /> Global Security Operations Center (SOC)
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Security Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Inspect Failed Logins, Locked Accounts, Active User Sessions, Password Resets, Audit Logs, and Suspicious Anomalies.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportSecurityDossier}
              className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Download size={14} />
              <span>Export Security PDF</span>
            </button>
          </div>
        </div>

        {/* TOP SUMMARY STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Failed Logins</span>
              <strong className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{failedLogins.length} Events</strong>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800">
              <UserX size={20} />
            </div>
          </div>

          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Locked Accounts</span>
              <strong className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{lockedAccounts.length} Accounts</strong>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800">
              <Lock size={20} />
            </div>
          </div>

          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">3. Active Sessions</span>
              <strong className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{activeSessions.length} Online</strong>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
              <Radio size={20} />
            </div>
          </div>

          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">4. Reset Requests</span>
              <strong className="text-xl font-black text-blue-600 dark:text-cyan-400 mt-1 block">{resetRequests.length} Pending</strong>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200 dark:border-blue-800">
              <Key size={20} />
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN GRID: 1. FAILED LOGINS + 2. LOCKED ACCOUNTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SECTION 1: FAILED LOGIN ATTEMPTS (7 COLS) */}
          <div className="lg:col-span-7 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UserX size={16} className="text-rose-500" /> 1. Failed Login Attempts
              </h2>
              <Badge variant="danger">{failedLogins.length} Flagged</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {failedLogins.map((fl) => (
                <div key={fl.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-3">
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{fl.targetEmail}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 text-[10px] font-bold">{fl.attempts} Failed</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      IP: {fl.ip} • Location: {fl.location} • {fl.timestamp}
                    </span>
                  </div>

                  {/* 4. VIEW DETAILS BUTTON */}
                  <button
                    onClick={() => setViewDetailsModal({ title: "Failed Login Forensics", data: fl })}
                    className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 cursor-pointer"
                    title="View Forensics"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: LOCKED ACCOUNTS (5 COLS - WITH UNLOCK & RESET BUTTONS) */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock size={16} className="text-amber-500" /> 2. Locked Accounts
              </h2>
              <Badge variant="warning">{lockedAccounts.length} Locked</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {lockedAccounts.length > 0 ? (
                lockedAccounts.map((acc) => (
                  <div key={acc.id} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
                    <div>
                      <strong className="text-slate-900 dark:text-white font-extrabold text-xs block">{acc.name}</strong>
                      <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold block">{acc.email}</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">Reason: {acc.reason}</span>
                    </div>

                    {/* REQUIRED ACTION BUTTONS: UNLOCK ACCOUNT & RESET PASSWORD */}
                    <div className="flex items-center gap-2 pt-1 border-t border-amber-200/60 dark:border-amber-800">
                      <button
                        onClick={() => handleUnlockAccount(acc)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                      >
                        <Unlock size={12} />
                        <span>Unlock Account</span>
                      </button>

                      <button
                        onClick={() => handleResetPassword(acc.email, acc.name)}
                        className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                      >
                        <Key size={12} />
                        <span>Reset Password</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400">Zero locked user accounts</div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: ACTIVE SESSIONS (WITH TERMINATE SESSION BUTTON) */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio size={18} className="text-emerald-500" /> 3. Active User Sessions
            </h2>
            <Badge variant="success">{activeSessions.length} Active</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#334155] text-slate-400 text-[10px] uppercase font-bold">
                  <th className="pb-3">Session ID & User</th>
                  <th className="pb-3">Device & Browser</th>
                  <th className="pb-3">IP Address</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Started At</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {activeSessions.map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div>{sess.user}</div>
                      <span className="text-[10px] text-blue-500 font-bold">{sess.id}</span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{sess.device}</td>
                    <td className="py-3 font-mono text-blue-600 dark:text-cyan-400">{sess.ip}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{sess.location}</td>
                    <td className="py-3 text-slate-400">{sess.startedAt}</td>
                    <td className="py-3 text-right">
                      {/* REQUIRED ACTION: TERMINATE SESSION */}
                      <button
                        onClick={() => handleTerminateSession(sess)}
                        className="py-1.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ml-auto"
                      >
                        <UserX size={13} />
                        <span>Terminate Session</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-COLUMN GRID: 4. PASSWORD RESETS + 6. SUSPICIOUS ACTIVITIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SECTION 4: PASSWORD RESET REQUESTS (6 COLS) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Key size={16} className="text-blue-500" /> 4. Password Reset Requests
              </h2>
              <Badge variant="info">{resetRequests.length} Active</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {resetRequests.map((req) => (
                <div key={req.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-3">
                  <div>
                    <strong className="text-slate-900 dark:text-white font-extrabold text-xs block">{req.user}</strong>
                    <span className="text-[10px] text-blue-600 dark:text-cyan-400 block">{req.email} • {req.requestedAt}</span>
                  </div>

                  <button
                    onClick={() => handleResetPassword(req.email, req.user)}
                    className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <Key size={12} />
                    <span>Dispatch Link</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: SUSPICIOUS ACTIVITIES (6 COLS) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-500" /> 6. Suspicious Activities
              </h2>
              <Badge variant="danger">{suspiciousActivities.length} Anomalies</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {suspiciousActivities.map((susp) => (
                <div key={susp.id} className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-rose-700 dark:text-rose-400 font-extrabold text-xs">{susp.title}</strong>
                    <Badge variant="danger">{susp.severity}</Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{susp.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODAL: VIEW DETAILS FORENSICS */}
        <AnimatePresence>
          {viewDetailsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye size={18} className="text-blue-500" /> {viewDetailsModal.title}
                  </h3>
                  <button onClick={() => setViewDetailsModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Account</span>
                      <strong className="text-slate-900 dark:text-white font-extrabold">{viewDetailsModal.data.targetEmail}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Client IP & Location</span>
                      <strong className="text-blue-600 dark:text-cyan-400 font-extrabold">{viewDetailsModal.data.ip} ({viewDetailsModal.data.location})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Failed Attempts Count</span>
                      <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{viewDetailsModal.data.attempts} Failed Attempts</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button onClick={() => setViewDetailsModal(null)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Close Forensics</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default SecurityCenter;
