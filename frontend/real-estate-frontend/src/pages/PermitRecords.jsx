import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Map,
  FileCheck,
  Building,
  Search,
  ShieldCheck,
  CheckCircle2,
  FileDown,
  X,
  Building2,
  Calendar,
  Layers,
  Flame,
  FileText,
  Eye,
  Flag,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Send,
  User,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty } from "../services/liveStore";
import { getPermitRecords } from "../services/propertyService";

// Master Initial Permit Records Covering All 4 Categories & 4 Statuses
const MASTER_PERMIT_RECORDS = [
  // 1. Building Permit
  {
    id: "PRM-101",
    permitNumber: "GHMC/2023/PERM-8891",
    permitType: "Building Permit",
    category: "Building Permit",
    authority: "GHMC Municipal Building Inspectorate",
    status: "Verified",
    issueDate: "15 Jan 2023",
    expiryDate: "15 Jan 2028",
    farSanctioned: "3.5 FAR Commercial",
    engineer: "Er. K. V. Sharma (Structural Lead)",
    notes: "Municipal building plan sanction approved with 3.5 FAR.",
  },
  // 2. Construction Approval
  {
    id: "PRM-102",
    permitNumber: "HMDA/2022/CONST-4401",
    permitType: "Construction Approval",
    category: "Construction Approval",
    authority: "HMDA Master Plan Development Authority",
    status: "Verified",
    issueDate: "10 Aug 2022",
    expiryDate: "10 Aug 2027",
    farSanctioned: "4.0 FAR High-Rise",
    engineer: "Chief Town Planner HMDA",
    notes: "High-rise commercial construction layout approval granted.",
  },
  // 3. Occupancy Certificate
  {
    id: "PRM-103",
    permitNumber: "GHMC/2024/OC-9912",
    permitType: "Occupancy Certificate",
    category: "Occupancy Certificate",
    authority: "GHMC Town Planning Department",
    status: "Pending",
    issueDate: "01 May 2024",
    expiryDate: "Permanent Clearance",
    farSanctioned: "Full Structure Occupancy",
    engineer: "Municipal Building Inspector",
    notes: "Occupancy certificate final site inspection in progress.",
  },
  // 4. Renovation Permit
  {
    id: "PRM-104",
    permitNumber: "GHMC/2025/REN-1204",
    permitType: "Renovation Permit",
    category: "Renovation Permit",
    authority: "GHMC Urban Renovation Division",
    status: "Expired",
    issueDate: "12 Feb 2023",
    expiryDate: "12 Feb 2025",
    farSanctioned: "Facade Modification",
    engineer: "Er. Suresh Rao",
    notes: "Facade modification permit expired in Feb 2025. Renewal pending.",
  },
  // 5. Missing Permit Example
  {
    id: "PRM-105",
    permitNumber: "PCB/2026/EIA-MISSING",
    permitType: "Environmental PCB NOC",
    category: "Construction Approval",
    authority: "State Environment Impact Assessment Authority",
    status: "Missing",
    issueDate: "Not Issued",
    expiryDate: "N/A",
    farSanctioned: "N/A",
    engineer: "Pollution Control Board Inspector",
    notes: "Environmental clearance NOC missing from municipal submission packet.",
  },
];

