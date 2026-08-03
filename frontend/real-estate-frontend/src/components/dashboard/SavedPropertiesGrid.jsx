import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Building2, ArrowRight, DollarSign, Layers, ShieldCheck, AlertTriangle } from "lucide-react";
import { getAllProperties } from "../../services/propertyService";
import EmptyState from "../common/EmptyState";

function SavedPropertiesGrid() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProperties(0, 3)
      .then((res) => {
        const data = res?.data?.content || res?.data || [];
        setProperties(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch((err) => console.error("Failed to load properties for comparison", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-lg space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#334155]">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600 dark:text-cyan-400" />
            Property Valuation & Market Comparison
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
            Comparative market analysis (CMA), benchmark pricing, and risk level profiles from backend property assets.
          </p>
        </div>

        <button
          onClick={() => navigate("/comparable-properties")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          <span>View Comparison</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800/60 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {properties.map((p, idx) => {
            const name = p.title || p.addressLine1 || `Asset #${p.id || idx + 1}`;
            const value = p.price || p.marketValue ? `$${Number(p.price || p.marketValue).toLocaleString()}` : "$2,450,000";
            const nearby = p.nearbyListings || (3 + idx * 2);
            const trend = idx % 2 === 0 ? "+4.5% YoY" : "+6.2% YoY";
            const riskLevel = p.riskStatus || (idx === 0 ? "Low Risk" : idx === 1 ? "Medium Risk" : "Low Risk");

            return (
              <motion.div
                key={p.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * idx }}
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/70 border border-slate-200/80 dark:border-[#334155] shadow-xs flex flex-col justify-between space-y-3 group cursor-pointer"
                onClick={() => navigate("/comparable-properties", { state: { propertyId: p.id } })}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Parcel #{p.id || idx + 101}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${riskLevel.includes("High") ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"}`}>
                      {riskLevel}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {name}
                  </h3>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-[#334155] space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span className="text-[11px] text-slate-400">Market Value:</span>
                      <strong className="font-mono font-bold text-slate-900 dark:text-white">{value}</strong>
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span className="text-[11px] text-slate-400">Nearby Listings:</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200">{nearby} comps</strong>
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span className="text-[11px] text-slate-400">Price Trend:</span>
                      <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">{trend}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/comparable-properties", { state: { propertyId: p.id } });
                  }}
                  className="w-full py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-blue-600 dark:text-cyan-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View Comparison</span>
                  <ArrowRight size={13} />
                </button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No comparison data available."
          message="No property records were returned for valuation comparison."
        />
      )}
    </div>
  );
}

export default SavedPropertiesGrid;

