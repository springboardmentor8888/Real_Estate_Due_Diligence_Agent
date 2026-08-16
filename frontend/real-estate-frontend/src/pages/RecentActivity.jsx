import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Skeleton } from "../components/common/Skeleton";
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
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  Home,
  Database,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import { getAllAuditLogs } from "../services/auditService";

function RecentActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Filters State
  const [selectedUserFilter, setSelectedUserFilter] = useState("ALL");
  const [selectedActionFilter, setSelectedActionFilter] = useState("ALL");
  const [selectedEntityFilter, setSelectedEntityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("DATE_DESC");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch real audit logs from PostgreSQL via GET /api/audit-logs
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllAuditLogs();
      const rawList = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

      const formatted = rawList.map((item) => {
        const d = item.createdAt ? new Date(item.createdAt) : new Date();
        const userDisplay = item.userEmail || (item.userId ? `User #${item.userId}` : "Unknown User");
        const actionDisplay = item.action || "SYSTEM_EVENT";
        const entityDisplay = item.entityName
          ? `${item.entityName}${item.entityId ? ` #${item.entityId}` : ""}`
          : "System Core";

        return {
          id: `LOG-${item.auditLogId}`,
          rawId: item.auditLogId,
          user: userDisplay,
          userEmail: item.userEmail || "Unknown",
          action: actionDisplay,
          entityName: item.entityName || "Core",
          entityTarget: entityDisplay,
          module: item.entityName || "System",
          date: d.toLocaleDateString(),
          time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          timestamp: d,
          ipAddress: item.ipAddress || "Not recorded",
          status: "Success",
          variant: "success",
        };
      });

      setLogs(formatted);
      setLastSyncTime(new Date());
    } catch (err) {
      console.error("Failed to load audit logs:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Unable to load audit logs. Please check the backend connection and try again.";
      setError(msg);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Compute Dynamic Filter Options from Database
  const filterOptions = useMemo(() => {
    const users = Array.from(new Set(logs.map((l) => l.userEmail).filter(Boolean)));
    const actions = Array.from(new Set(logs.map((l) => l.action).filter(Boolean)));
    const entities = Array.from(new Set(logs.map((l) => l.entityName).filter(Boolean)));

    return { users, actions, entities };
  }, [logs]);

  // Search & Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entityTarget.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q) ||
        log.date.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q);

      const matchesUser = selectedUserFilter === "ALL" || log.userEmail === selectedUserFilter;
      const matchesAction = selectedActionFilter === "ALL" || log.action === selectedActionFilter;
      const matchesEntity = selectedEntityFilter === "ALL" || log.entityName === selectedEntityFilter;

      return matchesSearch && matchesUser && matchesAction && matchesEntity;
    });
  }, [logs, searchQuery, selectedUserFilter, selectedActionFilter, selectedEntityFilter]);

<<<<<<< HEAD
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
=======
  // Sort Logic
  const sortedLogs = useMemo(() => {
    const list = [...filteredLogs];
    if (sortBy === "DATE_DESC") {
      list.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === "DATE_ASC") {
      list.sort((a, b) => a.timestamp - b.timestamp);
    } else if (sortBy === "ACTION_ASC") {
      list.sort((a, b) => a.action.localeCompare(b.action));
    } else if (sortBy === "USER_ASC") {
      list.sort((a, b) => a.user.localeCompare(b.user));
    }
    return list;
  }, [filteredLogs, sortBy]);

  // Pagination Calculation
  const totalPages = Math.max(1, Math.ceil(sortedLogs.length / itemsPerPage));
