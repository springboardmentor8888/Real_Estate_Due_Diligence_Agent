import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Scale,
  ShieldCheck,
  FileText,
  AlertOctagon,
  FileSearch,
  CheckSquare,
  Home,
  ChevronRight,
  UserCheck,
  Map,
  History,
  Clock,
  Bell,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Users,
  Building2,
  FileCheck2,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import DashboardHeroHeader from "../components/dashboard/DashboardHeroHeader";
import StatCard from "../components/dashboard/StatCard";
import LegalKpiCards from "../components/dashboard/LegalKpiCards";
import QuickActions from "../components/dashboard/QuickActions";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { legalDashboardData } from "../mock/legalData";
import { getLiveLegalReviews } from "../services/liveStore";
import { showToast } from "../utils/swal";

function LegalDashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.firstName
    ? `${storedUser.firstName} ${storedUser.lastName || ""}`.trim()
    : storedUser.name || "Adv. Rajesh Sharma";
  const userRole = "Legal Reviewer";

  const [reviews, setReviews] = useState(getLiveLegalReviews);

  useEffect(() => {
    const syncLiveData = () => {
      setReviews(getLiveLegalReviews());
    };

    window.addEventListener("live_data_updated", syncLiveData);
    window.addEventListener("storage", syncLiveData);
    return () => {
      window.removeEventListener("live_data_updated", syncLiveData);
      window.removeEventListener("storage", syncLiveData);
    };
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Legal Reviewer Control Center
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SUB-REGISTRAR AUDIT ACTIVE
          </span>
        </div>

        {/* 1. WELCOME SECTION */}
        <DashboardHeroHeader userName={userName} userRole={userRole} />

        {/* 2. REUSABLE DASHBOARD KPI CARDS (6 CARDS) */}
        <LegalKpiCards cards={legalDashboardData.kpiCards} />

        {/* 3. QUICK ACTIONS */}
        <QuickActions
          title="⚡ Legal Audit & Signoff Operations"
          subtitle="Execute 30-year title deed verification, permit compliance checks, and legal report signoffs."
          actions={legalDashboardData.quickActions}
        />

        {/* 4. ASSIGNED REVIEWS QUEUE TABLE */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                LEGAL AUDIT QUEUE
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                📜 Assigned Reviews Queue
              </h2>
            </div>
            <button
              onClick={() => navigate("/legal/reviews")}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              <span>View Full Review Register</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                  <th className="p-4">Review ID</th>
                  <th className="p-4">Property Parcel</th>
                  <th className="p-4">Client Organization</th>
                  <th className="p-4">Deed Type</th>
                  <th className="p-4">Assigned Date</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-right">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155] text-slate-700 dark:text-slate-200">
                {legalDashboardData.assignedReviews.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate("/legal/reviews")}
                    className="hover:bg-slate-50 dark:hover:bg-[#0F172A] cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold text-blue-600 dark:text-cyan-400">{item.id}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{item.property}</td>
                    <td className="p-4 font-medium">{item.client}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{item.deedType}</td>
                    <td className="p-4 text-slate-400">{item.assignedDate}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.priority === "CRITICAL" ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300" :
                        item.priority === "HIGH" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300" :
                        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-cyan-300"
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Badge variant={item.variant}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2 COLUMNS: RECENT LEGAL ACTIVITIES & NOTIFICATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 5. RECENT LEGAL ACTIVITIES (7 Cols) */}
          <div className="lg:col-span-7 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  LEGAL TELEMETRY AUDIT
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  ⚡ Recent Legal Activities
                </h2>
              </div>
              <button onClick={() => navigate("/activity")} className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer">
                Activity Log
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {legalDashboardData.recentLegalActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/70 dark:bg-[#0F172A]/70 space-y-2 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">{act.action} • {act.time}</span>
                    <Badge variant={act.variant}>{act.status}</Badge>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">{act.title}</h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-[#334155]">
                    <span>🏢 {act.property}</span>
                    <span>👤 {act.reviewer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. NOTIFICATIONS (5 Cols) */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  SYSTEM ALERTS & DISPATCHES
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  🔔 Notifications
                </h2>
              </div>
              <button onClick={() => navigate("/notifications")} className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer">
                Alert Center
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {legalDashboardData.notifications.map((ntf) => (
                <div
                  key={ntf.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    ntf.unread
                      ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/80"
                      : "bg-slate-50/70 dark:bg-[#0F172A]/70 border-slate-200 dark:border-[#334155]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span className="text-amber-600 dark:text-amber-400">{ntf.priority} PRIORITY</span>
                    <span className="text-slate-400">{ntf.time}</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">{ntf.title}</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{ntf.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. UPCOMING DEADLINES SECTION */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                TIME CRITICAL COMPLIANCE
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                ⏰ Upcoming Deadlines
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {legalDashboardData.upcomingDeadlines.map((dl) => (
              <div
                key={dl.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">{dl.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 text-[10px]">
                      {dl.daysRemaining}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{dl.title}</h3>
                  <p className="text-[11px] text-slate-500 font-bold">🏢 {dl.property}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-[#334155] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-bold">Due: {dl.dueDate}</span>
                  <Badge variant={dl.variant}>{dl.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default LegalDashboard;
