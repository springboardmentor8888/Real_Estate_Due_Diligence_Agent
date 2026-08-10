import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Landmark,
  ShieldAlert,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  Receipt,
  Home,
  ChevronRight,
  Calculator,
  Building2,
  Bell,
  Search,
  CheckCircle2,
  Percent,
  Activity,
  ArrowUpRight,
  FileText,
  User,
  ExternalLink,
  Filter,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import DashboardHeroHeader from "../components/dashboard/DashboardHeroHeader";
import StatCard from "../components/dashboard/StatCard";
import FinancialKpiCards from "../components/dashboard/FinancialKpiCards";
import QuickActions, { FINANCIAL_QUICK_ACTIONS_SUITE } from "../components/dashboard/QuickActions";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { financialDashboardData } from "../mock/financialData";

// Enhanced 6 Statistics KPI Cards for Financial Institution
const FINANCIAL_KPI_CARDS = [
  {
    title: "Total Mortgage Portfolio",
    value: "₹ 485 Cr",
    change: "6 Active Loan Applications",
    isPositive: true,
    period: "Institutional Exposure",
    iconName: "Landmark",
    cardStyle: "bg-blue-50/60 dark:bg-[#1E293B] border-blue-200/80 dark:border-[#334155] border-l-4 border-l-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border-blue-300 dark:border-blue-800",
  },
  {
    title: "Approved Loan Volume",
    value: "₹ 340 Cr",
    change: "14 Sanctioned Loans YTD",
    isPositive: true,
    period: "Approved Portfolio",
    iconName: "FileCheck",
    cardStyle: "bg-emerald-50/60 dark:bg-[#1E293B] border-emerald-200/80 dark:border-[#334155] border-l-4 border-l-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
  },
  {
    title: "Average LTV Ratio",
    value: "62.5%",
    change: "Safe Underwriting Threshold",
    isPositive: true,
    period: "Max 70% Limit",
    iconName: "Percent",
    cardStyle: "bg-purple-50/60 dark:bg-[#1E293B] border-purple-200/80 dark:border-[#334155] border-l-4 border-l-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800",
  },
  {
    title: "High Risk Collateral",
    value: "1",
    change: "Requires 15% LTV Adjustment",
    isPositive: false,
    period: "Collateral Alert",
    iconName: "AlertTriangle",
    cardStyle: "bg-rose-50/60 dark:bg-[#1E293B] border-rose-200/80 dark:border-[#334155] border-l-4 border-l-rose-500",
    iconBg: "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800",
  },
];

// 4 Financial Quick Actions
const FINANCIAL_QUICK_ACTIONS = [
  { id: "qa-review-loans", title: "Assess Mortgage Loan", description: "Audit borrower credit DSCR, property LTV and sanction eligibility", path: "/financial/loans", iconName: "Landmark", badge: "Underwriting" },
  { id: "qa-analyze-risk", title: "Verify Collateral Title", description: "Run Sub-Registrar 30-year deed trace and encumbrance verification", path: "/risk-assessment", iconName: "TrendingUp", badge: "LTV Engine" },
  { id: "qa-gen-report", title: "Generate Report", description: "Compile institutional mortgage underwriting and LTV clearance report", path: "/due-diligence-report", iconName: "FileSpreadsheet", badge: "Reports" },
  { id: "qa-review-tax", title: "Review Tax History", description: "Verify municipal property tax receipts, PTIN challans and lien status", path: "/tax-history", iconName: "Receipt", badge: "Lien Audit" },
];

// Recent Loan Requests Dataset
const RECENT_LOAN_REQUESTS = [
  {
    id: "LOAN-2026-901",
    borrower: "Adani Realty Institutional Fund",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    propertyId: "1001",
    requestedAmount: "₹ 45.00 Cr",
    marketValuation: "₹ 65.00 Cr",
    ltvRatio: "69.2%",
    riskScore: "14/100 Low",
    status: "Sanctioned",
    variant: "success",
  },
  {
    id: "LOAN-2026-902",
    borrower: "DLF Cybercity Developers Ltd",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    propertyId: "1002",
    requestedAmount: "₹ 28.00 Cr",
    marketValuation: "₹ 38.00 Cr",
    ltvRatio: "73.6%",
    riskScore: "68/100 High",
    status: "Under Evaluation",
    variant: "warning",
  },
  {
    id: "LOAN-2026-903",
    borrower: "GMR Logistics Infrastructure",
    property: "Whitefield Horizon Tech Campus (PR-1003)",
    propertyId: "1003",
    requestedAmount: "₹ 110.00 Cr",
    marketValuation: "₹ 165.00 Cr",
    ltvRatio: "66.6%",
    riskScore: "18/100 Low",
    status: "Approved",
    variant: "success",
  },
  {
    id: "LOAN-2026-904",
    borrower: "Prestige Capital Partners",
    property: "Financial District Commercial Plot (PR-1004)",
    propertyId: "1004",
    requestedAmount: "₹ 32.00 Cr",
    marketValuation: "₹ 52.00 Cr",
    ltvRatio: "61.5%",
    riskScore: "22/100 Low",
    status: "Pending Appraisal",
    variant: "info",
  },
];

// High Risk Collateral Properties
const HIGH_RISK_COLLATERAL = [
  {
    id: "PR-1002",
    propertyName: "Jubilee Hills Commercial Plot 36",
    borrower: "DLF Cybercity Developers Ltd",
    valuation: "₹ 38.00 Cr",
    riskScore: "68/100",
    riskLevel: "High Risk",
    issue: "High Court Civil Stay Order #CS-402 filed by adjacent boundary owner. LTV capped at 55%.",
  },
];