>>>>>>> 1318ddef (Complete real estate due diligence platform)
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedLogs.slice(start, start + itemsPerPage);
  }, [sortedLogs, currentPage, itemsPerPage]);

  // Live Export Functionality
  const handleExportLogs = () => {
    if (sortedLogs.length === 0) {
      showToast("No audit records available to export.", "warning");
      return;
    }

    const headers = ["Log ID", "User", "Action", "Target Entity", "IP Address", "Date", "Time", "Status"];
    const rows = sortedLogs.map((l) => [
      l.id,
      `"${l.user}"`,
      `"${l.action}"`,
      `"${l.entityTarget}"`,
      `"${l.ipAddress}"`,
      `"${l.date}"`,
      `"${l.time}"`,
      `"${l.status}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Audit_Logs_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccessAlert("Export Complete", `Exported ${sortedLogs.length} audit records to CSV.`);
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto font-mono text-xs">
        {/* BREADCRUMB HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-500 dark:text-[#CBD5E1]">
          <nav className="flex items-center gap-2">
            <Link to="/admin/dashboard" className="hover:text-blue-600 dark:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Home size={14} /> Admin Workspace
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Audit Logs & Telemetry
            </span>
          </nav>

          <div className="flex items-center gap-3">
            {lastSyncTime && (
              <span className="text-[11px] text-slate-400">
                Synced {lastSyncTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <Button
              variant="outline"
              size="xs"
              onClick={fetchAuditLogs}
              loading={loading}
              icon={RefreshCw}
            >
              Sync
            </Button>
          </div>
        </div>

        {/* ERROR STATE BANNER */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <div>
                <p className="font-bold">Unable to load audit logs</p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">{error}</p>
              </div>
            </div>
            <Button variant="danger" size="xs" onClick={fetchAuditLogs}>
              Retry
            </Button>
          </div>
        )}

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
              <Database size={13} />
              POSTGRESQL AUDIT TRAIL • {loading ? "..." : `${logs.length} RECORDS`}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🛡️ Audit Logs & Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] max-w-2xl">
              Immutable event log recording property operations, report compilations, and authentication events.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleExportLogs}
              variant="outline"
              size="sm"
              icon={Download}
            >
              Export Audit Logs
            </Button>
          </div>
        </div>

        {/* SUMMARY METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Total Audit Events</span>
            <div className="flex items-center justify-between mt-2">
              <strong className="text-2xl font-black text-slate-900 dark:text-white">
                {loading ? "..." : logs.length}
              </strong>
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400">
                <Activity size={18} />
              </div>
            </div>
          </div>

          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Active Users Recorded</span>
            <div className="flex items-center justify-between mt-2">
              <strong className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {loading ? "..." : filterOptions.users.length}
              </strong>
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Users size={18} />
              </div>
            </div>
          </div>

          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Action Types</span>
            <div className="flex items-center justify-between mt-2">
              <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {loading ? "..." : filterOptions.actions.length}
              </strong>
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Terminal size={18} />
              </div>
            </div>
          </div>

          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Protected Modules</span>
            <div className="flex items-center justify-between mt-2">
              <strong className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {loading ? "..." : filterOptions.entities.length}
              </strong>
              <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Layers size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="white-card rounded-3xl p-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search User, Action, Module, IP Address, Date..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* User Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <Users size={12} className="text-slate-400" />
              <select
                value={selectedUserFilter}
                onChange={(e) => {
                  setSelectedUserFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer text-xs"
              >
<<<<<<< HEAD
                <option value="ALL">All Users</option>
                {userOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
=======
                <option value="ALL">All Users ({logs.length})</option>
                {filterOptions.users.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
>>>>>>> 1318ddef (Complete real estate due diligence platform)
                ))}
              </select>
            </div>

            {/* Action Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <Terminal size={12} className="text-slate-400" />
              <select
                value={selectedActionFilter}
                onChange={(e) => {
                  setSelectedActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL">All Actions</option>
<<<<<<< HEAD
                {actionOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
=======
                {filterOptions.actions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
>>>>>>> 1318ddef (Complete real estate due diligence platform)
                ))}
              </select>
            </div>

            {/* Entity / Module Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <Layers size={12} className="text-slate-400" />
              <select
                value={selectedEntityFilter}
                onChange={(e) => {
                  setSelectedEntityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL">All Modules</option>
<<<<<<< HEAD
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
=======
                {filterOptions.entities.map((en) => (
                  <option key={en} value={en}>
                    {en}
                  </option>
                ))}
>>>>>>> 1318ddef (Complete real estate due diligence platform)
              </select>
            </div>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && logs.length === 0 && (
          <div className="py-12">
            <EmptyState
              title="No audit records found."
              message="No audit events have been recorded in the database yet."
            />
          </div>
        )}

        {/* SEARCH EMPTY STATE */}
        {!loading && !error && logs.length > 0 && sortedLogs.length === 0 && (
          <div className="py-8">
            <EmptyState
              title="No matching audit logs"
              message={`No records matched "${searchQuery}".`}
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedUserFilter("ALL");
                setSelectedActionFilter("ALL");
                setSelectedEntityFilter("ALL");
              }}
            />
          </div>
        )}

        {/* AUDIT LOGS TABLE */}
        {!loading && !error && sortedLogs.length > 0 && (
          <div className="white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-[#334155] bg-slate-50/50 dark:bg-[#0F172A]/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Log ID</th>
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-5">Action</th>
                    <th className="py-3.5 px-5">Target Entity</th>
                    <th className="py-3.5 px-5">Date & Time</th>
                    <th className="py-3.5 px-5">IP Address</th>
                    <th className="py-3.5 px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                  {paginatedLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#0F172A]/40 transition-colors"
                    >
                      <td className="py-4 px-5 font-bold text-blue-600 dark:text-cyan-400 font-mono text-[11px]">
                        {log.id}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                        {log.user}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300 font-medium">
                        {log.entityTarget}
                      </td>
                      <td className="py-4 px-5 text-slate-500 font-mono text-[11px]">
                        <div>{log.date}</div>
                        <div className="text-[10px] text-slate-400">{log.time}</div>
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-500 text-[11px]">
                        {log.ipAddress}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Badge variant="success">{log.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="p-4 border-t border-slate-100 dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-500">
              <span>
                Showing {Math.min(paginatedLogs.length, sortedLogs.length)} of {sortedLogs.length} audit records (Page {currentPage} of {totalPages})
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-xs disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-xs disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default RecentActivity;
