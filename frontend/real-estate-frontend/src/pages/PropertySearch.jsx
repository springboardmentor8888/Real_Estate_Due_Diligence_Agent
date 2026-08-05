import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PropertySearchWorkspaceHeader from "../components/property/PropertySearchWorkspaceHeader";
import LinearPropertyCard from "../components/property/LinearPropertyCard";
import PropertyInspectionDrawer from "../components/property/PropertyInspectionDrawer";
import PropertyTable from "../components/property/PropertyTable";
import EmptyState from "../components/common/EmptyState";
import { Skeleton } from "../components/common/Skeleton";
import { LayoutGrid, List, Building2, SlidersHorizontal, RefreshCw } from "lucide-react";
import { getLiveProperties, setLiveActiveProperty } from "../services/liveStore";
import { MASTER_MOCK_PROPERTIES } from "../data/mockPropertyData";
import { showToast } from "../utils/swal";

function PropertySearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.searchQuery || "";

  const [allMasterProps, setAllMasterProps] = useState([]);
  const [searchAddress, setSearchAddress] = useState(initialQuery);
  const [stateFilter, setStateFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("price-asc");

  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);

  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Load properties from liveStore + MASTER_MOCK_PROPERTIES
  useEffect(() => {
    const liveProps = getLiveProperties();
    const combined = [...liveProps, ...MASTER_MOCK_PROPERTIES];
    const uniqueMap = new Map();

    combined.forEach((item, idx) => {
      const numId = (item.numericId || item.propertyId || item.id || idx + 1001).toString().replace(/\D/g, "") || `${1001 + idx}`;
      if (!uniqueMap.has(numId)) {
        uniqueMap.set(numId, {
          ...item,
          numericId: parseInt(numId, 10),
          propertyId: parseInt(numId, 10),
          id: `PR-${numId}`,
          title: item.propertyName || item.title || "Commercial Property Parcel",
          propertyName: item.propertyName || item.title || "Commercial Property Parcel",
          address: typeof item.address === "string" ? item.address : `${item.propertyName || "Plot"}, ${item.city || "Hyderabad"}`,
          city: item.city || "Hyderabad",
          state: item.state || "Telangana",
          type: item.landType || item.type || "Commercial",
          owner: item.ownerName || item.owner || "Ananya Rao",
          marketValue: item.marketValue || 250000000,
          riskScore: item.riskScore ?? 14,
          status: item.status || "Verified Clear Title",
          builtYear: item.builtYear || item.year || 2021,
          imageUrl: item.imageUrl || item.image || null,
        });
      }
    });

    setAllMasterProps(Array.from(uniqueMap.values()));
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...allMasterProps];

    // 1. Text Search Input
    if (searchAddress.trim()) {
      const q = searchAddress.toLowerCase().trim();
      result = result.filter((p) => {
        const name = (p.propertyName || p.title || "").toLowerCase();
        const addr = p.address.toLowerCase();
        const city = p.city.toLowerCase();
        const state = p.state.toLowerCase();
        const apn = (p.apnNumber || p.id || "").toLowerCase();
        const owner = (p.owner || "").toLowerCase();
        const survey = (p.surveyNumber || "").toLowerCase();

        return (
          name.includes(q) ||
          addr.includes(q) ||
          city.includes(q) ||
          state.includes(q) ||
          apn.includes(q) ||
          owner.includes(q) ||
          survey.includes(q)
        );
      });
    }

    // 2. State Filter
    if (stateFilter !== "ALL") {
      result = result.filter((p) => p.state.toLowerCase() === stateFilter.toLowerCase());
    }

    // 3. City Filter
    if (cityFilter !== "ALL") {
      result = result.filter((p) => p.city.toLowerCase() === cityFilter.toLowerCase());
    }

    // 4. Price Filter
    if (priceFilter !== "ALL") {
      result = result.filter((p) => {
        const val = p.marketValue || 250000000;
        if (priceFilter === "UNDER_10CR") return val < 100000000;
        if (priceFilter === "10CR_25CR") return val >= 100000000 && val <= 250000000;
        if (priceFilter === "25CR_50CR") return val >= 250000000 && val <= 500000000;
        if (priceFilter === "ABOVE_50CR") return val > 500000000;
        return true;
      });
    }

    // 5. Risk Score Filter
    if (riskFilter !== "ALL") {
      result = result.filter((p) => {
        const rs = p.riskScore ?? 14;
        if (riskFilter === "LOW") return rs <= 30;
        if (riskFilter === "MODERATE") return rs > 30 && rs <= 60;
        if (riskFilter === "HIGH") return rs > 60;
        return true;
      });
    }

    // 6. Property Type Filter
    if (typeFilter !== "ALL") {
      result = result.filter((p) => (p.type || p.category || "").toLowerCase().includes(typeFilter.toLowerCase()));
    }

    // 7. Status Filter
    if (statusFilter !== "ALL") {
      result = result.filter((p) => (p.status || "").toLowerCase().includes(statusFilter.toLowerCase()));
    }

    // 8. Sorting
    result.sort((a, b) => {
      if (sortBy === "price-asc") return (a.marketValue || 0) - (b.marketValue || 0);
      if (sortBy === "price-desc") return (b.marketValue || 0) - (a.marketValue || 0);
      if (sortBy === "risk-asc") return (a.riskScore || 0) - (b.riskScore || 0);
      if (sortBy === "year-desc") return (b.builtYear || 2021) - (a.builtYear || 2021);
      if (sortBy === "name-asc") return (a.propertyName || "").localeCompare(b.propertyName || "");
      return 0;
    });

    return result;
  }, [allMasterProps, searchAddress, stateFilter, cityFilter, priceFilter, riskFilter, typeFilter, statusFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchAddress("");
    setStateFilter("ALL");
    setCityFilter("ALL");
    setPriceFilter("ALL");
    setRiskFilter("ALL");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setSortBy("price-asc");
    showToast("Filters reset to default", "info");
  };

  const handleOpenDrawer = (property) => {
    setSelectedProperty(property);
    setDrawerOpen(true);
    if (property) {
      const pid = property.numericId || property.propertyId || property.id;
      setLiveActiveProperty(pid);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto">
        {/* TOP SECTION: Search & Multi-Vector Filter Controls */}
        <PropertySearchWorkspaceHeader
          searchAddress={searchAddress}
          setSearchAddress={setSearchAddress}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          riskFilter={riskFilter}
          setRiskFilter={setRiskFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allProperties={allMasterProps}
          onClearFilters={handleClearFilters}
        />

        {/* RESULTS BAR & VIEW MODE TOGGLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              Search Results
            </h2>
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
              {filteredAndSortedProperties.length} Parcels Found
            </span>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-[#1E293B] border border-slate-300/60 dark:border-[#334155] self-start sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white dark:bg-[#0F172A] text-blue-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <List size={14} />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* RESULTS GRID / TABLE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-100 dark:bg-[#1E293B] animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredAndSortedProperties.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProperties.map((prop) => (
                <LinearPropertyCard
                  key={(prop.numericId || prop.id).toString()}
                  property={prop}
                  onInspect={() => handleOpenDrawer(prop)}
                />
              ))}
            </div>
          ) : (
            <div className="white-card rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] p-4">
              <PropertyTable properties={filteredAndSortedProperties} onSelectProperty={handleOpenDrawer} />
            </div>
          )
        ) : (
          <EmptyState
            title="No Matching Property Parcels Found"
            message={`No property records matched your query "${searchAddress}" with current filter criteria.`}
            actionLabel="Reset Search & Filters"
            onAction={handleClearFilters}
          />
        )}

        {/* SIDE INSPECTION DRAWER */}
        <PropertyInspectionDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          property={selectedProperty}
        />
      </div>
    </MainLayout>
  );
}

export default PropertySearch;