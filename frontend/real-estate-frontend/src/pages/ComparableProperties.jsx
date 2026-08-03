import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Building2, MapPin, Compass, FileDown, Printer } from "lucide-react";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import { getAllProperties } from "../services/propertyService";

function ComparableProperties() {
  const [comparables, setComparables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProperties(0, 10)
      .then((res) => {
        if (res && res.data) {
          const items = res.data.content || res.data;
          if (Array.isArray(items)) {
            setComparables(items);
          }
        }
      })
      .catch((err) => {
        console.warn("Backend comparables query failed:", err);
        setComparables([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Compass size={14} /> Regional Market Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🏢 Comparable Property Analysis & Valuation Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Benchmark market valuation and physical similarity against nearby verified registry land parcels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf("Comparable Properties Analysis", "COMP")}
              variant="primary"
              size="sm"
              icon={FileDown}
              disabled={comparables.length === 0}
            >
              Download PDF
            </Button>
            <Button
              onClick={() => exportToExcel("Comparable Properties Data", comparables)}
              variant="secondary"
              size="sm"
              icon={Printer}
              disabled={comparables.length === 0}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {comparables.length === 0 && !loading ? (
          <EmptyState
            title="No comparable properties available."
            message="No comparable land parcel records were returned by the backend system."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparables.map((comp, idx) => (
              <div
                key={comp.propertyId || idx}
                className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    PR-{comp.propertyId || idx + 1}
                  </span>
                  <Badge variant="success">{comp.status || "Verified"}</Badge>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-base">
                    {comp.propertyName || comp.address?.addressLine1 || "Property Parcel"}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {comp.address?.city || "Not Available"}, {comp.address?.state || "Not Available"}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-[#334155] text-xs font-mono">
                  <span className="text-slate-400 uppercase text-[10px]">Market Valuation:</span>
                  <p className="font-bold text-blue-600 dark:text-cyan-400">
                    {comp.marketValue ? `₹${(comp.marketValue / 1000000).toFixed(2)} Cr` : "Not Available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ComparableProperties;
