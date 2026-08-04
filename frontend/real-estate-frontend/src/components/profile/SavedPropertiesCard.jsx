import React, { useState, useEffect } from "react";
import { Bookmark, MapPin, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import { getAllProperties } from "../../services/propertyService";

function SavedPropertiesCard() {
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    getAllProperties(0, 6).then((res) => {
      if (res && res.data) {
        const items = res.data.content || res.data;
        if (Array.isArray(items)) {
          setSavedProperties(items.slice(0, 3));
        }
      }
    });
  }, []);

  return (
    <div className="white-card rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="text-blue-600 dark:text-cyan-400" size={20} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">
            Bookmarked & Saved Properties ({savedProperties.length})
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {savedProperties.map((p) => (
          <div
            key={p.id || p.propertyId}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">
                  {p.id || `PR-${p.propertyId}`}
                </span>
                <Badge variant={p.variant || "success"}>{p.status || "Verified Clear Title"}</Badge>
              </div>

              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                {p.propertyName || p.title}
              </h4>

              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin size={12} /> {p.city}, {p.state}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-[#334155] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {typeof p.marketValue === "number" ? `₹${(p.marketValue / 10000000).toFixed(2)} Cr` : p.marketValue}
              </span>
              <button
                onClick={() => navigate("/property-details", { state: { propertyId: p.propertyId || p.id } })}
                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 hover:bg-blue-100 transition-colors cursor-pointer"
                title="Inspect Property"
              >
                <Eye size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedPropertiesCard;
