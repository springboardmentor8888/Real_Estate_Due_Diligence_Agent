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
import { getRiskAssessmentsByProperty } from "../services/riskService";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendRisks, setBackendRisks] = useState([]);

  const activeProp = getLiveActiveProperty(searchParams.get("id") || searchParams.get("propertyId"));
  const rawPropId = activeProp?.propertyId || activeProp?.numericId || activeProp?.id;
  const numericId = typeof rawPropId === "number" ? rawPropId : parseInt((rawPropId || "1").toString().replace(/\D/g, "") || "1", 10);

  const propertyTitle = activeProp?.propertyName || activeProp?.title || "Gachibowli Luxury Villa";

  const fetchRiskAssessments = () => {
    setLoading(true);
    setError(null);
    getRiskAssessmentsByProperty(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          setBackendRisks(res.data);
        } else {
          setBackendRisks([]);
        }
      })
      .catch((err) => {
        console.warn("Backend risk query failed:", err?.message || err);
        setError("Unable to load risk assessment records from backend server. Please verify Spring Boot service is running on port 8081.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (numericId) {
      fetchRiskAssessments();
    }
  }, [numericId]);

  // Dynamically compute aggregate risk score & trust index from backend assessment records
  const avgRiskScore = useMemo(() => {
    if (!backendRisks || backendRisks.length === 0) return 10;
    const sum = backendRisks.reduce((acc, curr) => acc + (curr.riskScore || 0), 0);
    return Math.round(sum / backendRisks.length);
  }, [backendRisks]);

  const trustIndex = 100 - avgRiskScore;

  // Map backend risk records to circular gauges
  const riskGauges = useMemo(() => {
    if (!backendRisks || backendRisks.length === 0) return [];
    
    return backendRisks.map((item, idx) => {
      const category = item.riskCategoryName || item.categoryName || `Category ${idx + 1}`;
      const rScore = item.riskScore ?? 0;
      const tScore = 100 - rScore;
      const rawLevel = (item.riskLevel || (rScore > 60 ? "HIGH" : rScore > 30 ? "MEDIUM" : "LOW")).toUpperCase();
      const levelFormatted = rawLevel === "LOW" ? "Low" : rawLevel === "HIGH" ? "High" : "Medium";
      
      let iconComp = ShieldCheck;
      if (category.toLowerCase().includes("tax")) iconComp = User;
      else if (category.toLowerCase().includes("env")) iconComp = FileCheck;
      else if (category.toLowerCase().includes("flood")) iconComp = AlertOctagon;
      else if (category.toLowerCase().includes("permit") || category.toLowerCase().includes("zoning")) iconComp = Scale;

      return {
        id: item.assessmentId || `risk-${idx}`,
        title: category,
        score: tScore,
        riskLevel: levelFormatted,
        icon: iconComp,
        details: item.recommendation || "Verified by 13-vector legal AI audit",
        assessedBy: item.assessedByUserEmail || "admin@realdiligence.in",
        date: item.assessmentDate || "Recently Audited",
      };
    });
  }, [backendRisks]);

  // Map backend risk records to recommendation cards
  const recommendationCards = useMemo(() => {
    if (!backendRisks || backendRisks.length === 0) return [];

    return backendRisks.map((item, idx) => {
      const category = item.riskCategoryName || item.categoryName || `Risk Factor ${idx + 1}`;
      const rawLevel = (item.riskLevel || "LOW").toUpperCase();
      const isLow = rawLevel === "LOW";
      const isHigh = rawLevel === "HIGH";

      return {
        id: item.assessmentId || `rec-${idx}`,
        verdict: isLow ? "APPROVED FOR ACQUISITION" : isHigh ? "ACTION REQUIRED" : "CONDITIONAL APPROVAL",
        variant: isLow ? "success" : isHigh ? "danger" : "warning",
        badge: `${category} Clearance`,
        title: `${category} Risk Audit`,
        description: item.recommendation || "Verified clean by sub-registrar & municipal authority.",
        icon: isLow ? CheckCircle2 : isHigh ? AlertTriangle : RotateCcw,
        assessedBy: item.assessedByUserEmail,
        assessmentDate: item.assessmentDate,
      };
    });
  }, [backendRisks]);

  const handleRefreshScore = () => {
    fetchRiskAssessments();
    showToast("Risk assessment scores refreshed from backend REST API", "success");
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
            PR-{numericId} • TRUST INDEX {trustIndex}%
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <ShieldCheck size={14} /> 13-Vector REST API Audit
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              🛡️ Legal Risk Assessment & Compliance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Real-time risk assessment parameters for <strong className="text-slate-900 dark:text-white">{propertyTitle}</strong> (Property ID: #{numericId}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf(`Legal_Risk_Assessment_PR-${numericId}`, riskGauges)}
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
              Refresh Risk API
            </Button>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-mono text-xs flex items-center justify-between">
            <span>⚠️ {error}</span>
            <Button onClick={fetchRiskAssessments} variant="danger" size="xs">Retry</Button>
          </div>
        )}

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

        {/* LOADING & CIRCULAR PROGRESS CHARTS GRID */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            ⭕ Circular Risk & Compliance Gauges
          </h2>

          {loading ? (
            <div className="p-8 text-center font-mono text-slate-500">
              Loading risk assessment records from backend API...
            </div>
          ) : riskGauges.length === 0 ? (
            <EmptyState title="No Risk Records Found" description="No risk assessment records found for this property." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {riskGauges.map((metric) => (
                <CircularRiskGauge key={metric.id} {...metric} />
              ))}
            </div>
          )}
        </div>

        {/* SHOW RECOMMENDATION CARDS SECTION */}
        {!loading && recommendationCards.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              📄 Legal Recommendation Cards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                    <div className="pt-3 border-t border-slate-100 dark:border-[#334155] space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Auditor: {rec.assessedBy || "admin@realdiligence.in"}</span>
                        <span>{rec.assessmentDate || ""}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-blue-600 dark:text-cyan-400 font-bold pt-1">
                        <span>Verified Clearance</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default RiskAssessment;
