import React from "react";
import { motion } from "framer-motion";
import {
  FileCheck2,
  Eye,
  UserCheck,
  Download,
  History,
  Clock,
} from "lucide-react";

function RecentActivityTimeline() {
  const activities = [
    {
      id: "act-1",
      title: "Generated Due Diligence Report",
      description: "Compiled comprehensive environmental and flood risk assessment for Gachibowli Tech Park Phase 2, Financial District, Hyderabad.",
      timestamp: "2 hours ago",
      icon: FileCheck2,
      iconColor: "text-blue-600 dark:text-cyan-400",
    },
    {
      id: "act-2",
      title: "Viewed Property Details",
      description: "Inspected zoning records and tax assessment history for Whitefield Outer Ring Road Tech Hub, Bengaluru.",
      timestamp: "5 hours ago",
      icon: Eye,
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "act-3",
      title: "Updated Profile & Security Credentials",
      description: "Successfully updated account security password and verified organization details for Apex Due Diligence Advisors India.",
      timestamp: "Yesterday, 04:30 PM",
      icon: UserCheck,
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "act-4",
      title: "Downloaded Comprehensive PDF Report",
      description: "Exported high-resolution due diligence report for Bandra Kurla Complex Corporate Tower, BKC Mumbai.",
      timestamp: "3 days ago",
      icon: Download,
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#334155] shadow-lg space-y-6"
    >
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 dark:border-[#334155]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
            <History size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              Recent Platform Activity
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8]">
              Audit trail of your recent searches, reports, downloads, and security logs.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#334155]">
        {activities.map((act, index) => {
          const IconComp = act.icon;
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="relative flex items-start gap-4 group"
            >
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#0F172A] border-2 border-blue-500 text-blue-600 dark:text-cyan-400 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                <IconComp size={14} className={act.iconColor} />
              </div>

              {/* Activity Card Content */}
              <div className="flex-1 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/60 dark:border-[#334155] shadow-xs hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {act.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                    <Clock size={12} />
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                  {act.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default RecentActivityTimeline;
