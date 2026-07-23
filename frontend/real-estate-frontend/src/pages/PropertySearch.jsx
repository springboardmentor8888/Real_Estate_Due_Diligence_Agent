import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import SearchForm from "../components/property/SearchForm";
import PropertyTable from "../components/property/PropertyTable";
import PropertyCard from "../components/property/PropertyCard";
import EmptyState from "../components/common/EmptyState";
import { Skeleton } from "../components/common/Skeleton";
import { LayoutGrid, List, Filter, Building2 } from "lucide-react";
import { showToast } from "../utils/swal";
import { INDIAN_PROPERTIES } from "../data/indianProperties";

function PropertySearch() {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState(INDIAN_PROPERTIES);

  const handleSearch = ({ address, propertyType, riskLevel, statusFilter }) => {
    setLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      let results = [...INDIAN_PROPERTIES];

      if (address && address.trim()) {
        const query = address.toLowerCase().trim();
        results = results.filter(
          (p) =>
            p.address.toLowerCase().includes(query) ||
            p.owner.toLowerCase().includes(query) ||
            p.id.toLowerCase().includes(query) ||
            p.city.toLowerCase().includes(query) ||
            p.state.toLowerCase().includes(query)
        );
      }

      if (propertyType && propertyType !== "ALL") {
        results = results.filter((p) =>
          p.type.toLowerCase().includes(propertyType.toLowerCase())
        );
      }

      if (riskLevel && riskLevel !== "ALL") {
        if (riskLevel === "LOW") {
          results = results.filter((p) => p.variant === "success");
        } else if (riskLevel === "MEDIUM") {
          results = results.filter((p) => p.variant === "warning");
        } else if (riskLevel === "HIGH") {
          results = results.filter((p) => p.variant === "danger");
        }
      }

      if (statusFilter && statusFilter !== "ALL") {
        results = results.filter((p) =>
          p.status.toLowerCase().includes(statusFilter.toLowerCase())
        );
      }

      setFilteredProperties(results);
      setLoading(false);
      showToast(`Found ${results.length} property audit records`, "success");
    }, 400);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              🔍 Property Search & Registry Verification
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Execute comprehensive due diligence queries across state land registries, tax assessor offices, municipal zoning codes, and flood maps.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutGrid size={16} /> Grid Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List size={16} /> Data Table
            </button>
          </div>
        </div>

        {/* Search Form Card */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Filter size={20} className="text-blue-600" /> Search & Filter Due Diligence Records
          </h2>
          <SearchForm onSearch={handleSearch} />
        </div>

        {/* Search Results */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" /> Verified Property Records
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Showing {filteredProperties.length} Property Parcels
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-64 rounded-3xl" />
            </div>
          ) : !hasSearched || filteredProperties.length === 0 ? (
            <EmptyState
              title="No Property Records Found"
              message="No land records matched your search parameters. Try adjusting your location or property filters above."
              actionLabel="Reset Search"
              onAction={() => handleSearch({})}
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <PropertyTable properties={filteredProperties} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default PropertySearch;