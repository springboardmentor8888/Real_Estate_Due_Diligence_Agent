import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileDown,
  ArrowRightLeft,
  Eye,
  Clock,
  Activity,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Badge from "../common/Badge";

// Mock Activity Data covering all 4 specified activity types
const INITIAL_ACTIVITY_ITEMS = [
  {
    id: "act-101",
    type: "PROPERTY_SEARCHED",
    title: "Property Searched",
    description: "Searched Financial District commercial plots with clear title verification.",
    target: "Financial District, Hyderabad (Budget: ₹15-35 Cr)",
    timestamp: "5 mins ago",
    status: "Search Executed",
    variant: "info",
    icon: Search,
    iconBg: "bg-blue-600 text-white",
    borderColor: "border-blue-500",
    linkPath: "/property-search",
  },
  {
    id: "act-102",
    type: "REPORT_DOWNLOADED",
    title: "Report Downloaded",
    description: "Downloaded Level 4 Verified Due Diligence Audit Certificate PDF.",
    target: "PR-1001 • Gachibowli Tech Park Phase 2",
    timestamp: "25 mins ago",
    status: "PDF Exported",
    variant: "success",
    icon: FileDown,
    iconBg: "bg-emerald-600 text-white",
    borderColor: "border-emerald-500",
    linkPath: "/due-diligence-report?id=1001",
  },
  {
    id: "act-103",
    type: "COMPARISON_CREATED",
    title: "Comparison Created",
    description: "Generated 8-vector side-by-side valuation matrix for 3 property parcels.",
    target: "PR-1001 vs PR-1002 vs PR-1003",
    timestamp: "2 hours ago",
    status: "Matrix Generated",
    variant: "success",
    icon: ArrowRightLeft,
    iconBg: "bg-purple-600 text-white",
    borderColor: "border-purple-500",
    linkPath: "/comparable-properties",
  },
  {
    id: "act-104",
    type: "WATCHLIST_UPDATED",
    title: "Watchlist Updated",
    description: "Activated 24/7 GIS automated monitoring for price & encumbrance alerts.",
    target: "PR-1002 • Jubilee Hills Plot 36",
    timestamp: "4 hours ago",
    status: "Monitoring Active",
    variant: "warning",
    icon: Eye,
    iconBg: "bg-amber-600 text-white animate-pulse",
    borderColor: "border-amber-500",
    linkPath: "/watchlist",
  },
  {
    id: "act-105",
    type: "PROPERTY_SEARCHED",
    title: "Property Searched",
    description: "Queried Grade-A office space in Whitefield Tech Corridor.",
    target: "Whitefield, Bengaluru",
    timestamp: "Yesterday at 04:15 PM",
    status: "Search Executed",
    variant: "info",
    icon: Search,
    iconBg: "bg-blue-600 text-white",
    borderColor: "border-blue-500",
    linkPath: "/property-search",
  },
  {
    id: "act-106",
    type: "REPORT_DOWNLOADED",
    title: "Report Downloaded",
    description: "Downloaded Municipal Tax History & Encumbrance Audit Document.",
    target: "PR-1003 • Whitefield Horizon Campus",
    timestamp: "2 days ago",
    status: "PDF Exported",
    variant: "success",
    icon: FileDown,
    iconBg: "bg-emerald-600 text-white",
    borderColor: "border-emerald-500",
    linkPath: "/due-diligence-report?id=1003",
  },
];

const ACTIVITY_FILTERS = [
  { id: "ALL", label: "All Activities" },
  { id: "PROPERTY_SEARCHED", label: "Property Searched", icon: Search },
  { id: "REPORT_DOWNLOADED", label: "Report Downloaded", icon: FileDown },
  { id: "COMPARISON_CREATED", label: "Comparison Created", icon: ArrowRightLeft },
  { id: "WATCHLIST_UPDATED", label: "Watchlist Updated", icon: Eye },
];

function RecentActivityFeed({ isFullPage = false }) {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("ALL");

  const filteredItems = useMemo(() => {
    if (filterType === "ALL") return INITIAL_ACTIVITY_ITEMS;
    return INITIAL_ACTIVITY_ITEMS.filter((item) => item.type === filterType);
  }, [filterType]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs space-y-6">
      {/* Activity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#334155]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
            <Activity size={14} /> Audit Trail & User Activity Log
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
            ⚡ Recent Activity Feed
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
            Real-time chronological timeline tracking property searches, PDF report downloads, comparison matrices, and watchlist updates.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          REAL-TIME STREAM
        </span>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {ACTIVITY_FILTERS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterType === tab.id
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#334155]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vertical Activity Timeline */}
      <div className="relative pl-3 sm:pl-6 space-y-6 before:absolute before:left-6 sm:before:left-9 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-[#334155]">
        <AnimatePresence>
          {filteredItems.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                onClick={() => navigate(item.linkPath)}
                className="relative flex items-start gap-4 sm:gap-5 group cursor-pointer"
              >
                {/* Node Badge Icon */}
                <div
                  className={`relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-md font-bold shrink-0 transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon size={18} />
                </div>

                {/* Event Card Content */}
                <div
                  className={`flex-1 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/80 dark:border-[#334155] border-l-4 ${item.borderColor} hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-200 space-y-2`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      <Badge variant={item.variant} className="text-[10px]">
                        {item.status}
                      </Badge>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-600 dark:text-cyan-400 font-bold truncate">
                      {item.target}
                    </span>

                    <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-400 shrink-0">
                      Open <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RecentActivityFeed;
