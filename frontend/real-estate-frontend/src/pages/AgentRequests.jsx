import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  PlusCircle,
  Home,
  Filter,
  ArrowUpDown,
  X,
  Eye,
  Edit3,
  FileDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building2,
  Users,
  UserCheck,
  Save,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";
import { showSuccessAlert, showToast } from "../utils/swal";
import { getLiveAgentRequests } from "../services/liveStore";

// Master Initial Due Diligence Requests Mock Data
const INITIAL_REQUESTS = [
  {
    id: "REQ-901",
    client: "Adani Realty Institutional Fund",
    property: "Cyber Towers Commercial Complex (PR-1001)",
    propertyId: "1001",
    priority: "HIGH",
    status: "Reviewing",
    dueDate: "08 Aug 2026",
    assignedReviewer: "Adv. Vikramaditya Rao",
    notes: "13-vector encumbrance check in progress at Sub-Registrar Office.",
  },
  {
    id: "REQ-902",
    client: "DLF Cybercity Portfolio",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    propertyId: "1002",
    priority: "MEDIUM",
    status: "Pending",
    dueDate: "12 Aug 2026",
    assignedReviewer: "Senior Legal Counsel Ananya",
    notes: "Awaiting municipal tax clearance receipt from GHMC.",
  },
  {
    id: "REQ-903",
    client: "Prestige Capital Partners",
    property: "Whitefield Horizon Tech Campus (PR-1003)",
    propertyId: "1003",
    priority: "HIGH",
    status: "Approved",
    dueDate: "10 Aug 2026",
    assignedReviewer: "Adv. Meera Deshmukh",
    notes: "Title search clean. All 13 audit vectors verified.",
  },
  {
    id: "REQ-904",
    client: "GMR Logistics Infrastructure",
    property: "Financial District Commercial Plot (PR-1004)",
    propertyId: "1004",
    priority: "HIGH",
    status: "Completed",
    dueDate: "04 Aug 2026",
    assignedReviewer: "Srinivas GMR Legal Team",
    notes: "Final report generated and dispatched to client vault.",
  },
  {
    id: "REQ-905",
    client: "Sobha Real Estate Fund",
    property: "BKC Prime Commercial Hub (PR-1005)",
    propertyId: "1005",
    priority: "LOW",
    status: "Rejected",
    dueDate: "02 Aug 2026",
    assignedReviewer: "Adv. Rajesh Varma",
    notes: "Rejected due to active boundary litigation suit #402/2024.",
  },
  {
    id: "REQ-906",
    client: "Mahindra Lifespaces Ltd",
    property: "Hitec City Phase 3 Plot (PR-1006)",
    propertyId: "1006",
    priority: "MEDIUM",
    status: "Reviewing",
    dueDate: "14 Aug 2026",
    assignedReviewer: "Priya Mahindra Counsel",
    notes: "Zoning & FAR classification under review by HMDA.",
  },
  {
    id: "REQ-907",
    client: "Godrej Properties Fund",
    property: "Kokapet SEZ Commercial Land (PR-1007)",
    propertyId: "1007",
    priority: "HIGH",
    status: "Pending",
    dueDate: "18 Aug 2026",
    assignedReviewer: "Adv. Vikramaditya Rao",
    notes: "Initial due diligence request submitted by Godrej Fund.",
  },
  {
    id: "REQ-908",
    client: "Brigade Group Enterprise",
    property: "Outer Ring Road Logistics Hub (PR-1008)",
    propertyId: "1008",
    priority: "LOW",
    status: "Approved",
    dueDate: "01 Aug 2026",
    assignedReviewer: "Senior Legal Counsel Ananya",
    notes: "Title clearance certificate verified and approved.",
  },
];

