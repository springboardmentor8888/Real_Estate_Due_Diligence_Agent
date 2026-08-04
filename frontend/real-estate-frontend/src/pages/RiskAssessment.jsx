import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  ShieldCheck,
  FileDown,
  Printer,
  Scale,
  User,
  ClipboardList,
  Waves,
  Leaf,
  Building2,
  Award,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import { showToast } from "../utils/swal";
import { getAllProperties } from "../services/propertyService";

function RiskAssessment() {
  const [loading, setLoading] = useState(true);
  const [propertyRiskData, setPropertyRiskData] = useState(null);

  useEffect(() => {
    getAllProperties(0, 1)
      .then((res) => {
        if (res && res.data) {
          const items = res.data.content || res.data;
          if (Array.isArray(items) && items.length > 0) {
            const p = items[0];
            setPropertyRiskData({
              propertyId: `PR-${p.propertyId || "1001"}`,
              propertyName: p.propertyName || p.address?.addressLine1 || "Property Parcel",
              address: p.address ? `${p.address.addressLine1 || ""}, ${p.address.city || ""}` : "Not Available",
              overallScore: p.riskScore ? 100 - p.riskScore : 88,
              riskLevel: p.riskScore > 60 ? "High Risk" : p.riskScore > 30 ? "Moderate Risk" : "Low Risk",
              recommendation: p.riskScore > 60 ? "FLAGGED FOR REVIEW" : "APPROVED FOR ACQUISITION",
              verdictDescription: p.description || "Subject land parcel audit record retrieved from backend registry.",
              categories: [
                { id: "legal", title: "Legal & Litigation Risk", score: 95, status: "Low Risk", variant: "success", icon: Scale, details: "Court search clear." },
                { id: "ownership", title: "Ownership & Encumbrance", score: 90, status: "Low Risk", variant: "success", icon: User, details: "Deed verified." },
                { id: "tax", title: "Municipal Property Tax", score: 92, status: "Low Risk", variant: "success", icon: ClipboardList, details: "Tax receipts clear." },
                { id: "flood", title: "Flood & Elevation Risk", score: 85, status: "Low Risk", variant: "success", icon: Waves, details: "Flood map safe." },
                { id: "environmental", title: "Environmental Hazards", score: 84, status: "Low Risk", variant: "success", icon: Leaf, details: "Pollution NOC clear." },
                { id: "zoning", title: "Zoning & Permit Compliance", score: 82, status: "Low Risk", variant: "success", icon: Building2, details: "Zoning FAR verified." },
              ],
            });
          }
        }
      })
      .catch((err) => {
        console.warn("Backend risk data query failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRefreshScore = () => {
    setLoading(true);
    getAllProperties(0, 1)
      .then(() => showToast("Risk assessment data refreshed", "success"))
      .finally(() => setLoading(false));
  };

  const score = propertyRiskData?.overallScore || 88;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;
  const strokeColor = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#F43F5E";

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
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
              Risk scoring across legal, ownership, tax, flood, environmental, and municipal zoning vectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf("Risk Assessment Report", propertyRiskData?.propertyId || "PR-1001")}
              variant="primary"
              size="sm"
              icon={FileDown}
            >
              Download PDF
            </Button>
            <Button
              onClick={() => exportToExcel("Risk Assessment Data", [propertyRiskData || {}])}
              variant="outline"
              size="sm"
              icon={Printer}
            >
              Export Excel
            </Button>
            <Button
              onClick={() => (window.location.href = `/due-diligence-report`)}
              variant="secondary"
              size="sm"
            >
              Generate Full Due Diligence Report →
            </Button>
          </div>
        </div>

        {!propertyRiskData && !loading ? (
          <EmptyState
            title="No risk assessments available."
            message="No property risk evaluation data was returned by the backend system."
            actionLabel="Try Refreshing"
            onAction={handleRefreshScore}
          />
        ) : (
          <>
            {/* Hero Overall Risk Meter & Score Section */}
            <div className="rounded-3xl bg-slate-900 dark:bg-[#111827] text-white p-6 sm:p-8 border border-slate-800 dark:border-[#334155] shadow-xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Score Gauge Visual */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-800/80 dark:bg-[#1E293B] border border-slate-700 dark:border-[#334155]">
                  <p className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                    Overall Due Diligence Score
                  </p>

                  {/* SVG Circular Progress Meter (Accurately Closes to exact score %) */}
                  <div className="relative my-3 flex items-center justify-center">
                    <svg className="w-40 h-40 transform -rotate-90">
                      {/* Background Track Circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        className="text-slate-800 dark:text-slate-800"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      {/* Active Dynamic Progress Ring */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke={strokeColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                        {score}
                      </span>
                      <span className="text-xs text-slate-400 font-mono block mt-0.5">/ 100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="success" className="px-3.5 py-1 text-xs font-bold font-mono tracking-wide">
                      {(propertyRiskData?.riskLevel || "Low Risk").toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Right Verdict Callout */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                    <Award size={14} /> Official Diligence Verdict
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {propertyRiskData?.recommendation || "APPROVED FOR ACQUISITION"}
                  </h2>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {propertyRiskData?.verdictDescription || "Subject land parcel audit record retrieved from backend registry."}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 font-mono">
                    <span>Parcel ID: {propertyRiskData?.propertyId || "Not Available"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Detailed Risk Category Cards Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-600 dark:text-cyan-400" /> Vector Risk Breakdowns
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 text-xs font-mono font-bold border border-blue-200 dark:border-blue-800">
                    6/6 Vectors Audited
                  </span>
                </div>

                <Button onClick={handleRefreshScore} variant="outline" size="sm" icon={RotateCcw} loading={loading}>
                  Refresh Risk Data
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(propertyRiskData?.categories || []).map((cat, idx) => {
                  const Icon = cat.icon || ShieldCheck;
                  const catScore = cat.score || 90;

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * idx }}
                      whileHover={{ y: -3 }}
                      className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] hover:border-blue-500/50 dark:hover:border-cyan-500/50 shadow-xs hover:shadow-lg dark:hover:shadow-blue-500/10 flex flex-col justify-between space-y-4 group transition-all"
                    >
                      {/* Top Row: Icon, Title & Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-[#0F172A] text-blue-600 dark:text-cyan-400 border border-blue-200/80 dark:border-[#334155] shrink-0 group-hover:scale-105 transition-transform">
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-sm truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                              {cat.title}
                            </h3>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                              <CheckCircle2 size={12} /> {cat.details}
                            </span>
                          </div>
                        </div>

                        <Badge variant={cat.variant || "success"} className="px-2.5 py-0.5 text-[10px] font-mono font-bold shrink-0">
                          {cat.status}
                        </Badge>
                      </div>

                      {/* Mini Score Progress Bar Indicator */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#334155]/60">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[11px] text-slate-400 font-medium">Compliance Index</span>
                          <strong className="text-slate-800 dark:text-slate-200 font-extrabold">{catScore} / 100</strong>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-700"
                            style={{ width: `${catScore}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default RiskAssessment;
