import React, { useState, useEffect } from "react";
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
  Printer,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Search,
  Receipt,
  FileText,
  Calendar,
  Sparkles,
  X,
  CreditCard,
  Flag,
  RotateCcw,
  Check,
  Send,
  AlertTriangle,
  Award,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import { exportToPdf } from "../utils/exportUtils";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty } from "../services/liveStore";

function TaxHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeProp = getLiveActiveProperty(searchParams.get("propertyId") || searchParams.get("id"));
  const propertyIdParam = activeProp ? (activeProp.numericId || activeProp.propertyId || "1001").toString() : "1001";
  const numericId = propertyIdParam.replace(/\D/g, "") || "1001";

  const [taxStatus, setTaxStatus] = useState("Zero Dues Verified");
  const [isVerifying, setIsVerifying] = useState(false);

  // Modals state
  const [payDuesModalOpen, setPayDuesModalOpen] = useState(false);
  const [flagLienModalOpen, setFlagLienModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [lienReason, setLienReason] = useState("Unpaid municipal commercial lighting surcharge lien ₹ 14,500.");

  // Realistic 5-year tax history dataset
  const baseTax = 485000 + parseInt(numericId) * 1200;
  const [taxRecords, setTaxRecords] = useState([
    {
      assessmentYear: "2025-2026",
      taxAmount: baseTax.toLocaleString(),
      taxAmountNum: baseTax,
      baseAssessmentVal: `₹${((baseTax * 42) / 100000).toFixed(2)} Lakhs`,
      taxStatus: "Paid in Full",
      paymentDate: "18 May 2025",
      receiptNumber: `TAX-HYD-2025-${88900 + parseInt(numericId)}`,
      ptinNumber: `PTIN-GHMC-${44100 + parseInt(numericId)}`,
      authority: "GHMC Serilingampally Circle 14",
    },
    {
      assessmentYear: "2024-2025",
      taxAmount: (baseTax - 22000).toLocaleString(),
      taxAmountNum: baseTax - 22000,
      baseAssessmentVal: `₹${(((baseTax - 22000) * 42) / 100000).toFixed(2)} Lakhs`,
      taxStatus: "Paid in Full",
      paymentDate: "12 Apr 2024",
      receiptNumber: `TAX-HYD-2024-${77800 + parseInt(numericId)}`,
      ptinNumber: `PTIN-GHMC-${44100 + parseInt(numericId)}`,
      authority: "GHMC Serilingampally Circle 14",
    },
    {
      assessmentYear: "2023-2024",
      taxAmount: (baseTax - 45000).toLocaleString(),
      taxAmountNum: baseTax - 45000,
      baseAssessmentVal: `₹${(((baseTax - 45000) * 42) / 100000).toFixed(2)} Lakhs`,
      taxStatus: "Paid in Full",
      paymentDate: "30 Apr 2023",
      receiptNumber: `TAX-HYD-2023-${66700 + parseInt(numericId)}`,
      ptinNumber: `PTIN-GHMC-${44100 + parseInt(numericId)}`,
      authority: "GHMC Serilingampally Circle 14",
    },
  ]);

  // ACTION BUTTON HANDLERS
  const handleVerifyTaxDues = () => {
    setIsVerifying(true);
    showToast("Auditing GHMC Municipal Tax & Lien Registry...", "info");

    setTimeout(() => {
      setIsVerifying(false);
      setTaxStatus("Zero Dues Verified");
      showSuccessAlert(
        "Municipal Tax Audit Complete",
        `Verified 0 outstanding dues & zero liens for PR-${numericId} under GHMC Circle 14.`
      );
    }, 800);
  };

  const handleOpenReceiptModal = (record) => {
    setSelectedReceipt(record);
    setReceiptModalOpen(true);
  };

  const handleConfirmLienSubmit = (e) => {
    e.preventDefault();
    setTaxStatus("Municipal Lien Flagged");
    showSuccessAlert("Tax Lien Flagged", `Flagged municipal tax lien on PR-${numericId}: "${lienReason}"`);
    setFlagLienModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <ClipboardList size={14} className="text-emerald-500 dark:text-emerald-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Municipal Property Tax & Lien Verification Workstation
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800">
            PR-{numericId} • GHMC CIRCLE 14
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER & 4 ACTION BUTTONS */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                PR-{numericId}
              </span>
              <Badge variant={taxStatus.includes("Verified") ? "success" : "danger"}>
                {taxStatus}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              🧾 Municipal Property Tax & Lien Registry
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Inspect historical property tax receipts, PTIN identifiers, zero-dues clearance certificates, and municipal encumbrance liens.
            </p>
          </div>

          {/* THE 4 ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button onClick={handleVerifyTaxDues} loading={isVerifying} variant="primary" size="sm" icon={ShieldCheck}>
              Verify Zero Dues
            </Button>

            <Button onClick={() => exportToPdf(`Tax_History_PR-${numericId}`, taxRecords)} variant="secondary" size="sm" icon={FileDown}>
              Download Certificate
            </Button>

            <Button onClick={() => setPayDuesModalOpen(true)} variant="success" size="sm" icon={CreditCard}>
              Pay Dues
            </Button>

            <Button onClick={() => setFlagLienModalOpen(true)} variant="danger" size="sm" icon={Flag}>
              Flag Lien
            </Button>
          </div>
        </div>

        {/* TAX HIGHLIGHT KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">PTIN NUMBER</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">PTIN-GHMC-{44100 + parseInt(numericId)}</h3>
            <p className="text-slate-500 text-[11px]">Serilingampally Municipal Zone</p>
          </div>

          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase">FY 2025-26 ANNUAL TAX</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">₹ {taxRecords[0]?.taxAmount}</h3>
            <p className="text-emerald-500 font-bold text-[11px]">Paid in Full on 18 May 2025</p>
          </div>

          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">OUTSTANDING LIENS</span>
            <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">Zero Dues</h3>
            <p className="text-slate-500 text-[11px]">Form 15 Clearance Certified</p>
          </div>
        </div>

        {/* 5-YEAR TAX RECORDS ENTERPRISE TABLE */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              📜 Municipal Property Tax Receipts & Audit Log
            </h2>
            <Badge variant="success">3 Fiscal Years Verified</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#334155] text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Assessment Year</th>
                  <th className="py-3 px-4">Tax Paid</th>
                  <th className="py-3 px-4">Receipt Ref #</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/60 font-medium">
                {taxRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{rec.assessmentYear}</td>
                    <td className="py-3.5 px-4 text-blue-600 dark:text-cyan-400 font-extrabold">₹ {rec.taxAmount}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-300">{rec.receiptNumber}</td>
                    <td className="py-3.5 px-4 text-slate-500">{rec.paymentDate}</td>
                    <td className="py-3.5 px-4"><Badge variant="success">{rec.taxStatus}</Badge></td>
                    <td className="py-3.5 px-4 text-right">
                      <Button onClick={() => handleOpenReceiptModal(rec)} variant="outline" size="sm" icon={Receipt}>
                        View Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: VIEW RECEIPT MODAL */}
        <AnimatePresence>
          {receiptModalOpen && selectedReceipt && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReceiptModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Receipt size={20} className="text-emerald-500" /> Municipal Tax Receipt
                  </h2>
                  <button onClick={() => setReceiptModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-500">Receipt #: <strong className="text-slate-900 dark:text-white">{selectedReceipt.receiptNumber}</strong></p>
                    <p className="text-slate-500">Assessment Year: <strong className="text-slate-900 dark:text-white">{selectedReceipt.assessmentYear}</strong></p>
                    <p className="text-slate-500">Amount Paid: <strong className="text-emerald-600 dark:text-emerald-400">₹ {selectedReceipt.taxAmount}</strong></p>
                    <p className="text-slate-500">Authority: <strong className="text-slate-900 dark:text-white">{selectedReceipt.authority}</strong></p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setReceiptModalOpen(false)} variant="secondary" size="sm">Close</Button>
                    <Button onClick={() => { setReceiptModalOpen(false); exportToPdf(selectedReceipt.receiptNumber, selectedReceipt); }} variant="primary" size="sm" icon={FileDown}>Export PDF</Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: FLAG LIEN MODAL */}
        <AnimatePresence>
          {flagLienModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFlagLienModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Flag size={20} className="text-rose-500" /> Flag Municipal Tax Lien
                  </h2>
                  <button onClick={() => setFlagLienModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleConfirmLienSubmit} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Record tax lien for <strong className="text-rose-600">PR-{numericId}</strong></p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Lien Description *</label>
                    <textarea rows={3} value={lienReason} onChange={(e) => setLienReason(e.target.value)} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setFlagLienModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="danger" size="sm">Flag Lien</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default TaxHistory;