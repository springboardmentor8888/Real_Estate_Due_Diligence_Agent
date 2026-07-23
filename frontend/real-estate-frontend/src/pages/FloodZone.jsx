import React from "react";
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

function FloodZone() {
  const flood = {
    risk: "Low Risk",
    zone: "Zone X (Unshaded)",
    insuranceRequired: "No Mandatory Flood Insurance",
    lastInspection: "March 2025",
    elevation: "+42.5 Meters above sea level",
    bfe: "N/A (Outside 100-year floodplain)",
  };

  const handleVerifyFEMA = () => {
    showSuccessAlert(
      "FEMA FIRM Map Verified",
      "FEMA Flood Map Panel #48201C0435J confirms Zone X rating."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-mono font-bold mb-3">
              <Waves size={14} /> FEMA Flood Insurance Rate Map (FIRM)
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              🌊 Flood Zone & Elevation Risk Analysis
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect flood plain designations, base flood elevation (BFE) metrics, and federal flood insurance requirements.
            </p>
          </div>

          <Button onClick={handleVerifyFEMA} variant="primary" icon={ShieldCheck}>
            Verify FEMA FIRM Panel
          </Button>
        </div>

        {/* Risk Meter Widget */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-8 border border-slate-800 shadow-xl">
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

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center shrink-0">
              <p className="text-xs font-mono text-cyan-300 uppercase">Risk Level Rating</p>
              <Badge variant="success" className="mt-2 text-sm px-4 py-1.5">
                {flood.risk}
              </Badge>
            </div>
          </div>

          {/* Visual Risk Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800">
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
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-600" /> Elevation & Insurance Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Flood Insurance Need</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{flood.insuranceRequired}</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">Lender Obligation: Waived</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Topographic Elevation</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{flood.elevation}</h3>
              <p className="text-xs text-slate-500 mt-1">High ground safety</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Base Flood Elevation (BFE)</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{flood.bfe}</h3>
              <p className="text-xs text-slate-500 mt-1">Standard flood height</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Last Map Revision</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{flood.lastInspection}</h3>
              <p className="text-xs text-slate-500 mt-1">FEMA FIRM Revision</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FloodZone;