import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  Home,
  ChevronRight,
  ShieldCheck,
  Eye,
  Download,
  X,
  Upload,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  Building2,
  FolderOpen,
  Scale,
  Award,
  Sparkles,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import { showToast, showConfirmDialog, showSuccessAlert } from "../utils/swal";
import { exportToPdf } from "../utils/exportUtils";
import LegalDocumentCard from "../components/legal/LegalDocumentCard";

// Initial Mock Dataset for the 6 Required Document Types
const MASTER_LEGAL_DOCUMENTS = [
  {
    id: "DOC-LEG-01",
    name: "Sub-Registrar Registered Sale Deed #DEED/TS/2021/4412",
    type: "Sale Deed",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    uploadDate: "04 Aug 2026",
    verifiedBy: "Adv. Rajesh Sharma",
    verificationStatus: "Verified",
    notes: "Registered sale deed verified clear at Serilingampally Sub-Registrar Office.",
  },
  {
    id: "DOC-LEG-02",
    name: "30-Year Chain Link Title Deed Extracts (1996 - 2026)",
    type: "Title Deed",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    uploadDate: "03 Aug 2026",
    verifiedBy: "Adv. Ananya Rao",
    verificationStatus: "Under Review",
    notes: "Title deed link chain verified for 30 years.",
  },
  {
    id: "DOC-LEG-03",
    name: "Sub-Registrar Official Registration Certificate #REG-HYD-9041",
    type: "Registration Certificate",
    property: "Whitefield Horizon Tech Campus (PR-1003)",
    uploadDate: "02 Aug 2026",
    verifiedBy: "Adv. Suresh Patel",
    verificationStatus: "Verified",
    notes: "Sub-Registrar seal & stamp duty clearance certified.",
  },
  {
    id: "DOC-LEG-04",
    name: "Form 15 Sub-Registrar Nil Encumbrance Certificate (EC #EC-2026-11)",
    type: "Encumbrance Certificate",
    property: "Financial District Commercial Plot (PR-1004)",
    uploadDate: "01 Aug 2026",
    verifiedBy: "Adv. Rajesh Sharma",
    verificationStatus: "Verified",
    notes: "Nil Encumbrance Certificate issued for 30-year search window.",
  },
  {
    id: "DOC-LEG-05",
    name: "Corporate Joint Venture Property Agreement & Lease Deed",
    type: "Property Agreement",
    property: "BKC Prime Commercial Hub (PR-1005)",
    uploadDate: "28 Jul 2026",
    verifiedBy: "Adv. Ananya Rao",
    verificationStatus: "Pending Verification",
    notes: "JV property agreement under legal counsel review.",
  },
  {
    id: "DOC-LEG-06",
    name: "High Court Civil Suit Boundary Stay Order Extract #CS-402/2024",
    type: "Court Orders",
    property: "Kokapet SEZ Commercial Land (PR-1006)",
    uploadDate: "25 Jul 2026",
    verifiedBy: "Adv. Suresh Patel",
    verificationStatus: "Rejected",
    notes: "Active civil stay order flagged by Sub-Registrar search.",
  },
];

function LegalDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(MASTER_LEGAL_DOCUMENTS);

  // Filters & Search
  const [activeTypeTab, setActiveTypeTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals State
  const [previewDocModal, setPreviewDocModal] = useState(null);
  const [reuploadModalDoc, setReuploadModalDoc] = useState(null);
  const [reuploadReason, setReuploadReason] = useState("");

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchType = activeTypeTab === "ALL" || doc.type === activeTypeTab;
      const matchSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.verificationStatus.toLowerCase().includes(searchQuery.toLowerCase());

      return matchType && matchSearch;
    });
  }, [documents, activeTypeTab, searchQuery]);

  // HANDLERS FOR THE 5 REQUIRED ACTION BUTTONS
  const handleViewDoc = (doc) => {
    setPreviewDocModal(doc);
  };

  const handleDownloadDoc = (doc) => {
    showToast(`Downloading PDF document ${doc.id}...`, "info");
    exportToPdf(`Legal_Document_${doc.id}`, doc);
  };

  const handleVerifyDoc = (doc) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, verificationStatus: "Verified" } : d))
    );
    showSuccessAlert("Document Verified", `Document ${doc.id} approved and status set to Verified.`);
  };

  const handleRejectDoc = (doc) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, verificationStatus: "Rejected" } : d))
    );
    showSuccessAlert("Document Rejected", `Document ${doc.id} status set to Rejected.`);
  };

  const handleRequestReuploadModal = (doc) => {
    setReuploadModalDoc(doc);
    setReuploadReason("Legibility blur on Sub-Registrar stamp seal.");
  };

  const handleConfirmReuploadSubmit = (e) => {
    e.preventDefault();
    if (!reuploadModalDoc) return;

    setDocuments((prev) =>
      prev.map((d) => (d.id === reuploadModalDoc.id ? { ...d, verificationStatus: "Pending Verification" } : d))
    );

    showSuccessAlert(
      "Reupload Requested",
      `Requested document reupload for ${reuploadModalDoc.id}. Reason: "${reuploadReason}"`
    );
    setReuploadModalDoc(null);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Sub-Registrar Legal Document Vault
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            DOCUMENT VAULT • {documents.length} DOCUMENTS
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <FolderOpen size={14} /> Official Legal Vault
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📂 Legal Documents & Deed Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect Sale Deeds, Title Deeds, Registration Certificates, Encumbrance Certificates, Property Agreements, and Court Orders.
            </p>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & DOCUMENT TYPE FILTERS */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search legal documents by Name, Type, Property, or Verification Status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Document Type Filter Pills (The 6 Required Document Types) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All Documents" },
              { id: "Sale Deed", label: "Sale Deed" },
              { id: "Title Deed", label: "Title Deed" },
              { id: "Registration Certificate", label: "Registration Cert" },
              { id: "Encumbrance Certificate", label: "Encumbrance Cert" },
              { id: "Property Agreement", label: "Property Agreement" },
              { id: "Court Orders", label: "Court Orders" },
            ].map((tab) => {
              const active = activeTypeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTypeTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                    active
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* REUSABLE DOCUMENT CARDS GRID */}
        {filteredDocuments.length === 0 ? (
          <EmptyState title="No legal documents found" message="No legal document matches your search query or document type filter." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <LegalDocumentCard
                key={doc.id}
                doc={doc}
                onView={handleViewDoc}
                onDownload={handleDownloadDoc}
                onVerify={handleVerifyDoc}
                onReject={handleRejectDoc}
                onRequestReupload={handleRequestReuploadModal}
              />
            ))}
          </div>
        )}

        {/* MODAL 1: VIEW DOCUMENT PREVIEW */}
        <AnimatePresence>
          {previewDocModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewDocModal(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-lg w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">{previewDocModal.type} • {previewDocModal.id}</span>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{previewDocModal.name}</h2>
                  </div>
                  <button onClick={() => setPreviewDocModal(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-500">🏢 Property: <strong className="text-slate-900 dark:text-white">{previewDocModal.property}</strong></p>
                    <p className="text-slate-500">📅 Upload Date: <strong className="text-slate-900 dark:text-white">{previewDocModal.uploadDate}</strong></p>
                    <p className="text-slate-500">👤 Verified By: <strong className="text-blue-600 dark:text-cyan-400">{previewDocModal.verifiedBy}</strong></p>
                    <p className="text-slate-500">📝 Notes: <strong className="text-slate-900 dark:text-white">{previewDocModal.notes}</strong></p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setPreviewDocModal(null)} variant="secondary" size="sm">Close</Button>
                    <Button onClick={() => handleDownloadDoc(previewDocModal)} variant="primary" size="sm" icon={Download}>Download PDF</Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: REQUEST REUPLOAD MODAL */}
        <AnimatePresence>
          {reuploadModalDoc && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReuploadModalDoc(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <RotateCcw size={20} className="text-amber-500" /> Request Document Reupload
                  </h2>
                  <button onClick={() => setReuploadModalDoc(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleConfirmReuploadSubmit} className="space-y-4 font-mono text-xs">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Request reupload for: <strong className="text-amber-600">{reuploadModalDoc.name}</strong></p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Reason for Reupload Request *</label>
                    <textarea rows={3} value={reuploadReason} onChange={(e) => setReuploadReason(e.target.value)} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setReuploadModalDoc(null)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="warning" size="sm" icon={Send}>Send Reupload Request</Button>
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

export default LegalDocuments;
