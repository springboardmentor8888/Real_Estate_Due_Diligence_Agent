import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  FileText,
  FileDown,
  Printer,
  ShieldCheck,
  Building2,
  DollarSign,
  Waves,
  Leaf,
  CheckCircle2,
  Scale,
  Award,
  Zap,
  MapPin,
  Search,
  Layers,
  Eye,
  Send,
  MessageSquare,
  Compass,
  User,
  FolderOpen,
  Map,
  X,
  Sparkles,
} from "lucide-react";
import { exportToPdf } from "../utils/exportUtils";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty, getLiveProperties, setLiveActiveProperty } from "../services/liveStore";
import { getReportsByProperty } from "../services/propertyService";
import { showToast, showSuccessAlert } from "../utils/swal";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

function DueDiligenceReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const urlId = searchParams.get("id") || searchParams.get("propertyId");
  const rawId = urlId || location.state?.propertyId || location.state?.property?.propertyId || location.state?.property?.numericId || localStorage.getItem("active_property_id") || "1";
  const cleanId = rawId.toString().replace(/\D/g, "") || "1";

  const allProps = getLiveProperties() || [];
  const activeProp = getLiveActiveProperty(cleanId);

  // Active Tab State (The 7 Required Tabs)
  const [activeTab, setActiveTab] = useState("overview");

  // Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Comments State
  const [comments, setComments] = useState([
    { id: 1, author: "Adv. Rajesh Sharma (Lead Legal Auditor)", role: "Legal Counsel", date: "04 Aug 2026, 03:30 PM", text: "Sub-Registrar 30-year deed chain search complete. 100% Nil Encumbrance Certificate verified." },
    { id: 2, author: "Er. K. V. Sharma", role: "Municipal Inspector", date: "03 Aug 2026, 11:15 AM", text: "GHMC commercial building permit and 3.5 FAR approved. Fire NOC valid through 2031." },
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  const formatProperty = (dataObj) => {
    const raw = dataObj || activeProp || allProps[0] || {};
    const numId = (raw.propertyId || raw.numericId || raw.id || cleanId).toString().replace(/\D/g, "") || "1";
    const propTitle = raw.propertyName || raw.title || raw.name || "Gachibowli Luxury Villa";
    
    return {
      numericId: numId,
      propertyId: numId,
      id: raw.propertyCode || `PROP-HYD-${String(numId).padStart(3, "0")}`,
      title: propTitle,
      propertyName: propTitle,
      address: raw.address || "Plot 45, Sy. No. 112/A, Financial District, Hyderabad",
      city: raw.city || "Hyderabad",
      owner: raw.ownerName || raw.owner || "Adani Realty Institutional Fund",
      type: raw.landType || raw.type || "Commercial Office",
      totalArea: "45,000 sq ft",
      marketValue: "₹ 45.00 Cr",
      riskScore: raw.riskScore ?? 14,
      status: raw.status || "Verified Clear Title",
      imgSrc: raw.imageUrl || raw.image || raw.imgSrc || FALLBACK_IMAGE,
    };
  };

  const [p, setP] = useState(() => formatProperty(location.state?.property));

  useEffect(() => {
    const formatted = formatProperty(location.state?.property);
    setP(formatted);
    setLiveActiveProperty(formatted.numericId);

    getReportsByProperty(cleanId)
      .then((res) => {
        if (res && res.data) {
          const report = Array.isArray(res.data) ? res.data[0] : res.data;
          if (report && report.executiveSummary) {
            setP((prev) => ({
              ...prev,
              executiveSummary: report.executiveSummary,
              reportStatus: report.reportStatus,
              overallRiskScore: report.overallRiskScore,
            }));
          }
        }
      })
      .catch((err) => console.warn("Report history backend query error:", err));
  }, [cleanId, location.state]);

  // THE 4 REQUIRED ACTION BUTTON HANDLERS
  const handleGeneratePdf = () => {
    showToast("Generating 13-vector due diligence report PDF...", "info");
    exportToPdf(`Due_Diligence_Report_${p.id}`, p.numericId);
  };

  const handlePreviewReport = () => {
    setPreviewModalOpen(true);
  };

  const handleDownloadReport = () => {
    showToast(`Downloading compiled due diligence report PDF for ${p.id}...`, "info");
    exportToPdf(`Due_Diligence_Report_${p.id}`, p.numericId);
  };

  const handleSubmitReview = () => {
    showSuccessAlert(
      "Due Diligence Review Sealed",
      `Submitted formal due diligence signoff for ${p.title} (${p.id}).`
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "Adv. Rajesh Sharma",
        role: "Legal Reviewer",
        date: "Just Now",
        text: newCommentText,
      },
    ]);
    setNewCommentText("");
    showToast("Legal comment added to report dossier", "success");
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Official Due Diligence Audit Dossier
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            PR-{p.numericId} • AUDIT VERDICT SEALED
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={p.numericId} />

        {/* HERO BANNER & THE 4 REQUIRED ACTION BUTTONS */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                {p.id}
              </span>
              <Badge variant="success">Level 4 Verified Audit</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              📄 Institutional Due Diligence Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Comprehensive 13-vector due diligence dossier for <strong className="text-slate-900 dark:text-white">{p.title}</strong>.
            </p>
          </div>

          {/* THE 4 REQUIRED ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* 1. Generate PDF */}
            <Button onClick={handleGeneratePdf} variant="primary" size="sm" icon={FileText}>
              Generate PDF
            </Button>

            {/* 2. Preview Report */}
            <Button onClick={handlePreviewReport} variant="outline" size="sm" icon={Eye}>
              Preview Report
            </Button>

            {/* 3. Download Report */}
            <Button onClick={handleDownloadReport} variant="secondary" size="sm" icon={FileDown}>
              Download Report
            </Button>

            {/* 4. Submit Review */}
            <Button onClick={handleSubmitReview} variant="success" size="sm" icon={Send}>
              Submit Review
            </Button>
          </div>
        </div>

        {/* NAVIGATION TAB STRIP (THE 7 REQUIRED TABS) */}
        <div className="white-card rounded-3xl p-3 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex items-center gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "ownership", label: "Ownership", icon: User },
            { id: "documents", label: "Legal Documents", icon: FolderOpen },
            { id: "permits", label: "Permits", icon: Map },
            { id: "zoning", label: "Zoning", icon: Compass },
            { id: "risk", label: "Risk Assessment", icon: ShieldCheck },
            { id: "comments", label: "Comments", icon: MessageSquare },
          ].map((tab) => {
            const IconC = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer font-bold whitespace-nowrap ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B]"
                }`}
              >
                <IconC size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS CONTAINER */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase">EXECUTIVE AUDIT SUMMARY</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{p.title}</h2>
                </div>
                <Badge variant="success">Verified Clear Title</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Recorded Owner</span>
                  <strong className="text-slate-900 dark:text-white font-extrabold text-xs block mt-1">{p.owner}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Market Valuation</span>
                  <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-xs block mt-1">{p.marketValue}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Total Plot Area</span>
                  <strong className="text-slate-900 dark:text-white font-bold text-xs block mt-1">{p.totalArea}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Risk Score</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs block mt-1">{p.riskScore}/100 Low Risk</strong>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium">
                13-vector due diligence audit completed for {p.title}. Title deed trace from 1996 to 2026 is clear of encumbrance liens, municipal tax arrears, and High Court civil litigation stay orders.
              </p>
            </div>
          )}

          {/* TAB 2: OWNERSHIP */}
          {activeTab === "ownership" && (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                👤 Sub-Registrar 30-Year Ownership Chain Trace
              </h2>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                <p className="text-slate-700 dark:text-slate-300 font-bold">Current Owner: {p.owner}</p>
                <p className="text-slate-500">Deed Reg No: DEED/TS/2021/8891 • Nil Encumbrance Certified</p>
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                📂 Verified Legal Document Vault List
              </h2>
              <div className="space-y-2">
                {["Sale Deed #DEED/2021/4412", "Form 15 Encumbrance Certificate", "Municipal Tax Clearance Receipt", "Fire NOC"].map((docName, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{docName}</span>
                    <Badge variant="success">Verified</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERMITS */}
          {activeTab === "permits" && (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                🚧 Municipal Building Permits & Approvals
              </h2>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                <p className="text-slate-700 dark:text-slate-300 font-bold">Building Sanction Permit: GHMC/2023/PERM-8891</p>
                <p className="text-slate-500">FAR: 3.5 Commercial • Fire Safety NOC Valid through 2031</p>
              </div>
            </div>
          )}

          {/* TAB 5: ZONING */}
          {activeTab === "zoning" && (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                🗺️ Municipal Zoning Master Plan 2031
              </h2>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                <p className="text-slate-700 dark:text-slate-300 font-bold">Zone Type: C-4 Commercial IT/ITES High-Density Zone</p>
                <p className="text-slate-500">Allowed Usage: Commercial IT Office Buildings • Nil Setback Violations</p>
              </div>
            </div>
          )}

          {/* TAB 6: RISK ASSESSMENT */}
          {activeTab === "risk" && (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                🛡️ 13-Vector Legal Risk Assessment Breakdown
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                  <span className="text-slate-400 text-[10px]">Overall Risk Score</span>
                  <p className="text-emerald-600 font-black text-xl">86/100 (Low Risk)</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                  <span className="text-slate-400 text-[10px]">Legal Verdict</span>
                  <p className="text-blue-600 font-black text-xl">Clear Title Approved</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: COMMENTS */}
          {activeTab === "comments" && (
            <div className="space-y-6">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                💬 Legal Auditor Comments & Review Signoff Log
              </h2>

              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white">{c.author} ({c.role})</span>
                      <span className="text-slate-400 text-[10px]">{c.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#334155]">
                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Record legal audit notes or compliance observations..."
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold"
                />
                <Button type="submit" variant="primary" size="sm" icon={Send}>
                  Add Legal Comment
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* MODAL 1: PREVIEW REPORT FULL MODAL */}
        <AnimatePresence>
          {previewModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-2xl w-full space-y-6 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">PDF PREVIEW • {p.id}</span>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">Due Diligence Audit Certificate</h2>
                  </div>
                  <button onClick={() => setPreviewModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-4">
                  <div className="text-center space-y-1 border-b border-slate-200 dark:border-[#334155] pb-3">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">OFFICIAL SUB-REGISTRAR AUDIT CERTIFICATE</h3>
                    <p className="text-slate-500 text-[11px]">Parcel: {p.title} ({p.id})</p>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">Recorded Owner: {p.owner}</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">Market Valuation: {p.marketValue}</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">Audit Verdict: 100% Clear Title Approved</p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                  <Button onClick={() => setPreviewModalOpen(false)} variant="secondary" size="sm">Close Preview</Button>
                  <Button onClick={() => { setPreviewModalOpen(false); handleDownloadReport(); }} variant="primary" size="sm" icon={FileDown}>Download PDF</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default DueDiligenceReport;
