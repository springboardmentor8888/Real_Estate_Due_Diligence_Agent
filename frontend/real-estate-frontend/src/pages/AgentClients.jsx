import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Building2,
  PlusCircle,
  Search,
  Mail,
  Phone,
  FileSpreadsheet,
  Home,
  ChevronRight,
  UserPlus,
  X,
  Eye,
  Edit3,
  Trash2,
  FileDown,
  LayoutGrid,
  List,
  Sliders,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  Building,
  Save,
  ArrowUpDown,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";
import { showSuccessAlert, showConfirmDialog, showToast } from "../utils/swal";
import { getLiveProperties } from "../services/liveStore";

// Master Initial Client Roster
const INITIAL_CLIENTS = [
  {
    id: "CLT-101",
    name: "Adani Realty Institutional Fund",
    contactPerson: "Rajiv Adani",
    email: "acquisitions@adanirealty.com",
    phone: "+91 98200 11223",
    assignedProperties: ["PR-1001 (Gachibowli Tech Park)", "PR-1004 (Financial District Plot)"],
    status: "Active Audit",
    tier: "VIP Client",
  },
  {
    id: "CLT-102",
    name: "DLF Cybercity Portfolio",
    contactPerson: "Vikram Singh",
    email: "vikram.singh@dlf.in",
    phone: "+91 98111 44556",
    assignedProperties: ["PR-1002 (Jubilee Hills Plot 36)", "PR-1005 (Hitec City Hub)"],
    status: "Under Review",
    tier: "Corporate",
  },
  {
    id: "CLT-103",
    name: "GMR Logistics Infrastructure",
    contactPerson: "Srinivas GMR",
    email: "srinivas.gmr@gmr.in",
    phone: "+91 98490 88776",
    assignedProperties: ["PR-1003 (Whitefield Horizon Campus)"],
    status: "Signoff Ready",
    tier: "Enterprise",
  },
  {
    id: "CLT-104",
    name: "Prestige Capital Partners",
    contactPerson: "Meera Prestige",
    email: "meera.capital@prestige.com",
    phone: "+91 98800 33445",
    assignedProperties: ["PR-1001 (Gachibowli Tech Park)", "PR-1003 (Whitefield Horizon)"],
    status: "Active Audit",
    tier: "VIP Client",
  },
  {
    id: "CLT-105",
    name: "Sobha Real Estate Fund",
    contactPerson: "Ananth Sobha",
    email: "ananth@sobhafuns.com",
    phone: "+91 98450 99887",
    assignedProperties: ["PR-1006 (Kokapet Commercial Plot)"],
    status: "Under Review",
    tier: "Corporate",
  },
  {
    id: "CLT-106",
    name: "Mahindra Lifespaces Ltd",
    contactPerson: "Priya Mahindra",
    email: "priya@mahindralifespaces.com",
    phone: "+91 99300 77665",
    assignedProperties: ["PR-1002 (Jubilee Hills Plot 36)"],
    status: "Signoff Ready",
    tier: "Enterprise",
  },
];

function AgentClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(INITIAL_CLIENTS);

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NAME_ASC");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  // Modals State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewProfileModalClient, setViewProfileModalClient] = useState(null);
  const [assignPropModalClient, setAssignPropModalClient] = useState(null);
  const [editModalClient, setEditModalClient] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportPropId, setSelectedReportPropId] = useState("");

  // Assign Property Form State
  const [selectedPropToAssign, setSelectedPropToAssign] = useState("PR-1001 (Gachibowli Tech Park Phase 2)");

  // Add / Edit Client Forms State
  const [clientForm, setClientForm] = useState({
    id: "",
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    status: "Active Audit",
  });

  // Available master properties to assign
  const masterProperties = useMemo(() => getLiveProperties() || [], []);

  // Filtered & Sorted Client List
  const processedClients = useMemo(() => {
    let list = clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery);

      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;

      return matchSearch && matchStatus;
    });

    if (sortBy === "NAME_ASC") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "NAME_DESC") list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === "MOST_PROPERTIES") list.sort((a, b) => b.assignedProperties.length - a.assignedProperties.length);

    return list;
  }, [clients, searchQuery, statusFilter, sortBy]);

  // Handlers
  const handleOpenCreateModal = () => {
    setClientForm({
      id: `CLT-10${clients.length + 1}`,
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      status: "Active Audit",
    });
    setCreateModalOpen(true);
  };

  const handleSaveCreateClient = (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email) {
      showToast("Please provide client name and email address", "error");
      return;
    }

    const created = {
      ...clientForm,
      photo: DEFAULT_AVATARS[clients.length % DEFAULT_AVATARS.length],
      assignedProperties: ["PR-1001 (Gachibowli Tech Park)"],
      tier: "Corporate",
    };

    setClients((prev) => [created, ...prev]);
    showSuccessAlert("Client Registered", `Registered client "${clientForm.name}" successfully.`);
    setCreateModalOpen(false);
  };

  const handleOpenEditModal = (client) => {
    setClientForm({ ...client });
    setEditModalClient(client);
  };

  const handleSaveEditClient = (e) => {
    e.preventDefault();
    setClients((prev) => prev.map((c) => (c.id === clientForm.id ? { ...c, ...clientForm } : c)));
    showToast(`Updated details for "${clientForm.name}"`, "success");
    setEditModalClient(null);
  };

  const handleDeleteClient = async (client) => {
    const confirmed = await showConfirmDialog({
      title: `Delete Client "${client.name}"?`,
      text: "This action will remove the client account and unassign their active property due diligence portfolios.",
      confirmButtonText: "Yes, Delete Account",
      cancelButtonText: "Keep Client",
      icon: "warning",
    });

    if (confirmed) {
      setClients((prev) => prev.filter((c) => c.id !== client.id));
      showToast(`Removed client account "${client.name}"`, "info");
    }
  };

  const handleAssignPropertySubmit = (e) => {
    e.preventDefault();
    if (!assignPropModalClient) return;

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === assignPropModalClient.id) {
          const updatedProps = Array.from(new Set([...c.assignedProperties, selectedPropToAssign]));
          return { ...c, assignedProperties: updatedProps };
        }
        return c;
      })
    );

    showSuccessAlert("Property Assigned", `Assigned "${selectedPropToAssign}" to ${assignPropModalClient.name}.`);
    setAssignPropModalClient(null);
  };

  const handleOpenGenerateReport = (client) => {
    const propId = client.assignedProperties[0]?.split(" ")[0]?.replace(/\D/g, "") || "1001";
    setSelectedReportPropId(propId);
    setReportModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-purple-500 dark:text-purple-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Client Account Roster
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs border border-purple-200 dark:border-purple-800">
            TOTAL CLIENTS: {clients.length}
          </span>
        </div>

        {/* HERO WORKSTATION BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-mono font-bold mb-2">
              <Users size={14} /> Institutional Client Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              👔 Client Accounts & Portfolios
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Manage real estate institutional clients, assign due diligence land parcels, track audit statuses, and issue verified reports.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={handleOpenCreateModal} variant="primary" size="sm" icon={UserPlus}>
              Add Client Account
            </Button>
          </div>
        </div>

        {/* SEARCH, FILTER, SORT & VIEW MODE CONTROLS */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients by Name, Contact Person, Email or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <Filter size={14} className="text-purple-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active Audit">Active Audit</option>
                <option value="Under Review">Under Review</option>
                <option value="Signoff Ready">Signoff Ready</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-xl">
              <ArrowUpDown size={14} className="text-blue-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
              >
                <option value="NAME_ASC">Sort: Name (A - Z)</option>
                <option value="NAME_DESC">Sort: Name (Z - A)</option>
                <option value="MOST_PROPERTIES">Sort: Most Properties</option>
              </select>
            </div>

            {/* View Mode Switcher: Cards vs Table */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#334155]">
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "card" ? "bg-white dark:bg-[#1E293B] text-purple-600 dark:text-purple-400 shadow-xs" : "text-slate-400"
                }`}
                title="Cards View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "table" ? "bg-white dark:bg-[#1E293B] text-purple-600 dark:text-purple-400 shadow-xs" : "text-slate-400"
                }`}
                title="Table View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* CLIENT CARDS GRID OR TABLE VIEW */}
        {processedClients.length === 0 ? (
          <EmptyState title="No clients found" message="No client account matches your search query or filter selection." />
        ) : viewMode === "card" ? (
          /* CARD GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedClients.map((client) => (
              <motion.div
                key={client.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Client Info Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                        <Building2 size={22} />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
                          {client.id}
                        </span>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight truncate">
                          {client.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                          Contact: {client.contactPerson}
                        </p>
                      </div>
                    </div>

                    <Badge variant={client.status === "Active Audit" ? "success" : client.status === "Under Review" ? "warning" : "info"}>
                      {client.status}
                    </Badge>
                  </div>

                  {/* Contact Info (Phone & Email) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] space-y-1.5 text-xs font-mono">
                    <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                      <Mail size={13} className="text-blue-500 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                      <Phone size={13} className="text-emerald-500 shrink-0" />
                      <span>{client.phone}</span>
                    </p>
                  </div>

                  {/* Assigned Properties Badge List */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 size={12} className="text-purple-500" /> Assigned Properties ({client.assignedProperties.length})
                    </span>
                    <div className="space-y-1">
                      {client.assignedProperties.map((prop, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 text-[11px] font-semibold truncate"
                        >
                          🏢 {prop}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* THE 5 REQUIRED ACTION BUTTONS */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* 1. View Profile */}
                    <button
                      onClick={() => navigate(`/agent/client-profile?id=${client.id || "CLT-501"}`)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      title="1. View Profile"
                    >
                      <Eye size={15} />
                    </button>

                    {/* 2. Assign Property */}
                    <button
                      onClick={() => setAssignPropModalClient(client)}
                      className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer"
                      title="2. Assign Property"
                    >
                      <Building2 size={15} />
                    </button>

                    {/* 3. Generate Report */}
                    <button
                      onClick={() => handleOpenGenerateReport(client)}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                      title="3. Generate Report"
                    >
                      <FileDown size={15} />
                    </button>

                    {/* 4. Edit Client */}
                    <button
                      onClick={() => handleOpenEditModal(client)}
                      className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 transition-colors cursor-pointer"
                      title="4. Edit Client"
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>

                  {/* 5. Delete Client */}
                  <button
                    onClick={() => handleDeleteClient(client)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white transition-colors cursor-pointer"
                    title="5. Delete Client"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW MODE */
          <div className="white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-[#334155] text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="p-4">Client Name & Organization</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Assigned Properties</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions (5 Buttons)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                {processedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 dark:hover:bg-[#0F172A]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">{client.id}</span>
                          <strong className="font-extrabold text-slate-900 dark:text-white text-xs">{client.name}</strong>
                          <span className="text-[10px] text-slate-400 block">Contact: {client.contactPerson}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Mail size={12} className="text-blue-500" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Phone size={12} className="text-emerald-500" />
                        <span>{client.phone}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {client.assignedProperties.length} Properties
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block max-w-xs">
                        {client.assignedProperties.join(", ")}
                      </span>
                    </td>

                    <td className="p-4">
                      <Badge variant={client.status === "Active Audit" ? "success" : client.status === "Under Review" ? "warning" : "info"}>
                        {client.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setViewProfileModalClient(client)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300" title="1. View Profile"><Eye size={14} /></button>
                        <button onClick={() => setAssignPropModalClient(client)} className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600" title="2. Assign Property"><Building2 size={14} /></button>
                        <button onClick={() => handleOpenGenerateReport(client)} className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600" title="3. Generate Report"><FileDown size={14} /></button>
                        <button onClick={() => handleOpenEditModal(client)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600" title="4. Edit Client"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteClient(client)} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 hover:bg-rose-600 hover:text-white" title="5. Delete Client"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL 1: VIEW PROFILE MODAL */}
        <AnimatePresence>
          {viewProfileModalClient && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewProfileModalClient(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-lg w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{viewProfileModalClient.name}</h2>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-mono">{viewProfileModalClient.id} • {viewProfileModalClient.tier}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewProfileModalClient(null)} className="p-2 text-slate-400 hover:text-white"><X size={18} /></button>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-400 uppercase font-bold">Client Contact Dossier</p>
                    <p className="text-slate-800 dark:text-slate-200 font-extrabold">Lead Contact: {viewProfileModalClient.contactPerson}</p>
                    <p className="text-slate-600 dark:text-slate-300">Email: {viewProfileModalClient.email}</p>
                    <p className="text-slate-600 dark:text-slate-300">Phone: {viewProfileModalClient.phone}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 space-y-2">
                    <p className="text-purple-900 dark:text-purple-300 font-extrabold uppercase">Assigned Property Portfolios</p>
                    {viewProfileModalClient.assignedProperties.map((p, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-purple-200 dark:border-purple-800 text-slate-800 dark:text-slate-200 font-bold">
                        🏢 {p}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end">
                  <Button onClick={() => setViewProfileModalClient(null)} variant="secondary" size="sm">Close Profile</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: ASSIGN PROPERTY MODAL */}
        <AnimatePresence>
          {assignPropModalClient && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssignPropModalClient(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 size={20} className="text-purple-600" /> Assign Property Parcel
                  </h2>
                  <button onClick={() => setAssignPropModalClient(null)} className="p-2 text-slate-400 hover:text-white"><X size={18} /></button>
                </div>

                <form onSubmit={handleAssignPropertySubmit} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Assigning new parcel to <strong className="text-purple-600">{assignPropModalClient.name}</strong></p>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Select Property Parcel:</label>
                    <select value={selectedPropToAssign} onChange={(e) => setSelectedPropToAssign(e.target.value)} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                      <option value="PR-1001 (Gachibowli Tech Park Phase 2)">PR-1001 • Gachibowli Tech Park Phase 2 (₹45 Cr)</option>
                      <option value="PR-1002 (Jubilee Hills Commercial Plot 36)">PR-1002 • Jubilee Hills Commercial Plot 36 (₹28.5 Cr)</option>
                      <option value="PR-1003 (Whitefield Horizon Tech Campus)">PR-1003 • Whitefield Horizon Tech Campus (₹38 Cr)</option>
                      <option value="PR-1004 (Financial District Commercial Plot)">PR-1004 • Financial District Commercial Plot (₹32 Cr)</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setAssignPropModalClient(null)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">Assign Parcel</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 3 & 4: CREATE / EDIT CLIENT MODAL */}
        <AnimatePresence>
          {(createModalOpen || editModalClient) && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setCreateModalOpen(false); setEditModalClient(null); }} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus size={20} className="text-purple-600" /> {editModalClient ? "Edit Client Account" : "Register Client Account"}
                  </h2>
                  <button onClick={() => { setCreateModalOpen(false); setEditModalClient(null); }} className="p-2 text-slate-400 hover:text-white"><X size={18} /></button>
                </div>

                <form onSubmit={editModalClient ? handleSaveEditClient : handleSaveCreateClient} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Organization Name *</label>
                    <input type="text" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Lead Contact Person</label>
                    <input type="text" value={clientForm.contactPerson} onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Corporate Email *</label>
                    <input type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Phone Number</label>
                    <input type="text" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Audit Status</label>
                    <select value={clientForm.status} onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold">
                      <option value="Active Audit">Active Audit</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Signoff Ready">Signoff Ready</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => { setCreateModalOpen(false); setEditModalClient(null); }} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" icon={Save}>{editModalClient ? "Save Changes" : "Register Client"}</Button>
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

export default AgentClients;
