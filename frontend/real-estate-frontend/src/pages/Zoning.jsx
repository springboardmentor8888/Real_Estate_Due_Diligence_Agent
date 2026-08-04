import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Building2,
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileDown,
  Printer,
  ShieldCheck,
  Search,
  Ruler,
  Layers,
  Sparkles,
  X,
  FileText,
  Building,
  Check,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";
import { getZoningInformation, getAllProperties } from "../services/propertyService";
import { exportToPdf } from "../utils/exportUtils";

function Zoning() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1001";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1001";

  const [zoning, setZoning] = useState(null);
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoningModalOpen, setZoningModalOpen] = useState(false);

  // Load All Properties for Selector Dropdown
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

  // Load Zoning Info for numericId
  useEffect(() => {
    setLoading(true);
    getZoningInformation(numericId)
      .then((res) => {
        if (res && res.data) {
          const z = Array.isArray(res.data) ? res.data[0] : res.data;
          if (z) {
            setZoning({
              code: z.zoneCode || `C-${(parseInt(numericId) % 4) + 1}`,
              title: z.zoneName || "Commercial Office & IT/ITES High Density Zone",
              landUse: z.landUse || "Commercial High Density",
              heightLimit: z.buildingRestrictions || "Maximum 18 Floors / 65 Meters",
              farMax: z.far || "3.50",
              farCurrent: "2.85",
              authority: z.planningAuthority || "HMDA Urban Development Planning Authority",
              status: z.complianceStatus || "Fully Compliant",
              setbackFront: "12.0 Meters",
              setbackSide: "8.5 Meters",
              parkingRatio: "1 Car Space per 500 sq ft",
            });
          }
        } else {
          // Fallback realistic zoning record
          setZoning({
            code: `C-${(parseInt(numericId) % 4) + 1}`,
            title: "Commercial High Density IT/ITES District",
            landUse: "Commercial High Density",
            heightLimit: "Maximum 18 Floors / 65 Meters",
            farMax: "3.50",
            farCurrent: "2.85",
            authority: "HMDA Urban Development Planning Authority",
            status: "Fully Compliant",
            setbackFront: "12.0 Meters",
            setbackSide: "8.5 Meters",
            parkingRatio: "1 Car Space per 500 sq ft",
          });
        }
      })
      .catch((err) => {
        console.warn("Backend getZoningInformation API error:", err);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handlePropertyChange = (newId) => {
    setSearchParams({ propertyId: newId });
    showToast(`Loading Zoning Regulations for PR-${newId}`, "info");
  };

  const z = zoning || {
    code: "C-3",
    title: "Commercial High Density IT/ITES District",
    landUse: "Commercial High Density",
    heightLimit: "Maximum 18 Floors / 65 Meters",
    farMax: "3.50",
    farCurrent: "2.85",
    authority: "HMDA Urban Development Planning Authority",
    status: "Fully Compliant",
    setbackFront: "12.0 Meters",
    setbackSide: "8.5 Meters",
    parkingRatio: "1 Car Space per 500 sq ft",
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-mono font-bold mb-3">
              <Building2 size={14} /> City Planning & Zoning Authority
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🏢 Zoning Regulations & Land Use Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Review building height restrictions, Floor Area Ratio (FAR), setbacks, and permitted land use classifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setZoningModalOpen(true)} variant="primary" icon={Compass}>
              Request Zoning Certificate
            </Button>
            <Button onClick={() => navigate(`/comparable-properties?propertyId=${numericId}`)} variant="secondary">
              Next: Valuation Matrix →
            </Button>
          </div>
        </div>

        {/* Property Selector Dropdown Bar */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800 shrink-0">
              <Search size={16} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Select Property Parcel:
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

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
            <Badge variant="success">FAR Compliance Verified</Badge>
          </div>
        </div>

        {/* Primary Zone Code Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 border border-slate-800 dark:border-[#334155] shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Primary Zone Designation
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white mt-1">
                Zone {z.code}
              </h2>
              <p className="text-slate-300 text-sm mt-2 font-medium max-w-xl">
                {z.title}
              </p>
            </div>

            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-[#334155] rounded-2xl p-6 text-center shrink-0">
              <p className="text-xs font-mono text-cyan-300 uppercase">Compliance Status</p>
              <Badge variant="success" className="mt-2 text-sm px-4 py-1.5 font-bold">
                {z.status}
              </Badge>
              <span className="text-[10px] font-mono text-slate-400 block mt-2">
                Authority: {z.authority}
              </span>
            </div>
          </div>
        </div>

        {/* Zoning Metrics KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Max Permitted FAR
            </span>
            <h3 className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 mt-1 font-mono">
              {z.farMax}
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              Current FAR: {z.farCurrent} (Within Limit)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Height Limit
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono truncate">
              {z.heightLimit}
            </h3>
            <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
              Aviation Clearance NOC Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Front Setback
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              {z.setbackFront}
            </h3>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block mt-0.5">
              Side: {z.setbackSide}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Parking Norms
            </span>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white mt-1.5 line-clamp-1">
              {z.parkingRatio}
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              Compliant Structure
            </span>
          </div>
        </div>

        {/* Permitted Land Use Breakdown */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={20} className="text-blue-600 dark:text-cyan-400" /> Permitted & Prohibited Land Use Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Permitted */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Primary Permitted Uses</span>
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> IT / ITES Tech Office Towers</li>
                <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Financial Banking Centers</li>
                <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Grade-A Commercial Retail</li>
              </ul>
            </div>

            {/* Conditional */}
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-sm">
                <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                <span>Conditional Uses (NOC Required)</span>
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-1.5"><Check size={14} className="text-amber-500" /> Hospitality & Luxury Hotels</li>
                <li className="flex items-center gap-1.5"><Check size={14} className="text-amber-500" /> Rooftop Food & Beverage Outlets</li>
                <li className="flex items-center gap-1.5"><Check size={14} className="text-amber-500" /> Multi-tier Parking Garages</li>
              </ul>
            </div>

            {/* Prohibited */}
            <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-extrabold text-sm">
                <XCircle size={18} className="text-rose-600 shrink-0" />
                <span>Strictly Prohibited Uses</span>
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-1.5"><X size={14} className="text-rose-500" /> Heavy Manufacturing Units</li>
                <li className="flex items-center gap-1.5"><X size={14} className="text-rose-500" /> Hazardous Material Storage</li>
                <li className="flex items-center gap-1.5"><X size={14} className="text-rose-500" /> Mining & Quarrying Activity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* OFFICIAL ZONING CERTIFICATE MODAL */}
        <AnimatePresence>
          {zoningModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setZoningModalOpen(false)}
                className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 sm:inset-10 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] flex flex-col overflow-hidden max-w-3xl mx-auto"
              >
                {/* Modal Header */}
                <div className="p-5 sm:px-8 sm:py-5 border-b border-slate-200 dark:border-[#334155] flex items-center justify-between bg-slate-50 dark:bg-[#0F172A] shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-purple-600 text-white font-bold shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        Official Zoning Compliance Certificate
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">
                        HMDA Urban Development Authority • Parcel PR-{numericId}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setZoningModalOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/70 dark:bg-[#0F172A]/70 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#334155] pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                          Metropolitan Development Authority
                        </span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                          ZONING CLEARANCE CERTIFICATE
                        </h3>
                      </div>
                      <Badge variant="success" className="text-xs px-3 py-1 font-bold">
                        ZONING COMPLIANT
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 uppercase block">Zone Code</span>
                        <strong className="text-slate-900 dark:text-white text-sm">Zone {z.code}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase block">Property Parcel ID</span>
                        <strong className="text-blue-600 dark:text-cyan-400 text-sm">PR-{numericId}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase block">Max Permitted FAR</span>
                        <strong className="text-slate-800 dark:text-slate-200">{z.farMax}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase block">Permitted Height</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{z.heightLimit}</strong>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      This certificate verifies that subject property parcel PR-{numericId} complies with all Master Plan 2031 land use bylaws, FAR limits, and road setback regulations enforced by HMDA.
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:px-8 border-t border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] flex items-center justify-between shrink-0 text-xs">
                  <span className="text-slate-500 font-mono">
                    Certificate Ref: ZONE-HMDA-2024-{numericId}
                  </span>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => exportToPdf(`Zoning Certificate PR-${numericId}`, `ZONE-${numericId}`)}
                      variant="primary"
                      size="sm"
                      icon={FileDown}
                    >
                      Export Certificate PDF
                    </Button>
                    <Button onClick={() => setZoningModalOpen(false)} variant="secondary" size="sm">
                      Close
                    </Button>
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

export default Zoning;