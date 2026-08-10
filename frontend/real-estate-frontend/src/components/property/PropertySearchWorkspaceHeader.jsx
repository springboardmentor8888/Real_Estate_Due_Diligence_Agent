import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  History,
  Check,
  Building2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function PropertySearchWorkspaceHeader({
  searchAddress,
  setSearchAddress,
  stateFilter,
  setStateFilter,
  cityFilter,
  setCityFilter,
  priceFilter,
  setPriceFilter,
  riskFilter,
  setRiskFilter,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  allProperties = [],
  onClearFilters,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  const states = [
    { id: "ALL", label: "All States" },
    { id: "Telangana", label: "Telangana" },
    { id: "Karnataka", label: "Karnataka" },
    { id: "Maharashtra", label: "Maharashtra" },
    { id: "Tamil Nadu", label: "Tamil Nadu" },
    { id: "Delhi NCR", label: "Delhi NCR" },
    { id: "Gujarat", label: "Gujarat" },
  ];

  const cities = [
    { id: "ALL", label: "All Cities" },
    { id: "Hyderabad", label: "Hyderabad" },
    { id: "Bengaluru", label: "Bengaluru" },
    { id: "Mumbai", label: "Mumbai" },
    { id: "Chennai", label: "Chennai" },
    { id: "Pune", label: "Pune" },
    { id: "Ahmedabad", label: "Ahmedabad" },
    { id: "Delhi", label: "Delhi" },
  ];

  const priceRanges = [
    { id: "ALL", label: "All Prices" },
    { id: "UNDER_10CR", label: "Under ₹10 Cr" },
    { id: "10CR_25CR", label: "₹10 Cr - ₹25 Cr" },
    { id: "25CR_50CR", label: "₹25 Cr - ₹50 Cr" },
    { id: "ABOVE_50CR", label: "Above ₹50 Cr" },
  ];

  const riskScores = [
    { id: "ALL", label: "All Risk Scores" },
    { id: "LOW", label: "Low Risk (< 30)" },
    { id: "MODERATE", label: "Moderate Risk (30-60)" },
    { id: "HIGH", label: "High Risk (> 60)" },
  ];

  const propertyTypes = [
    { id: "ALL", label: "All Property Types" },
    { id: "Commercial", label: "Commercial Office" },
    { id: "Residential", label: "Residential Plot" },
    { id: "Industrial", label: "Industrial Warehouse" },
    { id: "IT Campus", label: "IT Campus" },
    { id: "Mixed-Use", label: "Mixed-Use Hub" },
  ];

  const statuses = [
    { id: "ALL", label: "All Verification Statuses" },
    { id: "Verified Clear Title", label: "Verified Clear Title" },
    { id: "Encumbrance Verified", label: "Encumbrance Verified" },
    { id: "Registered & Active", label: "Registered & Active" },
  ];

  const sortOptions = [
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "risk-asc", label: "Risk Score: Lowest First" },
    { id: "year-desc", label: "Year Built: Newest First" },
    { id: "name-asc", label: "Name: A to Z" },
  ];

  const recentSearches = [
    "Gachibowli Tech Park, Hyderabad",
    "Whitefield Horizon Campus, Bengaluru",
    "Jubilee Hills Plot 36",
    "BKC Commercial Hub, Mumbai",
    "APN-HYD-500032-1001",
  ];

  // Auto-complete suggestion matches
  const suggestions = searchAddress.trim().length >= 2
    ? allProperties
        .filter((p) => {
          const q = searchAddress.toLowerCase();
          const name = (p.propertyName || p.title || "").toLowerCase();
          const apn = (p.apnNumber || p.id || "").toLowerCase();
          const city = (p.city || "").toLowerCase();
          return name.includes(q) || apn.includes(q) || city.includes(q);
        })
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters =
    searchAddress ||
    stateFilter !== "ALL" ||
    cityFilter !== "ALL" ||
    priceFilter !== "ALL" ||
    riskFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    statusFilter !== "ALL";

  return (
    <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
            <Search size={14} /> Multi-Vector Land Registry Search
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
            Property Search Workstation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
            Query land registry deeds, survey numbers, APN IDs, title clearance records, and risk scores.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <X size={14} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* 1. LARGE SEARCH BAR & AUTO-COMPLETE SUGGESTIONS */}
      <div className="relative" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <MapPin className="absolute left-4 text-blue-600 dark:text-cyan-400" size={20} />
          <input
            type="text"
            value={searchAddress}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearchAddress(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Search by Property Name, APN, Survey Number, Address, City, State, or Owner..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
          />
          {searchAddress && (
            <button
              onClick={() => setSearchAddress("")}
              className="absolute right-4 p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Auto-complete Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-2xl shadow-xl z-30 overflow-hidden divide-y divide-slate-100 dark:divide-[#334155]">
            <div className="px-4 py-2 bg-slate-50 dark:bg-[#0F172A] text-[10px] font-mono font-bold text-slate-400 uppercase">
              AUTO-COMPLETE SUGGESTIONS
            </div>
            {suggestions.map((item) => {
              const name = item.propertyName || item.title;
              const pid = item.id || `PR-${item.numericId}`;
              const city = item.city || "Hyderabad";
              return (
                <div
                  key={pid}
                  onClick={() => {
                    setSearchAddress(name);
                    setShowSuggestions(false);
                  }}
                  className="p-3.5 px-4 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-blue-600 dark:text-cyan-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{city} • {pid}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                    Select
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. RECENT SEARCHES PILLS */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 dark:text-slate-400 font-bold flex items-center gap-1 shrink-0">
          <History size={13} /> Recent Queries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {recentSearches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSearchAddress(item)}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-[11px] font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200/60 dark:border-[#334155]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SIX FILTER DROPDOWNS + SORT CONTROL GRID */}
      <div className="pt-4 border-t border-slate-100 dark:border-[#334155] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 uppercase flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-blue-600 dark:text-cyan-400" /> Filter & Sort Controls
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {/* State Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">State</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-slate-100 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">City</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-slate-100 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Price Range</label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-slate-100 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {priceRanges.map((pr) => (
                <option key={pr.id} value={pr.id}>{pr.label}</option>
              ))}
            </select>
          </div>

          {/* Risk Score Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Risk Score</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-slate-100 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {riskScores.map((rs) => (
                <option key={rs.id} value={rs.id}>{rs.label}</option>
              ))}
            </select>
          </div>

          {/* Property Type Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Property Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-slate-100 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {propertyTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>{pt.label}</option>
              ))}
            </select>
          </div>

          {/* Verification Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Verification Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-slate-100 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st.id} value={st.id}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 uppercase font-extrabold flex items-center gap-1">
              <ArrowUpDown size={11} /> Sort Results By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-cyan-200 font-bold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {sortOptions.map((so) => (
                <option key={so.id} value={so.id}>{so.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertySearchWorkspaceHeader;
