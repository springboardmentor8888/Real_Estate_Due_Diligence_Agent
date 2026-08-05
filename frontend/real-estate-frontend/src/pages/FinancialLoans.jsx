import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Landmark,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  CheckCircle2,
  XCircle,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Home,
  X,
  Send,
  FileText,
  ShieldCheck,
  FlaskConical,
  Percent,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";

// Master Initial Loan Requests Dataset with all 8 required data fields
const MASTER_LOAN_REQUESTS = [
  {
    id: "LOAN-2026-901",
    applicant: "Adani Realty Institutional Fund",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    propertyId: "1001",
    requestedAmount: "₹ 45.00 Cr",
    amountNum: 450000000,
    loanType: "Commercial Mortgage",
    status: "Approved",
    riskScore: "14/100 Low",
    riskScoreNum: 14,
    applicationDate: "04 Aug 2026",
    ltvRatio: "69.2%",
  },
  {
    id: "LOAN-2026-902",
    applicant: "DLF Cybercity Developers Ltd",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    propertyId: "1002",
    requestedAmount: "₹ 28.00 Cr",
    amountNum: 280000000,
    loanType: "Construction Loan",
    status: "Under Review",
    riskScore: "68/100 High",
    riskScoreNum: 68,
    applicationDate: "02 Aug 2026",
    ltvRatio: "73.6%",
  },
  {
    id: "LOAN-2026-903",
    applicant: "GMR Logistics Infrastructure",
    property: "Whitefield Horizon Tech Campus (PR-1003)",
    propertyId: "1003",
    requestedAmount: "₹ 110.00 Cr",
    amountNum: 1100000000,
    loanType: "Bridge Financing",
    status: "Approved",
    riskScore: "18/100 Low",
    riskScoreNum: 18,
    applicationDate: "30 Jul 2026",
    ltvRatio: "66.6%",
  },
  {
    id: "LOAN-2026-904",
    applicant: "Prestige Capital Partners",
    property: "Financial District Commercial Plot (PR-1004)",
    propertyId: "1004",
    requestedAmount: "₹ 32.00 Cr",
    amountNum: 320000000,
    loanType: "Refinancing",
    status: "Pending",
    riskScore: "22/100 Low",
    riskScoreNum: 22,
    applicationDate: "28 Jul 2026",
    ltvRatio: "61.5%",
  },
  {
    id: "LOAN-2026-905",
    applicant: "Sobha Real Estate Fund",
    property: "BKC Prime Commercial Hub (PR-1005)",
    propertyId: "1005",
    requestedAmount: "₹ 75.00 Cr",
    amountNum: 750000000,
    loanType: "Commercial Mortgage",
    status: "Rejected",
    riskScore: "78/100 High",
    riskScoreNum: 78,
    applicationDate: "25 Jul 2026",
    ltvRatio: "78.0%",
  },
];

