import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  FileSearch,
  Search,
  Filter,
  Home,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { MASTER_MOCK_PROPERTIES } from "../data/mockPropertyData";
import LegalPropertyReviewCard from "../components/legal/LegalPropertyReviewCard";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";

function PropertyReview() {
  const [properties, setProperties] = useState(MASTER_MOCK_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState("1001");

  // Filtered Properties List
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "VERIFIED" && (p.titleVerificationStatus?.includes("Clear") || p.status?.includes("Clear"))) ||
        (statusFilter === "FLAGGED" && (p.riskScore > 40 || p.titleVerificationStatus?.includes("Encumbrance"))) ||
        (statusFilter === "SEARCH" && p.titleVerificationStatus?.includes("Search"));

      const matchSearch =
        p.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.numericId.toString().includes(searchQuery);

      return matchStatus && matchSearch;
    });
  }, [properties, searchQuery, statusFilter]);

  const handleOpenReport = (propId) => {
    setSelectedPropId(propId);
    setReportModalOpen(true);
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
              Property Review & Legal Audit
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            PARCEL REGISTRY • {properties.length} PARCELS
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <FileSearch size={14} /> Sub-Registrar Parcel Audits
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              🏢 Property Review & Legal Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect property images, recorded owners, market valuations, legal clearance statuses, and 13-vector risk scores.
            </p>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & STATUS FILTERS */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties by Parcel Name, Address, Recorded Owner, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL", label: "All Properties" },
              { id: "VERIFIED", label: "Clear Title Verified" },
              { id: "FLAGGED", label: "Encumbrance Flagged" },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
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
        </div>

        {/* PROPERTY REVIEWS CARDS GRID */}
        {filteredProperties.length === 0 ? (
          <EmptyState title="No property review records found" message="No property parcel matches your search query or filter selection." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <LegalPropertyReviewCard
                key={prop.id || prop.numericId}
                property={prop}
                onGenerateReport={handleOpenReport}
              />
            ))}
          </div>
        )}

        {/* REPORT GENERATOR MODAL */}
        <ReportGeneratorModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          initialPropertyId={selectedPropId}
        />
      </div>
    </MainLayout>
  );
}

export default PropertyReview;
