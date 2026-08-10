import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  ArrowRightLeft,
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  FileDown,
  RotateCcw,
  Scale,
  DollarSign,
  TrendingUp,
  Award,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Receipt,
  Percent,
  Landmark,
  ShieldAlert,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import { exportToPdf } from "../utils/exportUtils";
import PropertyContextSwitcher from "../components/common/PropertyContextSwitcher";
import { getLiveActiveProperty } from "../services/liveStore";
import { getComparableAnalysis, getComparablePropertiesByProperty } from "../services/comparableService";
import { getValuationByProperty } from "../services/valuationService";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

// Comprehensive Mock Data for 6 Master Parcels covering all requested comparison table fields
const MASTER_COMPARE_PROPERTIES = [
  {
    numericId: "1001",
    id: "PR-1001",
    propertyName: "Gachibowli Tech Park Phase 2",
    city: "Hyderabad",
    address: "Plot 45, Financial District, Hyderabad",
    marketValue: "₹ 45.00 Cr",
    marketValueNum: 450000000,
    governmentValue: "₹ 32.50 Cr",
    taxStatus: "Zero Dues Verified",
    loanEligibility: "94% Eligible (High)",
    riskScore: "14/100 (Low Risk)",
    riskScoreNum: 14,
    investmentScore: "92/100 (AAA Rating)",
    priceTrend: "+12.4% p.a.",
    rentalYield: "7.8% p.a.",
    imgSrc: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    numericId: "1002",
    id: "PR-1002",
    propertyName: "Jubilee Hills Commercial Plot 36",
    city: "Hyderabad",
    address: "Road No. 36, Jubilee Hills, Hyderabad",
    marketValue: "₹ 38.00 Cr",
    marketValueNum: 380000000,
    governmentValue: "₹ 26.80 Cr",
    taxStatus: "Zero Dues Verified",
    loanEligibility: "72% Eligible (Medium)",
    riskScore: "68/100 (High Risk)",
    riskScoreNum: 68,
    investmentScore: "86/100 (AA+ Rating)",
    priceTrend: "+14.2% p.a.",
    rentalYield: "6.5% p.a.",
    imgSrc: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    numericId: "1003",
    id: "PR-1003",
    propertyName: "Whitefield Horizon Tech Campus",
    city: "Bengaluru",
    address: "EPIP Zone, Phase 2, Whitefield, Bengaluru",
    marketValue: "₹ 165.00 Cr",
    marketValueNum: 1650000000,
    governmentValue: "₹ 118.00 Cr",
    taxStatus: "Zero Dues Verified",
    loanEligibility: "96% Eligible (High)",
    riskScore: "18/100 (Low Risk)",
    riskScoreNum: 18,
    investmentScore: "95/100 (AAA Rating)",
    priceTrend: "+15.8% p.a.",
    rentalYield: "8.4% p.a.",
    imgSrc: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  },
  {
    numericId: "1004",
    id: "PR-1004",
    propertyName: "Financial District Commercial Plot",
    city: "Hyderabad",
    address: "Nanakramguda, Financial District, Hyderabad",
    marketValue: "₹ 52.00 Cr",
    marketValueNum: 520000000,
    governmentValue: "₹ 37.20 Cr",
    taxStatus: "Zero Dues Verified",
    loanEligibility: "90% Eligible (High)",
    riskScore: "22/100 (Low Risk)",
    riskScoreNum: 22,
    investmentScore: "90/100 (AAA Rating)",
    priceTrend: "+11.6% p.a.",
    rentalYield: "7.2% p.a.",
    imgSrc: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    numericId: "1005",
    id: "PR-1005",
    propertyName: "BKC Prime Commercial Hub",
    city: "Mumbai",
    address: "G-Block, Bandra Kurla Complex, Mumbai",
    marketValue: "₹ 210.00 Cr",
    marketValueNum: 2100000000,
    governmentValue: "₹ 155.00 Cr",
    taxStatus: "Zero Dues Verified",
    loanEligibility: "95% Eligible (High)",
    riskScore: "12/100 (Low Risk)",
    riskScoreNum: 12,
    investmentScore: "98/100 (AAA Rating)",
    priceTrend: "+16.5% p.a.",
    rentalYield: "8.9% p.a.",
    imgSrc: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    numericId: "1006",
    id: "PR-1006",
    propertyName: "Cyber City Office Tower",
    city: "Gurugram",
    address: "DLF Cyber City, Phase 2, Gurugram",
    marketValue: "₹ 140.00 Cr",
    marketValueNum: 1400000000,
    governmentValue: "₹ 98.00 Cr",
    taxStatus: "Zero Dues Verified",
    loanEligibility: "88% Eligible (High)",
    riskScore: "20/100 (Low Risk)",
    riskScoreNum: 20,
    investmentScore: "91/100 (AAA Rating)",
    priceTrend: "+13.8% p.a.",
    rentalYield: "7.9% p.a.",
    imgSrc: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  },
];

