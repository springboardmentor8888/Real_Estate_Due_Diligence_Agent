import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
import DashboardCard from "../components/dashboard/DashboardCard";
import QuickActions from "../components/dashboard/QuickActions";
import {
  ShieldCheck,
  Users,
  Building2,
  FileText,
  Activity,
  AlertTriangle,
  UserPlus,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Sparkles,
  Server,
  Database,
  ArrowUpRight,
  Shield,
  Layers,
  Search,
  Filter,
  Check,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import { exportToPdf } from "../utils/exportUtils";
import { getAdminDashboardAnalytics } from "../services/adminService";
import { getAllAuditLogs } from "../services/auditService";

// CENTRALIZED MOCK DATA FOR ADMIN DASHBOARD
const MOCK_RECENT_ACTIVITIES = [
  {
    id: "ACT-ADMIN-101",
    user: "V Bharath (Admin)",
    action: "Updated system security role permissions for Financial Institution",
    timestamp: "10 mins ago",
    status: "Completed",
    variant: "success",
  },
  {
    id: "ACT-ADMIN-102",
    user: "Adv. Rajesh Sharma",
    action: "Generated Legal Encumbrance Audit Report #RPT-881",
    timestamp: "35 mins ago",
    status: "Verified",
    variant: "info",
  },
  {
    id: "ACT-ADMIN-103",
    user: "Adani Realty Institutional",
    action: "Submitted Commercial Loan Application LN-HYD-2026-105",
    timestamp: "1 hour ago",
    status: "Under Review",
    variant: "warning",
  },
  {
    id: "ACT-ADMIN-104",
    user: "System Telemetry",
    action: "Automated Sub-Registrar API Database Sync completed",
    timestamp: "2 hours ago",
    status: "Success",
    variant: "success",
  },
];

// Mock System Alerts
const MOCK_SYSTEM_ALERTS = [
  {
    id: "ALT-101",
    title: "Sub-Registrar Registry API Latency Spike",
    description: "API response latency reached 420ms during peak Telangana land records sync.",
    severity: "Medium",
    time: "25 mins ago",
  },
  {
    id: "ALT-102",
    title: "Storage Backup Snapshot Created",
    description: "Daily automated PostgreSQL & Document storage snapshot completed successfully.",
    severity: "Info",
    time: "3 hours ago",
  },
];

// Mock Recent Reports
const MOCK_RECENT_REPORTS = [
  {
    id: "RPT-2026-901",
    title: "Commercial Due Diligence Audit Dossier",
    property: "Gachibowli Tech Park Phase 2",
    applicant: "Adani Realty Institutional Fund",
    date: "05 Aug 2026",
    status: "Approved",
  },
  {
    id: "RPT-2026-902",
    title: "Municipal PTIN Tax Clearance Verification",
    property: "Whitefield Horizon Tech Campus",
    applicant: "Sobha Developers Commercial",
    date: "04 Aug 2026",
    status: "Verified",
  },
  {
    id: "RPT-2026-903",
    title: "Collateral Risk Index Assessment",
    property: "Jubilee Hills Commercial Plot 36",
    applicant: "DLF Cybercity Developers Ltd",
    date: "04 Aug 2026",
    status: "Under Review",
  },
];

// Mock Recent User Registrations
const MOCK_RECENT_USERS = [
  {
    id: "USR-301",
    name: "Dr. Arvind Swamy",
    email: "arvind.swamy@capital.in",
    role: "Financial Institution",
    organization: "HDFC Commercial Capital",
    date: "Today at 09:15 AM",
  },
  {
    id: "USR-302",
    name: "Adv. Meera Deshmukh",
    email: "meera.legal@lexjuris.in",
    role: "Legal Reviewer",
    organization: "LexJuris Legal Auditors",
    date: "Yesterday at 04:40 PM",
  },
  {
    id: "USR-303",
    name: "Karan Johar Realty",
    email: "karan@joharrealty.com",
    role: "Real Estate Agent",
    organization: "Prime Realty Advisors",
    date: "Yesterday at 02:10 PM",
  },
];

// Analytics Preview Mock Data
const MOCK_USER_GROWTH = [
  { month: "Jan", users: 420 },
  { month: "Feb", users: 580 },
  { month: "Mar", users: 740 },
  { month: "Apr", users: 910 },
  { month: "May", users: 1120 },
  { month: "Jun", users: 1284 },
];

const MOCK_ROLE_DISTRIBUTION = [
  { name: "Buyers", value: 520, color: "#3B82F6" },
  { name: "Agents", value: 340, color: "#8B5CF6" },
  { name: "Legal Reviewers", value: 240, color: "#F59E0B" },
  { name: "Financial Institutions", value: 184, color: "#10B981" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Get User Profile from LocalStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.name || "V Bharath";

  React.useEffect(() => {
    getAdminDashboardAnalytics()
      .then((res) => {
        if (res && res.data) {
          setAnalytics(res.data);
        }
      })
      .catch((err) => console.warn("Backend admin analytics query fallback:", err));

    getAllAuditLogs()
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          setAuditLogs(res.data);
        }
      })
      .catch((err) => console.warn("Backend audit logs query fallback:", err));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* 1. WELCOME SECTION */}
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
              System Dashboard Telemetry • Monitor User Accounts, System Health, Audit Logs, Recent Reports, and Platform Analytics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              SYSTEM 100% OPERATIONAL
            </span>
          </div>
        </motion.div>

        {/* 2. STATISTICS CARDS (REUSABLE KPI CARDS COMPONENT) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <BarChart3 size={15} className="text-blue-500" /> SECTION 2: Key Performance Metrics
            </h2>
          </div>
          <DashboardCard analytics={analytics} />
        </section>

        {/* 3. QUICK ACTIONS (REUSABLE QUICK ACTIONS COMPONENT) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Layers size={15} className="text-purple-500" /> SECTION 3: Quick Actions Workstation
            </h2>
          </div>
          <QuickActions />
        </section>

        {/* 2-COLUMN MAIN GRID: ACTIVITIES (4) + ALERTS (5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 4. RECENT ACTIVITIES (7 COLS) */}
          <div className="lg:col-span-7 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> 4. Recent Activities
              </h2>
              <button
                onClick={() => navigate("/recent-activity")}
                className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View All Logs</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {MOCK_RECENT_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center justify-between gap-3 hover:border-blue-500/40 transition-all"
                >
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                      {act.action}
                    </h3>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      By {act.user} • {act.timestamp}
                    </span>
                  </div>
                  <Badge variant={act.variant}>{act.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 5. SYSTEM ALERTS (5 COLS) */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> 5. System Alerts
              </h2>
              <button
                onClick={() => navigate("/system-monitoring")}
                className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Monitor Health</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {MOCK_SYSTEM_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-slate-900 dark:text-white font-extrabold text-xs">
                      {alert.title}
                    </strong>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{alert.time}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. RECENT REPORTS */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-purple-500" /> 6. Recent Reports
            </h2>
            <button
              onClick={() => navigate("/report-management")}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Manage Reports</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

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
                {MOCK_RECENT_REPORTS.map((rpt) => (
                  <tr key={rpt.id} className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div>{rpt.title}</div>
                      <span className="text-[10px] text-blue-500 font-bold">{rpt.id}</span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{rpt.property}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{rpt.applicant}</td>
                    <td className="py-3 text-slate-400">{rpt.date}</td>
                    <td className="py-3"><Badge variant="success">{rpt.status}</Badge></td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => navigate(`/report-management`)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 hover:bg-blue-100 cursor-pointer" title="Preview"><Eye size={14} /></button>
                        <button onClick={() => exportToPdf(rpt.id, rpt)} className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer" title="Download PDF"><Download size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                {MOCK_RECENT_USERS.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      <div>{usr.name}</div>
                      <span className="text-[10px] text-slate-400">{usr.id}</span>
                    </td>
                    <td className="py-3 text-blue-600 dark:text-cyan-400 font-medium">{usr.email}</td>
                    <td className="py-3"><Badge variant="primary">{usr.role}</Badge></td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{usr.organization}</td>
                    <td className="py-3 text-slate-400">{usr.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. ANALYTICS PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* USER GROWTH (7 COLS) */}
          <div className="lg:col-span-7 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" /> 8A. User Growth Analytics Preview
              </h2>
              <button
                onClick={() => navigate("/financial-analytics")}
                className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_USER_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="users" name="Total Users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ROLE DISTRIBUTION (5 COLS) */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={16} className="text-purple-500" /> 8B. Role Distribution Preview
              </h2>
              <button
                onClick={() => navigate("/role-management")}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Manage Roles</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={MOCK_ROLE_DISTRIBUTION} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                    {MOCK_ROLE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                  <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;
