import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  Archive,
  Trash2,
  FileSpreadsheet,
  MapPin,
  User,
  Shield,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Check,
  PlusCircle,
  Download,
  Key,
} from "lucide-react";
import { showSuccessAlert, showToast, showConfirmDialog } from "../utils/swal";
import { MASTER_MOCK_PROPERTIES } from "../data/mockPropertyData";
import { exportToPdf } from "../utils/exportUtils";

// Extended Mock Properties Dataset with Owner & Assigned Agent
const INITIAL_PROPERTIES = MASTER_MOCK_PROPERTIES.slice(0, 10).map((prop, idx) => {
  const owners = [
    "Adani Realty Institutional Fund",
    "DLF Commercial Developers Ltd",
    "Prestige Estates Projects Ltd",
    "Sobha Developers Commercial",
    "Brigade Group Commercial Fund",
    "Godrej Properties Ltd",
  ];
  const agents = [
    "Ananya Rao",
    "Priya Sundaram",
    "Karan Johar Realty",
    "Vikram Malhotra",
    "Suresh Reddy",
  ];
  const statuses = ["Verified Clear", "Pending Audit", "High Risk Flagged", "Archived"];

  return {
    ...prop,
    owner: prop.ownerName || owners[idx % owners.length],
    assignedAgent: agents[idx % agents.length],
    status: statuses[idx % 3], // Default active statuses
    riskScoreNum: prop.riskScore || (idx % 2 === 0 ? 14 : idx % 3 === 0 ? 68 : 28),
  };
});

