import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  Building2,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Activity,
  FileText,
  FileCheck,
  ShieldAlert,
  Sparkles,
  AlertOctagon,
  Check,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { exportToPdf } from "../utils/exportUtils";
import { showToast } from "../utils/swal";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty } from "../services/liveStore";

/**
 * Reusable Circular Progress Chart Component for Risk & Compliance Metrics
 */
function CircularRiskGauge({ title, score = 85, riskLevel = "Low", icon: Icon, details }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  // Risk Rating: Low (Green), Medium (Amber), High (Red)
  const isLow = riskLevel === "Low" || score >= 70;
  const isMedium = riskLevel === "Medium" || (score >= 40 && score < 70);

  const colorHex = isLow ? "#10B981" : isMedium ? "#F59E0B" : "#F43F5E";
  const badgeVariant = isLow ? "success" : isMedium ? "warning" : "danger";
  const textColorClass = isLow
    ? "text-emerald-600 dark:text-emerald-400"
    : isMedium
    ? "text-amber-600 dark:text-amber-400"
    : "text-rose-600 dark:text-rose-400";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group font-mono text-xs"
    >
      {/* Card Header: Icon, Title, Risk Indicator Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] text-blue-600 dark:text-cyan-400 border border-slate-200 dark:border-[#334155] shrink-0 group-hover:scale-105 transition-transform">
            {Icon ? <Icon size={18} /> : <Activity size={18} />}
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-xs sm:text-sm truncate">
            {title}
          </h3>
        </div>

        {/* Risk Indicator (Low / Medium / High) */}
        <Badge variant={badgeVariant} className="px-2.5 py-0.5 text-[10px] font-mono font-bold shrink-0">
          {riskLevel} Risk
        </Badge>
      </div>

      {/* SVG Circular Progress Chart */}
      <div className="relative flex items-center justify-center my-1">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="text-slate-100 dark:text-[#0F172A]"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={colorHex}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className={`text-xl font-extrabold font-mono tracking-tight ${textColorClass}`}>
            {score}%
          </span>
          <span className="text-[9px] font-mono text-slate-400 uppercase">Score</span>
        </div>
      </div>

      {/* Detail Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#334155] text-center">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">
          {details}
        </p>
      </div>
    </motion.div>
  );
}

function RiskAssessment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const activeProp = getLiveActiveProperty(searchParams.get("id") || searchParams.get("propertyId"));
  const numericId = (activeProp?.numericId || activeProp?.propertyId || 1001).toString();

  const propertyTitle = activeProp?.propertyName || activeProp?.title || "Gachibowli Tech Park Phase 2";
  const rScore = activeProp?.riskScore ?? 14;

  // THE 6 SPECIFIC RISK METRICS REQUIRED BY USER
  const legalRiskMetrics = [
    {
      id: "overall-risk",
      title: "Overall Legal Risk",
      score: 100 - rScore,
      riskLevel: rScore > 60 ? "High" : rScore > 30 ? "Medium" : "Low",
      icon: ShieldCheck,
      details: "Comprehensive 13-vector due diligence trust score",
    },
    {
      id: "ownership-risk",
      title: "Ownership Risk",
      score: Math.max(75, 96 - rScore),
      riskLevel: "Low",
      icon: User,
      details: "Sub-Registrar 30-year deed chain clear",
    },
    {
      id: "permit-risk",
      title: "Permit Risk",
      score: Math.max(70, 90 - rScore),
      riskLevel: rScore > 50 ? "Medium" : "Low",
      icon: FileCheck,
      details: "Occupancy Cert & Fire NOC valid",
    },
    {
      id: "litigation-risk",
      title: "Litigation Risk",
      score: Math.max(80, 95 - rScore),
      riskLevel: "Low",
      icon: Scale,
      details: "High Court civil suit search clear",
    },
    {
      id: "fraud-risk",
      title: "Fraud Risk",
      score: Math.max(85, 98 - rScore),
      riskLevel: "Low",
      icon: ShieldAlert,
      details: "Encumbrance & lien search clear of forgery",
    },
    {
      id: "compliance-score",
      title: "Compliance Score",
      score: Math.max(68, 92 - rScore),
      riskLevel: rScore > 40 ? "Medium" : "Low",
      icon: TrendingUp,
      details: "Aggregate 100% due diligence compliance score",
    },
  ];

  // RECOMMENDATION CARDS DATASET
  const recommendationCards = [
    {
      id: "rec-1",
      verdict: "APPROVED FOR ACQUISITION",
      variant: "success",
      badge: "Final Legal Clearance",
      title: "Title & Land Registration Clearance",
      description: "Sub-Registrar 30-year title deed trace verified 100% clear of encumbrances. Property is recommended for institutional acquisition.",
      icon: CheckCircle2,
    },
    {
      id: "rec-2",
      verdict: "CONDITIONAL APPROVAL",
      variant: "warning",
      badge: "Action Required",
      title: "Municipal Property Tax Arrears Verification",
      description: "Obtain updated FY 2025-26 zero-dues receipt from GHMC Municipal Corporation prior to final deed execution.",
      icon: AlertTriangle,
    },
    {
      id: "rec-3",
      verdict: "MONITORING REQUIRED",
      variant: "info",
      badge: "Regular Audit",
      title: "Fire Safety NOC Renewal Schedule",
      description: "Ensure Fire Safety NOC is renewed with State Disaster & Fire Response Services before September 2026.",
      icon: RotateCcw,
    },
  ];

  const handleRefreshScore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Risk assessment scores refreshed", "success");
    }, 600);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Legal Risk Assessment Workstation
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            PR-{numericId} • TRUST INDEX {100 - rScore}%
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <ShieldCheck size={14} /> 13-Vector AI Risk Audit
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              🛡️ Legal Risk Assessment & Compliance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              13-vector risk breakdown for <strong className="text-slate-900 dark:text-white">{propertyTitle}</strong> (PR-{numericId}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf(`Legal_Risk_Assessment_PR-${numericId}`, legalRiskMetrics)}
              variant="primary"
              size="sm"
              icon={FileDown}
            >
              Export PDF
            </Button>
            <Button
              onClick={() => navigate(`/due-diligence-report?id=${numericId}`)}
              variant="secondary"
              size="sm"
              icon={FileText}
            >
              Full Audit Report
            </Button>
            <Button onClick={handleRefreshScore} variant="outline" size="sm" icon={RotateCcw} loading={loading}>
              Refresh Risk AI
            </Button>
          </div>
        </div>

        {/* RISK INDICATORS LEGEND BAR (LOW / MEDIUM / HIGH) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={16} className="text-blue-600 dark:text-cyan-400" />
            <span>Risk Indicators Legend:</span>
          </span>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-extrabold text-emerald-600 dark:text-emerald-400">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
              🟢 Low Risk (&ge; 70%)
            </span>
            <span className="flex items-center gap-1.5 font-extrabold text-amber-600 dark:text-amber-400">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
              🟡 Medium Risk (40-69%)
            </span>
            <span className="flex items-center gap-1.5 font-extrabold text-rose-600 dark:text-rose-400">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
              🔴 High Risk (&lt; 40%)
            </span>
          </div>
        </div>

        {/* CIRCULAR PROGRESS CHARTS GRID (THE 6 REQUIRED METRICS) */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            ⭕ Circular Risk & Compliance Gauges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalRiskMetrics.map((metric) => (
              <CircularRiskGauge key={metric.id} {...metric} />
            ))}
          </div>
        </div>

        {/* SHOW RECOMMENDATION CARDS SECTION */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            📄 Legal Recommendation Cards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendationCards.map((rec) => {
              const IconComp = rec.icon;
              return (
                <motion.div
                  key={rec.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-cyan-400">
                        {rec.badge}
                      </span>
                      <Badge variant={rec.variant}>{rec.verdict}</Badge>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                      <IconComp size={18} className="text-blue-600 dark:text-cyan-400 shrink-0" />
                      {rec.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium">
                      {rec.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between text-[11px] text-blue-600 dark:text-cyan-400 font-bold">
                    <span>Execute Recommendation</span>
                    <ChevronRight size={14} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default RiskAssessment;
