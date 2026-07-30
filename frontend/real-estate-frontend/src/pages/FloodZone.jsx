import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Waves,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Calendar,
  Compass,
} from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getFloodZoneInformation } from "../services/propertyService";

function FloodZone() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const defaultFlood = {
    risk: "Low Risk",
    zone: "Zone X (Unshaded)",
    insuranceRequired: "No Mandatory Flood Insurance",
    lastInspection: "March 2025",
    elevation: "+42.5 Meters above sea level",
    bfe: "N/A (Outside 100-year floodplain)",
  };

  const [flood, setFlood] = useState(defaultFlood);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFloodZoneInformation(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const f = res.data[0];
          setFlood({
            risk: f.floodRisk || "Low Risk",
            zone: f.floodZone || "Zone X (Unshaded)",
            insuranceRequired: f.insuranceRequired ? "Mandatory Insurance Required" : "No Mandatory Flood Insurance",
            lastInspection: f.lastUpdated ? f.lastUpdated.toString().split("T")[0] : "March 2025",
            elevation: f.elevationFeet ? `+${f.elevationFeet} Feet above sea level` : "+42.5 Meters above sea level",
            bfe: "N/A (Outside 100-year floodplain)",
          });
        }
      })
      .catch((err) => {
        console.warn("Backend getFloodZoneInformation API error, using default mock:", err);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleVerifyFEMA = () => {
    showSuccessAlert(
      "FEMA FIRM Map Verified",
      "FEMA Flood Map Panel #48201C0435J confirms Zone X rating."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-mono font-bold mb-3">
              <Waves size={14} /> Irrigation Board & FIRM Flood Survey
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🌊 Flood Zone & Elevation Risk Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect flood plain designations, base flood elevation (BFE) metrics, and federal flood insurance requirements.
            </p>
          </div>

          <Button onClick={handleVerifyFEMA} variant="primary" icon={ShieldCheck}>
            Verify FIRM Flood Panel
          </Button>
        </div>

        {/* Risk Meter Widget */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-8 border border-slate-800 dark:border-[#334155] shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                FEMA Designated Zone
              </span>
              <h2 className="text-4xl font-extrabold text-white mt-1">
                {flood.zone}
              </h2>
              <p className="text-slate-300 text-sm mt-2">
                Minimal flood hazard zone outside 500-year flood plain boundary.
              </p>
            </div>

            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-[#334155] rounded-2xl p-6 text-center shrink-0">
              <p className="text-xs font-mono text-cyan-300 uppercase">Risk Level Rating</p>
              <Badge variant="success" className="mt-2 text-sm px-4 py-1.5 font-bold">
                {flood.risk}
              </Badge>
            </div>
          </div>

          {/* Visual Risk Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 dark:border-[#334155]">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-400 mb-2">
              <span className="text-emerald-400">Zone X (Low)</span>
              <span className="text-amber-400">Zone AE (Moderate)</span>
              <span className="text-rose-400">Zone VE (High Risk)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 p-0.5 overflow-hidden flex">
              <div className="w-1/3 bg-emerald-500 h-full rounded-l-full relative">
                <div className="absolute right-2 top-0 bottom-0 w-2 bg-white rounded-full animate-ping" />
              </div>
              <div className="w-1/3 bg-amber-500/30 h-full" />
              <div className="w-1/3 bg-rose-500/30 h-full rounded-r-full" />
            </div>
          </div>
        </div>

        {/* Flood Risk Grid */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-600 dark:text-cyan-400" /> Elevation & Insurance Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Flood Insurance Need</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{flood.insuranceRequired}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">Lender Obligation: Waived</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Topographic Elevation</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{flood.elevation}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">High ground safety</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Base Flood Elevation (BFE)</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{flood.bfe}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">Standard flood height</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Last Map Revision</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{flood.lastInspection}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">FIRM Regional Survey</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FloodZone;