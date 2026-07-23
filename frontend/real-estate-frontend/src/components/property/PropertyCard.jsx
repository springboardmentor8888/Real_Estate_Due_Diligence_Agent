import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Ruler,
  ArrowRight,
} from "lucide-react";
import Badge from "../common/Badge";
import { INDIAN_PROPERTIES } from "../../data/indianProperties";

function PropertyCard({ property }) {
  const navigate = useNavigate();
  const item = property || INDIAN_PROPERTIES[0];

  const handleOpenDetails = (e) => {
    e.stopPropagation();
    navigate(`/property-details?id=${item.id}`, { state: { property: item } });
  };

  return (
    <div
      onClick={handleOpenDetails}
      className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#334155] shadow-xs hover:shadow-lg dark:hover:shadow-blue-500/10 hover-lift group cursor-pointer flex flex-col justify-between overflow-hidden transition-all duration-250"
    >
      {/* Property Visual Header Card */}
      <div className="relative h-44 bg-slate-900 dark:bg-[#0F172A] text-white p-5 flex flex-col justify-between overflow-hidden border-b border-slate-800 dark:border-[#334155]">
        {/* Subtle Blueprint Grid Overlay */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <span className="text-[11px] font-mono font-bold bg-slate-800/90 dark:bg-[#1E293B] text-slate-200 px-2.5 py-0.5 rounded-md border border-slate-700 dark:border-[#334155]">
            {item.id}
          </span>
          <Badge variant={item.variant || "success"}>{item.status}</Badge>
        </div>

        <div className="z-10 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
            {item.type}
          </span>
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 leading-snug">
            {item.address}
          </h3>
        </div>
      </div>

      {/* Property Details Specs Body */}
      <div className="p-5 space-y-4 bg-white dark:bg-[#1E293B]">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-[#334155] flex items-center gap-2">
            <User size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono">Owner</p>
              <p className="font-bold text-slate-800 dark:text-[#CBD5E1] truncate">{item.owner}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-[#334155] flex items-center gap-2">
            <Ruler size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono">Plot Area</p>
              <p className="font-bold text-slate-800 dark:text-[#CBD5E1]">{item.area}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#334155]">
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-mono">Diligence Score</p>
            <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
              {item.score}
            </p>
          </div>

          <button
            onClick={handleOpenDetails}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;