// System Dispatches Notifications
const FINANCIAL_NOTIFICATIONS = [
  { id: "NTF-F1", title: "Loan Application Approved", desc: "PR-1001 mortgage loan ₹ 45 Cr sanctioned for disbursal", time: "15 mins ago", priority: "HIGH" },
  { id: "NTF-F2", title: "Appraisal Certificate Uploaded", desc: "Independent valuation report uploaded for Whitefield Tech", time: "1 hour ago", priority: "MEDIUM" },
  { id: "NTF-F3", title: "LTV Threshold Alert", desc: "PR-1002 LTV ratio 73.6% exceeds 70% institutional limit", time: "3 hours ago", priority: "HIGH" },
];

function FinancialDashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.firstName
    ? `${storedUser.firstName} ${storedUser.lastName || ""}`.trim()
    : storedUser.name || "Venkatesh Iyer";
  const userRole = "Financial Institution";

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Top Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Financial Institution Portal
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            ROLE: MORTGAGE & COLLATERAL UNDERWRITER
          </span>
        </div>

        {/* 1. WELCOME SECTION */}
        <DashboardHeroHeader userName={userName} userRole={userRole} />

        {/* 2. REUSABLE DASHBOARD KPI CARDS (THE 6 SPECIFIED CARDS) */}
        <FinancialKpiCards />

        {/* 3. QUICK ACTIONS (THE 6 SPECIFIED BUTTONS) */}
        <QuickActions
          title="Financial Underwriting Quick Actions"
          subtitle="Run loan assessments, evaluate collateral, verify tax clearance, generate reports, compare properties, and analyze investments."
          actions={FINANCIAL_QUICK_ACTIONS_SUITE}
        />

        {/* 4. RECENT LOAN REQUESTS (ENTERPRISE DATA TABLE) */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#334155] pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                MORTGAGE APPLICATION PIPELINE
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Landmark size={20} className="text-blue-600 dark:text-cyan-400" />
                Recent Loan Requests & Underwriting Applications
              </h2>
            </div>

            <Button onClick={() => navigate("/financial/loans")} variant="outline" size="sm" icon={ChevronRight}>
              View All Loans
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#334155] text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Loan Ref ID</th>
                  <th className="py-3 px-4">Borrower Entity</th>
                  <th className="py-3 px-4">Collateral Property</th>
                  <th className="py-3 px-4">Loan Amount</th>
                  <th className="py-3 px-4">LTV Ratio</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/60 font-medium">
                {RECENT_LOAN_REQUESTS.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-cyan-400">{loan.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{loan.borrower}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{loan.property}</td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-600 dark:text-cyan-400">{loan.requestedAmount}</td>
                    <td className="py-3.5 px-4 font-bold">{loan.ltvRatio}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">{loan.riskScore}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={loan.variant}>{loan.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button onClick={() => navigate(`/risk-assessment?id=${loan.propertyId}`)} variant="outline" size="sm">
                        Audit LTV
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. HIGH RISK PROPERTIES & 6. FINANCIAL REPORTS (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 5. HIGH RISK PROPERTIES (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  COLLATERAL ALERT
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <AlertTriangle size={18} className="text-rose-500" /> High Risk Properties & Collateral Defective
                </h2>
              </div>
              <Badge variant="danger">1 Property Flagged</Badge>
            </div>

            <div className="space-y-3">
              {HIGH_RISK_COLLATERAL.map((col) => (
                <div key={col.id} className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-600 dark:text-rose-400">{col.id} • {col.riskLevel}</span>
                    <Badge variant="danger">{col.riskScore}</Badge>
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{col.propertyName}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">{col.issue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. FINANCIAL REPORTS (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  UNDERWRITING ARCHIVE
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <FileSpreadsheet size={18} className="text-purple-500" /> Financial Reports & Certificates
                </h2>
              </div>
              <Button onClick={() => navigate("/due-diligence-report")} variant="outline" size="sm">
                View Reports
              </Button>
            </div>

            <div className="space-y-3">
              {financialDashboardData.financialReports.map((rpt) => (
                <div key={rpt.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">{rpt.id} • {rpt.date}</span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">{rpt.name}</h3>
                    <p className="text-slate-500 text-[11px]">Borrower: {rpt.borrower}</p>
                  </div>
                  <Badge variant="success">{rpt.score}% AI Score</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. NOTIFICATIONS & 8. MARKET SUMMARY (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 7. NOTIFICATIONS DISPATCH (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  TELEMETRY STREAM
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <Bell size={18} className="text-amber-500" /> Financial Notifications & Alerts
                </h2>
              </div>
              <Button onClick={() => navigate("/notifications")} variant="outline" size="sm">
                Open Center
              </Button>
            </div>

            <div className="space-y-3">
              {FINANCIAL_NOTIFICATIONS.map((ntf) => (
                <div key={ntf.id} className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{ntf.title} • {ntf.time}</span>
                    <p className="font-extrabold text-slate-900 dark:text-white text-xs">{ntf.desc}</p>
                  </div>
                  <Badge variant="warning">{ntf.priority}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 8. MARKET SUMMARY (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                MORTGAGE BENCHMARK TELEMETRY
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                📈 Commercial Mortgage Market Summary
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Prime Mortgage Rate</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base block mt-0.5">8.45% p.a.</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Max Allowed LTV</span>
                <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-base block mt-0.5">70.0% Limit</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Average DSCR Required</span>
                <strong className="text-slate-900 dark:text-white font-extrabold text-base block mt-0.5">1.75x Ratio</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Institutional Exposure</span>
                <strong className="text-purple-600 dark:text-purple-400 font-extrabold text-base block mt-0.5">₹ 485 Cr Cap</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FinancialDashboard;
