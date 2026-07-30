import React from "react";
import MainLayout from "../components/layout/MainLayout";
import StatCard from "../components/dashboard/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentSearches from "../components/dashboard/RecentSearches";
import { ShieldCheck, Sparkles, ArrowUpRight, Award, ChevronRight, Home } from "lucide-react";

function Dashboard() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName || ""}`.trim() : storedUser.name || "Rama Charan";
  const userRole = storedUser.role || "Enterprise Auditor";

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#CBD5E1] font-medium">
          <Home size={14} className="text-slate-400 dark:text-cyan-400" />
          <span>/</span>
          <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">Dashboard Overview</span>
        </div>

        {/* Hero Welcome Analytics Card */}
        <div className="white-card rounded-2xl p-6 lg:p-7 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
                <Sparkles size={14} /> Real Estate Intelligence Platform
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
                Welcome back, {userName}
              </h1>

              <p className="text-slate-600 dark:text-[#CBD5E1] text-sm leading-relaxed">
                Monitor property ownership chains, zoning constraints, municipal tax assessments, flood zone risks, and permit compliance.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0F172A] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#334155]">
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" /> Active Workspace: <strong className="text-slate-800 dark:text-slate-200">{userRole}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0F172A] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#334155]">
                  <Award size={14} className="text-blue-600 dark:text-cyan-400" /> Verification Confidence: <strong className="text-slate-800 dark:text-slate-200">99.8%</strong>
                </span>
              </div>
            </div>

            {/* Quick Statistics Metric Pill */}
            <div className="shrink-0">
              <div className="rounded-2xl p-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-center min-w-[200px]">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Today's Property Audits
                </p>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-1 font-mono">
                  18
                </h2>
                <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                  <ArrowUpRight size={14} />
                  <span>+24% vs last week</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Statistics KPI Cards */}
        <StatCard />

        {/* Quick Diligence Action Cards */}
        <QuickActions />

        {/* Recent Property Audits Table */}
        <RecentSearches />
      </div>
    </MainLayout>
  );
}

export default Dashboard;