function PropertyManagement() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("propertyName");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal Control States
  const [editPropertyModal, setEditPropertyModal] = useState(null);
  const [viewPropertyModal, setViewPropertyModal] = useState(null);

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (p.propertyName || "").toLowerCase().includes(q) ||
        (p.address || "").toLowerCase().includes(q) ||
        (p.owner || "").toLowerCase().includes(q) ||
        (p.assignedAgent || "").toLowerCase().includes(q) ||
        (p.apnNumber || "").toLowerCase().includes(q);

      const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
      
      let matchesRisk = true;
      if (selectedRiskFilter === "LOW") matchesRisk = p.riskScoreNum < 25;
      else if (selectedRiskFilter === "MEDIUM") matchesRisk = p.riskScoreNum >= 25 && p.riskScoreNum <= 50;
      else if (selectedRiskFilter === "HIGH") matchesRisk = p.riskScoreNum > 50;

      return matchesSearch && matchesStatus && matchesRisk;
    }).sort((a, b) => {
      if (sortBy === "riskScore") return a.riskScoreNum - b.riskScoreNum;
      if (sortBy === "valuation") return (b.priceInr || 0) - (a.priceInr || 0);
      return (a.propertyName || "").localeCompare(b.propertyName || "");
    });
  }, [properties, searchQuery, selectedStatus, selectedRiskFilter, sortBy]);

  // Pagination Math
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  // Action Handlers
  const handleArchiveProperty = (prop) => {
    const isArchived = prop.status === "Archived";
    const nextStatus = isArchived ? "Verified Clear" : "Archived";
    setProperties((prev) =>
      prev.map((p) => (p.propertyId === prop.propertyId ? { ...p, status: nextStatus } : p))
    );
    showToast(
      `Property '${prop.propertyName}' ${isArchived ? "unarchived" : "archived"}.`,
      "info"
    );
  };

  const handleDeleteProperty = async (prop) => {
    const confirmed = await showConfirmDialog(
      "Delete Property Parcel?",
      `Are you sure you want to permanently delete '${prop.propertyName}' (${prop.apnNumber || prop.id})?`,
      "Delete Parcel",
      "Cancel"
    );
    if (confirmed) {
      setProperties((prev) => prev.filter((p) => p.propertyId !== prop.propertyId));
      showToast(`Property '${prop.propertyName}' deleted successfully`, "success");
    }
  };

  const handleGenerateReport = (prop) => {
    exportToPdf(`Due_Diligence_Audit_${prop.propertyId}`, prop);
    showSuccessAlert(
      "Audit Dossier Exported",
      `13-vector due diligence audit PDF generated for ${prop.propertyName}.`
    );
  };

  const handleSaveEditProperty = (e) => {
    e.preventDefault();
    setProperties((prev) =>
      prev.map((p) => (p.propertyId === editPropertyModal.propertyId ? { ...editPropertyModal } : p))
    );
    setEditPropertyModal(null);
    showSuccessAlert("Property Updated", `Listing details saved for ${editPropertyModal.propertyName}.`);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* HEADER BAR */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold mb-2">
              <Building2 size={14} /> Collateral Parcel Management Registry
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Property Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Audit, view details, edit, archive, and generate 13-vector due diligence audit dossiers for commercial & residential parcels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              {properties.length} PARCELS AUDITED
            </span>
          </div>
        </div>

        {/* SEARCH, SORT & FILTERS BAR */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* SEARCH */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by Parcel Name, Address, Owner, Agent, or APN..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
              />
            </div>

            {/* STATUS FILTER */}
            <div className="lg:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Audit Statuses</option>
                <option value="Verified Clear">Verified Clear</option>
                <option value="Pending Audit">Pending Audit</option>
                <option value="High Risk Flagged">High Risk Flagged</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* RISK LEVEL FILTER */}
            <div className="lg:col-span-2">
              <select
                value={selectedRiskFilter}
                onChange={(e) => {
                  setSelectedRiskFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Risk Vector Levels</option>
                <option value="LOW">Low Risk (&lt; 25)</option>
                <option value="MEDIUM">Moderate Risk (25-50)</option>
                <option value="HIGH">High Risk (&gt; 50)</option>
              </select>
            </div>

            {/* SORT */}
            <div className="lg:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-medium cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="propertyName">Sort: Parcel Name</option>
                <option value="riskScore">Sort: Risk Score</option>
                <option value="valuation">Sort: Valuation (INR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* PROPERTY CARDS GRID LAYOUT */}
        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProperties.map((prop) => {
              const isHighRisk = prop.riskScoreNum > 50;
              const isArchived = prop.status === "Archived";

              return (
                <motion.div
                  key={prop.propertyId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`white-card rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                    isArchived ? "opacity-60 grayscale" : ""
                  }`}
                >
                  {/* CARD IMAGE & OVERLAY BADGES */}
                  <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={prop.image || prop.imageUrl}
                      alt={prop.propertyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${
                          isHighRisk
                            ? "bg-rose-500/90 text-white border-rose-400"
                            : "bg-emerald-500/90 text-white border-emerald-400"
                        }`}
                      >
                        Risk Score: {prop.riskScoreNum} / 100
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <Badge variant={isArchived ? "secondary" : "success"}>
                        {prop.status}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl text-white flex items-center justify-between text-[11px] font-bold">
                      <span className="truncate">{prop.formattedPrice || `₹ ${((prop.priceInr || 15000000) / 10000000).toFixed(2)} Cr`}</span>
                      <span className="text-blue-300 font-mono text-[10px]">{prop.apnNumber || `APN-${prop.propertyId}`}</span>
                    </div>
                  </div>

                  {/* PROPERTY CARD CONTENT (ALL 7 REQUIRED DISPLAY FIELDS) */}
                  <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                        {prop.propertyName}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5 line-clamp-1">
                        <MapPin size={13} className="text-rose-500 shrink-0" />
                        {prop.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#334155] text-xs">
                      <div className="bg-slate-50 dark:bg-[#0F172A] p-2.5 rounded-2xl border border-slate-200/60 dark:border-[#334155]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Owner</span>
                        <strong className="text-slate-900 dark:text-white truncate block">{prop.owner}</strong>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#0F172A] p-2.5 rounded-2xl border border-slate-200/60 dark:border-[#334155]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Agent</span>
                        <strong className="text-blue-600 dark:text-cyan-400 truncate block">{prop.assignedAgent}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 5 REQUIRED ACTION BUTTONS FOOTER */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0F172A] border-t border-slate-100 dark:border-[#334155] flex items-center justify-between gap-1.5 flex-wrap">
                    {/* 1. VIEW DETAILS */}
                    <button
                      onClick={() => navigate(`/property-details?id=${prop.propertyId}`)}
                      className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                      title="View Property Details"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>

                    {/* 2. EDIT */}
                    <button
                      onClick={() => setEditPropertyModal({ ...prop })}
                      className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Edit Property Listing"
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>

                    {/* 3. ARCHIVE */}
                    <button
                      onClick={() => handleArchiveProperty(prop)}
                      className={`p-2 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                        isArchived
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200"
                      }`}
                      title={isArchived ? "Unarchive Listing" : "Archive Listing"}
                    >
                      <Archive size={13} />
                      <span>{isArchived ? "Restore" : "Archive"}</span>
                    </button>

                    {/* 4. GENERATE REPORT */}
                    <button
                      onClick={() => handleGenerateReport(prop)}
                      className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Generate Audit Dossier PDF"
                    >
                      <FileSpreadsheet size={13} />
                      <span>Report</span>
                    </button>

                    {/* 5. DELETE */}
                    <button
                      onClick={() => handleDeleteProperty(prop)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Delete Parcel Listing"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="white-card rounded-3xl p-12 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs text-center">
            <EmptyState
              title="No Property Parcels Found"
              description="No property listings match your current search query or risk filter criteria."
            />
          </div>
        )}

        {/* PAGINATION BAR */}
        <div className="white-card rounded-3xl p-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex items-center justify-between gap-4 font-mono text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{paginatedProperties.length}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white">{filteredProperties.length}</strong> property parcels (Page {currentPage} of {totalPages})
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1 font-bold"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1 font-bold"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* MODAL: EDIT PROPERTY */}
        <AnimatePresence>
          {editPropertyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono text-xs">
              <motion.form
                onSubmit={handleSaveEditProperty}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit size={18} className="text-amber-500" /> Edit Property Listing ({editPropertyModal.apnNumber})
                  </h3>
                  <button type="button" onClick={() => setEditPropertyModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Property Name</label>
                    <input type="text" value={editPropertyModal.propertyName} onChange={(e) => setEditPropertyModal({ ...editPropertyModal, propertyName: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <input type="text" value={editPropertyModal.address} onChange={(e) => setEditPropertyModal({ ...editPropertyModal, address: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Owner</label>
                      <input type="text" value={editPropertyModal.owner} onChange={(e) => setEditPropertyModal({ ...editPropertyModal, owner: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Agent</label>
                      <input type="text" value={editPropertyModal.assignedAgent} onChange={(e) => setEditPropertyModal({ ...editPropertyModal, assignedAgent: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Risk Score (0-100)</label>
                      <input type="number" value={editPropertyModal.riskScoreNum} onChange={(e) => setEditPropertyModal({ ...editPropertyModal, riskScoreNum: parseInt(e.target.value) || 0 })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Audit Status</label>
                      <select value={editPropertyModal.status} onChange={(e) => setEditPropertyModal({ ...editPropertyModal, status: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold">
                        <option value="Verified Clear">Verified Clear</option>
                        <option value="Pending Audit">Pending Audit</option>
                        <option value="High Risk Flagged">High Risk Flagged</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditPropertyModal(null)} className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2 px-4 rounded-xl bg-blue-600 text-white font-bold cursor-pointer">Save Changes</button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default PropertyManagement;
