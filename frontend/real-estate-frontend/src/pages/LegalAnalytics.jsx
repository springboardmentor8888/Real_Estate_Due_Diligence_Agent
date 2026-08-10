import React, { useState, useMemo } from "react";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Building2,
  FileText,
  Users,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Home,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  BarChart3,
  Calendar,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { showToast } from "../utils/swal";
import { exportToPdf } from "../utils/exportUtils";

// MASTER MOCK ANALYTICS DATASETS (THE 7 REQUIRED CHARTS & METRICS)
const MONTHLY_REVIEW_TREND = [
  { month: "Jan", completed: 14, pending: 3, avgTime: 2.4, docRate: 88.5 },
  { month: "Feb", completed: 18, pending: 4, avgTime: 2.1, docRate: 90.2 },
  { month: "Mar", completed: 22, pending: 5, avgTime: 1.9, docRate: 91.8 },
  { month: "Apr", completed: 19, pending: 3, avgTime: 2.0, docRate: 92.4 },
  { month: "May", completed: 25, pending: 6, avgTime: 1.7, docRate: 93.6 },
  { month: "Jun", completed: 28, pending: 7, avgTime: 1.6, docRate: 94.8 },
  { month: "Jul", completed: 24, pending: 5, avgTime: 1.8, docRate: 95.2 },
  { month: "Aug", completed: 27, pending: 4, avgTime: 1.5, docRate: 96.1 },
];

const RISK_DISTRIBUTION_DATA = [
  { name: "Low Risk (<25)", value: 68, color: "#10B981" },
  { name: "Medium Risk (25-50)", value: 22, color: "#F59E0B" },
  { name: "High Risk (>50)", value: 10, color: "#F43F5E" },
];

const TOP_RISK_CATEGORIES_DATA = [
  { category: "High Court Litigation Stay", count: 18, color: "#F43F5E" },
  { category: "FAR & Setback Non-Compliance", count: 14, color: "#F59E0B" },
  { category: "Sub-Registrar Lien Record", count: 11, color: "#3B82F6" },
  { category: "Municipal Tax Arrears", count: 8, color: "#8B5CF6" },
  { category: "Missing Ancestral Link Deed", count: 5, color: "#EC4899" },
];

const DOCUMENT_VERIFICATION_RATE_DATA = [
  { month: "Jan", verifiedRate: 88.5, target: 90 },
  { month: "Feb", verifiedRate: 90.2, target: 90 },
  { month: "Mar", verifiedRate: 91.8, target: 92 },
  { month: "Apr", verifiedRate: 92.4, target: 92 },
  { month: "May", verifiedRate: 93.6, target: 95 },
  { month: "Jun", verifiedRate: 94.8, target: 95 },
  { month: "Jul", verifiedRate: 95.2, target: 95 },
  { month: "Aug", verifiedRate: 96.1, target: 95 },
];

function LegalAnalytics() {
  const [timeRange, setTimeRange] = useState("2026_YTD");

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Sub-Registrar Legal Analytics & Telemetry
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            ANALYTICS ENGINE • REAL-TIME DISPATCH
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <TrendingUp size={14} /> Title Audit Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📈 Legal Review Analytics & Metrics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Telemetry metrics for completed reviews, pending queues, turnaround times, risk distribution, document verification rates, and top risk categories.
            </p>
          </div>

          {/* Time Range Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0F172A] p-1.5 rounded-2xl border border-slate-200 dark:border-[#334155]">
            {[
              { id: "2026_YTD", label: "2026 YTD" },
              { id: "6M", label: "6 Months" },
              { id: "FULL_YEAR", label: "Full Year" },
            ].map((tab) => {
              const active = timeRange === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setTimeRange(tab.id);
                    showToast(`Loaded analytics range ${tab.label}`, "info");
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TOP 3 HIGHLIGHT KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* 1. Reviews Completed */}
          <motion.div whileHover={{ y: -4 }} className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">1. REVIEWS COMPLETED</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">195</h3>
              <span className="text-emerald-500 font-bold text-xs flex items-center gap-0.5">
                <ArrowUpRight size={14} /> +18.4% YTD
              </span>
            </div>
            <p className="text-slate-500 text-[11px] font-medium">100% verified with Sub-Registrar title deeds</p>
          </motion.div>

          {/* 2. Pending Reviews */}
          <motion.div whileHover={{ y: -4 }} className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">2. PENDING REVIEWS QUEUE</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">9</h3>
              <span className="text-amber-500 font-bold text-xs">3 Urgent Priority</span>
            </div>
            <p className="text-slate-500 text-[11px] font-medium">Average 4.2 hours queue waiting time</p>
          </motion.div>

          {/* 3. Average Review Time */}
          <motion.div whileHover={{ y: -4 }} className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase">3. AVERAGE REVIEW TIME</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">1.8 Days</h3>
              <span className="text-emerald-500 font-bold text-xs flex items-center gap-0.5">
                <ArrowUpRight size={14} /> 32% Faster
              </span>
            </div>
            <p className="text-slate-500 text-[11px] font-medium">Reduced turnaround time vs 2.6 days target</p>
          </motion.div>
        </div>

        {/* 2 COLUMNS: REVIEWS COMPLETED & MONTHLY REVIEW TREND (CHARTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 1. REVIEWS COMPLETED & PENDING (BAR CHART) - 6 Cols */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase">REVIEWS VOLUME</span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  📈 Reviews Completed vs Pending
                </h2>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_REVIEW_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#FFF", borderRadius: 12 }} />
                  <Legend />
                  <Bar dataKey="completed" name="Completed Reviews" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pending" name="Pending Queue" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6. MONTHLY REVIEW TREND (LINE CHART) - 6 Cols */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">MONTHLY TELEMETRY</span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  📉 Monthly Review Trend & Turnaround Speed
                </h2>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_REVIEW_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#FFF", borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Completed Reviews" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="avgTime" name="Avg Turnaround (Days)" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 2 COLUMNS: RISK DISTRIBUTION (PIE) & DOCUMENT VERIFICATION RATE (AREA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 4. RISK DISTRIBUTION (PIE CHART) - 5 Cols */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">TITLE RISK SPECTRUM</span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                🍕 Risk Distribution Breakdown
              </h2>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={RISK_DISTRIBUTION_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                    {RISK_DISTRIBUTION_DATA.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#FFF", borderRadius: 12 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. DOCUMENT VERIFICATION RATE (AREA CHART) - 7 Cols */}
          <div className="lg:col-span-7 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">VAULT OCR ACCURACY</span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                📊 Document Verification Rate (96.1% Current)
              </h2>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DOCUMENT_VERIFICATION_RATE_DATA}>
                  <defs>
                    <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis domain={[80, 100]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#FFF", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="verifiedRate" name="Verification Rate (%)" stroke="#10B981" fillOpacity={1} fill="url(#rateGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 7. TOP RISK CATEGORIES (HORIZONTAL BAR CHART) */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">INCIDENCE FREQUENCY</span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              🏆 Top Risk Categories (Litigation, Setbacks, Liens)
            </h2>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_RISK_CATEGORIES_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94A3B8" fontSize={10} width={180} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", color: "#FFF", borderRadius: 12 }} />
                <Bar dataKey="count" name="Flagged Risk Incidents" fill="#F43F5E" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default LegalAnalytics;
