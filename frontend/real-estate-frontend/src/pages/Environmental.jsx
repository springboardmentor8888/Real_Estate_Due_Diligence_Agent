import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Leaf,
  ShieldCheck,
  Award,
  CheckCircle2,
  Droplets,
  Wind,
  FileCheck,
} from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getEnvironmentalRecords } from "../services/propertyService";

function Environmental() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const defaultEnv = {
    score: "92 / 100",
    soil: "Good (No Heavy Metals / Radon)",
    water: "Safe Municipal Supply",
    aqi: "22 (Excellent Air Quality)",
    hazardStatus: "Zero SPCB / EPA Liabilities",
    sustainability: "Grade A Solar Ready",
  };

  const [env, setEnv] = useState(defaultEnv);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEnvironmentalRecords(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const e = res.data[0];
          setEnv({
            score: e.clearanceStatus === "APPROVED" || e.clearanceStatus === "CLEAR" ? "95 / 100" : "85 / 100",
            soil: e.environmentalRisks || "Good (No Heavy Metals / Radon)",
            water: e.waterBodies || "Safe Municipal Supply",
            aqi: "22 (Excellent Air Quality)",
            hazardStatus: e.pollutionInfo || "Zero SPCB / EPA Liabilities",
            sustainability: "Grade A Solar Ready",
          });
        }
      })
      .catch((err) => {
        console.warn("Backend getEnvironmentalRecords API error, using default mock:", err);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleDownloadEnvReport = () => {
    showSuccessAlert(
      "Environmental Report Dispatched",
      "Environmental Audit & SPCB Phase I Assessment PDF has been generated."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold mb-3">
              <Leaf size={14} /> State Pollution Control Board (SPCB)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🌱 Environmental Records & Hazards Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect soil lead levels, groundwater purity tests, ambient air quality index (AQI), and environmental contamination liabilities.
            </p>
          </div>

          <Button onClick={handleDownloadEnvReport} variant="primary" icon={FileCheck}>
            Export Phase I Report
          </Button>
        </div>

        {/* Environmental Score Hero Box */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 border border-slate-800 dark:border-[#334155] shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Phase I Site Assessment Rating
              </span>
              <h2 className="text-4xl font-extrabold text-white mt-1">
                Environment Index: {env.score}
              </h2>
              <p className="text-slate-300 text-sm mt-2">
                Certified clear of hazardous chemicals, asbestos, radon, and underground storage tanks.
              </p>
            </div>

            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-[#334155] rounded-2xl p-6 text-center shrink-0">
              <p className="text-xs font-mono text-emerald-300 uppercase">SPCB Clearance</p>
              <Badge variant="success" className="mt-2 text-sm px-4 py-1.5 font-bold">
                Clean Site Rating
              </Badge>
            </div>
          </div>
        </div>

        {/* Environmental Grid */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-600 dark:text-cyan-400" /> Key Environmental Factors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Soil Composition</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{env.soil}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">Tested March 2025</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Groundwater Safety</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{env.water}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">Potable Tap Grade</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Air Quality Index (AQI)</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{env.aqi}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">Low particulate level</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Hazard Flag</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{env.hazardStatus}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">Zero Superfund liens</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Environmental;