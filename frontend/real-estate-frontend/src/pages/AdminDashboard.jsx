import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Users,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Activity,
  Award,
  ArrowUpRight,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { showToast } from "../utils/swal";

// Modular Reusable SVG Bar Chart Component (Structured to take API data props seamlessly)
const MonthlyTrendsBarChart = ({ data = [] }) => {
  const maxVal = Math.max(...data.map((d) => d.val), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2">
        {data.map((item, idx) => {
          const heightPct = Math.round((item.val / maxVal) * 100);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <span className="text-[10px] font-mono text-slate-400 dark:text-[#94A3B8] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                {item.val}
              </span>
              <div className="w-full max-w-[32px] bg-slate-100 dark:bg-[#0F172A] rounded-t-lg h-full flex items-end p-0.5 border border-slate-200/80 dark:border-[#334155]">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-md group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-[#94A3B8]">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Modular Reusable Risk Donut Chart Component
const RiskDistributionDonutChart = ({ distribution = [] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-2">
        <div className="relative w-40 h-40 rounded-full border-8 border-emerald-500 border-r-amber-500 border-b-rose-500 flex items-center justify-center shadow-md bg-slate-900/10 dark:bg-slate-900/60">
          <div className="text-center font-mono">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">100%</span>
            <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] block uppercase">Audit Scope</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2 text-xs font-mono">
        {distribution.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155]">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-slate-700 dark:text-[#CBD5E1] font-bold">{item.label}</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#F8FAFC]">{item.value}% ({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [loading, setLoading] = useState(false);

  // Demo Admin Analytics Data (Props structured for future backend API replacement)
  const kpiData = {
    totalUsers: 1480,
    totalProperties: 3240,
    totalReports: 1290,
    pendingReviews: 18,
    completedReviews: 1272,
  };

  const monthlyData = [
    { month: "Jan", val: 82 },
    { month: "Feb", val: 94 },
    { month: "Mar", val: 110 },
    { month: "Apr", val: 105 },
    { month: "May", val: 135 },
    { month: "Jun", val: 160 },
    { month: "Jul", val: 185 },
  ];

  const riskDistributionData = [
    { label: "Low Risk (Approved)", value: 78, count: "1,006", color: "bg-emerald-500" },
    { label: "Moderate Risk (Conditional)", value: 16, count: "206", color: "bg-amber-500" },
    { label: "High Risk (Flagged)", value: 6, count: "78", color: "bg-rose-500" },
  ];

  const handleRefreshAnalytics = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Admin telemetry and analytics refreshed", "success");
    }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Activity size={14} /> Executive Admin Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              ⚡ Platform Executive Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Monitor total registered workspace users, property parcel audits, risk distribution metrics, and system telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={handleRefreshAnalytics} variant="secondary" size="sm" icon={RotateCcw} loading={loading}>
              Refresh Telemetry
            </Button>
          </div>
        </div>

        {/* 5 Core Enterprise KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Total Users</p>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400">
                <Users size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono">{kpiData.totalUsers.toLocaleString()}</h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ArrowUpRight size={13} /> +12% this month
            </span>
          </div>

          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Total Properties</p>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <Building2 size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono">{kpiData.totalProperties.toLocaleString()}</h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ArrowUpRight size={13} /> +240 new parcels
            </span>
          </div>

          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Total Reports</p>
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
                <FileText size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono">{kpiData.totalReports.toLocaleString()}</h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ArrowUpRight size={13} /> +18% output
            </span>
          </div>

          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Pending Reviews</p>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <Clock size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">{kpiData.pendingReviews}</h3>
            <span className="text-[11px] font-medium text-slate-400 dark:text-[#94A3B8]">Audits in queue</span>
          </div>

          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Completed Reviews</p>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono">{kpiData.completedReviews.toLocaleString()}</h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">98.6% Completion</span>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Chart: Monthly Report Activity Trend */}
          <div className="lg:col-span-7 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  Monthly Report Generation Activity
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#CBD5E1]">Audits completed per calendar month</p>
              </div>
              <Badge variant="info">Year 2026</Badge>
            </div>

            <MonthlyTrendsBarChart data={monthlyData} />
          </div>

          {/* Right Chart: Risk Distribution */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  System Risk Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#CBD5E1]">Audited property risk breakdown</p>
              </div>
            </div>

            <RiskDistributionDonutChart distribution={riskDistributionData} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;
