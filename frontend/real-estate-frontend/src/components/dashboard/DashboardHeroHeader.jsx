import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

function DashboardHeroHeader({ userName, userRole }) {
  const navigate = useNavigate();

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xl relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Personalized Greeting & Meta */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-extrabold">
              <Sparkles size={14} className="text-blue-600 dark:text-cyan-400" />
              Real Estate Due Diligence Enterprise Suite
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 size={13} /> Level 4 Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-400">{userName}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-[#94A3B8] pt-1">
            {/* Non-editable static Role Badge */}
            <div className="role-badge flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#334155] select-none">
              <UserCheck size={14} className="text-blue-600 dark:text-cyan-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Role:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{userRole || "Buyer"}</span>
            </div>

            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#334155]">
              <Calendar size={14} className="text-indigo-500" />
              {currentDate}
            </span>

            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#334155]">
              <Clock size={14} className="text-emerald-500" />
              Session Active
            </span>
          </div>
        </div>

        {/* Right Side: Quick Summary Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-80">
          <div
            onClick={() => navigate("/report-history")}
            className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                Active Reports
              </span>
              <FileText size={16} className="text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              14
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
              +2 generated today
            </span>
          </div>

          <div
            onClick={() => navigate("/report-history")}
            className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                Pending Reviews
              </span>
              <Clock size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              3
            </h3>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block mt-1">
              Requires clearance
            </span>
          </div>

          <div
            onClick={() => navigate("/risk-assessment")}
            className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                High Risk
              </span>
              <AlertTriangle size={16} className="text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              2
            </h3>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block mt-1">
              Action required
            </span>
          </div>

          <div
            onClick={() => navigate("/profile")}
            className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                Saved Properties
              </span>
              <Bookmark size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              18
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
              Portfolio bookmarked
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardHeroHeader;
