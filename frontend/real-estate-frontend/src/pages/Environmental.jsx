import React from "react";
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

function Environmental() {
  const env = {
    score: "92 / 100",
    soil: "Good (No Heavy Metals / Radon)",
    water: "Safe Municipal Supply",
    aqi: "22 (Excellent Air Quality)",
    hazardStatus: "Zero EPA Superfund Liabilities",
    sustainability: "Grade A Solar Ready",
  };

  const handleDownloadEnvReport = () => {
    showSuccessAlert(
      "EPA Environmental Report Dispatched",
      "Environmental Audit & Phase I Assessment PDF has been generated."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold mb-3">
              <Leaf size={14} /> EPA & Environmental Health Protection Agency
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              🌱 Environmental Records & Hazards Audit
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect soil lead levels, groundwater purity tests, ambient air quality index (AQI), and EPA contamination liabilities.
            </p>
          </div>

          <Button onClick={handleDownloadEnvReport} variant="primary" icon={FileCheck}>
            Export Phase I Report
          </Button>
        </div>

        {/* Environmental Score Hero Box */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 border border-slate-800 shadow-xl">
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

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center shrink-0">
              <p className="text-xs font-mono text-emerald-300 uppercase">EPA Clearance</p>
              <Badge variant="success" className="mt-2 text-sm px-4 py-1.5">
                Clean Site Rating
              </Badge>
            </div>
          </div>
        </div>

        {/* Environmental Grid */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-600" /> Key Environmental Factors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Soil Composition</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{env.soil}</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">Tested March 2025</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Groundwater Safety</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{env.water}</h3>
              <p className="text-xs text-slate-500 mt-1">Potable Tap Grade</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Air Quality Index (AQI)</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{env.aqi}</h3>
              <p className="text-xs text-slate-500 mt-1">Low particulate level</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Hazard Flag</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{env.hazardStatus}</h3>
              <p className="text-xs text-slate-500 mt-1">Zero Superfund liens</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Environmental;