import React, { useState } from "react";
import { Bookmark, Building2, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../common/EmptyState";

function SavedPropertiesCard() {
  const navigate = useNavigate();
  const [savedProperties] = useState([]);

  return (
    <div className="white-card rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="text-blue-600 dark:text-cyan-400" size={20} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">
            Saved Properties ({savedProperties.length})
          </h3>
        </div>
      </div>

      {savedProperties.length === 0 ? (
        <EmptyState
          title="No saved properties found."
          message="Saved properties will appear here when bookmarked."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedProperties.map((p) => (
            <div key={p.id} className="p-4 rounded-xl border border-slate-200">
              {p.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedPropertiesCard;
