import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Bookmark,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

function UserStatsGrid() {
  const stats = [
    {
      id: "searched",
      title: "Properties Searched",
      count: "1,240",
      trend: "+18% this month",
      isPositive: true,
      icon: Building2,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-cyan-400 border-blue-200 dark:border-blue-800/40",
    },
    {
      id: "reports",
      title: "Reports Generated",
      count: "342",
      trend: "+12% this week",
      isPositive: true,
      icon: FileText,
      color: "from-indigo-500/20 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40",
    },
    {
      id: "saved",
      title: "Saved Properties",
      count: "18",
      trend: "4 updated recently",
      isPositive: true,
      icon: Bookmark,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
    },
    {
      id: "risk",
      title: "Risk Assessments",
      count: "980",
      trend: "98.5% confidence score",
      isPositive: true,
      icon: ShieldCheck,
      color: "from-cyan-500/20 to-blue-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * idx }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-[#334155] shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase font-bold text-slate-500 dark:text-[#94A3B8] tracking-wider">
                {stat.title}
              </span>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} border shadow-xs group-hover:scale-110 transition-transform`}>
                <IconComponent size={20} />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900 dark:text-[#F8FAFC] font-mono tracking-tight">
                {stat.count}
              </h3>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={13} />
                  {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default UserStatsGrid;
