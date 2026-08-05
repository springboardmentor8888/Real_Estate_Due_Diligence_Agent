import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  FileText,
  Activity,
  BarChart3,
  Sliders,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { showToast } from "../../utils/swal";

// 6 Master Quick Action Buttons Required with Exact Registered Target Paths
export const MASTER_QUICK_ACTIONS = [
  {
    id: "qa-manage-users",
    title: "Manage Users",
    subtitle: "User Accounts & Roles",
    tooltip: "Manage system user accounts, roles & access permissions",
    path: "/user-management",
    icon: Users,
    cardStyle: "bg-blue-50/70 dark:bg-[#0F172A] border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 hover:border-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400",
  },
  {
    id: "qa-manage-properties",
    title: "Manage Properties",
    subtitle: "Search & Audit Parcels",
    tooltip: "Search, add & audit collateral property parcels and APNs",
    path: "/property-management",
    icon: Building2,
    cardStyle: "bg-purple-50/70 dark:bg-[#0F172A] border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:border-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
  },
  {
    id: "qa-view-reports",
    title: "View Reports",
    tooltip: "Access and export financial & legal due diligence audit dossiers",
    subtitle: "Diligence & Audit Dossiers",
    path: "/report-management",
    icon: FileText,
    cardStyle: "bg-emerald-50/70 dark:bg-[#0F172A] border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:border-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "qa-audit-logs",
    title: "Audit Logs",
    subtitle: "Telemetry & Time Feed",
    tooltip: "Inspect chronological platform activity & system audit telemetry",
    path: "/recent-activity",
    icon: Activity,
    cardStyle: "bg-amber-50/70 dark:bg-[#0F172A] border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:border-amber-500",
    iconBg: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  },
  {
    id: "qa-analytics",
    title: "Analytics",
    subtitle: "Yields & Telemetry Charts",
    tooltip: "View underwriting telemetry, approval rates & financial trends",
    path: "/financial-analytics",
    icon: BarChart3,
    cardStyle: "bg-cyan-50/70 dark:bg-[#0F172A] border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 hover:border-cyan-500",
    iconBg: "bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "qa-system-settings",
    title: "System Settings",
    subtitle: "Infrastructure & Telemetry",
    tooltip: "Inspect system health, server telemetry & infrastructure settings",
    path: "/system-monitoring",
    icon: Sliders,
    cardStyle: "bg-indigo-50/70 dark:bg-[#0F172A] border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:border-indigo-500",
    iconBg: "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
  },
];

// Single Reusable Quick Action Button Component with Keyboard Accessibility & Clean Overflow Prevention
export function QuickActionButton({ action, onClick }) {
  const IconComp = action.icon || Activity;
  const navigate = useNavigate();

  const handleActionTrigger = (e) => {
    if (e) e.preventDefault();
    
    if (onClick) {
      onClick(action);
    } else if (action.path) {
      showToast(`Opening ${action.title}`, "info");
      navigate(action.path);
    } else {
      showToast(`Triggered ${action.title}`, "info");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActionTrigger(e);
    }
  };

  return (
    <motion.button
      type="button"
      tabIndex={0}
      title={action.tooltip}
      aria-label={`${action.title}: ${action.tooltip}`}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleActionTrigger}
      onKeyDown={handleKeyDown}
      className={`w-full p-4 rounded-2xl border shadow-xs transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#1E293B] overflow-hidden min-h-[110px] ${
        action.cardStyle || "bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white"
      }`}
    >
      <div className={`p-2.5 rounded-xl border border-slate-200/60 dark:border-[#334155] shadow-xs ${action.iconBg || "bg-white dark:bg-[#1E293B]"}`}>
        <IconComp size={20} />
      </div>

      <div className="w-full min-w-0 overflow-hidden space-y-0.5">
        <span className="font-extrabold text-xs tracking-tight block truncate text-slate-900 dark:text-white">
          {action.title}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block truncate">
          {action.subtitle || action.tooltip}
        </span>
      </div>
    </motion.button>
  );
}

// Quick Actions Section Grid Wrapper Component
export function QuickActions({ actions = MASTER_QUICK_ACTIONS, onActionClick }) {
  return (
    <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles size={16} className="text-blue-500" /> Platform Quick Actions Workstation
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
          6 SHORTCUTS
        </span>
      </div>

      {/* RESPONSIVE GRID LAYOUT: 2 COLS MOBILE, 3 COLS TABLET, 6 COLS DESKTOP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-stretch">
        {actions.map((action) => (
          <QuickActionButton key={action.id || action.title} action={action} onClick={onActionClick} />
        ))}
      </div>
    </div>
  );
}

export const FINANCIAL_QUICK_ACTIONS_SUITE = MASTER_QUICK_ACTIONS;

export default QuickActions;