function AgentRequests() {
  const navigate = useNavigate();

  // Requests State
  const [requests, setRequests] = useState(() => {
    try {
      const live = getLiveAgentRequests();
      if (Array.isArray(live) && live.length > 0) return live;
    } catch (e) {}
    return INITIAL_REQUESTS;
  });

  // Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DUE_DATE_ASC");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Modals State
  const [viewModalReq, setViewModalReq] = useState(null);
  const [updateModalReq, setUpdateModalReq] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportPropId, setSelectedReportPropId] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Update Form State
  const [updateForm, setUpdateForm] = useState({
    id: "",
    status: "Pending",
    priority: "HIGH",
    assignedReviewer: "",
    notes: "",
  });

  // Create Form State
  const [createForm, setCreateForm] = useState({
    client: "Adani Realty Institutional Fund",
    property: "Cyber Towers Commercial Complex (PR-1001)",
    propertyId: "1001",
    priority: "HIGH",
    status: "Pending",
    dueDate: "20 Aug 2026",
    assignedReviewer: "Adv. Vikramaditya Rao",
    notes: "New due diligence audit request initiated.",
  });

  // Filter & Sort Logic
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchSearch =
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.assignedReviewer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "ALL" || req.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const sortedRequests = useMemo(() => {
    const list = [...filteredRequests];
    if (sortBy === "DUE_DATE_ASC") {
      list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (sortBy === "PRIORITY_DESC") {
      const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      list.sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
    } else if (sortBy === "ID_ASC") {
      list.sort((a, b) => a.id.localeCompare(b.id));
    }
    return list;
  }, [filteredRequests, sortBy]);

  // Paginated Slice
  const totalPages = Math.ceil(sortedRequests.length / rowsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedRequests.slice(start, start + rowsPerPage);
  }, [sortedRequests, currentPage, rowsPerPage]);

  // Status Badge Color Renderer (Pending, Reviewing, Completed, Approved, Rejected)
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold">
            <Clock size={12} /> Pending
          </span>
        );
      case "Reviewing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold">
            <ShieldCheck size={12} /> Reviewing
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-mono font-bold">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  // Handlers
  const handleOpenUpdateModal = (req) => {
    setUpdateForm({
      id: req.id,
      status: req.status,
      priority: req.priority,
      assignedReviewer: req.assignedReviewer,
      notes: req.notes || "",
    });
    setUpdateModalReq(req);
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();
    setRequests((prev) =>
      prev.map((r) => (r.id === updateForm.id ? { ...r, ...updateForm } : r))
    );
    showToast(`Updated Due Diligence Request ${updateForm.id}`, "success");
    setUpdateModalReq(null);
  };

  const handleOpenReportModal = (req) => {
    const rawId = req.propertyId || req.property || "1001";
    const cleanId = String(rawId).replace(/\D/g, "") || "1001";
    setSelectedReportPropId(cleanId);
    setReportModalOpen(true);
  };

  const handleSaveCreateRequest = (e) => {
    e.preventDefault();
    const created = {
      id: `REQ-90${requests.length + 1}`,
      ...createForm,
    };
    setRequests((prev) => [created, ...prev]);
    showSuccessAlert("Request Initiated", `Created Due Diligence Request ${created.id}.`);
    setCreateModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-cyan-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Due Diligence Audit Workstation
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono font-bold text-xs border border-cyan-200 dark:border-cyan-800">
            ACTIVE REQUESTS: {requests.length}
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-mono font-bold mb-2">
              <ClipboardList size={14} /> 13-Vector Legal Audit Pipeline
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📋 Due Diligence Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Track client land audit inquiries, reviewer assignments, status updates, and issue verified due diligence reports.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={() => setCreateModalOpen(true)} variant="primary" size="sm" icon={PlusCircle}>
              New Audit Request
            </Button>
          </div>
        </div>

        {/* SEARCH, FILTER & SORT BAR */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Request ID, Client, Property Parcel, or Reviewer..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <Filter size={14} className="text-cyan-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Completed">Completed</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <ArrowUpDown size={14} className="text-blue-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
              >
                <option value="DUE_DATE_ASC">Sort: Due Date (Soonest)</option>
                <option value="PRIORITY_DESC">Sort: Priority (High First)</option>
                <option value="ID_ASC">Sort: Request ID (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESPONSIVE ENTERPRISE TABLE */}
        {sortedRequests.length === 0 ? (
          <EmptyState title="No requests found" message="No due diligence request matches your search or filter settings." />
        ) : (
          <div className="white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-[#334155] text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="p-4">Request ID</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Assigned Reviewer</th>
                  <th className="p-4 text-right">Actions (View • Update • Report)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-[#0F172A]/50 transition-colors">
                    {/* Request ID */}
                    <td className="p-4">
                      <span className="font-extrabold text-cyan-600 dark:text-cyan-400 block">{req.id}</span>
                    </td>

                    {/* Client */}
                    <td className="p-4">
                      <strong className="text-slate-900 dark:text-white font-bold block">{req.client}</strong>
                    </td>

                    {/* Property */}
                    <td className="p-4">
                      <span className="text-slate-800 dark:text-slate-200 font-medium block truncate max-w-xs" title={req.property}>
                        🏢 {req.property}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <Badge variant={req.priority === "HIGH" ? "danger" : req.priority === "MEDIUM" ? "warning" : "info"} className="text-[10px]">
                        {req.priority}
                      </Badge>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {renderStatusBadge(req.status)}
                    </td>

                    {/* Due Date */}
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-semibold">
                      {req.dueDate}
                    </td>

                    {/* Assigned Reviewer */}
                    <td className="p-4">
                      <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-bold">
                        <UserCheck size={13} className="text-purple-500" /> {req.assignedReviewer}
                      </span>
                    </td>

                    {/* Action Buttons: View, Update, Generate Report */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. View */}
                        <button
                          onClick={() => setViewModalReq(req)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title="1. View Request Details"
                        >
                          <Eye size={14} />
                        </button>

                        {/* 2. Update */}
                        <button
                          onClick={() => handleOpenUpdateModal(req)}
                          className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 transition-colors cursor-pointer"
                          title="2. Update Request"
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* 3. Generate Report */}
                        <button
                          onClick={() => handleOpenReportModal(req)}
                          className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                          title="3. Generate Report"
                        >
                          <FileDown size={14} />
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
        {sortedRequests.length > 0 && (
          <div className="white-card rounded-3xl p-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span>Showing {Math.min((currentPage - 1) * rowsPerPage + 1, sortedRequests.length)} - {Math.min(currentPage * rowsPerPage, sortedRequests.length)} of {sortedRequests.length} requests</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Rows Per Page Selector */}
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
                <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
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

        {/* MODAL 1: VIEW DETAILS MODAL */}
        <AnimatePresence>
          {viewModalReq && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewModalReq(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-lg w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">Request: {viewModalReq.id}</span>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{viewModalReq.client}</h2>
                  </div>
                  <button onClick={() => setViewModalReq(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Target Property Parcel</p>
                    <p className="text-slate-900 dark:text-white font-extrabold text-sm flex items-center gap-1.5">
                      <Building2 size={15} className="text-purple-500" /> {viewModalReq.property}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Status Badge</span>
                      <div className="mt-1">{renderStatusBadge(viewModalReq.status)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Due Date</span>
                      <strong className="text-slate-900 dark:text-white font-extrabold text-sm block mt-1">{viewModalReq.dueDate}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                    <p className="text-purple-900 dark:text-purple-300 uppercase font-bold text-[10px]">Assigned Reviewer</p>
                    <p className="text-slate-900 dark:text-white font-extrabold text-sm">{viewModalReq.assignedReviewer}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">{viewModalReq.notes}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                  <Button onClick={() => setViewModalReq(null)} variant="secondary" size="sm">Close</Button>
                  <Button onClick={() => { setViewModalReq(null); handleOpenReportModal(viewModalReq); }} variant="primary" size="sm" icon={FileDown}>Generate PDF Report</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: UPDATE REQUEST MODAL */}
        <AnimatePresence>
          {updateModalReq && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setUpdateModalReq(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit3 size={20} className="text-blue-500" /> Update Request ({updateForm.id})
                  </h2>
                  <button onClick={() => setUpdateModalReq(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleSaveUpdate} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Status Badge *</label>
                    <select value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                      <option value="Pending">Pending</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Completed">Completed</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Priority Level</label>
                    <select value={updateForm.priority} onChange={(e) => setUpdateForm({ ...updateForm, priority: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Assigned Reviewer</label>
                    <input type="text" value={updateForm.assignedReviewer} onChange={(e) => setUpdateForm({ ...updateForm, assignedReviewer: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Audit Notes</label>
                    <textarea rows={3} value={updateForm.notes} onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setUpdateModalReq(null)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" icon={Save}>Save Update</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 3: CREATE REQUEST MODAL */}
        <AnimatePresence>
          {createModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCreateModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle size={20} className="text-cyan-500" /> New Due Diligence Request
                  </h2>
                  <button onClick={() => setCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleSaveCreateRequest} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Client Organization *</label>
                    <input type="text" value={createForm.client} onChange={(e) => setCreateForm({ ...createForm, client: e.target.value })} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Target Property Parcel *</label>
                    <input type="text" value={createForm.property} onChange={(e) => setCreateForm({ ...createForm, property: e.target.value })} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 uppercase font-bold mb-1">Priority</label>
                      <select value={createForm.priority} onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold">
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 uppercase font-bold mb-1">Due Date</label>
                      <input type="text" value={createForm.dueDate} onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Assigned Legal Reviewer</label>
                    <input type="text" value={createForm.assignedReviewer} onChange={(e) => setCreateForm({ ...createForm, assignedReviewer: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setCreateModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">Initiate Audit Request</Button>
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

export default AgentRequests;