function PermitRecords() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeProp = getLiveActiveProperty(searchParams.get("propertyId") || searchParams.get("id"));
  const propertyIdParam = activeProp ? (activeProp.propertyId || activeProp.numericId || "1").toString() : "1";
  const numericId = propertyIdParam.replace(/\D/g, "") || "1";

  const [permits, setPermits] = useState(MASTER_PERMIT_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    if (!numericId) return;
    getPermitRecords(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((p, idx) => ({
            id: p.permitId || `PRM-${idx + 101}`,
            permitNumber: p.permitNumber || `GHMC/2023/PERM-${8890 + idx}`,
            permitType: p.permitType || p.permitCategory || "Building Permit",
            category: p.permitCategory || p.permitType || "Building Permit",
            authority: p.issuingAuthority || "GHMC Municipal Inspectorate",
            status: p.verificationStatus || p.status || "Verified",
            issueDate: p.issueDate || "15 Jan 2023",
            expiryDate: p.expiryDate || "15 Jan 2028",
            farSanctioned: p.sanctionedFar ? `${p.sanctionedFar} FAR` : "3.5 FAR Commercial",
            engineer: p.inspectingOfficer || "Er. K. V. Sharma (Structural Lead)",
            notes: p.remarks || "Municipal building plan sanction approved.",
          }));
          setPermits(mapped);
        }
      })
      .catch((err) => console.warn("Permit records backend query error:", err));
  }, [numericId]);

  // Modals state
  const [viewPermitModal, setViewPermitModal] = useState(null);
  const [flagIssueModal, setFlagIssueModal] = useState(null);
  const [flagReason, setFlagReason] = useState("");

  // Filtered Permits
  const filteredPermits = useMemo(() => {
    return permits.filter((p) => {
      const matchCategory = categoryFilter === "ALL" || p.category === categoryFilter;
      const matchSearch =
        p.permitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.permitType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.status.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [permits, categoryFilter, searchQuery]);

  // STATUS BADGE RENDERER FOR ALL 4 REQUIRED STATUSES
  const renderPermitStatusBadge = (status) => {
    switch (status) {
      case "Verified":
        return <Badge variant="success">Verified</Badge>;
      case "Pending":
        return <Badge variant="warning">Pending</Badge>;
      case "Missing":
        return <Badge variant="danger">Missing</Badge>;
      case "Expired":
        return <Badge variant="purple">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // HANDLERS FOR THE 4 REQUIRED ACTION BUTTONS
  const handleVerifyPermit = (p) => {
    setPermits((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, status: "Verified" } : item))
    );
    showSuccessAlert("Permit Verified", `Permit ${p.permitNumber} verified with municipal registry.`);
  };

  const handleApprovePermit = (p) => {
    setPermits((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, status: "Verified" } : item))
    );
    showSuccessAlert("Permit Approved", `Approved legal clearance for ${p.permitType}.`);
  };

  const handleFlagIssueModalOpen = (p) => {
    setFlagIssueModal(p);
    setFlagReason("FAR height sanction mismatch against master zoning plan.");
  };

  const handleConfirmFlagSubmit = (e) => {
    e.preventDefault();
    if (!flagIssueModal) return;

    setPermits((prev) =>
      prev.map((item) => (item.id === flagIssueModal.id ? { ...item, status: "Missing" } : item))
    );

    showSuccessAlert(
      "Permit Issue Flagged",
      `Flagged permit issue on ${flagIssueModal.permitNumber}: "${flagReason}"`
    );
    setFlagIssueModal(null);
  };

  const handleViewPermitDoc = (p) => {
    setViewPermitModal(p);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Map size={14} className="text-emerald-500 dark:text-emerald-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Municipal Building Permit & Compliance Registry
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800">
            PR-{numericId} • {permits.length} PERMITS RECORDED
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold mb-2">
              <Building2 size={14} /> Municipal Approvals & Clearances
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              🚧 Permit Verification Workstation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Audit Municipal Building Permits, Construction Approvals, Occupancy Certificates, and Renovation Permits across Verified, Pending, Missing, and Expired statuses.
            </p>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & PERMIT CATEGORY FILTERS */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search permits by Permit #, Authority, Type, or Status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Permit Category Pills (The 4 Required Categories) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All Permits" },
              { id: "Building Permit", label: "Building Permit" },
              { id: "Construction Approval", label: "Construction Approval" },
              { id: "Occupancy Certificate", label: "Occupancy Cert" },
              { id: "Renovation Permit", label: "Renovation Permit" },
            ].map((tab) => {
              const active = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
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

        {/* PERMIT RECORDS CARDS GRID */}
        {filteredPermits.length === 0 ? (
          <EmptyState title="No permit records found" message="No municipal permit matches your search query or selected category filter." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPermits.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-4 font-mono text-xs"
              >
                <div className="space-y-3">
                  {/* Header: Permit Number, Category & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        {p.category} • {p.id}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                        {p.permitType}
                      </h3>
                      <p className="text-slate-500 font-medium text-xs mt-0.5">{p.permitNumber}</p>
                    </div>

                    <div className="shrink-0">
                      {renderPermitStatusBadge(p.status)}
                    </div>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Sanctioning Authority</span>
                      <strong className="text-slate-900 dark:text-white font-extrabold text-xs block truncate" title={p.authority}>
                        🏛️ {p.authority}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Sanctioned FAR</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs block">
                        📐 {p.farSanctioned}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Issue Date</span>
                      <strong className="text-slate-900 dark:text-white font-bold block">{p.issueDate}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Expiry Date</span>
                      <strong className="text-slate-900 dark:text-white font-bold block">{p.expiryDate}</strong>
                    </div>
                  </div>

                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    📝 {p.notes}
                  </p>
                </div>

                {/* THE 4 REQUIRED ACTION BUTTONS PER CARD */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#334155] grid grid-cols-4 gap-2 text-xs">
                  {/* 1. Verify */}
                  <button
                    onClick={() => handleVerifyPermit(p)}
                    className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 font-bold transition-all flex items-center justify-center gap-1 border border-blue-200 dark:border-blue-800 cursor-pointer"
                    title="1. Verify Permit with Municipal Registry"
                  >
                    <ShieldCheck size={13} />
                    <span>Verify</span>
                  </button>

                  {/* 2. Approve */}
                  <button
                    onClick={() => handleApprovePermit(p)}
                    className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold transition-all flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                    title="2. Approve Permit Clearance"
                  >
                    <CheckCircle2 size={13} />
                    <span>Approve</span>
                  </button>

                  {/* 3. Flag Issue */}
                  <button
                    onClick={() => handleFlagIssueModalOpen(p)}
                    className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold transition-all flex items-center justify-center gap-1 border border-rose-200 dark:border-rose-800 cursor-pointer"
                    title="3. Flag Permit Violation / Issue"
                  >
                    <Flag size={13} />
                    <span>Flag Issue</span>
                  </button>

                  {/* 4. View Document */}
                  <button
                    onClick={() => handleViewPermitDoc(p)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-800 dark:text-slate-200 font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="4. View Permit Document"
                  >
                    <Eye size={13} />
                    <span>View Doc</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* MODAL 1: VIEW PERMIT DOCUMENT PREVIEW */}
        <AnimatePresence>
          {viewPermitModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewPermitModal(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-lg w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{viewPermitModal.category} • {viewPermitModal.permitNumber}</span>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{viewPermitModal.permitType}</h2>
                  </div>
                  <button onClick={() => setViewPermitModal(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-500">🏛️ Authority: <strong className="text-slate-900 dark:text-white">{viewPermitModal.authority}</strong></p>
                    <p className="text-slate-500">📐 Sanctioned FAR: <strong className="text-emerald-600 dark:text-emerald-400">{viewPermitModal.farSanctioned}</strong></p>
                    <p className="text-slate-500">👤 Structural Lead: <strong className="text-slate-900 dark:text-white">{viewPermitModal.engineer}</strong></p>
                    <p className="text-slate-500">📅 Valid Window: <strong className="text-slate-900 dark:text-white">{viewPermitModal.issueDate} to {viewPermitModal.expiryDate}</strong></p>
                    <p className="text-slate-500">📝 Inspection Notes: <strong className="text-slate-900 dark:text-white">{viewPermitModal.notes}</strong></p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end">
                    <Button onClick={() => setViewPermitModal(null)} variant="secondary" size="sm">Close Preview</Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: FLAG PERMIT ISSUE MODAL */}
        <AnimatePresence>
          {flagIssueModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFlagIssueModal(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Flag size={20} className="text-rose-500" /> Flag Permit Compliance Issue
                  </h2>
                  <button onClick={() => setFlagIssueModal(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleConfirmFlagSubmit} className="space-y-4 font-mono text-xs">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Flag permit issue for: <strong className="text-rose-600">{flagIssueModal.permitNumber}</strong></p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Permit Violation Issue *</label>
                    <textarea rows={3} value={flagReason} onChange={(e) => setFlagReason(e.target.value)} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setFlagIssueModal(null)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="danger" size="sm">Flag Permit Violation</Button>
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

export default PermitRecords;