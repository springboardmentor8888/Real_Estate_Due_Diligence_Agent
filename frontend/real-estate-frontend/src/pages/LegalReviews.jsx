import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  ShieldCheck,
  FileSearch,
  CheckSquare,
  AlertOctagon,
  Home,
  ChevronRight,
  UserCheck,
  X,
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  Eye,
  RefreshCw,
  Send,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import { showSuccessAlert, showToast, showConfirmDialog } from "../utils/swal";

// Master Initial Mock Assigned Reviews Dataset
const INITIAL_ASSIGNED_REVIEWS = [
  {
    id: "REV-LEG-1001",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    propertyId: "1001",
    buyer: "Adani Realty Institutional Fund",
    priority: "High",
    status: "Pending",
    assignedDate: "05 Aug 2026",
    dueDate: "09 Aug 2026",
    deedDetails: "Sub-Registrar Sale Deed #DEED/TS/2021/4412 verification clear.",
    riskScore: 14,
  },
  {
    id: "REV-LEG-1002",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    propertyId: "1002",
    buyer: "DLF Cybercity Portfolio",
    priority: "Critical",
    status: "Under Review",
    assignedDate: "04 Aug 2026",
    dueDate: "07 Aug 2026",
    deedDetails: "Boundary litigation civil suit #402/2024 requires stay order clearance.",
    riskScore: 68,
  },
  {
    id: "REV-LEG-1003",
    property: "Whitefield Horizon Tech Campus (PR-1003)",
    propertyId: "1003",
    buyer: "GMR Logistics Infrastructure",
    priority: "Medium",
    status: "Approved",
    assignedDate: "03 Aug 2026",
    dueDate: "08 Aug 2026",
    deedDetails: "100% clear title search certificate issued & sealed by legal counsel.",
    riskScore: 18,
  },
  {
    id: "REV-LEG-1004",
    property: "Financial District Commercial Plot (PR-1004)",
    propertyId: "1004",
    buyer: "Prestige Capital Partners",
    priority: "Low",
    status: "Approved",
    assignedDate: "02 Aug 2026",
    dueDate: "06 Aug 2026",
    deedDetails: "GHMC municipal property tax receipt #TAX-2026-9041 verified 0 dues.",
    riskScore: 22,
  },
  {
    id: "REV-LEG-1005",
    property: "BKC Prime Commercial Hub (PR-1005)",
    propertyId: "1005",
    buyer: "Sobha Real Estate Fund",
    priority: "High",
    status: "Rejected",
    assignedDate: "01 Aug 2026",
    dueDate: "05 Aug 2026",
    deedDetails: "Zoning FAR non-compliance flagged by Municipal Urban Planning Board.",
    riskScore: 78,
  },
  {
    id: "REV-LEG-1006",
    property: "Kokapet SEZ Commercial Land (PR-1006)",
    propertyId: "1006",
    buyer: "Mahindra Lifespaces Ltd",
    priority: "Medium",
    status: "Under Review",
    assignedDate: "30 Jul 2026",
    dueDate: "04 Aug 2026",
    deedDetails: "SEZ industrial land conversion NOC under review by Telangana Govt.",
    riskScore: 32,
  },
  {
    id: "REV-LEG-1007",
    property: "Cyberabad IT Zone Plot 12 (PR-1007)",
    propertyId: "1007",
    buyer: "Godrej Properties Fund",
    priority: "Critical",
    status: "Pending",
    assignedDate: "28 Jul 2026",
    dueDate: "03 Aug 2026",
    deedDetails: "30-year link deed chain verification in progress at Sub-Registrar Office.",
    riskScore: 48,
  },
];

function LegalReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState(INITIAL_ASSIGNED_REVIEWS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [modalMode, setModalMode] = useState("VIEW"); // 'VIEW', 'CONTINUE', 'SUBMIT'
  const [reviewNotes, setReviewNotes] = useState("");
  const [selectedVerdict, setSelectedVerdict] = useState("Approved");

  // Filtered & Sorted Reviews
  const processedReviews = useMemo(() => {
    let list = reviews.filter((r) => {
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      const matchSearch =
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.priority.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchSearch;
    });

    if (sortBy === "NEWEST") {
      list.sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate));
    } else if (sortBy === "PRIORITY") {
      const priorityMap = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      list.sort((a, b) => (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0));
    } else if (sortBy === "PROPERTY") {
      list.sort((a, b) => a.property.localeCompare(b.property));
    }

    return list;
  }, [reviews, searchQuery, statusFilter, sortBy]);

  // Paginated List
  const totalPages = Math.ceil(processedReviews.length / itemsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedReviews.slice(start, start + itemsPerPage);
  }, [processedReviews, currentPage]);

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge variant="warning">Pending</Badge>;
      case "Under Review":
        return <Badge variant="info">Under Review</Badge>;
      case "Approved":
        return <Badge variant="success">Approved</Badge>;
      case "Rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Priority Badge Helper
  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-mono font-bold text-[10px] border border-rose-200 dark:border-rose-800">CRITICAL</span>;
      case "High":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 font-mono font-bold text-[10px] border border-amber-200 dark:border-amber-800">HIGH</span>;
      case "Medium":
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-300 font-mono font-bold text-[10px] border border-blue-200 dark:border-blue-800">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono font-bold text-[10px] border border-slate-200">LOW</span>;
    }
  };

  // Handlers for the 3 Action Buttons
  const handleOpenReview = (item) => {
    setReviewModalItem(item);
    setModalMode("VIEW");
  };

  const handleContinueReview = (item) => {
    setReviewModalItem(item);
    setModalMode("CONTINUE");
    setReviewNotes(item.deedDetails || "");
  };

  const handleSubmitReview = (item) => {
    setReviewModalItem(item);
    setModalMode("SUBMIT");
    setSelectedVerdict("Approved");
    setReviewNotes(item.deedDetails || "");
  };

  const handleConfirmSubmitVerdict = (e) => {
    e.preventDefault();
    if (!reviewModalItem) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewModalItem.id
          ? {
              ...r,
              status: selectedVerdict,
              deedDetails: reviewNotes || r.deedDetails,
            }
          : r
      )
    );

    showSuccessAlert(
      "Legal Verdict Submitted",
      `Submitted legal review verdict "${selectedVerdict}" for ${reviewModalItem.id}.`
    );
    setReviewModalItem(null);
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Assigned Legal Reviews & Title Search
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            WORKSTATION • {reviews.length} QUEUED REVIEWS
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <Scale size={14} /> Title Deed Audit Workstation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📜 Assigned Reviews & Deed Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect 30-year sub-registrar land title deeds, Pahani extracts, encumbrance certificates, and execute legal signoffs.
            </p>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, SORT & STATUS FILTER BADGES */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviews by ID, Property, Buyer, Priority, or Status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {[
                { id: "ALL", label: "All" },
                { id: "Pending", label: "Pending" },
                { id: "Under Review", label: "Under Review" },
                { id: "Approved", label: "Approved" },
                { id: "Rejected", label: "Rejected" },
              ].map((tab) => {
                const active = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setStatusFilter(tab.id); setCurrentPage(1); }}
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0F172A] px-3 py-2 rounded-xl border border-slate-200 dark:border-[#334155] text-xs font-mono font-bold">
              <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="NEWEST">Sort: Newest First</option>
                <option value="PRIORITY">Sort: Priority High-Low</option>
                <option value="PROPERTY">Sort: Property Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* ASSIGNED REVIEWS ENTERPRISE TABLE */}
        {paginatedReviews.length === 0 ? (
          <EmptyState title="No assigned reviews found" message="No review record matches your search query or status filter selection." />
        ) : (
          <div className="white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                  <th className="p-4">Review ID</th>
                  <th className="p-4">Property Parcel</th>
                  <th className="p-4">Buyer Organization</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Date</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 text-right">Actions (Open • Continue • Submit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {paginatedReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-[#0F172A]/50 transition-colors">
                    {/* Review ID */}
                    <td className="p-4 font-bold text-blue-600 dark:text-cyan-400">{r.id}</td>

                    {/* Property */}
                    <td className="p-4">
                      <strong className="font-extrabold text-slate-900 dark:text-white text-xs block">{r.property}</strong>
                    </td>

                    {/* Buyer */}
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                      👤 {r.buyer}
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      {renderPriorityBadge(r.priority)}
                    </td>

                    {/* Status Badges (Pending, Under Review, Approved, Rejected) */}
                    <td className="p-4">
                      {renderStatusBadge(r.status)}
                    </td>

                    {/* Assigned Date */}
                    <td className="p-4 text-slate-400">{r.assignedDate}</td>

                    {/* Due Date */}
                    <td className="p-4 text-slate-400">{r.dueDate}</td>

                    {/* THE 3 REQUIRED ACTION BUTTONS PER ROW */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. Open Review */}
                        <button
                          onClick={() => handleOpenReview(r)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title="1. Open Review Details"
                        >
                          <Eye size={14} />
                        </button>

                        {/* 2. Continue Review */}
                        <button
                          onClick={() => handleContinueReview(r)}
                          className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 transition-colors cursor-pointer"
                          title="2. Continue Review & Edit Notes"
                        >
                          <RefreshCw size={14} />
                        </button>

                        {/* 3. Submit Review */}
                        <button
                          onClick={() => handleSubmitReview(r)}
                          className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                          title="3. Submit Legal Verdict"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION BAR */}
            <div className="p-4 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between text-xs font-mono text-slate-500">
              <span>
                Showing Page {currentPage} of {totalPages} ({processedReviews.length} total reviews)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] disabled:opacity-40 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] disabled:opacity-40 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL WORKSTATION FOR REVIEW (OPEN / CONTINUE / SUBMIT) */}
        <AnimatePresence>
          {reviewModalItem && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReviewModalItem(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-lg w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">{reviewModalItem.id} • {modalMode} MODE</span>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{reviewModalItem.property}</h2>
                  </div>
                  <button onClick={() => setReviewModalItem(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleConfirmSubmitVerdict} className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-1">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Buyer Organization</p>
                    <p className="text-slate-900 dark:text-white font-extrabold text-sm">{reviewModalItem.buyer}</p>
                    <p className="text-slate-500">Assigned: {reviewModalItem.assignedDate} • Due: {reviewModalItem.dueDate}</p>
                  </div>

                  {modalMode === "SUBMIT" && (
                    <div>
                      <label className="block text-slate-400 uppercase font-bold mb-1">Select Legal Verdict *</label>
                      <select
                        value={selectedVerdict}
                        onChange={(e) => setSelectedVerdict(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none"
                      >
                        <option value="Approved">Approved (Clear Title Verified)</option>
                        <option value="Under Review">Under Review (Further Inspection)</option>
                        <option value="Rejected">Rejected (Title Flagged / Non-Compliant)</option>
                        <option value="Pending">Pending (Awaiting Documents)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Sub-Registrar Title Findings & Legal Notes</label>
                    <textarea
                      rows={3}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Record title chain trace, encumbrance search findings..."
                      readOnly={modalMode === "VIEW"}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setReviewModalItem(null)} variant="secondary" size="sm">Close</Button>
                    {modalMode !== "VIEW" && (
                      <Button type="submit" variant="primary" size="sm" icon={Send}>Submit Legal Verdict</Button>
                    )}
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

export default LegalReviews;
