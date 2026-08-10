import React, { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  ClipboardList,
  DollarSign,
  FileDown,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Search,
  Receipt,
  FileText,
  Calendar,
  X,
  Flag,
  Send,
  AlertTriangle,
  History,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import { exportToPdf } from "../utils/exportUtils";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty } from "../services/liveStore";

function TaxVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const historyRef = useRef(null);

  const activeProp = getLiveActiveProperty(searchParams.get("propertyId") || searchParams.get("id"));
  const propertyIdParam = activeProp ? (activeProp.numericId || activeProp.propertyId || "1001").toString() : "1001";
  const numericId = propertyIdParam.replace(/\D/g, "") || "1001";

  const [taxClearanceStatus, setTaxClearanceStatus] = useState("Verified Clear Title");
  const [outstandingDues, setOutstandingDues] = useState("₹ 0 (Zero Dues)");
  const [isVerifying, setIsVerifying] = useState(false);

  // Modals state
  const [flagIssueModalOpen, setFlagIssueModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [flagReason, setFlagReason] = useState("Unpaid municipal commercial lighting surcharge ₹ 14,500.");

  // Realistic 5-year tax records dataset covering all requested fields
  const baseTaxNum = 486200;
  const [taxRecords, setTaxRecords] = useState([
    {
      assessmentYear: "2025-2026",
      currentPropertyTax: `₹ ${baseTaxNum.toLocaleString()} / annum`,
      assessmentValue: "₹ 32.50 Cr",
      outstandingDues: "₹ 0",
      taxClearanceStatus: "Verified Clear",
      paymentDate: "18 May 2025",
      receiptNumber: `TAX-HYD-2025-${88900 + parseInt(numericId)}`,
      ptinNumber: `PTIN-GHMC-${44100 + parseInt(numericId)}`,
      authority: "GHMC Serilingampally Circle 14",
    },
    {
      assessmentYear: "2024-2025",
      currentPropertyTax: `₹ ${(baseTaxNum - 22000).toLocaleString()} / annum`,
      assessmentValue: "₹ 30.20 Cr",
      outstandingDues: "₹ 0",
      taxClearanceStatus: "Verified Clear",
      paymentDate: "12 Apr 2024",
      receiptNumber: `TAX-HYD-2024-${77800 + parseInt(numericId)}`,
      ptinNumber: `PTIN-GHMC-${44100 + parseInt(numericId)}`,
      authority: "GHMC Serilingampally Circle 14",
    },
    {
      assessmentYear: "2023-2024",
      currentPropertyTax: `₹ ${(baseTaxNum - 45000).toLocaleString()} / annum`,
      assessmentValue: "₹ 28.50 Cr",
      outstandingDues: "₹ 0",
      taxClearanceStatus: "Verified Clear",
      paymentDate: "30 Apr 2023",
      receiptNumber: `TAX-HYD-2023-${66700 + parseInt(numericId)}`,
      ptinNumber: `PTIN-GHMC-${44100 + parseInt(numericId)}`,
      authority: "GHMC Serilingampally Circle 14",
    },
  ]);

  // THE 4 REQUIRED ACTION BUTTON HANDLERS
  // 1. Verify Tax
  const handleVerifyTax = () => {
    setIsVerifying(true);
    showToast("Auditing GHMC Municipal Tax & Lien Registry...", "info");

    setTimeout(() => {
      setIsVerifying(false);
      setTaxClearanceStatus("Verified Clear Title");
      setOutstandingDues("₹ 0 (Zero Dues)");
      showSuccessAlert(
        "Tax Verification Complete",
        `Municipal property tax for PR-${numericId} verified zero dues. Certificate #PTIN-GHMC-${44100 + parseInt(numericId)} issued.`
      );
    }, 800);
  };

  // 2. Flag Issue
  const handleFlagIssueSubmit = (e) => {
    e.preventDefault();
    setTaxClearanceStatus("Flagged Issue");
    setOutstandingDues("₹ 14,500 Outstanding");
    showSuccessAlert("Tax Issue Flagged", `Tax lien issue flagged: ${flagReason}`);
    setFlagIssueModalOpen(false);
  };

  // 3. Generate Tax Report
  const handleGenerateTaxReport = () => {
    const reportData = {
      propertyId: `PR-${numericId}`,
      currentPropertyTax: `₹ ${baseTaxNum.toLocaleString()} / annum`,
      outstandingDues,
      assessmentValue: "₹ 32.50 Cr",
      taxClearanceStatus,
      ptinNumber: `PTIN-GHMC-${44100 + parseInt(numericId)}`,
      records: taxRecords,
    };
    exportToPdf(`Tax_Verification_Report_PR-${numericId}`, reportData);
    showSuccessAlert("Tax Audit Report Generated", `Issued Municipal Tax Audit PDF Report for PR-${numericId}`);
  };

  // 4. View History
  const handleViewHistory = () => {
    if (historyRef.current) {
      historyRef.current.scrollIntoView({ behavior: "smooth" });
      showToast("Scrolled to 5-Year Tax Payment Ledger", "info");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <ClipboardList size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Municipal Property Tax Verification Registry
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            PTIN-GHMC-{44100 + parseInt(numericId)} • ZERO LIENS
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <ClipboardList size={14} /> Municipal PTIN & Encumbrance Workstation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              🧾 Tax Verification & Municipal Dues
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Audit current property tax liabilities, municipal assessment values, tax clearance certificates, and historical 5-year receipt ledgers.
            </p>
          </div>

          {/* THE 4 REQUIRED ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* 1. Verify Tax */}
            <Button
              onClick={handleVerifyTax}
              loading={isVerifying}
              variant="primary"
              size="sm"
              icon={CheckCircle2}
            >
              Verify Tax
            </Button>

            {/* 2. Flag Issue */}
            <Button
              onClick={() => setFlagIssueModalOpen(true)}
              variant="danger"
              size="sm"
              icon={Flag}
            >
              Flag Issue
            </Button>

            {/* 3. Generate Tax Report */}
            <Button
              onClick={handleGenerateTaxReport}
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
            >
              Generate Tax Report
            </Button>

            {/* 4. View History */}
            <Button
              onClick={handleViewHistory}
              variant="secondary"
              size="sm"
              icon={History}
            >
              View History
            </Button>
          </div>
        </div>

        {/* 4 SUMMARY METRIC CARDS COVERING REQUIRED FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Current Property Tax */}
          <div className="p-6 rounded-3xl bg-blue-50/60 dark:bg-[#1E293B] border border-blue-200/80 dark:border-[#334155] border-l-4 border-l-blue-500 space-y-2">
            <span className="text-slate-500 uppercase text-[10px] font-bold">1. Current Property Tax</span>
            <h3 className="text-2xl font-black text-blue-600 dark:text-cyan-400">
              ₹ {baseTaxNum.toLocaleString()} / yr
            </h3>
            <p className="text-slate-400 text-[10px] font-bold">Annual GHMC Commercial Tax</p>
          </div>

          {/* 2. Outstanding Dues */}
          <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-[#1E293B] border border-emerald-200/80 dark:border-[#334155] border-l-4 border-l-emerald-500 space-y-2">
            <span className="text-slate-500 uppercase text-[10px] font-bold">2. Outstanding Dues</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {outstandingDues}
            </h3>
            <p className="text-slate-400 text-[10px] font-bold">Municipal Lien Clearance</p>
          </div>

          {/* 3. Assessment Value */}
          <div className="p-6 rounded-3xl bg-purple-50/60 dark:bg-[#1E293B] border border-purple-200/80 dark:border-[#334155] border-l-4 border-l-purple-500 space-y-2">
            <span className="text-slate-500 uppercase text-[10px] font-bold">3. Municipal Assessment Value</span>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400">
              ₹ 32.50 Cr
            </h3>
            <p className="text-slate-400 text-[10px] font-bold">Ready Reckoner Base</p>
          </div>

          {/* 4. Tax Clearance Status */}
          <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-[#1E293B] border border-amber-200/80 dark:border-[#334155] border-l-4 border-l-amber-500 space-y-2">
            <span className="text-slate-500 uppercase text-[10px] font-bold">4. Tax Clearance Status</span>
            <div className="pt-1">
              <Badge variant={taxClearanceStatus === "Flagged Issue" ? "danger" : "success"}>
                {taxClearanceStatus}
              </Badge>
            </div>
            <p className="text-slate-400 text-[10px] font-bold mt-1">GHMC PTIN Certificate</p>
          </div>
        </div>

        {/* REUSABLE TABLE: PREVIOUS TAX RECORDS & PAYMENT HISTORY */}
        <div ref={historyRef} className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                PREVIOUS TAX RECORDS & LEDGER
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                📜 5-Year Payment History & PTIN Challan Audit
              </h2>
            </div>

            <Badge variant="success">{taxRecords.length} Verified Assessment Cycles</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#334155] text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Assessment Year</th>
                  <th className="py-3 px-4">PTIN Number</th>
                  <th className="py-3 px-4">Property Tax Paid</th>
                  <th className="py-3 px-4">Assessment Value</th>
                  <th className="py-3 px-4">Clearance Status</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/60 font-medium">
                {taxRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-cyan-400">{record.assessmentYear}</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{record.ptinNumber}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">{record.currentPropertyTax}</td>
                    <td className="py-3.5 px-4 text-purple-600 dark:text-purple-400 font-bold">{record.assessmentValue}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">{record.taxClearanceStatus}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{record.paymentDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => { setSelectedReceipt(record); setReceiptModalOpen(true); }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-all font-bold cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye size={13} /> View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: FLAG ISSUE MODAL */}
        <AnimatePresence>
          {flagIssueModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFlagIssueModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6 font-mono text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Flag size={20} className="text-rose-500" /> Flag Municipal Tax Issue
                  </h2>
                  <button onClick={() => setFlagIssueModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleFlagIssueSubmit} className="space-y-4 font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Flag tax clearance issue for PTIN-GHMC-{44100 + parseInt(numericId)}</p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Issue Description / Lien Notice *</label>
                    <textarea rows={3} value={flagReason} onChange={(e) => setFlagReason(e.target.value)} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setFlagIssueModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="danger" size="sm" icon={Send}>Flag Issue</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: VIEW RECEIPT MODAL */}
        <AnimatePresence>
          {receiptModalOpen && selectedReceipt && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReceiptModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6 font-mono text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Receipt size={20} className="text-blue-500" /> Municipal Tax Receipt Dossier
                  </h2>
                  <button onClick={() => setReceiptModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-3 font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-500">Receipt Ref: <strong className="text-blue-600 dark:text-cyan-400">{selectedReceipt.receiptNumber}</strong></p>
                    <p className="text-slate-500">Assessment Year: <strong className="text-slate-900 dark:text-white">{selectedReceipt.assessmentYear}</strong></p>
                    <p className="text-slate-500">PTIN Number: <strong className="text-slate-900 dark:text-white">{selectedReceipt.ptinNumber}</strong></p>
                    <p className="text-slate-500">Tax Amount Paid: <strong className="text-emerald-600 dark:text-emerald-400">{selectedReceipt.currentPropertyTax}</strong></p>
                    <p className="text-slate-500">Assessed Valuation: <strong className="text-purple-600 dark:text-purple-400">{selectedReceipt.assessmentValue}</strong></p>
                    <p className="text-slate-500">Authority: <strong className="text-slate-900 dark:text-white">{selectedReceipt.authority}</strong></p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setReceiptModalOpen(false)} variant="secondary" size="sm">Close</Button>
                    <Button onClick={() => { setReceiptModalOpen(false); exportToPdf(`Tax_Receipt_${selectedReceipt.receiptNumber}`, selectedReceipt); }} variant="primary" size="sm" icon={FileDown}>Download PDF</Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default TaxVerification;
