import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ImageOff } from "lucide-react";
import Badge from "../common/Badge";

function PropertyTable({ properties = [] }) {
  const navigate = useNavigate();

  const handleOpenDetails = (item, e) => {
    if (e) e.stopPropagation();
    const pid = item.propertyId || item.id;
    if (pid) {
      navigate(`/property-details?id=${pid}`, { state: { property: item } });
    }
  };

  if (properties.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#334155]">
        <p className="text-sm font-semibold text-slate-500 dark:text-[#94A3B8]">
          No properties found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155] shadow-xs bg-white dark:bg-[#1E293B]">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="sticky top-0 bg-slate-900 dark:bg-[#1E293B] text-white dark:text-[#CBD5E1] text-xs font-mono uppercase tracking-wider z-10 border-b border-slate-800 dark:border-[#334155]">
          <tr>
            <th className="p-3.5 font-semibold">Property & Address</th>
            <th className="p-3.5 font-semibold">Owner</th>
            <th className="p-3.5 font-semibold">Type & Zoning</th>
            <th className="p-3.5 font-semibold">Tax Status</th>
            <th className="p-3.5 font-semibold">Flood Risk</th>
            <th className="p-3.5 font-semibold">Score</th>
            <th className="p-3.5 font-semibold">Status</th>
            <th className="p-3.5 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
          {properties.map((item, idx) => {
            const thumbSrc = item.imageUrl || item.image || null;

            return (
              <tr
                key={item.id || item.propertyId || idx}
                onClick={(e) => handleOpenDetails(item, e)}
                className="even:bg-slate-50/60 dark:even:bg-[#111827] odd:bg-white dark:odd:bg-[#0F172A] hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer group"
              >
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    {thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt={item.title || item.address || "Property"}
                        className="w-12 h-10 rounded-lg object-cover border border-slate-200 dark:border-[#334155] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-10 rounded-lg bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] shrink-0 flex items-center justify-center text-slate-400">
                        <ImageOff size={16} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {item.propertyName || item.title || item.address || "Property Parcel"}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-400 font-mono mt-0.5">
                        {item.address || "Address Not Available"} • APN: {item.id || item.propertyId || "Not Available"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 font-medium text-slate-700 dark:text-[#CBD5E1]">{item.owner || "Not Available"}</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#273449] px-2 py-0.5 rounded border border-transparent dark:border-[#334155]">
                      {item.type || item.propertyType || "Not Available"}
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                      {item.zoning || "Not Available"}
                    </span>
                  </div>
                </td>
                <td className="p-3.5 text-xs font-medium text-slate-600 dark:text-[#CBD5E1]">{item.taxStatus || "Not Available"}</td>
                <td className="p-3.5 text-xs font-medium text-slate-600 dark:text-[#CBD5E1]">{item.floodRisk || "Not Available"}</td>
                <td className="p-3.5">
                  <span className="font-mono font-bold text-xs bg-slate-900 dark:bg-[#273449] text-white dark:text-cyan-300 px-2.5 py-1 rounded-md border border-transparent dark:border-[#334155]">
                    {item.score || "Not Available"}
                  </span>
                </td>
                <td className="p-3.5">
                  <Badge variant={item.variant || "success"}>{item.status || "Verified"}</Badge>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyTable;