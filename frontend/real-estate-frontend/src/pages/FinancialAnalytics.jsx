import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  FileText,
  Shield,
  Activity,
  Terminal,
  Calendar,
  Download,
  Sparkles,
  PieChart as PieIcon,
  Layers,
  Server,
  Clock,
} from "lucide-react";
import { exportToPdf } from "../utils/exportUtils";
import { showSuccessAlert, showToast } from "../utils/swal";

// TIMELINE-SPECIFIC DATASETS MATRIX
const TIMELINE_DATASETS = {
  "1M": {
    label: "Past 30 Days (4 Weeks)",
    userGrowth: [
      { label: "W1", totalUsers: 1180, newUsers: 30 },
      { label: "W2", totalUsers: 1210, newUsers: 30 },
      { label: "W3", totalUsers: 1245, newUsers: 35 },
      { label: "W4", totalUsers: 1284, newUsers: 39 },
    ],
    monthlyReports: [
      { label: "W1", reports: 52, approved: 46, flagged: 6 },
      { label: "W2", reports: 58, approved: 52, flagged: 6 },
      { label: "W3", reports: 64, approved: 58, flagged: 6 },
      { label: "W4", reports: 68, approved: 62, flagged: 6 },
    ],
    propertiesAdded: [
      { label: "W1", commercial: 14, residential: 18 },
      { label: "W2", commercial: 16, residential: 20 },
      { label: "W3", commercial: 18, residential: 22 },
      { label: "W4", commercial: 17, residential: 22 },
    ],
    riskDistribution: [
      { name: "Low Risk (< 25)", value: 180, color: "#10B981" },
      { name: "Moderate Risk (25-50)", value: 80, color: "#F59E0B" },
      { name: "High Risk (> 50)", value: 40, color: "#F43F5E" },
    ],
    roleDistribution: [
      { name: "Buyers", value: 120, color: "#3B82F6" },
      { name: "Agents", value: 80, color: "#8B5CF6" },
      { name: "Legal Reviewers", value: 55, color: "#F59E0B" },
      { name: "Financial Inst.", value: 40, color: "#10B981" },
      { name: "Administrators", value: 5, color: "#06B6D4" },
    ],
    activeUsers: [
      { label: "Mon", active: 840 },
      { label: "Tue", active: 910 },
      { label: "Wed", active: 942 },
      { label: "Thu", active: 890 },
      { label: "Fri", active: 920 },
      { label: "Sat", active: 450 },
      { label: "Sun", active: 380 },
    ],
    reportTrends: [
      { label: "W1", legalAudits: 28, taxVerifications: 24 },
      { label: "W2", legalAudits: 32, taxVerifications: 26 },
      { label: "W3", legalAudits: 36, taxVerifications: 28 },
      { label: "W4", legalAudits: 38, taxVerifications: 30 },
    ],
    apiUsage: [
      { label: "W1", requests: 39500, latencyMs: 44 },
      { label: "W2", requests: 42100, latencyMs: 42 },
      { label: "W3", requests: 45210, latencyMs: 40 },
      { label: "W4", requests: 44800, latencyMs: 41 },
    ],
  },
  "3M": {
    label: "Past 3 Months (Q2 2026)",
    userGrowth: [
      { label: "Apr", totalUsers: 910, newUsers: 170 },
      { label: "May", totalUsers: 1120, newUsers: 210 },
      { label: "Jun", totalUsers: 1284, newUsers: 164 },
    ],
    monthlyReports: [
      { label: "Apr", reports: 170, approved: 150, flagged: 20 },
      { label: "May", reports: 210, approved: 188, flagged: 22 },
      { label: "Jun", reports: 242, approved: 218, flagged: 24 },
    ],
    propertiesAdded: [
      { label: "Apr", commercial: 48, residential: 64 },
      { label: "May", commercial: 55, residential: 72 },
      { label: "Jun", commercial: 65, residential: 82 },
    ],
    riskDistribution: [
      { name: "Low Risk (< 25)", value: 360, color: "#10B981" },
      { name: "Moderate Risk (25-50)", value: 190, color: "#F59E0B" },
      { name: "High Risk (> 50)", value: 110, color: "#F43F5E" },
    ],
    roleDistribution: [
      { name: "Buyers", value: 270, color: "#3B82F6" },
      { name: "Agents", value: 180, color: "#8B5CF6" },
      { name: "Legal Reviewers", value: 125, color: "#F59E0B" },
      { name: "Financial Inst.", value: 95, color: "#10B981" },
      { name: "Administrators", value: 8, color: "#06B6D4" },
    ],
    activeUsers: [
      { label: "Apr W1", active: 780 },
      { label: "Apr W3", active: 820 },
      { label: "May W1", active: 870 },
      { label: "May W3", active: 910 },
      { label: "Jun W1", active: 935 },
      { label: "Jun W3", active: 942 },
    ],
    reportTrends: [
      { label: "Apr", legalAudits: 95, taxVerifications: 75 },
      { label: "May", legalAudits: 118, taxVerifications: 92 },
      { label: "Jun", legalAudits: 135, taxVerifications: 107 },
    ],
    apiUsage: [
      { label: "Apr", requests: 115000, latencyMs: 43 },
      { label: "May", requests: 132000, latencyMs: 41 },
      { label: "Jun", requests: 145210, latencyMs: 40 },
    ],
  },
  "6M": {
    label: "Past 6 Months (H1 2026)",
    userGrowth: [
      { label: "Jan", totalUsers: 420, newUsers: 85 },
      { label: "Feb", totalUsers: 580, newUsers: 160 },
      { label: "Mar", totalUsers: 740, newUsers: 160 },
      { label: "Apr", totalUsers: 910, newUsers: 170 },
      { label: "May", totalUsers: 1120, newUsers: 210 },
      { label: "Jun", totalUsers: 1284, newUsers: 164 },
    ],
    monthlyReports: [
      { label: "Jan", reports: 85, approved: 72, flagged: 13 },
      { label: "Feb", reports: 110, approved: 94, flagged: 16 },
      { label: "Mar", reports: 145, approved: 128, flagged: 17 },
      { label: "Apr", reports: 170, approved: 150, flagged: 20 },
      { label: "May", reports: 210, approved: 188, flagged: 22 },
      { label: "Jun", reports: 242, approved: 218, flagged: 24 },
    ],
    propertiesAdded: [
      { label: "Jan", commercial: 24, residential: 38 },
      { label: "Feb", commercial: 32, residential: 45 },
      { label: "Mar", commercial: 40, residential: 58 },
      { label: "Apr", commercial: 48, residential: 64 },
      { label: "May", commercial: 55, residential: 72 },
      { label: "Jun", commercial: 65, residential: 82 },
    ],
    riskDistribution: [
      { name: "Low Risk (< 25)", value: 640, color: "#10B981" },
      { name: "Moderate Risk (25-50)", value: 380, color: "#F59E0B" },
      { name: "High Risk (> 50)", value: 264, color: "#F43F5E" },
    ],
    roleDistribution: [
      { name: "Buyers", value: 520, color: "#3B82F6" },
      { name: "Agents", value: 340, color: "#8B5CF6" },
      { name: "Legal Reviewers", value: 240, color: "#F59E0B" },
      { name: "Financial Inst.", value: 184, color: "#10B981" },
      { name: "Administrators", value: 12, color: "#06B6D4" },
    ],
    activeUsers: [
      { label: "Jan", active: 380 },
      { label: "Feb", active: 520 },
      { label: "Mar", active: 680 },
      { label: "Apr", active: 810 },
      { label: "May", active: 900 },
      { label: "Jun", active: 942 },
    ],
    reportTrends: [
      { label: "Jan", legalAudits: 48, taxVerifications: 37 },
      { label: "Feb", legalAudits: 62, taxVerifications: 48 },
      { label: "Mar", legalAudits: 82, taxVerifications: 63 },
      { label: "Apr", legalAudits: 95, taxVerifications: 75 },
      { label: "May", legalAudits: 118, taxVerifications: 92 },
      { label: "Jun", legalAudits: 135, taxVerifications: 107 },
    ],
    apiUsage: [
      { label: "Jan", requests: 72000, latencyMs: 48 },
      { label: "Feb", requests: 94000, latencyMs: 46 },
      { label: "Mar", requests: 112000, latencyMs: 44 },
      { label: "Apr", requests: 125000, latencyMs: 43 },
      { label: "May", requests: 138000, latencyMs: 41 },
      { label: "Jun", requests: 152000, latencyMs: 40 },
    ],
  },
  "1Y": {
    label: "Past 12 Months (Full Year 2025-2026)",
    userGrowth: [
      { label: "Jul", totalUsers: 120, newUsers: 40 },
      { label: "Aug", totalUsers: 210, newUsers: 90 },
      { label: "Sep", totalUsers: 320, newUsers: 110 },
      { label: "Oct", totalUsers: 450, newUsers: 130 },
      { label: "Nov", totalUsers: 580, newUsers: 130 },
      { label: "Dec", totalUsers: 710, newUsers: 130 },
      { label: "Jan", totalUsers: 830, newUsers: 120 },
      { label: "Feb", totalUsers: 940, newUsers: 110 },
      { label: "Mar", totalUsers: 1020, newUsers: 80 },
      { label: "Apr", totalUsers: 1110, newUsers: 90 },
      { label: "May", totalUsers: 1200, newUsers: 90 },
      { label: "Jun", totalUsers: 1284, newUsers: 84 },
    ],
    monthlyReports: [
      { label: "Jul", reports: 25, approved: 20, flagged: 5 },
      { label: "Aug", reports: 42, approved: 35, flagged: 7 },
      { label: "Sep", reports: 68, approved: 58, flagged: 10 },
      { label: "Oct", reports: 95, approved: 82, flagged: 13 },
      { label: "Nov", reports: 120, approved: 102, flagged: 18 },
      { label: "Dec", reports: 145, approved: 125, flagged: 20 },
      { label: "Jan", reports: 168, approved: 145, flagged: 23 },
      { label: "Feb", reports: 190, approved: 165, flagged: 25 },
      { label: "Mar", reports: 215, approved: 188, flagged: 27 },
      { label: "Apr", reports: 238, approved: 208, flagged: 30 },
      { label: "May", reports: 260, approved: 228, flagged: 32 },
      { label: "Jun", reports: 285, approved: 250, flagged: 35 },
    ],
    propertiesAdded: [
      { label: "Jul", commercial: 10, residential: 15 },
      { label: "Aug", commercial: 16, residential: 22 },
      { label: "Sep", commercial: 22, residential: 30 },
      { label: "Oct", commercial: 30, residential: 42 },
      { label: "Nov", commercial: 38, residential: 52 },
      { label: "Dec", commercial: 45, residential: 60 },
      { label: "Jan", commercial: 52, residential: 68 },
      { label: "Feb", commercial: 58, residential: 75 },
      { label: "Mar", commercial: 64, residential: 82 },
      { label: "Apr", commercial: 70, residential: 90 },
      { label: "May", commercial: 78, residential: 98 },
      { label: "Jun", commercial: 85, residential: 108 },
    ],
    riskDistribution: [
      { name: "Low Risk (< 25)", value: 1450, color: "#10B981" },
      { name: "Moderate Risk (25-50)", value: 820, color: "#F59E0B" },
      { name: "High Risk (> 50)", value: 490, color: "#F43F5E" },
    ],
    roleDistribution: [
      { name: "Buyers", value: 1120, color: "#3B82F6" },
      { name: "Agents", value: 740, color: "#8B5CF6" },
      { name: "Legal Reviewers", value: 510, color: "#F59E0B" },
      { name: "Financial Inst.", value: 380, color: "#10B981" },
      { name: "Administrators", value: 18, color: "#06B6D4" },
    ],
    activeUsers: [
      { label: "Jul", active: 110 },
      { label: "Aug", active: 220 },
      { label: "Sep", active: 340 },
      { label: "Oct", active: 480 },
      { label: "Nov", active: 610 },
      { label: "Dec", active: 730 },
      { label: "Jan", active: 810 },
      { label: "Feb", active: 880 },
      { label: "Mar", active: 910 },
      { label: "Apr", active: 925 },
      { label: "May", active: 935 },
      { label: "Jun", active: 942 },
    ],
    reportTrends: [
      { label: "Q3 2025", legalAudits: 135, taxVerifications: 105 },
      { label: "Q4 2025", legalAudits: 260, taxVerifications: 200 },
      { label: "Q1 2026", legalAudits: 390, taxVerifications: 310 },
      { label: "Q2 2026", legalAudits: 485, taxVerifications: 382 },
    ],
    apiUsage: [
      { label: "Q3 2025", requests: 180000, latencyMs: 52 },
      { label: "Q4 2025", requests: 320000, latencyMs: 47 },
      { label: "Q1 2026", requests: 460000, latencyMs: 43 },
      { label: "Q2 2026", requests: 580000, latencyMs: 40 },
    ],
  },
};

function FinancialAnalytics() {
  const [timeRange, setTimeRange] = useState("6M");

  // Dynamically select datasets based on active timeRange
  const activeDataset = useMemo(() => {
    return TIMELINE_DATASETS[timeRange] || TIMELINE_DATASETS["6M"];
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    showToast(`Updated chart timeline to ${range} (${TIMELINE_DATASETS[range].label})`, "info");
  };

  const handleExportTelemetry = () => {
    exportToPdf(`System_Analytics_Telemetry_${timeRange}_2026`, {
      timeline: activeDataset.label,
      totalUsers: 1284,
      activeUsers: 942,
      totalProperties: 452,
      reportsGenerated: 892,
      systemHealth: "99.98%",
    });
    showSuccessAlert(
      "Telemetry Report Exported",
      `8-chart analytics telemetry dossier (${timeRange}) exported to PDF.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* HEADER BAR */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-bold mb-2">
              <BarChart3 size={14} /> Executive System Analytics & Yield Telemetry
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform Analytics ({timeRange})
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active Timeline: <strong className="text-blue-600 dark:text-cyan-400">{activeDataset.label}</strong> • All 8 visual charts dynamically adapt data points per selected timeline.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* TIMELINE CONTROLS BUTTONS */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              {["1M", "3M", "6M", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`py-1.5 px-3 rounded-xl font-bold cursor-pointer transition-all ${
                    timeRange === range
                      ? "bg-blue-600 text-white shadow-xs scale-105"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportTelemetry}
              className="py-2 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* 8 DYNAMIC RECHARTS GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={timeRange}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* CHART 1: USER GROWTH */}
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> 1. User Growth ({timeRange})
                </h2>
                <Badge variant="primary">{activeDataset.label}</Badge>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeDataset.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Area type="monotone" dataKey="totalUsers" name="Total Platform Users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="newUsers" name="New User Velocity" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 2: MONTHLY REPORTS */}
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-purple-500" /> 2. Reports Output ({timeRange})
                </h2>
                <Badge variant="info">{activeDataset.label}</Badge>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeDataset.monthlyReports} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Bar dataKey="approved" name="Approved Reports" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="flagged" name="Risk Flagged" fill="#F43F5E" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 3: PROPERTIES ADDED */}
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-500" /> 3. Properties Added ({timeRange})
                </h2>
                <Badge variant="success">{activeDataset.label}</Badge>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeDataset.propertiesAdded} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Area type="monotone" dataKey="commercial" name="Commercial Parcels" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="residential" name="Residential Parcels" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 4: RISK DISTRIBUTION */}
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield size={16} className="text-amber-500" /> 4. Risk Index Distribution ({timeRange})
                </h2>
                <Badge variant="warning">{activeDataset.label}</Badge>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={activeDataset.riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                      {activeDataset.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-risk-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 5: ROLE DISTRIBUTION */}
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieIcon size={16} className="text-cyan-500" /> 5. Role Distribution ({timeRange})
                </h2>
                <Badge variant="info">{activeDataset.label}</Badge>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={activeDataset.roleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                      {activeDataset.roleDistribution.map((entry, index) => (
                        <Cell key={`cell-role-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 6: ACTIVE USERS CONCURRENCY */}
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" /> 6. Active Users Concurrency ({timeRange})
                </h2>
                <Badge variant="success">{activeDataset.label}</Badge>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeDataset.activeUsers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Line type="monotone" dataKey="active" name="Active Concurrency" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 7: REPORT TRENDS */}
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-500" /> 7. Report Volume Trends ({timeRange})
                </h2>
                <Badge variant="info">{activeDataset.label}</Badge>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeDataset.reportTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Bar dataKey="legalAudits" name="Legal Encumbrance Audits" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="taxVerifications" name="Tax Clearance Verifications" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 8: API USAGE & LATENCY */}
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal size={16} className="text-teal-500" /> 8. API Volume & Response Latency ({timeRange})
                </h2>
                <Badge variant="success">{activeDataset.label}</Badge>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeDataset.apiUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="label" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", color: "#FFF", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Area type="monotone" dataKey="requests" name="API Request Volume" stroke="#0D9488" fill="#0D9488" fillOpacity={0.25} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default FinancialAnalytics;
