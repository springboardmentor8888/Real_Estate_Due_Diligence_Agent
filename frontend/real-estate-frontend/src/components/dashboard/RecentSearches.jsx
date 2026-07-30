import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Badge from "../common/Badge";
import { INDIAN_PROPERTIES } from "../../data/indianProperties";

function RecentSearches() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");

  const recentSearches = INDIAN_PROPERTIES.slice(0, 5).map((p, idx) => ({
    ...p,
    date: idx === 0 ? "Today, 14:20" : idx === 1 ? "Yesterday, 16:45" : `${22 - idx} Jul 2026`,
  }));

  const filteredSearches =
    filter === "ALL"
      ? recentSearches
      : recentSearches.filter(
          (item) => item.type.toUpperCase().includes(filter) || (filter === "RESIDENTIAL" && item.type.includes("Residential"))
        );

  const handleOpenDetails = (item, e) => {
    if (e) e.stopPropagation();
    navigate(`/property-details?id=${item.id}`, { state: { property: item } });
  };

  return (
    <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <span>🕒</span> Recent Property Audits
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#94A3B8] mt-1">
            Latest property due diligence checks performed in Indian state registries.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#334155] text-xs font-semibold">
          {["ALL", "RESIDENTIAL", "COMMERCIAL"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === tab
                  ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-200 text-xs uppercase font-mono tracking-wider">
              <th className="p-4 font-semibold">Property ID & Location</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Owner</th>
              <th className="p-4 font-semibold">Diligence Score</th>
              <th className="p-4 font-semibold">Verification Status</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#334155] bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200">
            {filteredSearches.map((item) => (
              <tr
                key={item.id}
                onClick={(e) => handleOpenDetails(item, e)}
                className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/80 transition-colors cursor-pointer group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                      {item.id.split("-")[1]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.address}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-400 font-mono mt-0.5">
                        ID: {item.id} • {item.date}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#1E293B] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#334155]">
                    {item.type}
                  </span>
                </td>
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{item.owner}</td>
                <td className="p-4">
                  <span className="font-bold text-slate-900 dark:text-[#F8FAFC] font-mono bg-slate-100 dark:bg-[#1E293B] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#334155]">
                    {item.score}
                  </span>
                </td>
                <td className="p-4">
                  <Badge variant={item.variant}>{item.status}</Badge>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={(e) => handleOpenDetails(item, e)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>View Report</span>
                    <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentSearches;