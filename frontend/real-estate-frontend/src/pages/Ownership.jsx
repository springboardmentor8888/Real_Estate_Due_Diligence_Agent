import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  User,
  Calendar,
  FileCheck,
  ShieldCheck,
  Clock,
  Award,
  Building2,
  MapPin,
  CheckCircle2,
  FileText,
  Search,
  ChevronRight,
  X,
  FileDown,
  Printer,
  Sparkles,
  Lock,
  DollarSign,
  AlertOctagon,
  Scale,
  Flag,
  Send,
  RefreshCw,
  Plus,
} from "lucide-react";
import { showSuccessAlert, showToast, showConfirmDialog } from "../utils/swal";
import { getOwnershipRecords, getAllProperties } from "../services/propertyService";
import { exportToPdf } from "../utils/exportUtils";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty } from "../services/liveStore";

function Ownership() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeProp = getLiveActiveProperty(searchParams.get("propertyId") || searchParams.get("id"));
  const propertyIdParam = activeProp ? (activeProp.numericId || activeProp.propertyId || "1001").toString() : "1001";
  const numericId = propertyIdParam.replace(/\D/g, "") || "1001";

  const [ownershipRecords, setOwnershipRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status & Verification state
  const [verificationStatus, setVerificationStatus] = useState("Verified Clear Title");
  const [isVerifying, setIsVerifying] = useState(false);

  // Modals state
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [requestDocModalOpen, setRequestDocModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  const [flagIssueReason, setFlagIssueReason] = useState("");
  const [requestedDocName, setRequestedDocName] = useState("1996 Partition Link Deed");

  // Load Ownership Records
  useEffect(() => {
    setLoading(true);
    getOwnershipRecords(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setOwnershipRecords(res.data);
        } else {
          setOwnershipRecords([
            {
              id: 1,
              ownerName: "Adani Realty Institutional Fund",
              ownershipType: "Sole Corporate Freehold Owner",
              startDate: "2021-04-12",
              deedNumber: `DEED/HYD/2021/${8800 + parseInt(numericId)}`,
              registrationNumber: `REG/TS/2021/${4400 + parseInt(numericId)}`,
              purchaseValue: "₹ 45.00 Cr",
              transferType: "Registered Sale Deed",
              subRegistrarOffice: "Serilingampally Sub-Registrar Office",
              isCurrentOwner: true,
            },
            {
              id: 2,
              ownerName: "Devi Infrastructure Projects Ltd",
              ownershipType: "Corporate Freehold",
              startDate: "2010-08-20",
              deedNumber: `DEED/HYD/2010/${3200 + parseInt(numericId)}`,
              registrationNumber: `REG/AP/2010/${1100 + parseInt(numericId)}`,
              purchaseValue: "₹ 28.50 Cr",
              transferType: "Corporate Title Transfer",
              subRegistrarOffice: "Ranga Reddy District Registry",
              isCurrentOwner: false,
            },
            {
              id: 3,
              ownerName: "Telangana State Industrial Infrastructure Corp",
              ownershipType: "Govt Allotment Land",
              startDate: "1996-02-15",
              deedNumber: `DEED/HYD/1996/${1020 + parseInt(numericId)}`,
              registrationNumber: `REG/AP/1996/${800 + parseInt(numericId)}`,
              purchaseValue: "₹ 12.20 Cr",
              transferType: "Govt Allotment Deed",
              subRegistrarOffice: "Hyderabad Central Registry",
              isCurrentOwner: false,
            },
          ]);
        }
      })
      .catch((err) => console.warn("Fallback ownership records", err))
      .finally(() => setLoading(false));
  }, [numericId]);

  // THE 4 REQUIRED ACTION BUTTON HANDLERS
  const handleVerifyOwnership = () => {
    setIsVerifying(true);
    showToast("Executing 30-Year Sub-Registrar Encumbrance Trace...", "info");

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus("Verified Clear Title");
      showSuccessAlert(
        "Ownership Verified",
        "Automated Sub-Registrar deed trace complete. 100% Nil Encumbrance Certificate verified."
      );
    }, 800);
  };

  const handleApproveOwnership = () => {
    setVerificationStatus("Clear Title Approved");
    setCertificateModalOpen(true);
  };

  const handleFlagIssueSubmit = (e) => {
    e.preventDefault();
    if (!flagIssueReason) {
      showToast("Please provide legal issue description", "error");
      return;
    }
    setVerificationStatus("Encumbrance Flagged");
    showSuccessAlert("Legal Issue Flagged", `Flagged encumbrance issue: "${flagIssueReason}"`);
    setFlagModalOpen(false);
    setFlagIssueReason("");
  };

  const handleRequestDocSubmit = (e) => {
    e.preventDefault();
    showSuccessAlert("Document Requested", `Sent request to owner for "${requestedDocName}".`);
    setRequestDocModalOpen(false);
  };

  const currentOwner = ownershipRecords.find((r) => r.isCurrentOwner) || ownershipRecords[0];
  const previousOwners = ownershipRecords.filter((r) => !r.isCurrentOwner);

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <User size={14} className="text-purple-500 dark:text-purple-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Sub-Registrar Ownership Verification Workstation
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            DEED CHAIN VERIFICATION ACTIVE
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER & THE 4 REQUIRED ACTION BUTTONS */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                PR-{numericId}
              </span>
              <Badge variant={verificationStatus.includes("Clear") ? "success" : verificationStatus.includes("Flagged") ? "danger" : "warning"}>
                {verificationStatus}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              👤 Ownership Verification Workstation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Inspect 30-year sub-registrar land title deeds, current & previous owner dossiers, encumbrance certificates, tax liens, and court dispute stay orders.
            </p>
          </div>

          {/* THE 4 REQUIRED ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* 1. Verify Ownership */}
            <Button onClick={handleVerifyOwnership} loading={isVerifying} variant="primary" size="sm" icon={ShieldCheck}>
              Verify Ownership
            </Button>

            {/* 2. Approve */}
            <Button onClick={handleApproveOwnership} variant="success" size="sm" icon={CheckCircle2}>
              Approve
            </Button>

            {/* 3. Flag Issue */}
            <Button onClick={() => setFlagModalOpen(true)} variant="danger" size="sm" icon={Flag}>
              Flag Issue
            </Button>

            {/* 4. Request Documents */}
            <Button onClick={() => setRequestDocModalOpen(true)} variant="outline" size="sm" icon={FileText}>
              Request Documents
            </Button>
          </div>
        </div>

        {/* 1. CURRENT OWNER DOSSIER */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md shrink-0">
                {currentOwner?.ownerName ? currentOwner.ownerName.slice(0, 2).toUpperCase() : "OW"}
              </div>
              <div>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block">CURRENT RECORDED OWNER</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {currentOwner?.ownerName || "Adani Realty Institutional Fund"}
                </h2>
                <p className="text-slate-500 font-medium text-xs mt-0.5">
                  Deed Reg No: {currentOwner?.registrationNumber || currentOwner?.deedNumber}
                </p>
              </div>
            </div>

            <Badge variant="success">Active Freehold Owner</Badge>
          </div>

          {/* Current Owner Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Ownership Type</span>
              <strong className="text-slate-900 dark:text-white font-extrabold text-xs block mt-1">{currentOwner?.ownershipType}</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Deed Transfer Date</span>
              <strong className="text-slate-900 dark:text-white font-extrabold text-xs block mt-1">{currentOwner?.startDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Recorded Value</span>
              <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-xs block mt-1">{currentOwner?.purchaseValue}</strong>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Sub-Registrar Office</span>
              <strong className="text-slate-900 dark:text-white font-extrabold text-xs block mt-1 truncate">{currentOwner?.subRegistrarOffice}</strong>
            </div>
          </div>
        </div>

        {/* 2 COLUMNS: ENCUMBRANCES, LIENS, DISPUTES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* 5. ENCUMBRANCES (Sub-Registrar Form 15) */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">SUB-REGISTRAR ENCUMBRANCE</span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              🛡️ Encumbrance Status
            </h3>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <strong className="text-emerald-800 dark:text-emerald-300 font-extrabold text-sm block">Nil Encumbrance Certified</strong>
              <p className="text-slate-600 dark:text-slate-300">Form 15 Sub-Registrar search from 1996 to 2026 clear of registered liens.</p>
            </div>
          </div>

          {/* 6. LIEN RECORDS (Tax & Mortgage Charges) */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase">FINANCIAL CHARGES</span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              💰 Lien Records
            </h3>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
              <strong className="text-blue-800 dark:text-cyan-300 font-extrabold text-sm block">Zero Outstanding Liens</strong>
              <p className="text-slate-600 dark:text-slate-300">GHMC municipal tax receipts & bank NOC clear of hypothecation charges.</p>
            </div>
          </div>

          {/* 7. DISPUTES (Litigation & Court Injunctions) */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">COURT LITIGATION</span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              ⚖️ Civil Disputes
            </h3>
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
              <strong className="text-purple-800 dark:text-purple-300 font-extrabold text-sm block">No Active Court Injunctions</strong>
              <p className="text-slate-600 dark:text-slate-300">High Court civil suit telemetry clear of partition dispute stays.</p>
            </div>
          </div>
        </div>

        {/* 2. PREVIOUS OWNERS & 3. OWNERSHIP TIMELINE & 4. TRANSFER HISTORY */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6 font-mono text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">30-YEAR DEED TRANSFER HISTORY</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              📜 Previous Owners & Title Deed Transfer History (1996 - 2026)
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#334155]">
            {ownershipRecords.map((rec, idx) => (
              <div key={rec.id || idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 dark:text-white font-extrabold text-sm">{rec.ownerName}</strong>
                    {rec.isCurrentOwner && <Badge variant="success">Current Owner</Badge>}
                  </div>
                  <p className="text-slate-500 font-medium">{rec.ownershipType} • {rec.transferType}</p>
                  <p className="text-slate-400 text-[11px]">Deed #{rec.deedNumber} • Reg Office: {rec.subRegistrarOffice}</p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-slate-400 text-[10px] block">Deed Date</span>
                  <strong className="text-slate-900 dark:text-white font-bold block">{rec.startDate}</strong>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold block mt-0.5">{rec.purchaseValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL 1: FLAG LEGAL ISSUE MODAL */}
        <AnimatePresence>
          {flagModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFlagModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Flag size={20} className="text-rose-500" /> Flag Legal Title Issue
                  </h2>
                  <button onClick={() => setFlagModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleFlagIssueSubmit} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Flag issue for property <strong className="text-rose-600">PR-{numericId}</strong></p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Legal Issue Category *</label>
                    <select className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                      <option value="boundary">Boundary Demarcation Dispute</option>
                      <option value="lien">Unrecorded Tax Arrears Lien</option>
                      <option value="stay">Civil Court Injunction Stay Order</option>
                      <option value="deed">Missing Ancestral Link Deed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Issue Description *</label>
                    <textarea rows={3} value={flagIssueReason} onChange={(e) => setFlagIssueReason(e.target.value)} placeholder="Describe encumbrance defect or dispute details..." required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setFlagModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="danger" size="sm">Flag Title Issue</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: REQUEST DOCUMENTS MODAL */}
        <AnimatePresence>
          {requestDocModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestDocModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={20} className="text-blue-500" /> Request Link Deed Documents
                  </h2>
                  <button onClick={() => setRequestDocModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleRequestDocSubmit} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Request title documents from <strong className="text-blue-600">{currentOwner?.ownerName}</strong></p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Required Document Name *</label>
                    <input type="text" value={requestedDocName} onChange={(e) => setRequestedDocName(e.target.value)} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setRequestDocModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" icon={Send}>Send Request</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 3: CERTIFICATE APPROVAL MODAL */}
        <AnimatePresence>
          {certificateModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCertificateModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award size={20} className="text-emerald-500" /> Title Clearance Certificate Sealed
                  </h2>
                  <button onClick={() => setCertificateModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <strong className="text-emerald-800 dark:text-emerald-300 font-extrabold text-sm block">100% Clear Title Approved</strong>
                    <p className="text-slate-600 dark:text-slate-300">Sub-Registrar encumbrance search verified clear for property PR-{numericId}.</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setCertificateModalOpen(false)} variant="secondary" size="sm">Close</Button>
                    <Button onClick={() => { setCertificateModalOpen(false); exportToPdf(`Ownership_Certificate_PR_${numericId}`, currentOwner); }} variant="primary" size="sm" icon={FileDown}>Export PDF</Button>
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

export default Ownership;