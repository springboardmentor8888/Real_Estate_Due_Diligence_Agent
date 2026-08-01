import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  FileDown,
  Printer,
  Scale,
  User,
  ClipboardList,
  Waves,
  Leaf,
  Building2,
  Map,
  CheckCircle2,
  TrendingUp,
  Award,
  Info,
  RotateCcw,
} from "lucide-react";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import { showToast } from "../utils/swal";

function RiskAssessment() {
  const [loading, setLoading] = useState(false);

  // Demo risk assessment dataset (Structured to consume API responses seamlessly)
  const riskData = {
    propertyId: "PR-1001",
    propertyName: "Prestige Cyber Heights",
    address: "Plot 42, Electronic City Phase 1, Bengaluru",
    overallScore: 88, // 0 - 100 Scale
    riskLevel: "Low Risk",
    recommendation: "APPROVED FOR ACQUISITION",
    verdictDescription:
      "Subject land parcel exhibits clean title ownership, clear municipal tax standing, zero flood zone hazard, and 100% compliance with zoning FAR regulations. Recommended for institutional acquisition.",
    categories: [
      {
        id: "legal",
        title: "Legal & Litigation Risk",
        score: 95,
        status: "Low Risk",
        variant: "success",
        icon: Scale,
        details: "Zero pending civil litigation or high court disputes identified in judicial archives.",
        metrics: [
          { label: "Court Records Search", value: "Clear (0 Encumbrances)" },
          { label: "Title Chain Sanity", value: "30-Year Trace Clean" },
        ],
      },
      {
        id: "ownership",
        title: "Ownership & Encumbrance",
        score: 90,
        status: "Low Risk",
        variant: "success",
        icon: User,
        details: "Sole private individual owner with verified Warranty Deed at Sub-Registrar Office.",
        metrics: [
          { label: "Active Mortgages", value: "0 Liens Outstanding" },
          { label: "Share Distribution", value: "100% Single Holder" },
        ],
      },
      {
        id: "tax",
        title: "Municipal Property Tax",
        score: 92,
        status: "Low Risk",
        variant: "success",
        icon: ClipboardList,
        details: "Annual property tax paid in full through FY 2025-26. Zero outstanding municipal penalties.",
        metrics: [
          { label: "Assessor Assessment", value: "Fully Settled" },
          { label: "Challan Receipt", value: "Verified #CH-2025-88" },
        ],
      },
      {
        id: "flood",
        title: "Flood & Elevation Risk",
        score: 85,
        status: "Low Risk",
        variant: "success",
        icon: Waves,
        details: "Located in FEMA FIRM Zone X (minimal flood hazard). Topographic elevation +42m.",
        metrics: [
          { label: "FIRM Flood Plain", value: "Zone X (Unshaded)" },
          { label: "Base Elevation", value: "+42.5 Meters MSL" },
        ],
      },
      {
        id: "environmental",
        title: "Environmental Hazards",
        score: 84,
        status: "Low Risk",
        variant: "success",
        icon: Leaf,
        details: "State Pollution Control Board Phase I clearance. Safe soil composition and potable water.",
        metrics: [
          { label: "EPA Superfund List", value: "Not Listed" },
          { label: "AQI Rating", value: "22 (Good Air Quality)" },
        ],
      },
      {
        id: "zoning",
        title: "Zoning & Permit Compliance",
        score: 82,
        status: "Low Risk",
        variant: "success",
        icon: Building2,
        details: "Fully compliant with R1-A residential zoning rules. All 3 historical permits closed.",
        metrics: [
          { label: "Allowable FAR", value: "2.0 (Within Limit)" },
          { label: "Height Clearance", value: "18m Max Limit" },
        ],
      },
    ],
  };

  const handleRefreshScore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Risk Assessment Matrix recalculated successfully", "success");
    }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <ShieldCheck size={14} /> AI Due Diligence Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🛡️ Property Risk Assessment & Recommendation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Comprehensive risk scoring across legal, ownership, tax, flood, environmental, and municipal zoning vectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf("Risk Assessment Report", riskData.propertyId)}
              variant="primary"
              size="sm"
              icon={FileDown}
            >
              Download PDF
            </Button>
            <Button
              onClick={() => exportToExcel("Risk Assessment Data", [riskData])}
              variant="secondary"
              size="sm"
              icon={Printer}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* Hero Overall Risk Meter & Score Section */}
        <div className="rounded-3xl bg-slate-900 dark:bg-[#111827] text-white p-6 sm:p-8 border border-slate-800 dark:border-[#334155] shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Score Gauge Visual */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-800/80 dark:bg-[#1E293B] border border-slate-700 dark:border-[#334155]">
              <p className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                Overall Due Diligence Score
              </p>
              
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-8 border-slate-700 border-t-emerald-500 border-r-emerald-500 flex items-center justify-center bg-slate-900/60 shadow-inner">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                      {riskData.overallScore}
                    </span>
                    <span className="text-xs text-slate-400 font-mono block">/ 100</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Badge variant="success" className="px-3.5 py-1 text-xs font-bold font-mono tracking-wide">
                  {riskData.riskLevel.toUpperCase()}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">High Confidence</span>
              </div>
            </div>

            {/* Right Verdict Callout */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                <Award size={14} /> Official Diligence Verdict
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {riskData.recommendation}
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                {riskData.verdictDescription}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 font-mono">
                <span>Parcel ID: {riskData.propertyId}</span>
                <span>Calculated via Real Estate Agent Engine v2.4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Risk Category Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-600 dark:text-cyan-400" /> Vector Risk Breakdowns
            </h2>
            <Button onClick={handleRefreshScore} variant="outline" size="sm" icon={RotateCcw} loading={loading}>
              Recalculate Risk
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskData.categories.map((cat) => {
              const Icon = cat.icon;

              return (
                <div
                  key={cat.id}
                  className="white-card rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] hover-lift flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800 shrink-0">
                          <Icon size={20} />
                        </div>
                        <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-base leading-tight">
                          {cat.title}
                        </h3>
                      </div>
                      <Badge variant={cat.variant} className="px-2.5 py-1 text-xs font-mono font-bold shrink-0">{cat.status}</Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                      {cat.details}
                    </p>

                    {/* Score Bar */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between text-xs font-mono font-semibold">
                        <span className="text-slate-500 dark:text-[#94A3B8]">Score Rating</span>
                        <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">{cat.score} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#0F172A] rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-[#334155]">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sub-Metrics Footer */}
                  <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 dark:border-[#334155] text-[11px] font-mono">
                    {cat.metrics.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155]">
                        <p className="text-slate-400 dark:text-[#94A3B8] text-[10px] uppercase font-bold">{m.label}</p>
                        <p className="font-bold text-slate-800 dark:text-[#F8FAFC] truncate mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default RiskAssessment;
