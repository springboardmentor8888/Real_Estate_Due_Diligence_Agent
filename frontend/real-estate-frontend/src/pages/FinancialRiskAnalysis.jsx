import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty } from "../services/liveStore";
import {
  TrendingUp,
  ShieldAlert,
  CreditCard,
  Building2,
  Receipt,
  Award,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { exportToPdf } from "../utils/exportUtils";
import { showSuccessAlert } from "../utils/swal";

// SVG Circular Progress Gauge Component
function CircularGauge({ score, max = 100, label, riskLevel, colorClass, strokeColor }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / max) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-3 font-mono">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-200 dark:stroke-[#334155]"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
            {score}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
            / {max}
          </span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{label}</h4>
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colorClass}`}
        >
          {riskLevel}
        </span>
      </div>
    </div>
  );
}

// Linear Progress Bar Component
function RiskProgressBar({ label, score, level, color, icon: Icon }) {
  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="flex items-center justify-between font-bold">
        <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Icon size={14} className="text-blue-500" /> {label}
        </span>
        <span className="text-slate-900 dark:text-white font-extrabold">
          {score}/100 ({level})
        </span>
      </div>

      <div className="h-3 w-full bg-slate-100 dark:bg-[#0F172A] rounded-full overflow-hidden border border-slate-200 dark:border-[#334155]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function FinancialRiskAnalysis() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeProp = getLiveActiveProperty(searchParams.get("id") || searchParams.get("propertyId"));
  const numericId = (activeProp?.numericId || activeProp?.propertyId || 1001).toString();

  // Mock Financial Risk Analysis Metrics for current active property
  const riskData = {
    overallFinancialRisk: 18,
    overallLevel: "Low Risk",
    creditRisk: 12,
    creditLevel: "Low Risk",
    propertyRisk: 24,
    propertyLevel: "Low Risk",
    taxRisk: 8,
    taxLevel: "Low Risk",
    investmentRisk: 16,
    investmentLevel: "Low Risk",
    marketRisk: 22,
    marketLevel: "Low Risk",
    loanEligibilityScore: 94,
    eligibilityLevel: "High Sanction Eligibility",
  };

  const handleExportRiskReport = () => {
    exportToPdf(`Financial_Risk_Analysis_PR-${numericId}`, riskData);
    showSuccessAlert("Risk Analysis Exported", `Generated institutional financial risk report for PR-${numericId}`);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Financial Risk Analysis & Underwriting Scorecard
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            PR-{numericId} • RISK TELEMETRY
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <ShieldAlert size={14} /> Underwriting Risk Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📊 Financial Risk Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              13-Vector Risk Telemetry evaluating Credit Risk, Property Collateral Risk, Tax Risk, Investment Risk, Market Risk, and Overall Loan Eligibility.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={handleExportRiskReport} variant="primary" size="md" icon={FileSpreadsheet}>
              Export Risk Audit
            </Button>
          </div>
        </div>

        {/* SECTION 1: CIRCULAR CHARTS FOR ALL 7 REQUIRED METRICS */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                CIRCULAR SCORECARDS
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                🎯 Risk Vector Circular Telemetry
              </h2>
            </div>

            <Badge variant="success">Overall Score: 18/100 (Low Risk)</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {/* 1. Overall Financial Risk */}
            <CircularGauge
              score={riskData.overallFinancialRisk}
              label="Overall Risk"
              riskLevel="Low"
              colorClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300"
              strokeColor="#10B981"
            />

            {/* 2. Credit Risk */}
            <CircularGauge
              score={riskData.creditRisk}
              label="Credit Risk"
              riskLevel="Low"
              colorClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300"
              strokeColor="#10B981"
            />

            {/* 3. Property Risk */}
            <CircularGauge
              score={riskData.propertyRisk}
              label="Property Risk"
              riskLevel="Low"
              colorClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300"
              strokeColor="#10B981"
            />

            {/* 4. Tax Risk */}
            <CircularGauge
              score={riskData.taxRisk}
              label="Tax Risk"
              riskLevel="Low"
              colorClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300"
              strokeColor="#10B981"
            />

            {/* 5. Investment Risk */}
            <CircularGauge
              score={riskData.investmentRisk}
              label="Investment Risk"
              riskLevel="Low"
              colorClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300"
              strokeColor="#10B981"
            />

            {/* 6. Market Risk */}
            <CircularGauge
              score={riskData.marketRisk}
              label="Market Risk"
              riskLevel="Low"
              colorClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300"
              strokeColor="#10B981"
            />

            {/* 7. Loan Eligibility Score */}
            <CircularGauge
              score={riskData.loanEligibilityScore}
              label="Eligibility"
              riskLevel="High (94%)"
              colorClass="bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-cyan-300 border-blue-300"
              strokeColor="#3B82F6"
            />
          </div>
        </div>

        {/* SECTION 2: PROGRESS INDICATORS (LOW, MEDIUM, HIGH) */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <div>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                LINEAR BREAKDOWN
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                📊 Underwriting Progress Indicators
              </h2>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">0-30 Low</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">31-60 Medium</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">61-100 High</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskProgressBar label="Overall Financial Risk" score={18} level="Low" color="bg-emerald-500" icon={ShieldCheck} />
            <RiskProgressBar label="Credit Risk" score={12} level="Low" color="bg-emerald-500" icon={CreditCard} />
            <RiskProgressBar label="Property Collateral Risk" score={24} level="Low" color="bg-emerald-500" icon={Building2} />
            <RiskProgressBar label="Tax & Lien Risk" score={8} level="Low" color="bg-emerald-500" icon={Receipt} />
            <RiskProgressBar label="Investment Volatility Risk" score={16} level="Low" color="bg-emerald-500" icon={TrendingUp} />
            <RiskProgressBar label="Market Interest Risk" score={22} level="Low" color="bg-emerald-500" icon={BarChart2} />
          </div>
        </div>

        {/* SECTION 3: UNDERWRITING RECOMMENDATIONS BASED ON MOCK DATA */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                DECISION MATRIX
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                💡 Underwriting Recommendations & Sanction Verdict
              </h2>
            </div>
            <Badge variant="success">Eligible for Sanction</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Recommendation 1 */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 size={16} /> Sanction Disbursal Recommended
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">Safe LTV Margin (69.2%)</h3>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                The requested loan amount of ₹ 45 Cr represents a 69.2% LTV against market valuation ₹ 65 Cr, satisfying the institutional 70% threshold.
              </p>
            </div>

            {/* Recommendation 2 */}
            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-cyan-400 font-bold">
                <Lightbulb size={16} /> Zero Tax Lien Clearance
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">Verified Municipal PTIN</h3>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Municipal property tax dues (PTIN-90812) verified paid through FY 2025. Zero outstanding tax liens or municipal encumbrance attached.
              </p>
            </div>

            {/* Recommendation 3 */}
            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold">
                <Award size={16} /> High Credit Score (94/100)
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">Strong DSCR (2.1x)</h3>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Borrower entity maintains a Debt Service Coverage Ratio of 2.1x, providing a 35% liquidity safety buffer over the required 1.75x ratio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FinancialRiskAnalysis;
