import React from "react";
import MainLayout from "../components/layout/MainLayout";
import StatCard from "../components/dashboard/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentSearches from "../components/dashboard/RecentSearches";
import { ShieldCheck, Sparkles, ArrowUpRight, Award, ChevronRight, Home } from "lucide-react";

function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Home size={14} className="text-slate-400" />
          <span>/</span>
          <span className="text-slate-900 font-semibold">Dashboard Overview</span>
        </div>

        {/* Hero Welcome Analytics Card (Light Enterprise SaaS Style) */}
        <div className="white-card rounded-2xl p-6 lg:p-8 bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                <Sparkles size={14} /> Real Estate Intelligence Platform
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back, Rama Charan
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed">
                Monitor property ownership chains, zoning constraints, municipal tax assessments, flood zone risks, and permit compliance.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <ShieldCheck size={14} className="text-emerald-600" /> Active Workspace: <strong className="text-slate-800">Enterprise Auditor</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Award size={14} className="text-blue-600" /> Verification Confidence: <strong className="text-slate-800">99.8%</strong>
                </span>
              </div>
            </div>

            {/* Quick Statistics Metric Pill */}
            <div className="shrink-0">
              <div className="rounded-2xl p-5 bg-slate-50 border border-slate-200 text-center min-w-[200px]">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Today's Property Audits
                </p>
                <h2 className="text-4xl font-extrabold text-slate-900 mt-1 font-mono">
                  18
                </h2>
                <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-semibold mt-2">
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