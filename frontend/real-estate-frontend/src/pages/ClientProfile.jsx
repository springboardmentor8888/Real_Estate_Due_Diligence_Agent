import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Users,
  Edit3,
  PlusCircle,
  FileDown,
  MessageSquare,
  Home,
  ChevronRight,
  ShieldCheck,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  Send,
  UserCheck,
  DollarSign,
  Eye,
  Sparkles,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import { showToast, showSuccessAlert } from "../utils/swal";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";

// Master Initial Mock Client Dossiers
const MASTER_CLIENT_DOSSIERS = [
  {
    id: "CLT-501",
    name: "Adani Realty Institutional Fund",
    contactPerson: "Vikram Adani (VP Acquisitions)",
    phone: "+91 98765 43210",
    email: "acquisitions@adanirealty.com",
    address: "Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat - 382421",
    status: "Active Corporate Client",
    totalInvestment: "₹ 350.00 Cr",
    notes: "Focused on acquiring Grade-A IT/ITES commercial land parcels in Financial District & HITEC City with clear 30-year title deeds.",
    assignedProperties: [
      {
        id: "PR-1001",
        numericId: "1001",
        name: "Gachibowli Tech Park Phase 2",
        address: "Plot 45, Financial District, Gachibowli, Hyderabad",
        price: "₹ 45.00 Cr",
        riskScore: 14,
        status: "Verified Clear Title",
      },
      {
        id: "PR-1004",
        numericId: "1004",
        name: "Financial District Commercial Plot",
        address: "Nanakramguda, Financial District, Hyderabad",
        price: "₹ 32.00 Cr",
        riskScore: 22,
        status: "Verified Clear Title",
      },
    ],
    reportsGenerated: [
      {
        reportId: "REP-2026-101",
        title: "13-Vector Level 4 Audit Certificate - PR-1001",
        date: "04 Aug 2026",
        status: "Verified Clear Title",
        riskScore: 14,
      },
      {
        reportId: "REP-2026-104",
        title: "Municipal Tax & Lien Clearance Report - PR-1004",
        date: "01 Aug 2026",
        status: "Verified Clear Title",
        riskScore: 22,
      },
    ],
    meetingHistory: [
      {
        id: "MTG-1",
        date: "04 Aug 2026",
        time: "11:30 AM",
        title: "Portfolio Diligence Review Call",
        type: "Zoom Video Call",
        notes: "Reviewed 13-vector due diligence audit certificate for Gachibowli Tech Park.",
      },
      {
        id: "MTG-2",
        date: "28 Jul 2026",
        time: "02:30 PM",
        title: "Site Inspection & Parcel Boundary Walkthrough",
        type: "On-Site Visit",
        notes: "Inspected physical boundary survey markers at Financial District plot.",
      },
    ],
  },

  {
    id: "CLT-502",
    name: "DLF Cybercity Portfolio",
    contactPerson: "Ananya Sharma (Director Legal)",
    phone: "+91 98123 45678",
    email: "legal.diligence@dlfcybercity.com",
    address: "DLF Gateway Tower, Cyber City, Phase 2, Gurugram, Haryana - 122002",
    status: "Active Corporate Client",
    totalInvestment: "₹ 280.00 Cr",
    notes: "Mandate for commercial land acquisitions in Jubilee Hills & Kokapet. Requires strict HMDA zoning NOC clearance.",
    assignedProperties: [
      {
        id: "PR-1002",
        numericId: "1002",
        name: "Jubilee Hills Commercial Plot 36",
        address: "Road No. 36, Jubilee Hills, Hyderabad",
        price: "₹ 28.50 Cr",
        riskScore: 68,
        status: "Encumbrance Alert Flagged",
      },
    ],
    reportsGenerated: [
      {
        reportId: "REP-2026-102",
        title: "Encumbrance & Tax Lien Risk Report - PR-1002",
        date: "03 Aug 2026",
        status: "Encumbrance Alert Flagged",
        riskScore: 68,
      },
    ],
    meetingHistory: [
      {
        id: "MTG-3",
        date: "03 Aug 2026",
        time: "03:00 PM",
        title: "Encumbrance Remediation Legal Conference",
        type: "In-Person Meeting",
        notes: "Discussed Sub-Registrar deed litigation suit #402/2024 remediation steps.",
      },
    ],
  },
];

function ClientProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientId = searchParams.get("id") || "CLT-501";

  // Selected Client Dossier
  const [clientData, setClientData] = useState(() => {
    return MASTER_CLIENT_DOSSIERS.find((c) => c.id === clientId) || MASTER_CLIENT_DOSSIERS[0];
  });

  // Active Sub-Tab: 'properties', 'reports', 'meetings', 'notes'
  const [activeTab, setActiveTab] = useState("properties");

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignPropertyModalOpen, setAssignPropertyModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: clientData.name,
    contactPerson: clientData.contactPerson,
    phone: clientData.phone,
    email: clientData.email,
    address: clientData.address,
    notes: clientData.notes,
  });

  // Assign Property Form State
  const [newAssignPropName, setNewAssignPropName] = useState("Whitefield Horizon Tech Campus (PR-1003)");

  // Contact Form State
  const [contactMessage, setContactMessage] = useState("");

  // Handlers
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setClientData((prev) => ({ ...prev, ...editForm }));
    showSuccessAlert("Profile Updated", `Updated client profile for ${editForm.name}.`);
    setEditModalOpen(false);
  };

  const handleSaveAssignProperty = (e) => {
    e.preventDefault();
    const assigned = {
      id: `PR-${Math.floor(1000 + Math.random() * 9000)}`,
      numericId: "1003",
      name: newAssignPropName,
      address: "EPIP Zone, Phase 2, Whitefield, Bengaluru",
      price: "₹ 38.00 Cr",
      riskScore: 18,
      status: "Verified Clear Title",
    };

    setClientData((prev) => ({
      ...prev,
      assignedProperties: [assigned, ...prev.assignedProperties],
    }));

    showSuccessAlert("Property Assigned", `Assigned ${newAssignPropName} to ${clientData.name}.`);
    setAssignPropertyModalOpen(false);
  };

  const handleSendContactSubmit = (e) => {
    e.preventDefault();
    showSuccessAlert("Message Sent", `Sent dispatch to ${clientData.contactPerson} (${clientData.email}).`);
    setContactModalOpen(false);
    setContactMessage("");
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-purple-500 dark:text-purple-400" />
            <span>/</span>
            <Link to="/agent/clients" className="hover:text-purple-600 transition-colors">
              Client Management
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              {clientData.name}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs border border-purple-200 dark:border-purple-800">
            {clientData.id} • {clientData.status}
          </span>
        </div>

        {/* HERO CLIENT PROFILE HEADER CARD & THE 4 REQUIRED ACTION BUTTONS */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Sleek Corporate Building Badge (No photo avatars per user directive) */}
              <div className="p-4 rounded-3xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                <Building2 size={36} />
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                  <span className="text-purple-600 dark:text-purple-400">{clientData.id}</span>
                  <span>•</span>
                  <Badge variant="success">{clientData.status}</Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {clientData.name}
                </h1>

                <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-300 font-bold">
                  Contact Person: <span className="text-slate-900 dark:text-white">{clientData.contactPerson}</span>
                </p>
              </div>
            </div>

            {/* THE 4 REQUIRED ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* 1. Edit */}
              <Button onClick={() => setEditModalOpen(true)} variant="secondary" size="sm" icon={Edit3}>
                Edit
              </Button>

              {/* 2. Assign Property */}
              <Button onClick={() => setAssignPropertyModalOpen(true)} variant="primary" size="sm" icon={PlusCircle}>
                Assign Property
              </Button>

              {/* 3. Generate Report */}
              <Button onClick={() => setReportModalOpen(true)} variant="outline" size="sm" icon={FileText}>
                Generate Report
              </Button>

              {/* 4. Contact Client */}
              <Button onClick={() => setContactModalOpen(false)} variant="secondary" size="sm" icon={MessageSquare} onClick={() => setContactModalOpen(true)}>
                Contact Client
              </Button>
            </div>
          </div>

          {/* CONTACT INFO GRID (Phone, Email, Address) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-[#334155] text-xs font-mono">
            {/* Phone */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center gap-3">
              <Phone size={18} className="text-blue-500 shrink-0" />
              <div>
                <span className="text-slate-400 uppercase text-[10px] block font-bold">Corporate Phone</span>
                <strong className="text-slate-900 dark:text-white font-extrabold">{clientData.phone}</strong>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center gap-3">
              <Mail size={18} className="text-purple-500 shrink-0" />
              <div>
                <span className="text-slate-400 uppercase text-[10px] block font-bold">Email Address</span>
                <strong className="text-slate-900 dark:text-white font-extrabold truncate block">{clientData.email}</strong>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex items-center gap-3">
              <MapPin size={18} className="text-emerald-500 shrink-0" />
              <div>
                <span className="text-slate-400 uppercase text-[10px] block font-bold">Corporate HQ Address</span>
                <strong className="text-slate-900 dark:text-white font-extrabold truncate block">{clientData.address}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION TABS (Assigned Properties, Reports Generated, Meeting History, Notes) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs font-mono font-bold">
          {[
            { id: "properties", label: `Assigned Properties (${clientData.assignedProperties.length})`, icon: Building2 },
            { id: "reports", label: `Reports Generated (${clientData.reportsGenerated.length})`, icon: FileText },
            { id: "meetings", label: `Meeting History (${clientData.meetingHistory.length})`, icon: Clock },
            { id: "notes", label: "Client Notes & Mandate", icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  active
                    ? "bg-white dark:bg-[#0F172A] text-purple-600 dark:text-purple-300 shadow-sm border border-slate-200 dark:border-[#334155]"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="space-y-6">
          {/* TAB 1: ASSIGNED PROPERTIES */}
          {activeTab === "properties" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {clientData.assignedProperties.map((prop) => (
                <motion.div
                  key={prop.id}
                  whileHover={{ y: -2 }}
                  className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">{prop.id}</span>
                    <Badge variant={prop.riskScore > 50 ? "danger" : "success"}>
                      {prop.status} ({prop.riskScore}/100)
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">{prop.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin size={13} className="text-blue-500 shrink-0" />
                      <span>{prop.address}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px]">Market Valuation</span>
                      <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-sm block">{prop.price}</strong>
                    </div>

                    <Link to={`/property-details?id=${prop.numericId}`} className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1 border border-purple-200 dark:border-purple-800 transition-colors">
                      <Eye size={14} /> View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* TAB 2: REPORTS GENERATED */}
          {activeTab === "reports" && (
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 font-mono text-xs">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-purple-500" /> Due Diligence Audit Reports Issued
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-[#334155]">
                {clientData.reportsGenerated.map((rep) => (
                  <div key={rep.reportId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">{rep.reportId} • Issued {rep.date}</span>
                      <strong className="text-slate-900 dark:text-white font-extrabold text-sm block">{rep.title}</strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="success">{rep.status}</Badge>
                      <Button onClick={() => setReportModalOpen(true)} variant="outline" size="sm" icon={FileDown}>
                        PDF Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEETING HISTORY */}
          {activeTab === "meetings" && (
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 font-mono text-xs">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> Diligence Strategy Meeting History
              </h3>

              <div className="space-y-3">
                {clientData.meetingHistory.map((mtg) => (
                  <div key={mtg.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">{mtg.date} at {mtg.time} • {mtg.type}</span>
                      <span className="text-slate-400">{mtg.id}</span>
                    </div>
                    <strong className="text-slate-900 dark:text-white font-extrabold text-sm block">{mtg.title}</strong>
                    <p className="text-slate-600 dark:text-slate-300">{mtg.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NOTES */}
          {activeTab === "notes" && (
            <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4 font-mono text-xs">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-500" /> Client Due Diligence Notes & Investment Mandate
              </h3>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{clientData.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* MODAL 1: EDIT CLIENT MODAL */}
        <AnimatePresence>
          {editModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit3 size={20} className="text-purple-500" /> Edit Client Profile
                  </h2>
                  <button onClick={() => setEditModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Organization Name *</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Contact Person</label>
                    <input type="text" value={editForm.contactPerson} onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Phone</label>
                    <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Email Address</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Corporate Address</label>
                    <textarea rows={2} value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setEditModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">Save Profile</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: ASSIGN PROPERTY MODAL */}
        <AnimatePresence>
          {assignPropertyModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssignPropertyModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle size={20} className="text-[#3B82F6]" /> Assign Property Parcel
                  </h2>
                  <button onClick={() => setAssignPropertyModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleSaveAssignProperty} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Assign land or commercial parcel to <strong className="text-purple-600">{clientData.name}</strong></p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Select Available Parcel *</label>
                    <select value={newAssignPropName} onChange={(e) => setNewAssignPropName(e.target.value)} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                      <option value="Whitefield Horizon Tech Campus (PR-1003)">Whitefield Horizon Tech Campus (PR-1003)</option>
                      <option value="BKC Prime Commercial Hub (PR-1005)">BKC Prime Commercial Hub (PR-1005)</option>
                      <option value="Kokapet SEZ Commercial Land (PR-1006)">Kokapet SEZ Commercial Land (PR-1006)</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setAssignPropertyModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">Assign Parcel</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 4: CONTACT CLIENT MODAL */}
        <AnimatePresence>
          {contactModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setContactModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare size={20} className="text-purple-500" /> Contact Client
                  </h2>
                  <button onClick={() => setContactModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleSendContactSubmit} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Dispatch message to <strong className="text-purple-600">{clientData.contactPerson}</strong> ({clientData.email})</p>

                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Message Content *</label>
                    <textarea rows={4} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Type due diligence update or inquiry..." required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setContactModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" icon={Send}>Send Message</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* REPORT GENERATOR MODAL */}
        <ReportGeneratorModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} initialPropertyId="1001" />
      </div>
    </MainLayout>
  );
}

export default ClientProfile;
