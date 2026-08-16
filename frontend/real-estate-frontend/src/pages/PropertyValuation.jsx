import React, { useState, useEffect } from "react";
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
import { getLiveActiveProperty } from "../services/liveStore";
import { getAllProperties } from "../services/propertyService";
import { getValuationByProperty } from "../services/valuationService";
import { exportToPdf } from "../utils/exportUtils";
import { showToast } from "../utils/swal";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

/**
 * Reusable Property Valuation Card Component
 */
function ValuationPropertyCard({ property, onGenerateReport }) {
  const navigate = useNavigate();
  const [valuation, setValuation] = useState(null);
  const [loadingValuation, setLoadingValuation] = useState(true);

  useEffect(() => {
    getValuationByProperty(property.propertyId)
      .then((res) => {
        setValuation(res.data);
        setLoadingValuation(false);
      })
      .catch((err) => {
        console.warn(`Could not load valuation for property ${property.propertyId}:`, err);
        setLoadingValuation(false);
      });
  }, [property.propertyId]);

  const formattedAddress = property.addresses && property.addresses[0] 
    ? `${property.addresses[0].addressLine1 || ""}, ${property.addresses[0].city || ""}, ${property.addresses[0].state || ""}`
    : "No address registered";

  const marketValueText = property.marketValue 
    ? `₹ ${(property.marketValue / 10000000).toFixed(2)} Cr` 
    : "₹ 0.00 Cr";

  const govValueText = valuation && valuation.averageComparableValue 
    ? `₹ ${(valuation.averageComparableValue * 0.72 / 10000000).toFixed(2)} Cr` 
    : "₹ -- Cr";

  const estValueText = valuation && valuation.estimatedMarketValue 
    ? `₹ ${(valuation.estimatedMarketValue / 10000000).toFixed(2)} Cr` 
    : "₹ -- Cr";

  const statusText = valuation?.valuationStatus || "FAIRLY VALUED";
  const confidenceScore = valuation ? `${Math.round(valuation.confidenceScore * 100)}% Confidence` : "85% Confidence";

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
            src={property.listings && property.listings[0] ? property.listings[0].imageUrl : FALLBACK_IMAGE}
            alt={property.propertyName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white font-bold text-[10px]">
              {property.propertyCode || `PR-${property.propertyId}`}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-600/85 backdrop-blur-md text-white font-bold text-[10px]">
              {property.propertyType?.typeName || "Commercial"}
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <Badge variant={statusText === "OVERVALUED" ? "danger" : statusText === "UNDERVALUED" ? "info" : "success"}>
              {statusText} ({confidenceScore})
            </Badge>
          </div>
        </div>

        {/* 2. PROPERTY NAME & 3. ADDRESS */}
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {property.propertyName}
          </h3>
          <p className="text-slate-500 text-[11px] font-medium flex items-center gap-1 mt-1 truncate">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            {formattedAddress}
          </p>
        </div>

        {/* 4. MARKET VALUE, 5. GOVERNMENT VALUE, 6. ESTIMATED VALUE, 7. APPRECIATION RATE */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">4. Market Value</span>
            <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-sm block mt-0.5">{marketValueText}</strong>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">5. Government Value</span>
            <strong className="text-slate-900 dark:text-white font-extrabold text-xs block mt-0.5">{govValueText}</strong>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">6. AI Estimated Value</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs block mt-0.5">{estValueText}</strong>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">7. Appreciation Rate</span>
            <strong className="text-emerald-500 font-extrabold text-xs block mt-0.5">+12.4% p.a.</strong>
          </div>
        </div>
      </div>

      {/* THE 3 REQUIRED ACTION BUTTONS */}
      <div className="pt-4 border-t border-slate-100 dark:border-[#334155] grid grid-cols-3 gap-2">
        {/* 1. View Details */}
        <Button
          onClick={() => navigate(`/property-details?id=${property.propertyId}`)}
          variant="outline"
          size="sm"
          icon={Eye}
        >
          Details
        </Button>

        {/* 2. Generate Valuation Report */}
        <Button
          onClick={() => onGenerateReport(property, valuation)}
          variant="primary"
          size="sm"
          icon={FileSpreadsheet}
        >
          Report
        </Button>

        {/* 3. Compare Property */}
        <Button
          onClick={() => navigate(`/comparable-properties?id=${property.propertyId}`)}
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

  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportProp, setSelectedReportProp] = useState(null);
  const [selectedValuation, setSelectedValuation] = useState(null);

  useEffect(() => {
    getAllProperties()
      .then((res) => {
        const list = res.data.content || res.data || [];
        setPropertiesList(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading properties for valuation:", err);
        setLoading(false);
      });
  }, []);

  // Filtered properties
  const filteredProperties = propertiesList.filter((p) =>
    p.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.propertyCode && p.propertyCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleGenerateReportClick = (prop, val) => {
    setSelectedReportProp(prop);
    setSelectedValuation(val);
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
                    <p className="text-slate-500">Market Value: <strong className="text-blue-600 dark:text-cyan-400">₹ {(selectedReportProp.marketValue / 10000000).toFixed(2)} Cr</strong></p>
                    <p className="text-slate-500">Govt Guideline Value: <strong className="text-slate-900 dark:text-white">{selectedValuation && selectedValuation.averageComparableValue ? `₹ ${(selectedValuation.averageComparableValue * 0.72 / 10000000).toFixed(2)} Cr` : "₹ -- Cr"}</strong></p>
                    <p className="text-slate-500">Estimated AI Value: <strong className="text-emerald-600 dark:text-emerald-400">{selectedValuation && selectedValuation.estimatedMarketValue ? `₹ ${(selectedValuation.estimatedMarketValue / 10000000).toFixed(2)} Cr` : "₹ -- Cr"}</strong></p>
                    <p className="text-slate-500">Appreciation Rate: <strong className="text-emerald-500">+12.4% p.a.</strong></p>
                    <p className="text-slate-500">Investment Status: <strong className="text-purple-600 dark:text-purple-400">{selectedValuation?.valuationStatus || "FAIRLY VALUED"}</strong></p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex justify-end gap-3">
                    <Button onClick={() => setReportModalOpen(false)} variant="secondary" size="sm">Close</Button>
                    <Button onClick={() => { setReportModalOpen(false); exportToPdf(`Valuation_Report_${selectedReportProp.propertyCode || selectedReportProp.propertyId}`, selectedReportProp); }} variant="primary" size="sm" icon={FileDown}>Download PDF</Button>
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
