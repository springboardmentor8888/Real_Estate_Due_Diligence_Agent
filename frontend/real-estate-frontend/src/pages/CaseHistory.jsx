import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  Home,
  UserCheck,
  Scale,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertOctagon,
  FileDown,
  ChevronRight,
  Sparkles,
  Layers,
} from "lucide-react";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty } from "../services/liveStore";
import { exportToPdf } from "../utils/exportUtils";

// Master Initial Case History Dataset covering all 4 requested categories
const MASTER_CASE_HISTORY_EVENTS = [
  // 1. Previous Reviews
  {
    id: "HIS-REV-901",
    category: "Previous Reviews",
    title: "Title & Encumbrance Review Signed Off",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    propertyId: "1001",
    date: "04 Aug 2026",
    year: "2026",
    user: "Adv. Rajesh Sharma",
    status: "Approved",
    variant: "success",
    description: "Executed 30-year Sub-Registrar deed trace. Issued 100% Nil Encumbrance Certificate signoff.",
  },
  {
    id: "HIS-REV-902",
    category: "Previous Reviews",
    title: "HMDA Master Plan Layout Permission Verified",
    property: "Whitefield Horizon Tech Campus (PR-1003)",
    propertyId: "1003",
    date: "01 Aug 2026",
    year: "2026",
    user: "Adv. Suresh Patel",
    status: "Approved",
    variant: "success",
    description: "Verified commercial 3.5 FAR sanctioned layout and Fire NOC height clearance.",
  },

  // 2. Ownership Changes
  {
    id: "HIS-OWN-801",
    category: "Ownership Changes",
    title: "Sale Deed Reg #DEED/TS/2021/4412 Execution",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    propertyId: "1001",
    date: "12 Apr 2021",
    year: "2021",
    user: "Serilingampally Sub-Registrar",
    status: "Closed",
    variant: "success",
    description: "Title transferred from Devi Infrastructure Projects Ltd to Adani Realty Institutional Fund (₹ 45.00 Cr).",
  },
  {
    id: "HIS-OWN-802",
    category: "Ownership Changes",
    title: "Corporate Title Transfer #REG/AP/2010/1102",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    propertyId: "1002",
    date: "20 Aug 2010",
    year: "2010",
    user: "Ranga Reddy District Registry",
    status: "Closed",
    variant: "secondary",
    description: "Title deed transferred from Telangana State Industrial Corp to Devi Infrastructure (₹ 28.50 Cr).",
  },

  // 3. Legal Disputes
  {
    id: "HIS-LIT-701",
    category: "Legal Disputes",
    title: "Bombay High Court Boundary Demarcation Suit #CS-4481",
    property: "BKC Prime Commercial Hub (PR-1005)",
    propertyId: "1005",
    date: "14 Nov 2023",
    year: "2023",
    user: "Bombay High Court Division Bench",
    status: "Closed",
    variant: "success",
    description: "Civil boundary dispute disposed in favor of registered owner with full costs.",
  },
  {
    id: "HIS-LIT-702",
    category: "Legal Disputes",
    title: "Sub-Registrar Stay Order Alert #CS-402/2024",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    propertyId: "1002",
    date: "15 Jan 2024",
    year: "2024",
    user: "Telangana High Court",
    status: "Active Flagged",
    variant: "danger",
    description: "Active civil stay order filed regarding adjacent survey boundary line.",
  },

  // 4. Historical Reports
  {
    id: "HIS-RPT-601",
    category: "Historical Reports",
    title: "Level 4 Enterprise Due Diligence Report Issued",
    property: "Financial District Commercial Plot (PR-1004)",
    propertyId: "1004",
    date: "15 Dec 2025",
    year: "2025",
    user: "Adv. Ananya Rao",
    status: "Approved",
    variant: "success",
    description: "Issued institutional due diligence clearance certificate PDF for acquisition.",
  },
  {
    id: "HIS-RPT-602",
    category: "Historical Reports",
    title: "Environmental Soil NOC & PCB Audit Report",
    property: "Kokapet SEZ Commercial Land (PR-1006)",
    propertyId: "1006",
    date: "10 Oct 2024",
    year: "2024",
    user: "State Pollution Control Board",
    status: "Closed",
    variant: "success",
    description: "Environmental NOC clearance audit completed and archived in legal vault.",
  },
];

function CaseHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeProp = getLiveActiveProperty(searchParams.get("id") || searchParams.get("propertyId"));
  const numericId = (activeProp?.numericId || activeProp?.propertyId || 1001).toString();

  const [events, setEvents] = useState(MASTER_CASE_HISTORY_EVENTS);

  // FILTERS STATE (PROPERTY, DATE, STATUS, SEARCH, SORT)
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryTab, setCategoryTab] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  // FILTERED & SORTED EVENTS
  const processedEvents = useMemo(() => {
    let list = events.filter((ev) => {
      const matchCategory = categoryTab === "ALL" || ev.category === categoryTab;
      const matchProperty = propertyFilter === "ALL" || ev.propertyId === propertyFilter;
      const matchDate =
        dateFilter === "ALL" ||
        (dateFilter === "2026" && ev.year === "2026") ||
        (dateFilter === "2025" && ev.year === "2025") ||
        (dateFilter === "EARLIER" && parseInt(ev.year) <= 2024);

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "Closed" && ev.status.includes("Closed")) ||
        (statusFilter === "Approved" && ev.status.includes("Approved")) ||
        (statusFilter === "Flagged" && ev.status.includes("Flagged"));

      const matchSearch =
        ev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchProperty && matchDate && matchStatus && matchSearch;
    });

    if (sortBy === "NEWEST") {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "OLDEST") {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "PROPERTY") {
      list.sort((a, b) => a.property.localeCompare(b.property));
    }

    return list;
  }, [events, categoryTab, propertyFilter, dateFilter, statusFilter, searchQuery, sortBy]);

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <History size={14} className="text-purple-500 dark:text-purple-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Sub-Registrar Case History & Legal Telemetry
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs border border-purple-200 dark:border-purple-800">
            CASE REGISTRY • {events.length} HISTORICAL EVENTS
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-mono font-bold mb-2">
              <History size={14} /> 30-Year Chronological Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📜 Case History & Legal Timeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect historical land title reviews, 30-year ownership transfers, High Court civil litigation stay orders, and past due diligence audit reports.
            </p>
          </div>

          <Button
            onClick={() => exportToPdf("Sub_Registrar_Case_History", processedEvents)}
            variant="primary"
            size="sm"
            icon={FileDown}
          >
            Export History PDF
          </Button>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTERS (PROPERTY, DATE, STATUS) & SORT */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search history by Case ID, Event Title, Property, Court, or User..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* 1. PROPERTY FILTER */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0F172A] px-3 py-2 rounded-xl border border-slate-200 dark:border-[#334155]">
                <Building2 size={14} className="text-slate-400 shrink-0" />
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Property: All Parcels</option>
                  <option value="1001">PR-1001 (Gachibowli Tech Park)</option>
                  <option value="1002">PR-1002 (Jubilee Hills Plot 36)</option>
                  <option value="1003">PR-1003 (Whitefield Tech)</option>
                  <option value="1004">PR-1004 (Financial District)</option>
                  <option value="1005">PR-1005 (BKC Commercial)</option>
                </select>
              </div>

              {/* 2. DATE FILTER */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0F172A] px-3 py-2 rounded-xl border border-slate-200 dark:border-[#334155]">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Date: All Time</option>
                  <option value="2026">Year: 2026</option>
                  <option value="2025">Year: 2025</option>
                  <option value="EARLIER">Year: 2024 & Earlier</option>
                </select>
              </div>

              {/* SORT DROPDOWN */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0F172A] px-3 py-2 rounded-xl border border-slate-200 dark:border-[#334155]">
                <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="NEWEST">Sort: Newest First</option>
                  <option value="OLDEST">Sort: Oldest First</option>
                  <option value="PROPERTY">Sort: Property Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* CATEGORY & STATUS FILTER TABS */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-[#334155] pt-3">
            {/* Category Tabs (The 4 Required Display Categories) */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "ALL", label: "All Events" },
                { id: "Previous Reviews", label: "Previous Reviews" },
                { id: "Ownership Changes", label: "Ownership Changes" },
                { id: "Legal Disputes", label: "Legal Disputes" },
                { id: "Historical Reports", label: "Historical Reports" },
              ].map((tab) => {
                const active = categoryTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryTab(tab.id)}
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

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1">
              {[
                { id: "ALL", label: "All Statuses" },
                { id: "Approved", label: "Approved" },
                { id: "Closed", label: "Closed" },
                { id: "Flagged", label: "Flagged" },
              ].map((tab) => {
                const active = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold text-[11px] ${
                      active
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-[#0F172A] text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHRONOLOGICAL TIMELINE VIEW (THE REQUIRED TIMELINE VIEW) */}
        {processedEvents.length === 0 ? (
          <EmptyState title="No case history events found" message="No historical record matches your search query or selected filter criteria." />
        ) : (
          <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                ⏳ Chronological Case History Timeline ({processedEvents.length} Events)
              </h2>
            </div>

            {/* Timeline Events Vertical Track */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-[#334155]">
              {processedEvents.map((ev, idx) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="relative space-y-3"
                >
                  {/* Timeline Dot Node */}
                  <div className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#1E293B] shadow-md ${
                    ev.variant === "danger" ? "bg-rose-500" : ev.variant === "warning" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />

                  {/* Event Card Content */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-3 hover:border-purple-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                          {ev.category} • {ev.id}
                        </span>
                        <Badge variant={ev.variant}>{ev.status}</Badge>
                      </div>

                      <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
                        <Clock size={13} /> {ev.date}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium">
                      {ev.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-[#334155] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-bold">
                      <span>🏢 {ev.property}</span>
                      <span>👤 Executed By: {ev.user}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CaseHistory;
