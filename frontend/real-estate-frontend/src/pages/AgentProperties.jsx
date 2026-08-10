import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  PlusCircle,
  Home,
  Filter,
  ArrowUpDown,
  X,
  Save,
  UserPlus,
  ShieldCheck,
  MapPin,
  Tag,
  User,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import AgentPropertyCard from "../components/property/AgentPropertyCard";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";
import { getLiveProperties } from "../services/liveStore";
import { showSuccessAlert, showToast } from "../utils/swal";
import { UNIQUE_PROPERTY_IMAGES } from "../data/mockPropertyData";

// Helper: Extract numeric value safely without crashing on numbers or missing strings
const getNumericMarketValue = (prop) => {
  if (!prop) return 0;
  if (typeof prop.marketValue === "number") return prop.marketValue;
  if (typeof prop.price === "number") return prop.price;
  const rawStr = String(prop.displayPrice || prop.marketValueFormatted || prop.price || prop.marketValue || "0");
  const parsed = parseFloat(rawStr.replace(/[^0-9.]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
};

// Initial Mock Agent Properties Data
const INITIAL_AGENT_PROPERTIES = [
  {
    id: "PR-1001",
    title: "Gachibowli Commercial Tech Park Phase 2",
    location: "Financial District, Nanakramguda, Hyderabad",
    owner: "Adani Realty Institutional Fund",
    price: "₹ 45.00 Cr",
    riskScore: 14,
    status: "Final Review",
    image: UNIQUE_PROPERTY_IMAGES[0],
  },
  {
    id: "PR-1002",
    title: "Jubilee Hills Commercial Plot 36",
    location: "Road No. 36, Jubilee Hills, Hyderabad",
    owner: "DLF Cybercity Portfolio",
    price: "₹ 28.50 Cr",
    riskScore: 22,
    status: "Title Search",
    image: UNIQUE_PROPERTY_IMAGES[2],
  },
  {
    id: "PR-1003",
    title: "Whitefield Horizon Tech Campus",
    location: "ITPL Main Road, Whitefield, Bengaluru",
    owner: "GMR Logistics Infrastructure",
    price: "₹ 38.00 Cr",
    riskScore: 19,
    status: "Environmental NOC",
    image: UNIQUE_PROPERTY_IMAGES[3],
  },
  {
    id: "PR-1004",
    title: "Financial District Commercial Plot",
    location: "Nanakramguda, Gachibowli, Hyderabad",
    owner: "Prestige Capital Partners",
    price: "₹ 32.00 Cr",
    riskScore: 28,
    status: "Zoning Audit",
    image: UNIQUE_PROPERTY_IMAGES[5],
  },
  {
    id: "PR-1005",
    title: "BKC Prime Commercial Hub",
    location: "Bandra Kurla Complex, Mumbai",
    owner: "Sobha Real Estate Fund",
    price: "₹ 85.00 Cr",
    riskScore: 11,
    status: "Completed",
    image: UNIQUE_PROPERTY_IMAGES[4],
  },
];

function AgentProperties() {
  const navigate = useNavigate();

  // Load properties safely from liveStore or mock fallback
  const [properties, setProperties] = useState(() => {
    try {
      const live = getLiveProperties();
      if (Array.isArray(live) && live.length > 0) return live;
    } catch (e) {}
    return INITIAL_AGENT_PROPERTIES;
  });

  // Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("VALUE_DESC");

  // Modals State
  const [viewDetailsModalProp, setViewDetailsModalProp] = useState(null);
  const [editModalProp, setEditModalProp] = useState(null);
  const [assignClientModalProp, setAssignClientModalProp] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportPropId, setSelectedReportPropId] = useState("");
  const [addPropertyModalOpen, setAddPropertyModalOpen] = useState(false);

  // Forms State
  const [editForm, setEditForm] = useState({ id: "", title: "", location: "", owner: "", price: "", status: "" });
  const [assignedClientName, setAssignedClientName] = useState("Adani Realty Institutional Fund");

  const [newPropForm, setNewPropForm] = useState({
    title: "",
    location: "",
    owner: "Adani Realty Fund",
    price: "₹ 25.00 Cr",
    status: "Title Search",
  });

  // Filtered & Sorted Properties List
  const processedProperties = useMemo(() => {
    const safeList = Array.isArray(properties) ? properties : INITIAL_AGENT_PROPERTIES;

    let list = safeList.filter((p) => {
      if (!p) return false;

      const pId = String(p.id || p.propertyId || "");
      const pName = String(p.title || p.propertyName || p.name || "");
      const pLoc = String(p.location || p.address || p.addressLine1 || "");
      const pOwner = String(p.owner || p.clientName || p.client || "");

      const matchSearch =
        pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pLoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pId.toLowerCase().includes(searchQuery.toLowerCase());

      const pStatus = p.status || p.stage || "Active Audit";
      const matchStatus = statusFilter === "ALL" || pStatus === statusFilter;

      return matchSearch && matchStatus;
    });

    if (sortBy === "VALUE_DESC") {
      list.sort((a, b) => getNumericMarketValue(b) - getNumericMarketValue(a));
    } else if (sortBy === "RISK_ASC") {
      list.sort((a, b) => (a.riskScore || 18) - (b.riskScore || 18));
    } else if (sortBy === "NAME_ASC") {
      list.sort((a, b) => (a.title || a.propertyName || a.name || "").localeCompare(b.title || b.propertyName || b.name || ""));
    }

    return list;
  }, [properties, searchQuery, statusFilter, sortBy]);

  // Handlers
  const handleViewDetails = (prop) => {
    if (!prop) return;
    const rawId = String(prop.id || prop.propertyId || "1001");
    const numericId = rawId.replace(/\D/g, "") || "1001";
    localStorage.setItem("active_property_id", numericId);
    navigate(`/property-details?id=${numericId}`, { state: { property: prop } });
  };

  const handleEditProperty = (prop) => {
    setEditForm({
      id: prop.id || `PR-${prop.propertyId || 1001}`,
      title: prop.title || prop.propertyName || prop.name || "",
      location: prop.location || prop.address || prop.addressLine1 || "",
      owner: prop.owner || prop.clientName || prop.client || "",
      price: prop.price || prop.displayPrice || prop.marketValueFormatted || "",
      status: prop.status || prop.stage || "Active Audit",
    });
    setEditModalProp(prop);
  };

  const handleSaveEditProperty = (e) => {
    e.preventDefault();
    setProperties((prev) =>
      prev.map((p) => {
        const pid = p.id || `PR-${p.propertyId}`;
        if (pid === editForm.id) {
          return { ...p, title: editForm.title, location: editForm.location, owner: editForm.owner, price: editForm.price, status: editForm.status };
        }
        return p;
      })
    );
    showToast(`Updated property details for ${editForm.title}`, "success");
    setEditModalProp(null);
  };

  const handleGenerateReport = (prop) => {
    const rawId = String(prop.id || prop.propertyId || "1001");
    const cleanId = rawId.replace(/\D/g, "") || "1001";
    setSelectedReportPropId(cleanId);
    setReportModalOpen(true);
  };

  const handleAssignClient = (prop) => {
    setAssignClientModalProp(prop);
  };

  const handleSaveAssignClient = (e) => {
    e.preventDefault();
    if (!assignClientModalProp) return;

    const pid = assignClientModalProp.id || `PR-${assignClientModalProp.propertyId}`;

    setProperties((prev) =>
      prev.map((p) => {
        const itemPid = p.id || `PR-${p.propertyId}`;
        if (itemPid === pid) {
          return { ...p, owner: assignedClientName };
        }
        return p;
      })
    );
    showSuccessAlert(
      "Client Assigned",
      `Assigned ${assignedClientName} to property ${pid}.`
    );
    setAssignClientModalProp(null);
  };

  const handleAddPropertySubmit = (e) => {
    e.preventDefault();
    if (!newPropForm.title) {
      showToast("Please enter property title", "error");
      return;
    }

    const created = {
      id: `PR-100${properties.length + 1}`,
      ...newPropForm,
      riskScore: Math.floor(Math.random() * 20) + 10,
      image: UNIQUE_PROPERTY_IMAGES[properties.length % UNIQUE_PROPERTY_IMAGES.length],
    };

    setProperties((prev) => [created, ...prev]);
    showSuccessAlert("Property Registered", `Added parcel ${created.id} to your assigned agent portfolio.`);
    setAddPropertyModalOpen(false);
    setNewPropForm({ title: "", location: "", owner: "Adani Realty Fund", price: "₹ 25.00 Cr", status: "Title Search" });
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
              Assigned Property Portfolio
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            AGENT PORTFOLIO • {properties.length} PARCELS
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <Building2 size={14} /> Assigned Land & Commercial Parcels
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              🏢 My Managed Properties
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              View and manage all real estate parcels assigned to your agent workstation, track risk scores, and execute due diligence audits.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={() => setAddPropertyModalOpen(true)} variant="primary" size="sm" icon={PlusCircle}>
              Register New Property
            </Button>
          </div>
        </div>

        {/* SEARCH, FILTER & SORT CONTROLS */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties by Parcel ID, Name, Address or Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <option value="ALL">All Audit Statuses</option>
                <option value="Final Review">Final Review</option>
                <option value="Title Search">Title Search</option>
                <option value="Environmental NOC">Environmental NOC</option>
                <option value="Zoning Audit">Zoning Audit</option>
                <option value="Completed">Completed</option>
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
                <option value="VALUE_DESC">Market Value: High to Low</option>
                <option value="RISK_ASC">Lowest Risk Score</option>
                <option value="NAME_ASC">Name (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* PROPERTY CARDS GRID */}
        {processedProperties.length === 0 ? (
          <EmptyState title="No properties found" message="No property parcel matches your search query or filter selection." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedProperties.map((prop, idx) => (
              <AgentPropertyCard
                key={prop.id || prop.propertyId || idx}
                property={prop}
                onViewDetails={handleViewDetails}
                onEditProperty={handleEditProperty}
                onGenerateReport={handleGenerateReport}
                onAssignClient={handleAssignClient}
              />
            ))}
          </div>
        )}

        {/* MODAL 1: VIEW DETAILS MODAL */}
        <AnimatePresence>
          {viewDetailsModalProp && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewDetailsModalProp(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-xl w-full space-y-6 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">ID: {viewDetailsModalProp.id || `PR-${viewDetailsModalProp.propertyId}`}</span>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{viewDetailsModalProp.title || viewDetailsModalProp.propertyName || viewDetailsModalProp.name}</h2>
                  </div>
                  <button onClick={() => setViewDetailsModalProp(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Market Valuation</span>
                      <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-base">
                        {viewDetailsModalProp.displayPrice || viewDetailsModalProp.marketValueFormatted || (typeof viewDetailsModalProp.marketValue === 'number' ? `₹ ${(viewDetailsModalProp.marketValue / 10000000).toFixed(2)} Cr` : viewDetailsModalProp.price)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Audit Status</span>
                      <Badge variant="success">{viewDetailsModalProp.status || viewDetailsModalProp.stage || "Active Audit"}</Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-400 uppercase font-bold text-[10px]">Location & Address</p>
                    <p className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                      <MapPin size={14} className="text-rose-500" />
                      <span>{viewDetailsModalProp.location || viewDetailsModalProp.address || viewDetailsModalProp.addressLine1}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1.5">
                    <p className="text-purple-900 dark:text-purple-300 font-bold uppercase text-[10px]">Assigned Client / Owner</p>
                    <p className="text-slate-900 dark:text-white font-extrabold text-sm">{viewDetailsModalProp.owner || viewDetailsModalProp.clientName || "Adani Realty Fund"}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                  <Button onClick={() => setViewDetailsModalProp(null)} variant="secondary" size="sm">Close</Button>
                  <Button onClick={() => { const id = viewDetailsModalProp.id || `PR-${viewDetailsModalProp.propertyId}`; setViewDetailsModalProp(null); navigate(`/property-search?id=${id}`); }} variant="primary" size="sm">Full GIS Page</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 2: EDIT PROPERTY MODAL */}
        <AnimatePresence>
          {editModalProp && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModalProp(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Edit Property Parcel ({editForm.id})</h2>
                  <button onClick={() => setEditModalProp(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleSaveEditProperty} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Property Name *</label>
                    <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Address / Location</label>
                    <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Market Value</label>
                    <input type="text" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Audit Status</label>
                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold">
                      <option value="Final Review">Final Review</option>
                      <option value="Title Search">Title Search</option>
                      <option value="Environmental NOC">Environmental NOC</option>
                      <option value="Zoning Audit">Zoning Audit</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setEditModalProp(null)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm" icon={Save}>Save Changes</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 3: ASSIGN CLIENT MODAL */}
        <AnimatePresence>
          {assignClientModalProp && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssignClientModalProp(null)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus size={20} className="text-purple-600" /> Assign Client to Parcel
                  </h2>
                  <button onClick={() => setAssignClientModalProp(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleSaveAssignClient} className="space-y-4 text-xs font-mono">
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Assigning client owner to <strong className="text-blue-600">{assignClientModalProp.title || assignClientModalProp.propertyName || assignClientModalProp.name}</strong></p>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Select Client Organization:</label>
                    <select value={assignedClientName} onChange={(e) => setAssignedClientName(e.target.value)} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold focus:outline-none">
                      <option value="Adani Realty Institutional Fund">Adani Realty Institutional Fund</option>
                      <option value="DLF Cybercity Portfolio">DLF Cybercity Portfolio</option>
                      <option value="GMR Logistics Infrastructure">GMR Logistics Infrastructure</option>
                      <option value="Prestige Capital Partners">Prestige Capital Partners</option>
                      <option value="Sobha Real Estate Fund">Sobha Real Estate Fund</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setAssignClientModalProp(null)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">Confirm Assignment</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL 4: ADD PROPERTY MODAL */}
        <AnimatePresence>
          {addPropertyModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddPropertyModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle size={20} className="text-blue-500" /> Register Property Parcel
                  </h2>
                  <button onClick={() => setAddPropertyModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <form onSubmit={handleAddPropertySubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Property Title *</label>
                    <input type="text" value={newPropForm.title} onChange={(e) => setNewPropForm({ ...newPropForm, title: e.target.value })} placeholder="E.g. Financial District Commercial Hub" required className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Address / Location</label>
                    <input type="text" value={newPropForm.location} onChange={(e) => setNewPropForm({ ...newPropForm, location: e.target.value })} placeholder="E.g. Nanakramguda, Hyderabad" className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold mb-1">Market Valuation</label>
                    <input type="text" value={newPropForm.price} onChange={(e) => setNewPropForm({ ...newPropForm, price: e.target.value })} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white font-bold" />
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setAddPropertyModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">Register Parcel</Button>
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

export default AgentProperties;