function FinancialLoans() {
  const navigate = useNavigate();

  // State Management
  const [loans, setLoans] = useState(MASTER_LOAN_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Modals state
  const [selectedLoanModal, setSelectedLoanModal] = useState(null);
  const [requestDocsModalOpen, setRequestDocsModalOpen] = useState(false);
  const [selectedDocLoan, setSelectedDocLoan] = useState(null);
  const [docRequestNote, setDocRequestNote] = useState("Please provide audited FY 2025 financial statements & zero-dues tax receipt.");

  // FILTERED & SORTED LOAN REQUESTS
  const processedLoans = useMemo(() => {
    let list = loans.filter((loan) => {
      const matchStatus = statusFilter === "ALL" || loan.status === statusFilter;
      const matchSearch =
        loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.status.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchSearch;
    });

    if (sortBy === "NEWEST") {
      list.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
    } else if (sortBy === "AMOUNT_DESC") {
      list.sort((a, b) => b.amountNum - a.amountNum);
    } else if (sortBy === "RISK_ASC") {
      list.sort((a, b) => a.riskScoreNum - b.riskScoreNum);
    }

    return list;
  }, [loans, statusFilter, searchQuery, sortBy]);

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(processedLoans.length / pageSize) || 1;
  const paginatedLoans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedLoans.slice(start, start + pageSize);
  }, [processedLoans, currentPage, pageSize]);

  // ACTION BUTTON HANDLERS
  const handleApproveLoan = (id) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "Approved" } : l))
    );
    showSuccessAlert("Loan Application Approved", `Loan application ${id} sanctioned successfully.`);
  };

  const handleRejectLoan = (id) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "Rejected" } : l))
    );
    showSuccessAlert("Loan Application Rejected", `Loan application ${id} rejected due to underwriting parameters.`);
  };

  const handleOpenDocRequest = (loan) => {
    setSelectedDocLoan(loan);
    setRequestDocsModalOpen(true);
  };

  const handleSendDocRequestSubmit = (e) => {
    e.preventDefault();
    showSuccessAlert("Document Request Dispatched", `Dispatched document request to ${selectedDocLoan?.applicant}`);
    setRequestDocsModalOpen(false);
  };

  // Helper for Status Badge Variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "Approved": return "success";
      case "Under Review": return "warning";
      case "Pending": return "info";
      case "Rejected": return "danger";
      default: return "secondary";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Landmark size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Commercial Mortgage Loan Applications
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            UNDERWRITING PIPELINE • {processedLoans.length} APPLICATIONS
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <Landmark size={14} /> Mortgage Underwriting Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              🏛️ Commercial Mortgage Loan Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Audit applicant entities, collateral property valuation, requested loan amounts, LTV ratios, and 13-vector risk scores.
            </p>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, STATUS BADGE FILTERS & SORT */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search loan requests by Loan ID, Applicant, Property, Type, or Status..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0F172A] px-3 py-2 rounded-xl border border-slate-200 dark:border-[#334155]">
              <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="NEWEST">Sort: Newest First</option>
                <option value="AMOUNT_DESC">Sort: Amount (High to Low)</option>
                <option value="RISK_ASC">Sort: Risk Score (Low to High)</option>
              </select>
            </div>
          </div>

          {/* REQUIRED STATUS BADGE FILTERS (Pending, Under Review, Approved, Rejected) */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 dark:border-[#334155] pt-3">
            {[
              { id: "ALL", label: "All Requests" },
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
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ENTERPRISE DATA TABLE (THE 9 REQUIRED COLUMNS & 5 REQUIRED BUTTONS) */}
        {paginatedLoans.length === 0 ? (
          <EmptyState title="No loan applications found" message="No mortgage loan request matches your search query or selected status filter." />
        ) : (
          <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                🏛️ Loan Application Underwriting Registry
              </h2>
              <span className="text-slate-400 font-bold">Showing {paginatedLoans.length} of {processedLoans.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#334155] text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-3">1. Loan ID</th>
                    <th className="py-3 px-3">2. Applicant</th>
                    <th className="py-3 px-3">3. Property</th>
                    <th className="py-3 px-3">4. Amount</th>
                    <th className="py-3 px-3">5. Loan Type</th>
                    <th className="py-3 px-3">6. Status</th>
                    <th className="py-3 px-3">7. Risk Score</th>
                    <th className="py-3 px-3">8. App Date</th>
                    <th className="py-3 px-3 text-right">9. Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/60 font-medium">
                  {paginatedLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-colors">
                      {/* 1. Loan ID */}
                      <td className="py-3.5 px-3 font-bold text-blue-600 dark:text-cyan-400">{loan.id}</td>

                      {/* 2. Applicant */}
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">{loan.applicant}</td>

                      {/* 3. Property */}
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{loan.property}</td>

                      {/* 4. Requested Amount */}
                      <td className="py-3.5 px-3 font-extrabold text-blue-600 dark:text-cyan-400">{loan.requestedAmount}</td>

                      {/* 5. Loan Type */}
                      <td className="py-3.5 px-3 font-bold text-slate-700 dark:text-slate-300">{loan.loanType}</td>

                      {/* 6. Status (Status Badges: Pending, Under Review, Approved, Rejected) */}
                      <td className="py-3.5 px-3">
                        <Badge variant={getStatusVariant(loan.status)}>{loan.status}</Badge>
                      </td>

                      {/* 7. Risk Score */}
                      <td className="py-3.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">{loan.riskScore}</td>

                      {/* 8. Application Date */}
                      <td className="py-3.5 px-3 text-slate-400">{loan.applicationDate}</td>

                      {/* 9. Actions (The 5 Required Buttons: View, Evaluate, Approve, Reject, Request Docs) */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. View Application */}
                          <button
                            onClick={() => setSelectedLoanModal(loan)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                            title="View Application Details"
                          >
                            <Eye size={14} />
                          </button>

                          {/* 2. Evaluate */}
                          <button
                            onClick={() => navigate(`/risk-assessment?id=${loan.propertyId}`)}
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-600 dark:text-cyan-300 transition-all cursor-pointer"
                            title="Evaluate Risk Score"
                          >
                            <FlaskConical size={14} />
                          </button>

                          {/* 3. Approve */}
                          {loan.status !== "Approved" && (
                            <button
                              onClick={() => handleApproveLoan(loan.id)}
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-300 transition-all cursor-pointer"
                              title="Approve Loan Application"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}

                          {/* 4. Reject */}
                          {loan.status !== "Rejected" && (
                            <button
                              onClick={() => handleRejectLoan(loan.id)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 text-rose-600 dark:text-rose-300 transition-all cursor-pointer"
                              title="Reject Application"
                            >
                              <XCircle size={14} />
                            </button>
                          )}

                          {/* 5. Request Documents */}
                          <button
                            onClick={() => handleOpenDocRequest(loan)}
                            className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 text-purple-600 dark:text-purple-300 transition-all cursor-pointer"
                            title="Request Financial Documents"
                          >
                            <FolderOpen size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ENTERPRISE PAGINATION CONTROLS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-[#334155] pt-4 font-mono text-xs">
              <span className="text-slate-500 font-bold">
                Page {currentPage} of {totalPages} ({processedLoans.length} Total Applications)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="secondary"
                  size="sm"
                  icon={ChevronLeft}
                >
                  Previous
                </Button>

                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  size="sm"
                  icon={ChevronRight}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: VIEW APPLICATION DETAILS MODAL */}
        <AnimatePresence>
          {selectedLoanModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLoanModal(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye size={20} className="text-blue-500" /> Loan Application Dossier
                  </h2>
                  <button onClick={() => setSelectedLoanModal(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-500">Loan ID: <strong className="text-blue-600 dark:text-cyan-400">{selectedLoanModal.id}</strong></p>
                    <p className="text-slate-500">Applicant: <strong className="text-slate-900 dark:text-white">{selectedLoanModal.applicant}</strong></p>
                    <p className="text-slate-500">Property: <strong className="text-slate-900 dark:text-white">{selectedLoanModal.property}</strong></p>
                    <p className="text-slate-500">Requested Amount: <strong className="text-emerald-600 dark:text-emerald-400">{selectedLoanModal.requestedAmount}</strong></p>
                    <p className="text-slate-500">Sanctioned LTV: <strong className="text-slate-900 dark:text-white">{selectedLoanModal.ltvRatio}</strong></p>
                    <p className="text-slate-500">Risk Score: <strong className="text-emerald-600 dark:text-emerald-400">{selectedLoanModal.riskScore}</strong></p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setSelectedLoanModal(null)} variant="secondary" size="sm">Close</Button>
                    <Button onClick={() => { setSelectedLoanModal(null); navigate(`/risk-assessment?id=${selectedLoanModal.propertyId}`); }} variant="primary" size="sm">Evaluate Risk</Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: REQUEST DOCUMENTS MODAL */}
        <AnimatePresence>
          {requestDocsModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestDocsModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderOpen size={20} className="text-purple-500" /> Request Financial Documents
                  </h2>
                  <button onClick={() => setRequestDocsModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleSendDocRequestSubmit} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Request documents from <strong className="text-blue-600">{selectedDocLoan?.applicant}</strong></p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Document Request Note *</label>
                    <textarea rows={3} value={docRequestNote} onChange={(e) => setDocRequestNote(e.target.value)} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setRequestDocsModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" icon={Send}>Dispatch Request</Button>
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

export default FinancialLoans;
