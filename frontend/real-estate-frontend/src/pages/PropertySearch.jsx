import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PropertySearchWorkspaceHeader from "../components/property/PropertySearchWorkspaceHeader";
import LinearPropertyCard from "../components/property/LinearPropertyCard";
import PropertyInspectionDrawer from "../components/property/PropertyInspectionDrawer";
import PropertyTable from "../components/property/PropertyTable";
import EmptyState from "../components/common/EmptyState";
import { Skeleton } from "../components/common/Skeleton";
import { LayoutGrid, List, Building2 } from "lucide-react";
import { getAllProperties, searchProperties } from "../services/propertyService";
import { showToast } from "../utils/swal";

function PropertySearch() {
  const location = useLocation();
  const initialQuery = location.state?.searchQuery || "";

  const [searchAddress, setSearchAddress] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Side-Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch properties from backend API on mount or search
  useEffect(() => {
    handleSearch(searchAddress, selectedCategory);
  }, []);

  const handleSearch = async (addressQuery, categoryQuery) => {
    setLoading(true);

    try {
      let response;
      if (addressQuery || (categoryQuery && categoryQuery !== "ALL")) {
        response = await searchProperties({
          city: addressQuery || undefined,
          propertyType: categoryQuery !== "ALL" ? categoryQuery : undefined,
        });
      } else {
        response = await getAllProperties(0, 50);
      }

      if (response && response.data) {
        const items = response.data.content || response.data;
        if (Array.isArray(items) && items.length > 0) {
          const mapped = items.map((p, idx) => ({
            id: p.propertyId ? `PR-${p.propertyId}` : `PR-100${idx + 1}`,
            propertyId: p.propertyId,
            numericId: p.propertyId || idx + 1,
            title: p.propertyName || (p.address ? `${p.address.addressLine1 || ""}` : "Property Parcel"),
            propertyName: p.propertyName || (p.address ? `${p.address.addressLine1 || ""}` : "Property Parcel"),
            address: p.address ? `${p.address.addressLine1 || ""}, ${p.address.city || ""}` : "Address Not Available",
            city: p.address?.city || "Not Available",
            state: p.address?.state || "Not Available",
            type: p.propertyType || "Residential",
            owner: p.createdByEmail ? p.createdByEmail.split("@")[0] : "Not Available",
            score: p.marketValue ? `₹${(p.marketValue / 1000000).toFixed(2)} Cr` : "Not Available",
            riskScore: p.riskScore || 20,
            riskLevel: p.riskScore > 60 ? "High Risk" : p.riskScore > 30 ? "Moderate Risk" : "Low Risk",
            status: p.status || "Verified",
            variant: p.status === "Verified Clear Title" ? "success" : "warning",
            area: p.totalArea ? `${p.totalArea} sq ft` : "Not Available",
            year: p.builtYear || "Not Available",
            imageUrl: p.imageUrl || null,
            image: p.imageUrl || null,
            description: p.description || null,
            rawBackendData: p,
          }));
          setFilteredProperties(mapped);
          setLoading(false);
          showToast(`Retrieved ${mapped.length} property records from API`, "success");
          return;
        }
      }
    } catch (err) {
      console.warn("Backend property service query failed:", err);
    }

    setFilteredProperties([]);
    setLoading(false);
  };

  const handleOpenDrawer = (property) => {
    setSelectedProperty(property);
    setDrawerOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto">
        {/* TOP SECTION: Search & Category Chips Header */}
        <PropertySearchWorkspaceHeader
          searchAddress={searchAddress}
          setSearchAddress={setSearchAddress}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSearch={handleSearch}
        />

        {/* RESULTS BAR: View Mode Toggle & Result Counter */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-blue-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
              Verified Property Records
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0F172A] px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-[#334155]">
              {filteredProperties.length} Parcels
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#334155]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* MAIN FULL-WIDTH GRID LAYOUT OR EMPTY STATE */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <EmptyState
            title="No properties found."
            message="No property records were returned by the backend API. Try adjusting your search query or connecting to the backend server."
            actionLabel="Refresh Records"
            onAction={() => {
              setSearchAddress("");
              setSelectedCategory("ALL");
              handleSearch("", "ALL");
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((prop) => (
              <LinearPropertyCard
                key={prop.id || prop.propertyId}
                property={prop}
                onInspect={handleOpenDrawer}
              />
            ))}
          </div>
        ) : (
          <PropertyTable properties={filteredProperties} />
        )}

        {/* FLOATING SIDE-DRAWER INSPECTION MODAL */}
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