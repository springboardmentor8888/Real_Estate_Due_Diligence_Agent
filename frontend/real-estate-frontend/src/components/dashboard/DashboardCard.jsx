import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Building2,
  FileText,
  Clock,
  Activity,
  Server,
  Terminal,
  TrendingUp,
  TrendingDown,
  Globe,
} from "lucide-react";

// Centralized Mock Dataset for all 8 requested KPI Cards
export const MASTER_KPI_CARDS_DATA = [
  {
    id: "kpi-1",
    title: "Total Users",
    count: "1,284",
    trend: "+12.5% this month",
    isPositive: true,
    lastUpdated: "Updated 2 mins ago",
    icon: Users,
    cardStyle: "border-l-4 border-l-blue-500 bg-blue-50/40 dark:bg-[#1E293B]",
    iconBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border-blue-200 dark:border-blue-800",
  },
  {
    id: "kpi-2",
    title: "Active Users",
    count: "942",
    trend: "73.3% Online Rate",
    isPositive: true,
    lastUpdated: "Updated 1 min ago",
    icon: CheckCircle2,
    cardStyle: "border-l-4 border-l-emerald-500 bg-emerald-50/40 dark:bg-[#1E293B]",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "kpi-3",
    title: "Total Properties",
    count: "452",
    trend: "Valued at ₹ 4,250 Cr",
    isPositive: true,
    lastUpdated: "Updated 5 mins ago",
    icon: Building2,
    cardStyle: "border-l-4 border-l-purple-500 bg-purple-50/40 dark:bg-[#1E293B]",
    iconBg: "bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  {
    id: "kpi-4",
    title: "Reports Generated",
    count: "892",
    trend: "99.4% SLA Compliance",
    isPositive: true,
    lastUpdated: "Updated 10 mins ago",
    icon: FileText,
    cardStyle: "border-l-4 border-l-cyan-500 bg-cyan-50/40 dark:bg-[#1E293B]",
    iconBg: "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  },
  {
    id: "kpi-5",
    title: "Pending Reviews",
    count: "34",
    trend: "-8.5% Queue Reduction",
    isPositive: true,
    lastUpdated: "Updated 15 mins ago",
    icon: Clock,
    cardStyle: "border-l-4 border-l-amber-500 bg-amber-50/40 dark:bg-[#1E293B]",
    iconBg: "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  {
    id: "kpi-6",
    title: "Active Sessions",
    count: "186",
    trend: "Peak Concurrent Users",
    isPositive: true,
    lastUpdated: "Just now",
    icon: Activity,
    cardStyle: "border-l-4 border-l-indigo-500 bg-indigo-50/40 dark:bg-[#1E293B]",
    iconBg: "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  },
  {
    id: "kpi-7",
    title: "System Health",
    count: "99.98%",
    trend: "All Services Operational",
    isPositive: true,
    lastUpdated: "Live Telemetry",
    icon: Server,
    cardStyle: "border-l-4 border-l-emerald-500 bg-emerald-50/40 dark:bg-[#1E293B]",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "kpi-8",
    title: "Today's API Requests",
    count: "45,210",
    trend: "Avg Latency 42ms",
    isPositive: true,
    lastUpdated: "Updated 1 min ago",
    icon: Terminal,
    cardStyle: "border-l-4 border-l-[#0D9488] bg-teal-50/40 dark:bg-[#1E293B]",
    iconBg: "bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  },
];

// Single Reusable Dashboard KPI Card Component
export function DashboardCardItem({ card }) {
  const IconComp = card.icon || Activity;
  const TrendIcon = card.isPositive !== false ? TrendingUp : TrendingDown;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-3xl p-6 border shadow-xs hover:shadow-xl transition-all duration-300 font-mono text-xs ${
        card.cardStyle || "bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#334155]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-slate-600 dark:text-[#CBD5E1] uppercase tracking-wider">
          {card.title}
        </span>
        <div className={`p-2.5 rounded-2xl border ${card.iconBg || "bg-blue-100 text-blue-600"}`}>
          <IconComp size={18} />
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC]">
          {card.count}
        </h3>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-[#334155]">
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
          <TrendIcon size={12} />
          {card.trend}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          {card.lastUpdated}
        </span>
      </div>
    </motion.div>
  );
}

// Grid Wrapper rendering all 8 KPI Cards
export function DashboardCard({ cards = MASTER_KPI_CARDS_DATA, analytics }) {
  const dynamicCards = cards.map((card) => {
    if (!analytics) return card;

    const titleLower = (card.title || "").toLowerCase();

    if (analytics.totalUsers !== undefined && (card.id === "kpi-1" || titleLower.includes("user"))) {
      return { ...card, count: typeof analytics.totalUsers === "number" ? analytics.totalUsers.toLocaleString() : analytics.totalUsers };
    }
    if (analytics.totalProperties !== undefined && (card.id === "kpi-3" || titleLower.includes("property") || titleLower.includes("properties"))) {
      return { ...card, count: typeof analytics.totalProperties === "number" ? analytics.totalProperties.toLocaleString() : analytics.totalProperties };
    }
    if (analytics.totalReports !== undefined && (card.id === "kpi-4" || titleLower.includes("report"))) {
      return { ...card, count: typeof analytics.totalReports === "number" ? analytics.totalReports.toLocaleString() : analytics.totalReports };
    }
    if (analytics.totalRiskAssessments !== undefined && (card.id === "kpi-5" || titleLower.includes("risk") || titleLower.includes("review"))) {
      return { ...card, count: typeof analytics.totalRiskAssessments === "number" ? analytics.totalRiskAssessments.toLocaleString() : analytics.totalRiskAssessments };
    }
    if (analytics.totalAuditLogs !== undefined && (card.id === "kpi-8" || titleLower.includes("audit") || titleLower.includes("api"))) {
      return { ...card, count: typeof analytics.totalAuditLogs === "number" ? analytics.totalAuditLogs.toLocaleString() : analytics.totalAuditLogs };
    }

    return card;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {dynamicCards.map((card) => (
        <DashboardCardItem key={card.id || card.title} card={card} />
      ))}
    </div>
  );
}

export const EnterpriseKPIGrid = DashboardCard;
export const KPIDashboardCards = DashboardCard;

export default DashboardCard;
