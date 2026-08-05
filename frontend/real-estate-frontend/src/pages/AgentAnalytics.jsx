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
} from "recharts";
import {
  TrendingUp,
  Building2,
  DollarSign,
  FileText,
  Users,
  ShieldCheck,
  MapPin,
  Award,
  ArrowUpRight,
  Home,
  Activity,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";

// MASTER TIME-RANGE DATASETS

const ANALYTICS_BY_RANGE = {
  "2026_YTD": {
    kpis: {
      revenue: "₹ 348.50 Cr",
      revenueGrowth: "+24.8%",
      propertiesSold: "149 Parcels",
      salesGrowth: "+18.2%",
      reportsGenerated: "317 Reports",
      reportsBadge: "100% 13-Vector Clear",
      asp: "₹ 24.50 Cr",
      aspGrowth: "+12.4%",
      peakMonth: "Peak: ₹ 54.1 Cr (Jun)",
    },
    revenueAndSales: [
      { month: "Jan", revenue: 28.5, propertiesSold: 12, reports: 24, clients: 45 },
      { month: "Feb", revenue: 34.2, propertiesSold: 15, reports: 31, clients: 52 },
      { month: "Mar", revenue: 42.0, propertiesSold: 18, reports: 38, clients: 61 },
      { month: "Apr", revenue: 38.6, propertiesSold: 16, reports: 35, clients: 68 },
      { month: "May", revenue: 48.9, propertiesSold: 21, reports: 44, clients: 76 },
      { month: "Jun", revenue: 54.1, propertiesSold: 24, reports: 50, clients: 84 },
      { month: "Jul", revenue: 49.3, propertiesSold: 20, reports: 46, clients: 90 },
      { month: "Aug", revenue: 53.4, propertiesSold: 23, reports: 49, clients: 96 },
    ],
    riskDistribution: [
      { name: "Low Risk (<25)", value: 68, color: "#10B981" },
      { name: "Moderate Risk (25-50)", value: 22, color: "#F59E0B" },
      { name: "High Risk (>50)", value: 10, color: "#EF4444" },
    ],
    marketTrends: [
      { month: "Jan", commercial: 100, residential: 100 },
      { month: "Feb", commercial: 108, residential: 104 },
      { month: "Mar", commercial: 115, residential: 109 },
      { month: "Apr", commercial: 124, residential: 114 },
      { month: "May", commercial: 132, residential: 120 },
      { month: "Jun", commercial: 145, residential: 127 },
      { month: "Jul", commercial: 149, residential: 130 },
      { month: "Aug", commercial: 158, residential: 136 },
    ],
    aspByType: [
      { type: "Commercial Office", asp: 42.5 },
      { type: "IT Tech Parks", asp: 68.0 },
      { type: "SEZ Industrial", asp: 34.2 },
      { type: "Luxury Residential", asp: 18.5 },
      { type: "Retail Outlets", asp: 28.0 },
    ],
    topCities: [
      { city: "Hyderabad", deals: 48, revenue: 142.5 },
      { city: "Bengaluru", deals: 36, revenue: 118.0 },
      { city: "Mumbai", deals: 24, revenue: 185.2 },
      { city: "NCR (Gurugram)", deals: 20, revenue: 94.6 },
      { city: "Pune", deals: 14, revenue: 58.0 },
    ],
  },

  "6M": {
    kpis: {
      revenue: "₹ 286.30 Cr",
      revenueGrowth: "+19.4%",
      propertiesSold: "122 Parcels",
      salesGrowth: "+15.1%",
      reportsGenerated: "254 Reports",
      reportsBadge: "99.2% Accuracy",
      asp: "₹ 25.80 Cr",
      aspGrowth: "+14.2%",
      peakMonth: "Peak: ₹ 54.1 Cr (Jun)",
    },
    revenueAndSales: [
      { month: "Mar", revenue: 42.0, propertiesSold: 18, reports: 38, clients: 61 },
      { month: "Apr", revenue: 38.6, propertiesSold: 16, reports: 35, clients: 68 },
      { month: "May", revenue: 48.9, propertiesSold: 21, reports: 44, clients: 76 },
      { month: "Jun", revenue: 54.1, propertiesSold: 24, reports: 50, clients: 84 },
      { month: "Jul", revenue: 49.3, propertiesSold: 20, reports: 46, clients: 90 },
      { month: "Aug", revenue: 53.4, propertiesSold: 23, reports: 49, clients: 96 },
    ],
    riskDistribution: [
      { name: "Low Risk (<25)", value: 72, color: "#10B981" },
      { name: "Moderate Risk (25-50)", value: 20, color: "#F59E0B" },
      { name: "High Risk (>50)", value: 8, color: "#EF4444" },
    ],
    marketTrends: [
      { month: "Mar", commercial: 115, residential: 109 },
      { month: "Apr", commercial: 124, residential: 114 },
      { month: "May", commercial: 132, residential: 120 },
      { month: "Jun", commercial: 145, residential: 127 },
      { month: "Jul", commercial: 149, residential: 130 },
      { month: "Aug", commercial: 158, residential: 136 },
    ],
    aspByType: [
      { type: "Commercial Office", asp: 44.0 },
      { type: "IT Tech Parks", asp: 71.5 },
      { type: "SEZ Industrial", asp: 36.0 },
      { type: "Luxury Residential", asp: 19.8 },
      { type: "Retail Outlets", asp: 29.5 },
    ],
    topCities: [
      { city: "Hyderabad", deals: 40, revenue: 118.0 },
      { city: "Bengaluru", deals: 30, revenue: 98.0 },
      { city: "Mumbai", deals: 20, revenue: 154.0 },
      { city: "NCR (Gurugram)", deals: 18, revenue: 82.5 },
      { city: "Pune", deals: 12, revenue: 48.0 },
    ],
  },

  "1Y": {
    kpis: {
      revenue: "₹ 512.80 Cr",
      revenueGrowth: "+31.2%",
      propertiesSold: "215 Parcels",
      salesGrowth: "+22.6%",
      reportsGenerated: "468 Reports",
      reportsBadge: "100% Legal Clearance",
      asp: "₹ 23.90 Cr",
      aspGrowth: "+16.8%",
      peakMonth: "Peak: ₹ 54.1 Cr (Jun 2026)",
    },
    revenueAndSales: [
      { month: "Sep 25", revenue: 22.0, propertiesSold: 9, reports: 18, clients: 28 },
      { month: "Oct 25", revenue: 24.5, propertiesSold: 11, reports: 20, clients: 32 },
      { month: "Nov 25", revenue: 26.0, propertiesSold: 10, reports: 22, clients: 36 },
      { month: "Dec 25", revenue: 31.2, propertiesSold: 13, reports: 26, clients: 40 },
      { month: "Jan 26", revenue: 28.5, propertiesSold: 12, reports: 24, clients: 45 },
      { month: "Feb 26", revenue: 34.2, propertiesSold: 15, reports: 31, clients: 52 },
      { month: "Mar 26", revenue: 42.0, propertiesSold: 18, reports: 38, clients: 61 },
      { month: "Apr 26", revenue: 38.6, propertiesSold: 16, reports: 35, clients: 68 },
      { month: "May 26", revenue: 48.9, propertiesSold: 21, reports: 44, clients: 76 },
      { month: "Jun 26", revenue: 54.1, propertiesSold: 24, reports: 50, clients: 84 },
      { month: "Jul 26", revenue: 49.3, propertiesSold: 20, reports: 46, clients: 90 },
      { month: "Aug 26", revenue: 53.4, propertiesSold: 23, reports: 49, clients: 96 },
    ],
    riskDistribution: [
      { name: "Low Risk (<25)", value: 64, color: "#10B981" },
      { name: "Moderate Risk (25-50)", value: 24, color: "#F59E0B" },
      { name: "High Risk (>50)", value: 12, color: "#EF4444" },
    ],
    marketTrends: [
      { month: "Sep 25", commercial: 92, residential: 94 },
      { month: "Nov 25", commercial: 98, residential: 98 },
      { month: "Jan 26", commercial: 108, residential: 104 },
      { month: "Mar 26", commercial: 115, residential: 109 },
      { month: "May 26", commercial: 132, residential: 120 },
      { month: "Jul 26", commercial: 149, residential: 130 },
      { month: "Aug 26", commercial: 158, residential: 136 },
    ],
    aspByType: [
      { type: "Commercial Office", asp: 41.2 },
      { type: "IT Tech Parks", asp: 65.0 },
      { type: "SEZ Industrial", asp: 32.5 },
      { type: "Luxury Residential", asp: 17.8 },
      { type: "Retail Outlets", asp: 26.4 },
    ],
    topCities: [
      { city: "Hyderabad", deals: 72, revenue: 210.5 },
      { city: "Bengaluru", deals: 54, revenue: 176.0 },
      { city: "Mumbai", deals: 38, revenue: 292.0 },
      { city: "NCR (Gurugram)", deals: 28, revenue: 132.0 },
      { city: "Pune", deals: 22, revenue: 88.0 },
    ],
  },
};

function AgentAnalytics() {
  const [timeRange, setTimeRange] = useState("2026_YTD");

  // Dynamic Dataset for active time range
  const currentData = useMemo(() => {
    return ANALYTICS_BY_RANGE[timeRange] || ANALYTICS_BY_RANGE["2026_YTD"];
  }, [timeRange]);

  const { kpis, revenueAndSales, riskDistribution, marketTrends, aspByType, topCities } = currentData;

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-cyan-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Executive Analytics & Performance Intelligence
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono font-bold text-xs border border-cyan-200 dark:border-cyan-800">
            METRICS UPDATED DYNAMICALLY
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-mono font-bold mb-2">
              <Activity size={14} /> Performance Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📊 Analytics & Market Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Track revenue velocity, property sales volume, client growth curves, risk distribution, market trends, and top city performance.
            </p>
          </div>

          {/* DYNAMIC TIME RANGE SWITCHER (2026 YTD, Last 6 Months, Full Year) */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0F172A] p-1.5 rounded-2xl border border-slate-200 dark:border-[#334155] text-xs font-mono font-bold shrink-0">
            {[
              { id: "2026_YTD", label: "2026 YTD" },
              { id: "6M", label: "Last 6 Months" },
              { id: "1Y", label: "Full Year" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeRange === t.id
                    ? "bg-white dark:bg-[#1E293B] text-cyan-600 dark:text-cyan-400 shadow-xs border border-slate-200 dark:border-[#334155]"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. TOP-LEVEL DYNAMIC REUSABLE KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Monthly Revenue */}
          <motion.div key={`kpi-1-${timeRange}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Gross Revenue</span>
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400"><DollarSign size={16} /></span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpis.revenue}</h3>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight size={14} /> {kpis.revenueGrowth} vs prior period
              </p>
            </div>
          </motion.div>

          {/* KPI 2: Properties Sold */}
          <motion.div key={`kpi-2-${timeRange}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Properties Sold</span>
              <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400"><Building2 size={16} /></span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpis.propertiesSold}</h3>
              <p className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight size={14} /> {kpis.salesGrowth} deal closure rate
              </p>
            </div>
          </motion.div>

          {/* KPI 3: Reports Generated */}
          <motion.div key={`kpi-3-${timeRange}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Reports Generated</span>
              <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300"><FileText size={16} /></span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpis.reportsGenerated}</h3>
              <p className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight size={14} /> {kpis.reportsBadge}
              </p>
            </div>
          </motion.div>

          {/* KPI 4: Average Selling Price */}
          <motion.div key={`kpi-4-${timeRange}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Avg Selling Price</span>
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300"><Award size={16} /></span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">{kpis.asp}</h3>
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight size={14} /> {kpis.aspGrowth} land appreciation
              </p>
            </div>
          </motion.div>
        </div>

        {/* 2. CHARTS SECTION - ROW 1: Monthly Revenue & Properties Sold */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Monthly Revenue Velocity (Area Chart) */}
          <motion.div key={`chart-rev-${timeRange}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-7 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-600 dark:text-cyan-400">FINANCIAL VELOCITY</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  💰 Monthly Revenue (₹ Cr)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {kpis.peakMonth}
              </span>
            </div>

            <div className="h-72 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueAndSales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "12px", color: "#F8FAFC" }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue (₹ Cr)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: Properties Sold (Bar Chart) */}
          <motion.div key={`chart-sales-${timeRange}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-5 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-cyan-400">DEAL CLOSURE VOLUME</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  📈 Properties Sold per Month
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                {kpis.propertiesSold} Total
              </span>
            </div>

            <div className="h-72 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueAndSales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "12px", color: "#F8FAFC" }} />
                  <Bar dataKey="propertiesSold" name="Parcels Sold" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* 3. CHARTS SECTION - ROW 2: Risk Distribution & Reports Generated & Client Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 3: Risk Distribution (Donut / Pie Chart) */}
          <motion.div key={`chart-risk-${timeRange}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-4 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400">PORTFOLIO HEALTH</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                🛡️ Risk Distribution
              </h3>
            </div>

            <div className="h-56 w-full font-mono text-xs flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "12px", color: "#F8FAFC" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#334155] text-xs font-mono">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{item.name}</span>
                  </div>
                  <strong className="text-slate-900 dark:text-white font-extrabold">{item.value}%</strong>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chart 4: Reports Generated & Client Growth (Bar Chart) */}
          <motion.div key={`chart-rep-${timeRange}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-8 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-purple-600 dark:text-purple-400">AUDIT PIPELINE & CLIENTS</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  📄 Reports Generated & Client Growth
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Reports Issued
                </span>
                <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Active Clients
                </span>
              </div>
            </div>

            <div className="h-72 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueAndSales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "12px", color: "#F8FAFC" }} />
                  <Bar dataKey="reports" name="Reports Generated" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="clients" name="Active Clients" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* 4. CHARTS SECTION - ROW 3: Market Trends & Average Selling Price & Top Cities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 5: Market Trends Index (Line Chart) */}
          <motion.div key={`chart-[#trends]-${timeRange}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-4 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400">APPRECIATION VELOCITY</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                📉 Market Trends Index
              </h3>
            </div>

            <div className="h-64 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "12px", color: "#F8FAFC" }} />
                  <Line type="monotone" dataKey="commercial" name="Commercial Index" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="residential" name="Residential Index" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 6: Average Selling Price (ASP) per Property Type */}
          <motion.div key={`chart-asp-${timeRange}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-4 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-cyan-400">VALUATION BENCHMARK</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                🏷️ Average Selling Price (Cr)
              </h3>
            </div>

            <div className="h-64 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aspByType} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" stroke="#94A3B8" />
                  <YAxis dataKey="type" type="category" stroke="#94A3B8" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "12px", color: "#F8FAFC" }} />
                  <Bar dataKey="asp" name="ASP (₹ Cr)" fill="#6366F1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 7: Top Cities Performance */}
          <motion.div key={`chart-cities-${timeRange}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-4 white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-rose-600 dark:text-rose-400">GEOGRAPHIC DISTRIBUTION</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                🏙️ Top Cities Deal Volume
              </h3>
            </div>

            <div className="space-y-3 pt-2 font-mono text-xs">
              {topCities.map((item) => (
                <div key={item.city} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                      <MapPin size={13} className="text-cyan-500" /> {item.city}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold">
                      {item.deals} Deals (₹ {item.revenue} Cr)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#0F172A] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${(item.deals / topCities[0].deals) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AgentAnalytics;
