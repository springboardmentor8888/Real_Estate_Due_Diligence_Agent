import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Badge from "../common/Badge";
import { INDIAN_PROPERTIES } from "../../data/indianProperties";

function PropertyTable({ properties = [] }) {
  const navigate = useNavigate();
  const displayList = properties.length > 0 ? properties : INDIAN_PROPERTIES;

  const handleOpenDetails = (item, e) => {
    if (e) e.stopPropagation();
    navigate(`/property-details?id=${item.id}`, { state: { property: item } });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#334155] shadow-xs bg-white dark:bg-[#1E293B]">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="sticky top-0 bg-slate-900 dark:bg-[#1E293B] text-white dark:text-[#CBD5E1] text-xs font-mono uppercase tracking-wider z-10 border-b border-slate-800 dark:border-[#334155]">
          <tr>
            <th className="p-3.5 font-semibold">Property ID & Address</th>
            <th className="p-3.5 font-semibold">Registered Owner</th>
            <th className="p-3.5 font-semibold">Classification & Zoning</th>
            <th className="p-3.5 font-semibold">Tax Status</th>
            <th className="p-3.5 font-semibold">Flood Risk</th>
            <th className="p-3.5 font-semibold">Score</th>
            <th className="p-3.5 font-semibold">Status</th>
            <th className="p-3.5 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
          {displayList.map((item) => (
            <tr
              key={item.id}
              onClick={(e) => handleOpenDetails(item, e)}
              className="even:bg-slate-50/60 dark:even:bg-[#111827] odd:bg-white dark:odd:bg-[#0F172A] hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer group"
            >
              <td className="p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                    {item.id.split("-")[2] || "101"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {item.address}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-400 font-mono mt-0.5">
                      APN: {item.id}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-3.5 font-medium text-slate-700 dark:text-[#CBD5E1]">{item.owner}</td>
              <td className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#273449] px-2 py-0.5 rounded border border-transparent dark:border-[#334155]">
                    {item.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {item.zoning || "R1"}
                  </span>
                </div>
              </td>
              <td className="p-3.5 text-xs font-medium text-slate-600 dark:text-[#CBD5E1]">{item.taxStatus}</td>
              <td className="p-3.5 text-xs font-medium text-slate-600 dark:text-[#CBD5E1]">{item.floodRisk}</td>
              <td className="p-3.5">
                <span className="font-mono font-bold text-xs bg-slate-900 dark:bg-[#273449] text-white dark:text-cyan-300 px-2.5 py-1 rounded-md border border-transparent dark:border-[#334155]">
                  {item.score}
                </span>
              </td>
              <td className="p-3.5">
                <Badge variant={item.variant || "success"}>{item.status}</Badge>
              </td>
              <td className="p-3.5 text-right">
                <button
                  onClick={(e) => handleOpenDetails(item, e)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-lg border border-transparent dark:border-blue-800/60 transition-colors cursor-pointer"
                >
                  <span>Open Audit</span>
                  <ChevronRight size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyTable;