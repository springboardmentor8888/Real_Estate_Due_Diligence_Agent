import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  FileText,
  Search,
  Filter,
  Eye,
  FileDown,
  Trash2,
  Calendar,
  Building2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  X,
  Share2,
  Copy,
  Mail,
  Send,
  Clock,
  Archive,
  Layers,
  Sparkles,
} from "lucide-react";
import { showToast, showConfirmDialog, showSuccessAlert } from "../utils/swal";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";
import { getReportsByProperty } from "../services/reportService";

// Master Initial Mock Reports Dataset across 4 categories
const INITIAL_MOCK_REPORTS = [
  // 1. Generated Reports
  {
    reportId: "REP-2026-101",
    propertyId: "1001",
    propertyName: "Gachibowli Tech Park Phase 2 (PR-1001)",
    client: "Adani Realty Institutional Fund",
    generatedDate: "04 Aug 2026",
    rawDate: new Date("2026-08-04").getTime(),
    riskScore: 14,
    category: "Generated",
    status: "Verified Clear Title",
    owner: "Adani Realty",
    marketValue: "₹ 45.00 Cr",
    address: "Financial District, Nanakramguda, Hyderabad",
  },
  {
    reportId: "REP-2026-102",
    propertyId: "1003",
    propertyName: "Whitefield Horizon Tech Campus (PR-1003)",
    client: "GMR Logistics Infrastructure",
    generatedDate: "02 Aug 2026",
    rawDate: new Date("2026-08-02").getTime(),
    riskScore: 18,
    category: "Generated",
    status: "Verified Clear Title",
    owner: "GMR Infrastructure",
    marketValue: "₹ 38.00 Cr",
    address: "ITPL Main Road, Whitefield, Bengaluru",
  },
  {
    reportId: "REP-2026-103",
    propertyId: "1005",
    propertyName: "BKC Prime Commercial Hub (PR-1005)",
    client: "Sobha Real Estate Fund",
    generatedDate: "01 Aug 2026",
    rawDate: new Date("2026-08-01").getTime(),
    riskScore: 11,
    category: "Generated",
    status: "Verified Clear Title",
    owner: "Sobha Real Estate",
    marketValue: "₹ 85.00 Cr",
    address: "Bandra Kurla Complex, Mumbai",
  },

  // 2. Pending Reports
  {
    reportId: "REP-2026-104",
    propertyId: "1002",
    propertyName: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    client: "DLF Cybercity Portfolio",
    generatedDate: "03 Aug 2026",
    rawDate: new Date("2026-08-03").getTime(),
    riskScore: 28,
    category: "Pending",
    status: "Pending Legal Signoff",
    owner: "DLF Cybercity",
    marketValue: "₹ 28.50 Cr",
    address: "Road No. 36, Jubilee Hills, Hyderabad",
  },
  {
    reportId: "REP-2026-105",
    propertyId: "1006",
    propertyName: "Kokapet SEZ Commercial Land (PR-1006)",
    client: "Mahindra Lifespaces Ltd",
    generatedDate: "30 Jul 2026",
    rawDate: new Date("2026-07-30").getTime(),
    riskScore: 34,
    category: "Pending",
    status: "Pending Tax NOC",
    owner: "Mahindra Lifespaces",
    marketValue: "₹ 32.00 Cr",
    address: "SEZ Zone, Kokapet, Hyderabad",
  },

  // 3. Shared Reports
  {
    reportId: "REP-2026-106",
    propertyId: "1004",
    propertyName: "Financial District Commercial Plot (PR-1004)",
    client: "Prestige Capital Partners",
    generatedDate: "28 Jul 2026",
    rawDate: new Date("2026-07-28").getTime(),
    riskScore: 22,
    category: "Shared",
    status: "Shared with Client",
    owner: "Prestige Capital",
    marketValue: "₹ 32.00 Cr",
    address: "Financial District, Hyderabad",
  },
  {
    reportId: "REP-2026-107",
    propertyId: "1007",
    propertyName: "Hitec City Cyber Towers Hub (PR-1007)",
    client: "Godrej Properties Fund",
    generatedDate: "25 Jul 2026",
    rawDate: new Date("2026-07-25").getTime(),
    riskScore: 16,
    category: "Shared",
    status: "Shared with Lender",
    owner: "Godrej Properties",
    marketValue: "₹ 52.00 Cr",
    address: "HITEC City Phase 2, Madhapur, Hyderabad",
  },

  // 4. Archived Reports
  {
    reportId: "REP-2025-089",
    propertyId: "1008",
    propertyName: "Bellandur Outer Ring Road Logistics (PR-1008)",
    client: "Brigade Group Enterprise",
    generatedDate: "15 Dec 2025",
    rawDate: new Date("2025-12-15").getTime(),
    riskScore: 19,
    category: "Archived",
    status: "Archived Audit",
    owner: "Brigade Group",
    marketValue: "₹ 29.50 Cr",
    address: "Bellandur Junction, ORR, Bengaluru",
  },
];

function ReportHistory() {
  const navigate = useNavigate();
  const [reportsList, setReportsList] = useState(INITIAL_MOCK_REPORTS);

  // Tab & Controls State
  const [activeCategoryTab, setActiveCategoryTab] = useState("ALL"); // 'ALL', 'Generated', 'Pending', 'Shared', 'Archived'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("DATE_DESC");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Modals State
  const [previewReport, setPreviewReport] = useState(null);
  const [shareReport, setShareReport] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportPropId, setSelectedReportPropId] = useState("");

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      ALL: reportsList.length,
      Generated: reportsList.filter((r) => r.category === "Generated").length,
      Pending: reportsList.filter((r) => r.category === "Pending").length,
      Shared: reportsList.filter((r) => r.category === "Shared").length,
      Archived: reportsList.filter((r) => r.category === "Archived").length,
    };
  }, [reportsList]);

  // Filter & Sort Logic
  const filteredReports = useMemo(() => {
    return reportsList.filter((item) => {
      const matchCategory = activeCategoryTab === "ALL" || item.category === activeCategoryTab;

      const matchSearch =
        item.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [reportsList, activeCategoryTab, searchQuery]);

  const sortedReports = useMemo(() => {
    const list = [...filteredReports];
    if (sortBy === "DATE_DESC") {
      list.sort((a, b) => b.rawDate - a.rawDate);
    } else if (sortBy === "DATE_ASC") {
      list.sort((a, b) => a.rawDate - b.rawDate);
    } else if (sortBy === "RISK_ASC") {
      list.sort((a, b) => a.riskScore - b.riskScore);
    } else if (sortBy === "NAME_ASC") {
      list.sort((a, b) => a.propertyName.localeCompare(b.propertyName));
    }
    return list;
  }, [filteredReports, sortBy]);

  // Paginated Slice
  const totalPages = Math.ceil(sortedReports.length / rowsPerPage) || 1;
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedReports.slice(start, start + rowsPerPage);
  }, [sortedReports, currentPage, rowsPerPage]);

  // Handlers
  const handleOpenPdfModal = (item) => {
    const cleanId = String(item.propertyId || item.numericId || "1001").replace(/\D/g, "") || "1001";
    setSelectedReportPropId(cleanId);
    setReportModalOpen(true);
  };

  const handleDeleteReport = async (item) => {
    const confirmed = await showConfirmDialog({
      title: `Delete Report ${item.reportId}?`,
      text: "This action will permanently purge the verified due diligence audit certificate from your report vault.",
      confirmButtonText: "Yes, Delete Report",
      cancelButtonText: "Keep Report",
      icon: "warning",
    });

    if (confirmed) {
      setReportsList((prev) => prev.filter((r) => r.reportId !== item.reportId));
      showToast(`Deleted Report ${item.reportId}`, "info");
    }
  };

  const handleShareSubmit = (e) => {
    e.preventDefault();
    if (!shareEmail) {
      showToast("Please enter client email address", "error");
      return;
    }

    setReportsList((prev) =>
      prev.map((r) => (r.reportId === shareReport.reportId ? { ...r, category: "Shared", status: "Shared with Client" } : r))
    );

    showSuccessAlert("Report Shared", `Shared report ${shareReport.reportId} with ${shareEmail}.`);
    setShareReport(null);
    setShareEmail("");
  };

  const handleCopyShareLink = (reportId) => {
    navigator.clipboard.writeText(`https://app.agentdd.com/reports/share/${reportId}`);
    showToast("Shareable report link copied to clipboard!", "success");
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-emerald-500 dark:text-emerald-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Institutional Report Center
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800">
            REPORT VAULT • {reportsList.length} CERTIFICATES
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold mb-2">
              <FileText size={14} /> Report Center Vault
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📄 Enterprise Due Diligence Report Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Access generated, pending, shared, and archived 13-vector due diligence audit reports, preview findings, and export institutional PDFs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={() => handleOpenPdfModal({ propertyId: "1001" })} variant="primary" size="sm" icon={Plus}>
              Generate New Report
            </Button>
          </div>
        </div>

        {/* CATEGORY TABS (Generated, Pending, Shared, Archived) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs font-mono font-bold">
          {[
            { id: "ALL", label: "All Reports", icon: Layers, count: categoryCounts.ALL },
            { id: "Generated", label: "Generated Reports", icon: CheckCircle2, count: categoryCounts.Generated },
            { id: "Pending", label: "Pending Reports", icon: Clock, count: categoryCounts.Pending },
            { id: "Shared", label: "Shared Reports", icon: Share2, count: categoryCounts.Shared },
            { id: "Archived", label: "Archived Reports", icon: Archive, count: categoryCounts.Archived },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeCategoryTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategoryTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  active
                    ? "bg-white dark:bg-[#0F172A] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-[#334155]"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    active
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-200 dark:bg-[#0F172A] text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH & SORT CONTROLS */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by Property Parcel, Client Name, Report ID, or Status..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3.5 py-2 rounded-xl text-xs font-mono">
            <ArrowUpDown size={14} className="text-emerald-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              <option value="DATE_DESC">Generated Date: Newest First</option>
              <option value="DATE_ASC">Generated Date: Oldest First</option>
              <option value="RISK_ASC">Lowest Risk Score</option>
              <option value="NAME_ASC">Property Name (A - Z)</option>
            </select>
          </div>
        </div>

        {/* ENTERPRISE REPORT CARDS / TABLE VIEW */}
        {sortedReports.length === 0 ? (
          <EmptyState title="No reports found" message="No report certificate matches your search query or tab selection." />
        ) : (
          <div className="white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-[#334155] text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="p-4">Report ID / Property</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Generated Date</th>
                  <th className="p-4">Risk Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions (Preview • PDF • Share • Delete)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {paginatedReports.map((item) => (
                  <tr key={item.reportId} className="hover:bg-slate-50/50 dark:hover:bg-[#0F172A]/50 transition-colors">
                    {/* Property */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">{item.reportId}</span>
                        <strong className="font-extrabold text-slate-900 dark:text-white text-xs block">{item.propertyName}</strong>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="p-4">
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{item.client}</strong>
                    </td>

                    {/* Generated Date */}
                    <td className="p-4 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-bold">
                      <Calendar size={13} className="text-blue-500 shrink-0" />
                      <span>{item.generatedDate}</span>
                    </td>

                    {/* Risk Score */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.riskScore <= 25
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800"
                        }`}
                      >
                        <ShieldCheck size={11} /> {item.riskScore} / 100
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <Badge variant={item.category === "Pending" ? "warning" : item.category === "Shared" ? "info" : "success"}>
                        {item.status}
                      </Badge>
                    </td>

                    {/* THE 4 REQUIRED ACTION BUTTONS */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. Preview */}
                        <button
                          onClick={() => setPreviewReport(item)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title="1. Preview Report"
                        >
                          <Eye size={14} />
                        </button>

                        {/* 2. Download PDF */}
                        <button
                          onClick={() => handleOpenPdfModal(item)}
                          className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                          title="2. Download PDF"
                        >
                          <FileDown size={14} />
                        </button>

                        {/* 3. Share */}
                        <button
                          onClick={() => setShareReport(item)}
                          className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 transition-colors cursor-pointer"
                          title="3. Share Report"
                        >
                          <Share2 size={14} />
                        </button>

                        {/* 4. Delete */}
                        <button
                          onClick={() => handleDeleteReport(item)}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white transition-colors cursor-pointer"
                          title="4. Delete Report"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {sortedReports.length > 0 && (
          <div className="white-card rounded-3xl p-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="text-slate-500 dark:text-slate-400">
              Showing {Math.min((currentPage - 1) * rowsPerPage + 1, sortedReports.length)} - {Math.min(currentPage * rowsPerPage, sortedReports.length)} of {sortedReports.length} reports
            </div>

            <div className="flex items-center gap-4">
              {/* Rows Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] rounded-xl px-2.5 py-1 text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-[#334155] bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-[#334155] bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: PREVIEW REPORT MODAL */}
        <AnimatePresence>
          {previewReport && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewReport(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-xl w-full space-y-6 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Report: {previewReport.reportId}</span>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{previewReport.propertyName}</h2>
                  </div>
                  <button onClick={() => setPreviewReport(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Client Organization</p>
                    <p className="text-slate-900 dark:text-white font-extrabold text-sm">{previewReport.client}</p>
                    <p className="text-slate-500 dark:text-slate-400">Generated Date: {previewReport.generatedDate}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div>
                      <span className="text-emerald-900 dark:text-emerald-300 uppercase block text-[10px] font-bold">13-Vector Risk Score</span>
                      <strong className="text-emerald-700 dark:text-emerald-300 font-extrabold text-lg">{previewReport.riskScore} / 100</strong>
                    </div>
                    <div>
                      <span className="text-emerald-900 dark:text-emerald-300 uppercase block text-[10px] font-bold">Status Badge</span>
                      <Badge variant="success">{previewReport.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                  <Button onClick={() => setPreviewReport(null)} variant="secondary" size="sm">Close Preview</Button>
                  <Button onClick={() => { setPreviewReport(null); handleOpenPdfModal(previewReport); }} variant="primary" size="sm" icon={FileDown}>Export PDF</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 3: SHARE REPORT MODAL */}
        <AnimatePresence>
          {shareReport && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShareReport(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Share2 size={20} className="text-blue-500" /> Share Due Diligence Report
                  </h2>
                  <button onClick={() => setShareReport(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleShareSubmit} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Sharing report <strong className="text-emerald-600">{shareReport.reportId}</strong> for {shareReport.propertyName}</p>
                  
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Recipient Corporate Email *</label>
                    <input type="email" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} placeholder="acquisitions@client.com" required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-2">
                    <button type="button" onClick={() => handleCopyShareLink(shareReport.reportId)} className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-[#334155] cursor-pointer">
                      <Copy size={14} /> Copy Secure Access Link
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setShareReport(null)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" icon={Send}>Send Report</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* REPORT GENERATOR MODAL */}
        <ReportGeneratorModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} initialPropertyId={selectedReportPropId} />
      </div>
    </MainLayout>
  );
}

export default ReportHistory;
