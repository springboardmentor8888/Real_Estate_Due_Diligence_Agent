import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Activity,
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  Globe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Terminal,
  Layers,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { exportToPdf } from "../utils/exportUtils";
import { showSuccessAlert, showToast } from "../utils/swal";
import { getAllAuditLogs } from "../services/auditService";

// CENTRALIZED MOCK SYSTEM AUDIT LOGS DATASET (12 Enterprise Audit Records)
const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-2026-801",
    user: "V Bharath (Administrator)",
    rawUser: "V Bharath",
    action: "Updated system security role permissions for Financial Institution",
    actionType: "Security Update",
    module: "Security",
    date: "05 Aug 2026",
    time: "09:42:15 AM",
    ipAddress: "192.168.1.104",
    status: "Success",
    variant: "success",
  },
  {
    id: "LOG-2026-802",
    user: "Adv. Rajesh Sharma (Legal Reviewer)",
    rawUser: "Adv. Rajesh Sharma",
    action: "Issued Legal Title Verification Certificate #RPT-881",
    actionType: "Encumbrance Certificate",
    module: "Title Audit",
    date: "05 Aug 2026",
    time: "09:15:30 AM",
    ipAddress: "10.0.4.15",
    status: "Completed",
    variant: "success",
  },
  {
    id: "LOG-2026-803",
    user: "Adani Realty (Buyer)",
    rawUser: "Adani Realty",
    action: "Submitted Commercial Loan Application LN-HYD-2026-105",
    actionType: "Loan Application",
    module: "Loan Reviews",
    date: "05 Aug 2026",
    time: "08:50:12 AM",
    ipAddress: "49.207.18.22",
    status: "Verified",
    variant: "info",
  },
  {
    id: "LOG-2026-804",
    user: "System Telemetry (Cron Service)",
    rawUser: "System Telemetry",
    action: "Automated Sub-Registrar Registry API Database Sync completed",
    actionType: "Sub-Registrar Sync",
    module: "Telemetry",
    date: "05 Aug 2026",
    time: "07:30:00 AM",
    ipAddress: "127.0.0.1",
    status: "Success",
    variant: "success",
  },
  {
    id: "LOG-2026-805",
    user: "Venkatesh Iyer (Financial Institution)",
    rawUser: "Venkatesh Iyer",
    action: "Approved Collateral Risk Index Assessment for Gachibowli Tech Park",
    actionType: "Risk Assessment",
    module: "Financial Reports",
    date: "04 Aug 2026",
    time: "04:45:22 PM",
    ipAddress: "182.73.19.84",
    status: "Completed",
    variant: "success",
  },
  {
    id: "LOG-2026-806",
    user: "Ananya Rao (Real Estate Agent)",
    rawUser: "Ananya Rao",
    action: "Uploaded Sub-Registrar 30-year Sale Deed Chain PDF for Jubilee Hills Plot",
    actionType: "Deed Upload",
    module: "Title Audit",
    date: "04 Aug 2026",
    time: "02:10:05 PM",
    ipAddress: "103.22.45.12",
    status: "Success",
    variant: "success",
  },
  {
    id: "LOG-2026-807",
    user: "Adv. Meera Deshmukh (Legal Reviewer)",
    rawUser: "Adv. Meera Deshmukh",
    action: "Flagged GHMC Municipal Tax Ledger Discrepancy for Whitefield Campus",
    actionType: "Tax Verification",
    module: "Tax Ledger",
    date: "04 Aug 2026",
    time: "11:25:40 AM",
    ipAddress: "14.97.102.50",
    status: "Warning",
    variant: "warning",
  },
  {
    id: "LOG-2026-808",
    user: "Unknown Client IP (External API)",
    rawUser: "External API",
    action: "Failed authentication attempt on Sub-Registrar OAuth2 endpoint",
    actionType: "Security Update",
    module: "Security",
    date: "03 Aug 2026",
    time: "11:55:10 PM",
    ipAddress: "198.51.100.42",
    status: "Failed",
    variant: "danger",
  },
  {
    id: "LOG-2026-809",
    user: "Aditi Deshmukh (Administrator)",
    rawUser: "Aditi Deshmukh",
    action: "Executed Daily PostgreSQL Database Snapshot & Storage Backup",
    actionType: "Sub-Registrar Sync",
    module: "Telemetry",
    date: "03 Aug 2026",
    time: "05:00:00 PM",
    ipAddress: "192.168.1.108",
    status: "Success",
    variant: "success",
  },
  {
    id: "LOG-2026-810",
    user: "Suresh Reddy (Buyer)",
    rawUser: "Suresh Reddy",
    action: "Generated 13-vector Due Diligence Audit Dossier PDF #RPT-2026-908",
    actionType: "Encumbrance Certificate",
    module: "Financial Reports",
    date: "02 Aug 2026",
    time: "03:14:18 PM",
    ipAddress: "117.211.8.65",
    status: "Completed",
    variant: "success",
  },
  {
    id: "LOG-2026-811",
    user: "Adv. Kavitah Pillai (Legal Reviewer)",
    rawUser: "Adv. Kavitah Pillai",
    action: "Verified Court Litigation Registry search for Poona Commercial Enclave",
    actionType: "Encumbrance Certificate",
    module: "Title Audit",
    date: "01 Aug 2026",
    time: "01:30:45 PM",
    ipAddress: "106.51.20.90",
    status: "Verified",
    variant: "success",
  },
  {
    id: "LOG-2026-812",
    user: "Dr. Arvind Swamy (Financial Institution)",
    rawUser: "Dr. Arvind Swamy",
    action: "Calculated Debt Service Coverage Ratio (DSCR) for Salt Lake Tech Sector V",
    actionType: "Risk Assessment",
    module: "Financial Reports",
    date: "31 Jul 2026",
    time: "10:20:00 AM",
    ipAddress: "122.170.4.11",
    status: "Completed",
    variant: "info",
  },
];

function RecentActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAuditLogs()
      .then((res) => {
        const list = res.data || [];
        const mapped = list.map((log) => ({
          id: `LOG-${log.logId}`,
          user: `${log.user?.firstName || ""} ${log.user?.lastName || "System"} (${log.user?.role?.roleName || "User"})`,
          rawUser: log.user?.firstName || "System",
          action: log.action || "System action executed",
          actionType: log.action || "Audit Record",
          module: log.module || "General",
          date: log.timestamp ? new Date(log.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Today",
          time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" }) : "Just Now",
          ipAddress: log.ipAddress || "127.0.0.1",
          status: "Success",
          variant: "success",
        }));
        setLogs(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading activity logs:", err);
        setLoading(false);
      });
  }, []);

  // 4 REQUIRED DROPDOWN FILTERS: User, Action, Module, Date
  const [selectedUserFilter, setSelectedUserFilter] = useState("ALL");
  const [selectedActionFilter, setSelectedActionFilter] = useState("ALL");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState("ALL");
  const [selectedDateFilter, setSelectedDateFilter] = useState("ALL");

  // Search & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Sort Logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q) ||
        log.date.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q);

      const matchesUser = selectedUserFilter === "ALL" || log.rawUser === selectedUserFilter;
      const matchesAction = selectedActionFilter === "ALL" || log.actionType === selectedActionFilter;
      const matchesModule = selectedModuleFilter === "ALL" || log.module === selectedModuleFilter;

      let matchesDate = true;
      if (selectedDateFilter === "TODAY") matchesDate = log.date.includes("05 Aug");
      else if (selectedDateFilter === "PAST_7") matchesDate = true;

      return matchesSearch && matchesUser && matchesAction && matchesModule && matchesDate;
    }).sort((a, b) => {
      if (sortBy === "user") return a.user.localeCompare(b.user);
      if (sortBy === "module") return a.module.localeCompare(b.module);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return b.id.localeCompare(a.id);
    });
  }, [logs, searchQuery, selectedUserFilter, selectedActionFilter, selectedModuleFilter, selectedDateFilter, sortBy]);

  const userOptions = useMemo(() => {
    const set = new Set(logs.map((l) => l.rawUser));
    return Array.from(set).filter(Boolean);
  }, [logs]);

  const actionOptions = useMemo(() => {
    const set = new Set(logs.map((l) => l.actionType));
    return Array.from(set).filter(Boolean);
  }, [logs]);

  const moduleOptions = useMemo(() => {
    const set = new Set(logs.map((l) => l.module));
    return Array.from(set).filter(Boolean);
  }, [logs]);

  // Pagination Math
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const handleExportPdf = () => {
    exportToPdf("System_Audit_Logs_Dossier_2026", { logsCount: filteredLogs.length });
    showSuccessAlert(
      "Audit Log Exported",
      `Exported ${filteredLogs.length} audit log entries to PDF.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* HEADER BAR */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold mb-2">
              <Terminal size={14} /> System Telemetry Audit Log Stream
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Audit Logs & Telemetry
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Chronological platform activity stream, security audit trails, module executions, and client IP telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportPdf}
              className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Download size={16} />
              <span>Export Audit Logs</span>
            </button>
          </div>
        </div>

        {/* 4 REQUIRED DROPDOWN FILTERS WORKSTATION */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* SEARCH */}
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search User, Action, Module, IP Address, Date..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
              />
            </div>

            {/* FILTER 1: USER */}
            <div className="lg:col-span-2">
              <select
                value={selectedUserFilter}
                onChange={(e) => {
                  setSelectedUserFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Users</option>
                {userOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* FILTER 2: ACTION */}
            <div className="lg:col-span-2">
              <select
                value={selectedActionFilter}
                onChange={(e) => {
                  setSelectedActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Actions</option>
                {actionOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* FILTER 3: MODULE */}
            <div className="lg:col-span-2">
              <select
                value={selectedModuleFilter}
                onChange={(e) => {
                  setSelectedModuleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Modules</option>
                {moduleOptions.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* FILTER 4: DATE */}
            <div className="lg:col-span-2">
              <select
                value={selectedDateFilter}
                onChange={(e) => {
                  setSelectedDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today</option>
                <option value="PAST_7">Past 7 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESPONSIVE ENTERPRISE TABLE WITH ALL 7 REQUIRED COLUMNS */}
        <div className="white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-[#334155] text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-4">1. User</th>
                  <th className="py-3.5 px-4">2. Action</th>
                  <th className="py-3.5 px-4">3. Module</th>
                  <th className="py-3.5 px-4">4. Date</th>
                  <th className="py-3.5 px-4">5. Time</th>
                  <th className="py-3.5 px-4">6. IP Address</th>
                  <th className="py-3.5 px-4 text-right">7. Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => {
                    const isFailed = log.status === "Failed";
                    const isWarning = log.status === "Warning";

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-[#0F172A]/60 transition-colors">
                        {/* 1. USER */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 dark:text-white">{log.user}</div>
                          <span className="text-[10px] text-blue-500 font-bold">{log.id}</span>
                        </td>

                        {/* 2. ACTION */}
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200 font-medium">
                          {log.action}
                        </td>

                        {/* 3. MODULE */}
                        <td className="py-3.5 px-4">
                          <Badge variant="primary">{log.module}</Badge>
                        </td>

                        {/* 4. DATE */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          {log.date}
                        </td>

                        {/* 5. TIME */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          {log.time}
                        </td>

                        {/* 6. IP ADDRESS */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px] border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1">
                            <Globe size={11} className="text-blue-500" />
                            {log.ipAddress}
                          </span>
                        </td>

                        {/* 7. STATUS */}
                        <td className="py-3.5 px-4 text-right">
                          <Badge variant={log.variant}>{log.status}</Badge>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <EmptyState
                        title="No Audit Logs Found"
                        description="No system telemetry log records match your search or dropdown filter criteria."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          <div className="p-4 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between gap-4 font-mono text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{paginatedLogs.length}</strong> of{" "}
              <strong className="text-slate-900 dark:text-white">{filteredLogs.length}</strong> audit records (Page {currentPage} of {totalPages})
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1 font-bold"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1 font-bold"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default RecentActivity;
