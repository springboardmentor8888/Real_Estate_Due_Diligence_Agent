import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  FileText,
  TrendingUp,
  ClipboardList,
  ArrowRight,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import Button from "../common/Button";

function QuickActions() {
  const navigate = useNavigate();

  const reports = [
    {
      id: "risk-assessment",
      title: "Risk Assessment Report",
      description: "Comprehensive 0–100 risk score breakdown across legal, tax, flood, environmental & zoning vectors.",
      icon: ShieldAlert,
      path: "/risk-assessment",
      badge: "AI Risk Matrix",
      gradient: "from-blue-600 to-cyan-600",
      borderAccent: "border-l-4 border-l-blue-500",
    },
    {
      id: "due-diligence-report",
      title: "Property Due Diligence Report",
      description: "Formal 13-section institutional audit report formatted for digital reading and PDF/Excel export.",
      icon: FileText,
      path: "/due-diligence-report",
      badge: "Full Audit",
      gradient: "from-indigo-600 to-purple-600",
      borderAccent: "border-l-4 border-l-purple-500",
    },
    {
      id: "comparable-properties",
      title: "Comparable Property Analysis",
      description: "Regional market valuation benchmarks, price/sq.ft metrics, distance & similarity match matrix.",
      icon: TrendingUp,
      path: "/comparable-properties",
      badge: "Market Intel",
      gradient: "from-cyan-600 to-teal-600",
      borderAccent: "border-l-4 border-l-cyan-500",
    },
    {
      id: "tax-ownership",
      title: "Tax & Ownership Summary",
      description: "Historical land title ownership chain and municipal tax assessment challan receipts.",
      icon: ClipboardList,
      path: "/tax-history",
      badge: "Registry Trail",
      gradient: "from-emerald-600 to-green-600",
      borderAccent: "border-l-4 border-l-emerald-500",
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
            <BarChart3 size={14} /> Reporting Dashboard
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
            📊 Analytics & Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
            Access comprehensive due diligence analytics, risk evaluations, and executive report statements.
          </p>
        </div>

        <button
          onClick={() => navigate("/report-history")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-[#0F172A] hover:bg-slate-800 dark:hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-sm border border-slate-800 dark:border-[#334155] cursor-pointer shrink-0"
        >
          <span>All Archived Reports</span>
          <ChevronRight size={14} className="text-cyan-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reports.map((report) => {
          const Icon = report.icon;

          return (
            <div
              key={report.id}
              onClick={() => navigate(report.path)}
              className={`group relative p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] ${report.borderAccent} hover:border-blue-400 dark:hover:border-cyan-400 shadow-xs hover-lift transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${report.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-[#334155]">
                    {report.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors text-base leading-tight">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>View Report</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;