import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  DollarSign,
  Building2,
  MapPin,
  TrendingUp,
  Award,
  Eye,
  FileSpreadsheet,
  ArrowLeftRight,
  Search,
  FileDown,
  Sparkles,
  X,
  Scale,
  Landmark,
} from "lucide-react";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveProperties, getLiveActiveProperty } from "../services/liveStore";
import { exportToPdf } from "../utils/exportUtils";
import { showToast } from "../utils/swal";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

// Realistic Valuation Mock Data covering all requested fields
const VALUATION_MOCK_DATA = [
  {
    numericId: "1001",
    id: "PR-1001",
    propertyName: "Gachibowli Tech Park Phase 2",
    address: "Plot 45, Sy. No. 112/A, Financial District, Hyderabad",
    landType: "Commercial Office",
    marketValue: "₹ 45.00 Cr",
    marketValueNum: 450000000,
    governmentValue: "₹ 32.50 Cr",
    estimatedValue: "₹ 48.20 Cr",
    appreciationRate: "+12.4% p.a.",
    investmentScore: "92/100 (AAA Rating)",
    investmentScoreNum: 92,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    numericId: "1002",
    id: "PR-1002",
    propertyName: "Jubilee Hills Commercial Plot 36",
    address: "Road No. 36, Jubilee Hills, Hyderabad",
    landType: "Retail Commercial",
    marketValue: "₹ 38.00 Cr",
    marketValueNum: 380000000,
    governmentValue: "₹ 26.80 Cr",
    estimatedValue: "₹ 40.50 Cr",
    appreciationRate: "+14.2% p.a.",
    investmentScore: "86/100 (AA+ Rating)",
    investmentScoreNum: 86,
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    numericId: "1003",
    id: "PR-1003",
    propertyName: "Whitefield Horizon Tech Campus",
    address: "EPIP Zone, Phase 2, Whitefield, Bengaluru",
    landType: "IT Tech Park",
    marketValue: "₹ 165.00 Cr",
    marketValueNum: 1650000000,
    governmentValue: "₹ 118.00 Cr",
    estimatedValue: "₹ 178.50 Cr",
    appreciationRate: "+15.8% p.a.",
    investmentScore: "95/100 (AAA Rating)",
    investmentScoreNum: 95,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  },
  {
    numericId: "1004",
    id: "PR-1004",
    propertyName: "Financial District Commercial Plot",
    address: "Nanakramguda, Financial District, Hyderabad",
    landType: "Commercial Office",
    marketValue: "₹ 52.00 Cr",
    marketValueNum: 520000000,
    governmentValue: "₹ 37.20 Cr",
    estimatedValue: "₹ 56.40 Cr",
    appreciationRate: "+11.6% p.a.",
    investmentScore: "90/100 (AAA Rating)",
    investmentScoreNum: 90,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
];

/**
 * Reusable Property Valuation Card Component
 */
function ValuationPropertyCard({ property, onGenerateReport }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs hover:shadow-xl transition-all space-y-5 flex flex-col justify-between group font-mono text-xs"
    >
      <div className="space-y-4">
        {/* 1. PROPERTY IMAGE */}
        <div className="h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
          <img
            src={property.imageUrl}
            alt={property.propertyName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white font-bold text-[10px]">
              {property.id}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-600/85 backdrop-blur-md text-white font-bold text-[10px]">
              {property.landType}
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <Badge variant="success">{property.investmentScore}</Badge>
          </div>
        </div>

        {/* 2. PROPERTY NAME & 3. ADDRESS */}
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {property.propertyName}
          </h3>
          <p className="text-slate-500 text-[11px] font-medium flex items-center gap-1 mt-1 truncate">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            {property.address}
          </p>
        </div>

        {/* 4. MARKET VALUE, 5. GOVERNMENT VALUE, 6. ESTIMATED VALUE, 7. APPRECIATION RATE */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">4. Market Value</span>
            <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-sm block mt-0.5">{property.marketValue}</strong>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">5. Government Value</span>
            <strong className="text-slate-900 dark:text-white font-extrabold text-xs block mt-0.5">{property.governmentValue}</strong>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">6. AI Estimated Value</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs block mt-0.5">{property.estimatedValue}</strong>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">7. Appreciation Rate</span>
            <strong className="text-emerald-500 font-extrabold text-xs block mt-0.5">{property.appreciationRate}</strong>
          </div>
        </div>
      </div>

      {/* THE 3 REQUIRED ACTION BUTTONS */}
      <div className="pt-4 border-t border-slate-100 dark:border-[#334155] grid grid-cols-3 gap-2">
        {/* 1. View Details */}
        <Button
          onClick={() => navigate(`/property-details?id=${property.numericId}`)}
          variant="outline"
          size="sm"
          icon={Eye}

        >
          Details
        </Button>

        {/* 2. Generate Valuation Report */}
        <Button
          onClick={() => onGenerateReport(property)}
          variant="primary"
          size="sm"
          icon={FileSpreadsheet}

        >
          Report
        </Button>

        {/* 3. Compare Property */}
        <Button
          onClick={() => navigate(`/comparable-properties?id=${property.numericId}`)}
          variant="secondary"
          size="sm"
          icon={ArrowLeftRight}

        >
          Compare
        </Button>
      </div>
    </motion.div>
  );
}

function PropertyValuation() {
  const [searchParams] = useSearchParams();
  const activeProp = getLiveActiveProperty(searchParams.get("id") || searchParams.get("propertyId"));
  const numericId = (activeProp?.numericId || activeProp?.propertyId || 1001).toString();

  const [searchQuery, setSearchQuery] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportProp, setSelectedReportProp] = useState(null);

  // Filtered properties
  const filteredProperties = VALUATION_MOCK_DATA.filter((p) =>
    p.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateReportClick = (prop) => {
    setSelectedReportProp(prop);
    setReportModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Property Valuation & Ready Reckoner Registry
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            PR-{numericId} • READY RECKONER VALUATION
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <DollarSign size={14} /> AI Ready Reckoner Valuation Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              💰 Property Valuation & Ready Reckoner
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect Market Value, Sub-Registrar Government Guideline Value, AI Estimated Valuation, Appreciation Rate, and Investment Rating Score.
            </p>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search valuation registry by Property Name, Address, or Parcel Ref ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>
        </div>

        {/* REUSABLE PROPERTY CARDS GRID */}
        {filteredProperties.length === 0 ? (
          <EmptyState title="No property valuation records found" message="No property matches your search query." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProperties.map((prop) => (
              <ValuationPropertyCard
                key={prop.id}
                property={prop}
                onGenerateReport={handleGenerateReportClick}
              />
            ))}
          </div>
        )}

        {/* MODAL: GENERATE VALUATION REPORT MODAL */}
        <AnimatePresence>
          {reportModalOpen && selectedReportProp && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReportModalOpen(false)} className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet size={20} className="text-blue-500" /> Valuation Report Certificate
                  </h2>
                  <button onClick={() => setReportModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
                    <p className="text-slate-500">Property: <strong className="text-slate-900 dark:text-white">{selectedReportProp.propertyName}</strong></p>
                    <p className="text-slate-500">Market Value: <strong className="text-blue-600 dark:text-cyan-400">{selectedReportProp.marketValue}</strong></p>
                    <p className="text-slate-500">Govt Guideline Value: <strong className="text-slate-900 dark:text-white">{selectedReportProp.governmentValue}</strong></p>
                    <p className="text-slate-500">Estimated AI Value: <strong className="text-emerald-600 dark:text-emerald-400">{selectedReportProp.estimatedValue}</strong></p>
                    <p className="text-slate-500">Appreciation Rate: <strong className="text-emerald-500">{selectedReportProp.appreciationRate}</strong></p>
                    <p className="text-slate-500">Investment Score: <strong className="text-purple-600 dark:text-purple-400">{selectedReportProp.investmentScore}</strong></p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setReportModalOpen(false)} variant="secondary" size="sm">Close</Button>
                    <Button onClick={() => { setReportModalOpen(false); exportToPdf(`Valuation_Report_${selectedReportProp.id}`, selectedReportProp); }} variant="primary" size="sm" icon={FileDown}>Download PDF</Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default PropertyValuation;
