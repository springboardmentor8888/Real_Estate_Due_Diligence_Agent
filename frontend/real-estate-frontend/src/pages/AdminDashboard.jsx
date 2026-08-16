import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import DashboardCard from "../components/dashboard/DashboardCard";
import QuickActions from "../components/dashboard/QuickActions";
import {
  ShieldCheck,
  Users,
  Building2,
  FileText,
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Server,
  Database,
  ArrowUpRight,
  Shield,
  Layers,
  RotateCcw,
  Sparkles,
  MapPin,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import { exportToPdf } from "../utils/exportUtils";
import { getAdminDashboardAnalytics } from "../services/adminService";
import { getAllAuditLogs } from "../services/auditService";
import { getAllReports } from "../services/reportService";
import { getAllProperties } from "../services/propertyService";
import { getCurrentUser } from "../services/authService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [reports, setReports] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState("");

  // Authenticated user identity
  const storedUser = getCurrentUser() || JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.firstName 
    ? `${storedUser.firstName} ${storedUser.lastName || ""}`.trim() 
    : (storedUser.name || "System Administrator");

  const fetchAdminData = useCallback(async (isManualSync = false) => {
    try {
      if (isManualSync) setSyncing(true);
      else setLoading(true);

      const [analyticsRes, logsRes, reportsRes, propsRes] = await Promise.allSettled([
        getAdminDashboardAnalytics(),
        getAllAuditLogs(),
        getAllReports(0, 20),
        getAllProperties(0, 50),
      ]);

      let online = false;

      if (analyticsRes.status === "fulfilled" && analyticsRes.value?.data) {
        setAnalytics(analyticsRes.value.data);
        online = true;
      }
      if (logsRes.status === "fulfilled") {
        const logData = logsRes.value?.data || logsRes.value;
        setAuditLogs(Array.isArray(logData) ? logData : []);
        online = true;
      }
      if (reportsRes.status === "fulfilled") {
        const rptData = reportsRes.value?.data || reportsRes.value;
        setReports(rptData?.content || (Array.isArray(rptData) ? rptData : []));
        online = true;
      }
      if (propsRes.status === "fulfilled") {
        const pData = propsRes.value?.data || propsRes.value;
        setProperties(pData?.content || (Array.isArray(pData) ? pData : []));
        online = true;
      }

      setIsOnline(online);
      const nowStr = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastSyncTime(nowStr);

      if (isManualSync) {
        showToast("Platform telemetry refreshed from PostgreSQL database", "success");
      }
    } catch (err) {
      console.error("Admin dashboard data fetch error:", err);
      setIsOnline(false);
      if (isManualSync) {
        showToast("Unable to sync telemetry with backend", "error");
      }
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();

    // Auto-polling telemetry interval every 45 seconds with cleanup
    const interval = setInterval(() => {
      fetchAdminData();
    }, 45000);

    return () => clearInterval(interval);
  }, [fetchAdminData]);

  // Compute dynamic property status distribution from real properties
  const propertyStatusDistribution = useMemo(() => {
    if (properties.length === 0) return [];
    const counts = {};
    properties.forEach((p) => {
      const st = p.status || "UNDER_REVIEW";
      counts[st] = (counts[st] || 0) + 1;
    });

    const colors = {
      ACTIVE: "#10B981",
      AVAILABLE: "#10B981",
      VERIFIED: "#3B82F6",
      PENDING: "#F59E0B",
      UNDER_REVIEW: "#F59E0B",
      FLAGGED: "#EF4444",
      SOLD: "#64748B",
    };

    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
      color: colors[name] || "#8B5CF6",
    }));
  }, [properties]);

  // Compute dynamic audit log activity chart from real audit logs
  const auditActivityByAction = useMemo(() => {
    if (auditLogs.length === 0) return [];
    const counts = {};
    auditLogs.slice(0, 50).forEach((log) => {
      const act = log.action || "SYSTEM_EVENT";
      counts[act] = (counts[act] || 0) + 1;
    });

    return Object.entries(counts)
      .slice(0, 6)
      .map(([action, count]) => ({
        action: action.replace(/_/g, " "),
        count,
      }));
  }, [auditLogs]);

  // Compute city distribution from real properties
  const propertyCityDistribution = useMemo(() => {
    if (properties.length === 0) return [];
    const counts = {};
    properties.forEach((p) => {
      const city = p.address?.city || p.city || "Urban Hub";
      counts[city] = (counts[city] || 0) + 1;
    });
    return Object.entries(counts).slice(0, 4);
  }, [properties]);

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* 1. WELCOME & SYNC HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-mono font-bold mb-2">
              <ShieldCheck size={14} /> System Administrator Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              👋 Welcome, {userName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              System Dashboard Telemetry • Live PostgreSQL platform monitoring, audit telemetry, and due diligence registries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Dynamic System Status */}
            <span
              className={`px-3 py-1.5 rounded-2xl font-mono font-bold text-xs border flex items-center gap-1.5 ${
                isOnline
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              {isOnline ? "SYSTEM OPERATIONAL" : "SYSTEM DEGRADED"}
            </span>

            {/* Sync Button */}
            <Button
              onClick={() => fetchAdminData(true)}
              variant="outline"
              size="sm"
              icon={RotateCcw}
              loading={syncing || loading}
            >
              {syncing ? "Syncing..." : lastSyncTime ? `Sync (${lastSyncTime})` : "Sync Data"}
            </Button>
          </div>
        </motion.div>

        {/* 2. LIVE STATISTICS CARDS (8 KPI CARDS) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <BarChart3 size={15} className="text-blue-500" /> Key Performance Telemetry
            </h2>
            {lastSyncTime && (
              <span className="text-[10px] text-slate-400">
                Auto-polled every 45s • Last: {lastSyncTime}
              </span>
            )}
          </div>
          <DashboardCard
            analytics={analytics}
            loading={loading}
            isOnline={isOnline}
            lastSyncTime={lastSyncTime}
          />
        </section>

        {/* 3. QUICK ACTIONS WORKSTATION */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Layers size={15} className="text-purple-500" /> Administrative Quick Actions Workstation
            </h2>
          </div>
          <QuickActions />
        </section>

        {/* 4. RECENT AUDIT LOGS & INFRASTRUCTURE TELEMETRY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* RECENT LIVE AUDIT LOG FEED */}
          <div className="lg:col-span-7 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> Live Audit Log Feed ({analytics?.totalAuditLogs ?? auditLogs.length})
              </h2>
              <button
                onClick={() => navigate("/recent-activity")}
                className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View All Logs</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

<<<<<<< HEAD
            <div className="space-y-3 font-mono text-xs">
              {auditLogs && auditLogs.length > 0 ? (
                auditLogs.slice(0, 4).map((act) => (
                  <div
                    key={act.auditLogId}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-3 hover:border-blue-500/40 transition-all"
                  >
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {act.action}
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        By {act.userEmail || "System"} • {act.createdAt ? new Date(act.createdAt).toLocaleString() : "Recently"}
                      </span>
                    </div>
                    <Badge variant="primary">{act.entityName || "Audit"}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500">No system activities recorded yet.</div>
              )}
            </div>
=======
            {auditLogs.length === 0 ? (
              <div className="py-6">
                <EmptyState
                  title="No Audit Logs Recorded"
                  message="System operations will automatically generate telemetry in this feed."
                />
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {auditLogs.slice(0, 5).map((log, idx) => {
                  const logId = log.id || log.logId || `LOG-${idx + 1}`;
                  const actionStr = (log.action || "SYSTEM_EVENT").replace(/_/g, " ");
                  const userStr = log.username || log.performedBy || log.userEmail || "System Telemetry";
                  const dateStr = log.timestamp ? new Date(log.timestamp).toLocaleString("en-GB") : "Recent";
                  const isSuccess = (log.status || "SUCCESS").toUpperCase() === "SUCCESS";

                  return (
                    <div
                      key={logId}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-3 hover:border-blue-500/40 transition-all"
                    >
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {actionStr}
                        </h3>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          By {userStr} • {dateStr}
                        </span>
                      </div>
                      <Badge variant={isSuccess ? "success" : "danger"}>
                        {log.status || "SUCCESS"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
>>>>>>> 1318ddef (Complete real estate due diligence platform)
          </div>

          {/* INFRASTRUCTURE & DATABASE TELEMETRY */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Server size={16} className="text-emerald-500" /> Platform Infrastructure Telemetry
              </h2>
              <button
                onClick={() => navigate("/system-monitoring")}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Full Telemetry</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white font-extrabold text-xs block">
                    PostgreSQL Database Engine
                  </strong>
                  <span className="text-[10px] text-slate-400">Port 5432 • HikariCP Active</span>
                </div>
                <Badge variant={isOnline ? "success" : "danger"}>{isOnline ? "CONNECTED" : "OFFLINE"}</Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white font-extrabold text-xs block">
                    Spring Boot 3.5.16 REST API
                  </strong>
                  <span className="text-[10px] text-slate-400">Port 8081 • JWT Security</span>
                </div>
                <Badge variant={isOnline ? "success" : "danger"}>{isOnline ? "ONLINE" : "OFFLINE"}</Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white font-extrabold text-xs block">
                    Live Properties Catalog
                  </strong>
                  <span className="text-[10px] text-slate-400">Real estate parcels registered</span>
                </div>
                <strong className="text-purple-600 dark:text-cyan-400 font-black text-sm">
                  {analytics?.totalProperties ?? properties.length} Parcels
                </strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white font-extrabold text-xs block">
                    Registered Users
                  </strong>
                  <span className="text-[10px] text-slate-400">Buyer, Agent, Legal, Financial & Admin</span>
                </div>
                <strong className="text-cyan-600 dark:text-cyan-400 font-black text-sm">
                  {analytics?.totalUsers ?? "—"} Users
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* 5. RECENT DUE DILIGENCE REPORTS REGISTRY */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-purple-500" /> Recent Due Diligence Reports ({analytics?.totalReports ?? reports.length})
            </h2>
            <button
              onClick={() => navigate("/report-management")}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Manage Reports</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

<<<<<<< HEAD
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#334155] text-slate-400 text-[10px] uppercase font-bold">
                  <th className="pb-3">Report ID & Title</th>
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Applicant</th>
                  <th className="pb-3">Generated Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {analytics && analytics.recentReports && analytics.recentReports.length > 0 ? (
                  analytics.recentReports.map((rpt) => (
                    <tr key={rpt.reportId} className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        <div>{rpt.reportName}</div>
                        <span className="text-[10px] text-blue-500 font-bold">RPT-{rpt.reportId}</span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{rpt.propertyName}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{rpt.generatedByUserEmail}</td>
                      <td className="py-3 text-slate-400">{rpt.generatedAt ? new Date(rpt.generatedAt).toLocaleDateString() : "N/A"}</td>
                      <td className="py-3"><Badge variant="success">{rpt.reportStatus}</Badge></td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => navigate(`/report-management`)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 hover:bg-blue-100 cursor-pointer" title="Preview"><Eye size={14} /></button>
                          <button onClick={() => exportToPdf(rpt.reportId, rpt)} className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer" title="Download PDF"><Download size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-slate-500">No reports generated yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. RECENT USER REGISTRATIONS */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-blue-500" /> 7. Recent User Registrations
            </h2>
            <button
              onClick={() => navigate("/user-management")}
              className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Manage User Accounts</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#334155] text-slate-400 text-[10px] uppercase font-bold">
                  <th className="pb-3">User ID & Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Assigned Role</th>
                  <th className="pb-3">Organization</th>
                  <th className="pb-3">Registration Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {analytics && analytics.recentUsers && analytics.recentUsers.length > 0 ? (
                  analytics.recentUsers.map((usr) => (
                    <tr key={usr.userId} className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        <div>{usr.firstName} {usr.lastName}</div>
                        <span className="text-[10px] text-slate-400">USR-{usr.userId}</span>
                      </td>
                      <td className="py-3 text-blue-600 dark:text-cyan-400 font-medium">{usr.email}</td>
                      <td className="py-3"><Badge variant="primary">{usr.role}</Badge></td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{usr.phone || "N/A"}</td>
                      <td className="py-3 text-slate-400">{usr.createdAt ? new Date(usr.createdAt).toLocaleString() : "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-500">No users registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. ANALYTICS PREVIEW */}
=======
          {reports.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="No Reports Generated Yet"
                message="Due diligence reports generated by users will appear in this administrative registry."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-[#334155] text-slate-400 text-[10px] uppercase font-bold">
                    <th className="pb-3">Report ID</th>
                    <th className="pb-3">Property ID / Name</th>
                    <th className="pb-3">Report Type</th>
                    <th className="pb-3">Generated Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                  {reports.slice(0, 5).map((rpt) => {
                    const rptId = rpt.reportId || rpt.id;
                    const pId = rpt.propertyId || rpt.property?.propertyId || "—";
                    const pName = rpt.propertyName || rpt.property?.propertyName || `Property #${pId}`;
                    const rptType = (rpt.reportType || "DUE_DILIGENCE").replace(/_/g, " ");
                    const dateStr = rpt.createdAt ? new Date(rpt.createdAt).toLocaleDateString("en-GB") : "Recent";
                    const st = rpt.status || "COMPLETED";

                    return (
                      <tr key={rptId} className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                        <td className="py-3 font-bold text-blue-600 dark:text-cyan-400">
                          RPT-{rptId}
                        </td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {pName} (PR-{pId})
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">
                          {rptType}
                        </td>
                        <td className="py-3 text-slate-400">{dateStr}</td>
                        <td className="py-3">
                          <Badge variant={st === "COMPLETED" || st === "VERIFIED" ? "success" : "warning"}>
                            {st}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/report-history`)}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 hover:bg-blue-100 cursor-pointer"
                              title="Preview"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => exportToPdf(rptId, rpt)}
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 6. CHARTS & REGISTRY BREAKDOWNS */}
>>>>>>> 1318ddef (Complete real estate due diligence platform)
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* AUDIT LOG TELEMETRY CHART (7 COLS) */}
          <div className="lg:col-span-7 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" /> Audit Actions Breakdown
              </h2>
              <button
                onClick={() => navigate("/recent-activity")}
                className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Audit Logs</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
            <div className="h-64 w-full pt-2">
<<<<<<< HEAD
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={(analytics && analytics.userGrowth) || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="users" name="Total Users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
=======
              {auditActivityByAction.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No telemetry logged yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={auditActivityByAction} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="action" stroke="#94A3B8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Bar dataKey="count" name="Audit Events" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
>>>>>>> 1318ddef (Complete real estate due diligence platform)
            </div>
          </div>

          {/* PROPERTY VERIFICATION DISTRIBUTION (5 COLS) */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={16} className="text-purple-500" /> Property Status Breakdown
              </h2>
            </div>
<<<<<<< HEAD
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={(analytics && analytics.roleDistribution) || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                    {((analytics && analytics.roleDistribution) || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#64748B"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                  <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
=======
            <div className="h-64 w-full flex items-center justify-center">
              {propertyStatusDistribution.length === 0 ? (
                <span className="text-slate-400">No properties in database.</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {propertyStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
>>>>>>> 1318ddef (Complete real estate due diligence platform)
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;
