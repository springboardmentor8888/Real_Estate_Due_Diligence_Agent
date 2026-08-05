import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight, Bookmark } from "lucide-react";
import SavedPropertyCard from "./SavedPropertyCard";
import ReportGeneratorModal from "./ReportGeneratorModal";
import { getLiveSavedProperties } from "../../services/liveStore";
import { MASTER_MOCK_PROPERTIES } from "../../data/mockPropertyData";
import EmptyState from "../common/EmptyState";

function SavedPropertiesGrid() {
  const navigate = useNavigate();
  const [savedList, setSavedList] = useState([]);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedModalPropId, setSelectedModalPropId] = useState("");

  const refreshList = () => {
    const live = getLiveSavedProperties();
    if (live && live.length >= 6) {
      setSavedList(live.slice(0, 6));
    } else {
      // Ensure 6 mock properties are displayed for preview
      const combined = [...live, ...MASTER_MOCK_PROPERTIES];
      const uniqueMap = new Map();
      combined.forEach((item) => {
        const idKey = (item.numericId || item.propertyId || item.id || "").toString().replace(/\D/g, "");
        if (idKey && !uniqueMap.has(idKey)) {
          uniqueMap.set(idKey, item);
        }
      });
      setSavedList(Array.from(uniqueMap.values()).slice(0, 6));
    }
  };

  useEffect(() => {
    refreshList();
    window.addEventListener("live_data_updated", refreshList);
    window.addEventListener("storage", refreshList);
    return () => {
      window.removeEventListener("live_data_updated", refreshList);
      window.removeEventListener("storage", refreshList);
    };
  }, []);

  const handleGenerateReport = (prop) => {
    const pid = (prop.numericId || prop.propertyId || prop.id || "1001").toString().replace(/\D/g, "") || "1001";
    setSelectedModalPropId(pid);
    setReportModalOpen(true);
  };

  const handleRemoveProperty = () => {
    refreshList();
  };

  return (
    <>
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#334155]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <Bookmark size={14} /> Saved Watchlist Portfolio
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              <Building2 size={22} className="text-blue-600 dark:text-cyan-400" /> Saved Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
              Your saved watchlist property parcels with real-time risk scores, market values, and audit tools.
            </p>
          </div>

          <button
            onClick={() => navigate("/saved-properties")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
          >
            <span>View All Watchlist ({savedList.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {savedList.length > 0 ? (
          /* Display 6 Mock Properties in 3-column Responsive Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedList.map((item, idx) => (
              <SavedPropertyCard
                key={(item.numericId || item.id || idx).toString()}
                property={item}
                onGenerateReport={handleGenerateReport}
                onRemove={handleRemoveProperty}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Saved Properties"
            message="Your watchlist is empty. Search land registries and click Save Property to add parcels here."
          />
        )}
      </div>

      <ReportGeneratorModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        initialPropertyId={selectedModalPropId}
      />
    </>
  );
}

export default SavedPropertiesGrid;
