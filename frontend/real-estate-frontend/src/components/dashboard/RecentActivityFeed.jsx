import React from "react";
import { motion } from "framer-motion";
import { History, Search, ShieldCheck, DollarSign, FileDown, CheckCircle2 } from "lucide-react";

function RecentActivityFeed() {
  const timelineItems = [
    {
      id: 1,
      type: "Property Searched",
      detail: 'Searched Sy. No. 112/A for "Gachibowli Tech Park Phase 2"',
      time: "10 mins ago",
      icon: Search,
      color: "bg-blue-500 text-white",
    },
    {
      id: 2,
      type: "Ownership Verified",
      detail: "Deed title chain & Sub-Registrar index clear for Parcel PR-1001",
      time: "45 mins ago",
      icon: ShieldCheck,
      color: "bg-emerald-500 text-white",
    },
    {
      id: 3,
      type: "Tax Records Updated",
      detail: "2024/2025 Municipal tax receipt verified zero arrears",
      time: "2 hours ago",
      icon: DollarSign,
      color: "bg-indigo-500 text-white",
    },
    {
      id: 4,
      type: "Risk Assessment Completed",
      detail: "Multi-vector risk matrix score calculated: 14/100 Low Risk",
      time: "4 hours ago",
      icon: CheckCircle2,
      color: "bg-teal-500 text-white",
    },
    {
      id: 5,
      type: "Report Exported",
      detail: "PDF & Excel Due Diligence Report downloaded by user",
      time: "Yesterday",
      icon: FileDown,
      color: "bg-purple-500 text-white",
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#334155]">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <History size={18} className="text-blue-600 dark:text-cyan-400" />
          Recent Activity Timeline
        </h3>
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Audit Log</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {timelineItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
              className="relative text-xs space-y-0.5"
            >
              <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full ${item.color} flex items-center justify-center shadow-xs ring-4 ring-white dark:ring-[#1E293B]`}>
                <IconComp size={11} />
              </span>

              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {item.type}
                </span>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {item.time}
                </span>
              </div>

              <p className="text-slate-500 dark:text-[#CBD5E1] text-[11px] leading-relaxed">
                {item.detail}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivityFeed;