function ComparableProperties() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const propertyIdParam = searchParams.get("id") || searchParams.get("propertyId") || localStorage.getItem("active_property_id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  // State: Selected Property IDs (Allow selecting up to three properties)
  const [selectedIds, setSelectedIds] = useState(["1001", "1002", "1004"]);
  const [isComparing, setIsComparing] = useState(false);

  // Dynamic Location-Based Synchronization Engine:
  // When active parcel changes, re-center comparison pool around the active parcel and its same-location peers!
  useEffect(() => {
    const activeObj = MASTER_COMPARE_PROPERTIES.find((p) => p.numericId === numericId) || MASTER_COMPARE_PROPERTIES[0];
    const activeCity = activeObj.city;

    // Filter properties in same city first, then other cities
    const sameCityOthers = MASTER_COMPARE_PROPERTIES.filter((p) => p.city === activeCity && p.numericId !== numericId);
    const diffCityOthers = MASTER_COMPARE_PROPERTIES.filter((p) => p.city !== activeCity && p.numericId !== numericId);

    const orderedPool = [activeObj, ...sameCityOthers, ...diffCityOthers];
    const initialThree = orderedPool.slice(0, 3).map((p) => p.numericId);

    setSelectedIds(initialThree);
  }, [numericId, searchParams]);

  // Toggle Selection (Max 3)
  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) {
        showToast("At least one property must remain selected for comparison.", "warning");
        return;
      }
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      if (selectedIds.length >= 3) {
        showToast("You can select up to three properties for comparison.", "warning");
        return;
      }
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  // Selected property objects
  const selectedProperties = useMemo(() => {
    return MASTER_COMPARE_PROPERTIES.filter((p) => selectedIds.includes(p.numericId));
  }, [selectedIds]);

  // THE 3 REQUIRED BUTTON HANDLERS
  // 1. Compare
  const handleRunCompare = () => {
    setIsComparing(true);
    showToast("Generating location-benchmarked side-by-side comparison...", "info");
    setTimeout(() => {
      setIsComparing(false);
      showSuccessAlert("Location Matrix Updated", `Comparing ${selectedProperties.length} selected commercial properties.`);
    }, 600);
  };

  // 2. Generate Comparison Report
  const handleGenerateComparisonReport = () => {
    exportToPdf(`Property_Comparison_Report_${selectedIds.join("-")}`, selectedProperties);
    showSuccessAlert("Comparison Report Exported", `Generated location comparison report for ${selectedProperties.length} properties.`);
  };

  // 3. Reset
  const handleReset = () => {
    const activeObj = MASTER_COMPARE_PROPERTIES.find((p) => p.numericId === numericId) || MASTER_COMPARE_PROPERTIES[0];
    const activeCity = activeObj.city;
    const sameCityOthers = MASTER_COMPARE_PROPERTIES.filter((p) => p.city === activeCity && p.numericId !== numericId);
    const diffCityOthers = MASTER_COMPARE_PROPERTIES.filter((p) => p.city !== activeCity && p.numericId !== numericId);
    const initialThree = [activeObj, ...sameCityOthers, ...diffCityOthers].slice(0, 3).map((p) => p.numericId);
    setSelectedIds(initialThree);
    showSuccessAlert("Selection Reset", "Property selection reset to location-matched defaults.");
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Side-by-Side Property Comparison Matrix
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-blue-800">
            {selectedProperties.length} OF 3 PROPERTIES SELECTED
          </span>
        </div>

        {/* PROPERTY CONTEXT SWITCHER BAR */}
        <PropertyContextSwitcher currentPropertyId={numericId} />

        {/* HERO BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <ArrowRightLeft size={14} /> Side-by-Side Underwriting Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              📊 Compare Commercial Properties
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Select up to three commercial properties to benchmark Market Value, Government Ready Reckoner Value, Tax Clearance Status, Loan Eligibility, Risk Score, Investment Score, Price Trend, and Rental Yield.
            </p>
          </div>

          {/* THE 3 REQUIRED ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* 1. Compare */}
            <Button
              onClick={handleRunCompare}
              loading={isComparing}
              variant="primary"
              size="sm"
              icon={ArrowRightLeft}
            >
              Compare
            </Button>

            {/* 2. Generate Comparison Report */}
            <Button
              onClick={handleGenerateComparisonReport}
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
            >
              Generate Comparison Report
            </Button>

            {/* 3. Reset */}
            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
              icon={RotateCcw}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* DYNAMIC LOCATION-MATCHED PROPERTY SELECTION CARDS (UP TO THREE PROPERTIES) */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                LOCATION BENCHMARK SELECTOR
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                Select Up to Three Properties for Location Benchmarking
              </h2>
            </div>

            <span className="text-slate-400 font-bold">{selectedIds.length}/3 Selected</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {MASTER_COMPARE_PROPERTIES.map((prop) => {
              const isSelected = selectedIds.includes(prop.numericId);
              return (
                <div
                  key={prop.id}
                  onClick={() => handleToggleSelect(prop.numericId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-md"
                      : "bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-[#334155] hover:border-slate-300"
                  }`}
                >
                  <div className="shrink-0 text-blue-600 dark:text-cyan-400">
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-400" />}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">{prop.id}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-300">
                        {prop.city}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">{prop.propertyName}</h3>
                    <p className="text-slate-500 text-[10px] truncate">{prop.address}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPARISON TABLE COVERING ALL 8 REQUIRED FIELDS */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <div>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                BENCHMARK MATRIX
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                ⚖️ Side-by-Side Comparison Table
              </h2>
            </div>

            <Badge variant="success">Comparing {selectedProperties.length} Parcels</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#334155] text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-4 px-4 w-1/4">Comparison Metric</th>
                  {selectedProperties.map((p) => (
                    <th key={p.id} className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 text-[10px]">
                          {p.id}
                        </span>
                        <span className="truncate">{p.propertyName} ({p.city})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/60 font-medium">
                {/* Location / Address */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MapPin size={14} className="text-blue-500" /> Location & City
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {p.city} • {p.address}
                    </td>
                  ))}
                </tr>

                {/* 1. Market Value */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <DollarSign size={14} className="text-blue-500" /> 1. Market Value
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-extrabold text-blue-600 dark:text-cyan-400">
                      {p.marketValue}
                    </td>
                  ))}
                </tr>

                {/* 2. Government Value */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Building2 size={14} className="text-purple-500" /> 2. Government Ready Reckoner Value
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {p.governmentValue}
                    </td>
                  ))}
                </tr>

                {/* 3. Tax Status */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Receipt size={14} className="text-emerald-500" /> 3. Tax Clearance Status
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-bold">
                      <Badge variant="success">{p.taxStatus}</Badge>
                    </td>
                  ))}
                </tr>

                {/* 4. Loan Eligibility */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Landmark size={14} className="text-blue-500" /> 4. Loan Eligibility
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-bold text-blue-600 dark:text-cyan-300">
                      {p.loanEligibility}
                    </td>
                  ))}
                </tr>

                {/* 5. Risk Score */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-rose-500" /> 5. Risk Score
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-bold">
                      <Badge variant={p.riskScoreNum > 50 ? "danger" : "success"}>
                        {p.riskScore}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* 6. Investment Score */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Award size={14} className="text-amber-500" /> 6. Investment Score
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-extrabold text-amber-600 dark:text-amber-400">
                      {p.investmentScore}
                    </td>
                  ))}
                </tr>

                {/* 7. Price Trend */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <TrendingUp size={14} className="text-emerald-500" /> 7. Annual Price Trend
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {p.priceTrend}
                    </td>
                  ))}
                </tr>

                {/* 8. Rental Yield */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#0F172A]">
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Percent size={14} className="text-purple-500" /> 8. Annual Rental Yield
                  </td>
                  {selectedProperties.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 font-extrabold text-purple-600 dark:text-purple-400">
                      {p.rentalYield}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ComparableProperties;
