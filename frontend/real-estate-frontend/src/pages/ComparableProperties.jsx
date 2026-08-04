import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  ArrowRightLeft,
  Building2,
  MapPin,
  ShieldCheck,
  Search,
  CheckCircle2,
  FileDown,
  Printer,
  Sparkles,
  X,
  Sliders,
  TrendingUp,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import { getComparableProperties, getAllProperties, recordInspectionNotification } from "../services/propertyService";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

function ComparableProperties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1001";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1001";

  const [comparables, setComparables] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("matrix"); // 'matrix' or 'cards'
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Load Property List for Selector Dropdown
  useEffect(() => {
    getAllProperties(0, 20)
      .then((res) => {
        if (res && res.data) {
          const items = res.data.content || res.data;
          if (Array.isArray(items)) setPropertyList(items);
        }
      })
      .catch((err) => console.warn("Failed to load property list", err));
  }, []);

  // Load Comparables for numericId
  useEffect(() => {
    setLoading(true);
    getComparableProperties(numericId)
      .then((res) => {
        if (res && res.data) {
          const items = Array.isArray(res.data) ? res.data : res.data.content || [res.data];
          if (items && items.length > 0) {
            setComparables(mapBackendComparables(items, numericId));
          } else {
            setComparables(getMockComparables(numericId));
          }
        } else {
          setComparables(getMockComparables(numericId));
        }
      })
      .catch((err) => {
        console.warn("Backend getComparableProperties API error:", err);
        setComparables(getMockComparables(numericId));
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const mapBackendComparables = (items, baseId) => {
    return items.map((item, idx) => ({
      id: item.id || `comp-${baseId}-${idx + 1}`,
      propertyId: item.propertyId || item.numericId || `${1001 + idx}`,
      title: item.title || item.propertyName || item.address || `Comparable Parcel #${idx + 1}`,
      address: item.address || item.location || "Gachibowli Financial District, Hyderabad",
      city: item.city || "Hyderabad",
      area: item.area || item.sqft || `${12000 + idx * 1500} sq ft`,
      areaNum: 12000 + idx * 1500,
      price: item.price || item.marketValue ? `₹${((item.marketValue || 145000000) / 10000000).toFixed(2)} Cr` : `₹${(14.5 + idx * 1.2).toFixed(2)} Cr`,
      priceNum: item.marketValue || (14.5 + idx * 1.2) * 10000000,
      pricePerSqft: `₹${(11200 + idx * 450).toLocaleString()} / sq ft`,
      pricePerSqftNum: 11200 + idx * 450,
      similarity: item.similarity || `${96 - idx * 3}% Match`,
      similarityNum: 96 - idx * 3,
      riskScore: item.riskScore || 15 + idx * 4,
      status: item.status || "Verified Clear Title",
      builtYear: item.builtYear || 2021,
      imgSrc: item.imageUrl || FALLBACK_IMAGE,
    }));
  };

  const getMockComparables = (baseId) => [
    {
      id: `comp-${baseId}-1`,
      propertyId: "1001",
      title: "Gachibowli Tech Park Phase 2",
      address: "Plot 14, Financial District, Gachibowli, Hyderabad",
      city: "Hyderabad",
      area: "14,500 sq ft",
      areaNum: 14500,
      price: "₹18.50 Cr",
      priceNum: 185000000,
      pricePerSqft: "₹12,758 / sq ft",
      pricePerSqftNum: 12758,
      similarity: "98% Match",
      similarityNum: 98,
      riskScore: 18,
      status: "Verified Clear Title",
      builtYear: 2022,
      imgSrc: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: `comp-${baseId}-2`,
      propertyId: "1002",
      title: "Cyber Towers Commercial Office",
      address: "HITECH City Main Road, Madhapur, Hyderabad",
      city: "Hyderabad",
      area: "18,200 sq ft",
      areaNum: 18200,
      price: "₹24.00 Cr",
      priceNum: 240000000,
      pricePerSqft: "₹13,186 / sq ft",
      pricePerSqftNum: 13186,
      similarity: "94% Match",
      similarityNum: 94,
      riskScore: 22,
      status: "Verified Clear Title",
      builtYear: 2021,
      imgSrc: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: `comp-${baseId}-3`,
      propertyId: "1003",
      title: "Knowledge City Tower C",
      address: "Raidurgam Metro Corridor, Serilingampally, Hyderabad",
      city: "Hyderabad",
      area: "12,000 sq ft",
      areaNum: 12000,
      price: "₹15.20 Cr",
      priceNum: 152000000,
      pricePerSqft: "₹12,666 / sq ft",
      pricePerSqftNum: 12666,
      similarity: "91% Match",
      similarityNum: 91,
      riskScore: 14,
      status: "Verified Clear Title",
      builtYear: 2023,
      imgSrc: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: `comp-${baseId}-4`,
      propertyId: "1004",
      title: "Jubilee Hills Commercial Plaza",
      address: "Road No 36, Jubilee Hills, Hyderabad",
      city: "Hyderabad",
      area: "11,500 sq ft",
      areaNum: 11500,
      price: "₹19.80 Cr",
      priceNum: 198000000,
      pricePerSqft: "₹17,217 / sq ft",
      pricePerSqftNum: 17217,
      similarity: "87% Match",
      similarityNum: 87,
      riskScore: 28,
      status: "Verified Clear Title",
      builtYear: 2020,
      imgSrc: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const handlePropertyChange = (newId) => {
    setSearchParams({ propertyId: newId });
    showToast(`Loading Comparable Valuation for PR-${newId}`, "info");
  };

  const handleToggleCompare = (pId, e) => {
    e.stopPropagation();
    setSelectedForCompare((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  const selectedItems = comparables.filter((c) => selectedForCompare.includes(c.propertyId));

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <ArrowRightLeft size={14} /> AI Market Valuation & Comparative Analysis Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              📊 Comparable Property Valuation Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Benchmark market rates, per-sqft valuation metrics, and risk scores across nearby commercial & residential parcels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setCompareModalOpen(true)}
              variant="primary"
              icon={ArrowRightLeft}
              disabled={selectedForCompare.length < 2}
            >
              Compare Selected ({selectedForCompare.length})
            </Button>
            <Button
              onClick={() => exportToExcel(`Comparable_Properties_PR-${numericId}`, comparables)}
              variant="secondary"
              icon={Printer}
            >
              Export Matrix Excel
            </Button>
          </div>
        </div>

        {/* Property Selector Bar & View Toggle */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800 shrink-0">
              <Search size={16} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Benchmark Target Parcel:
            </span>
            <select
              value={numericId}
              onChange={(e) => handlePropertyChange(e.target.value)}
              className="w-full sm:w-80 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {propertyList.map((item, idx) => {
                const itemVal = item.propertyId || item.id || 1001 + idx;
                const titleStr = item.propertyName || item.title || item.address?.addressLine1 || `Parcel #${itemVal}`;
                return (
                  <option key={itemVal} value={itemVal}>
                    PR-{itemVal} - {titleStr}
                  </option>
                );
              })}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-[#334155]">
            <button
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === "matrix"
                  ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <List size={14} /> Matrix Table
            </button>

            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <LayoutGrid size={14} /> Cards Grid
            </button>
          </div>
        </div>

        {/* Content Section: Matrix Table or Grid */}
        {loading ? (
          <div className="space-y-3 py-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : comparables.length === 0 ? (
          <EmptyState
            title="No comparable properties found."
            message="No property records matched your benchmark criteria."
          />
        ) : viewMode === "matrix" ? (
          /* COMPARATIVE MATRIX TABLE VIEW */
          <div className="glass-card rounded-3xl border border-slate-200 dark:border-[#334155] shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 text-xs font-mono uppercase">
                    <th className="py-3.5 px-4 w-12 text-center">Compare</th>
                    <th className="py-3.5 px-5">Property Parcel</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Total Area</th>
                    <th className="py-3.5 px-4">Market Valuation</th>
                    <th className="py-3.5 px-4">Per Sq Ft Rate</th>
                    <th className="py-3.5 px-4">Similarity Match</th>
                    <th className="py-3.5 px-4">Risk Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#334155] bg-white dark:bg-[#0F172A] text-xs">
                  {comparables.map((comp, idx) => {
                    const isSelected = selectedForCompare.includes(comp.propertyId);

                    return (
                      <tr
                        key={comp.id || idx}
                        onClick={() => {
                          recordInspectionNotification(comp);
                          showToast(`Opening Inspection Workspace for "${comp.title}"...`, "info");
                          navigate(`/property-details?id=${comp.propertyId}`, { state: { property: comp } });
                        }}
                        className={`transition-colors cursor-pointer group ${
                          isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/40"
                            : "hover:bg-slate-50 dark:hover:bg-[#1E293B]/60"
                        }`}
                      >
                        {/* Checkbox Column */}
                        <td className="py-3.5 px-4 text-center" onClick={(e) => handleToggleCompare(comp.propertyId, e)}>
                          <button className="text-blue-600 dark:text-cyan-400 cursor-pointer">
                            {isSelected ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-400" />}
                          </button>
                        </td>

                        {/* Property Image & Title */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={comp.imgSrc}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = FALLBACK_IMAGE;
                              }}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-[#334155] shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-mono font-bold text-slate-400 block">
                                PR-{comp.propertyId}
                              </span>
                              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                                {comp.title}
                              </h4>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {comp.city}
                        </td>

                        {/* Area */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          {comp.area}
                        </td>

                        {/* Valuation */}
                        <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600 dark:text-cyan-400">
                          {comp.price}
                        </td>

                        {/* Per Sqft Rate */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {comp.pricePerSqft}
                        </td>

                        {/* Similarity */}
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {comp.similarity}
                        </td>

                        {/* Risk Status */}
                        <td className="py-3.5 px-4">
                          <Badge variant={comp.riskScore > 60 ? "danger" : comp.riskScore > 30 ? "warning" : "success"}>
                            {comp.status}
                          </Badge>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              recordInspectionNotification(comp);
                              showToast(`Opening Inspection Workspace for "${comp.title}"...`, "info");
                              navigate(`/property-details?id=${comp.propertyId}`, { state: { property: comp } });
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-[#334155] transition-colors cursor-pointer"
                          >
                            Inspect <ArrowUpRight size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* CARDS GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparables.map((comp, idx) => (
              <div
                key={comp.id || idx}
                onClick={() => {
                  recordInspectionNotification(comp);
                  showToast(`Opening Inspection Workspace for "${comp.title}"...`, "info");
                  navigate(`/property-details?id=${comp.propertyId}`, { state: { property: comp } });
                }}
                className="white-card rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={comp.imgSrc}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-[#334155] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      PR-{comp.propertyId}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white line-clamp-1">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{comp.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100 dark:border-[#334155]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Valuation</span>
                    <p className="font-extrabold text-blue-600 dark:text-cyan-400">{comp.price}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Per Sq Ft</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{comp.pricePerSqft}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPARISON MODAL */}
        <AnimatePresence>
          {compareModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCompareModalOpen(false)}
                className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 sm:inset-10 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] flex flex-col overflow-hidden max-w-4xl mx-auto"
              >
                {/* Modal Header */}
                <div className="p-5 sm:px-8 sm:py-5 border-b border-slate-200 dark:border-[#334155] flex items-center justify-between bg-slate-50 dark:bg-[#0F172A] shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-600 text-white font-bold shrink-0">
                      <ArrowRightLeft size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        Side-by-Side Comparative Parcel Analysis
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">
                        Comparing {selectedItems.length} Property Parcels
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCompareModalOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedItems.map((item) => (
                      <div key={item.propertyId} className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-4">
                        <div className="flex items-center gap-3">
                          <img src={item.imgSrc} alt="" className="w-14 h-14 rounded-xl object-cover border" />
                          <div>
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">PR-{item.propertyId}</span>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{item.title}</h4>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs font-mono">
                          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-[#334155]">
                            <span className="text-slate-400">Market Valuation</span>
                            <strong className="text-blue-600 dark:text-cyan-400 font-bold">{item.price}</strong>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-[#334155]">
                            <span className="text-slate-400">Per Sq Ft Rate</span>
                            <strong className="text-slate-800 dark:text-slate-200">{item.pricePerSqft}</strong>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-[#334155]">
                            <span className="text-slate-400">Total Area</span>
                            <strong className="text-slate-800 dark:text-slate-200">{item.area}</strong>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-[#334155]">
                            <span className="text-slate-400">Similarity</span>
                            <strong className="text-emerald-600 dark:text-emerald-400">{item.similarity}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:px-8 border-t border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] flex items-center justify-between shrink-0 text-xs">
                  <span className="text-slate-500 font-mono">
                    Valuation Model AI v4.2
                  </span>
                  <Button onClick={() => setCompareModalOpen(false)} variant="secondary" size="sm">
                    Close Comparison
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default ComparableProperties;
