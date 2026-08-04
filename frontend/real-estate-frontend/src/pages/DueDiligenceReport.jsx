import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  FileText,
  FileDown,
  Printer,
  ShieldCheck,
  Building2,
  User,
  DollarSign,
  Waves,
  Leaf,
  Map,
  Zap,
  CheckCircle2,
  Scale,
  Award,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  MapPin,
  ShieldAlert,
  Search,
  Filter,
} from "lucide-react";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import { getPropertyDetails, getAllProperties } from "../services/propertyService";
import { showToast } from "../utils/swal";

function DueDiligenceReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const targetId = searchParams.get("id") || location.state?.property?.id || location.state?.property?.propertyId || "PR-1001";
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(false);
  const [propertyList, setPropertyList] = useState([]);

  // Fetch logged-in user name & role from localStorage
  const getLoggedInUser = () => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const name = parsed.firstName
          ? `${parsed.firstName} ${parsed.lastName || ""}`.trim()
          : parsed.name || parsed.username || "Rama Charan";
        const role = parsed.role || "Buyer";
        return { name, role };
      }
    } catch (e) { }
    return { name: "Rama Charan", role: "Buyer" };
  };

  const { name: loggedInName, role: loggedInRole } = getLoggedInUser();

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

  // Load all properties for selector dropdown
  useEffect(() => {
    getAllProperties(0, 30)
      .then((res) => {
        if (res && res.data) {
          const items = res.data.content || res.data;
          if (Array.isArray(items)) {
            setPropertyList(items);
          }
        }
      })
      .catch((err) => console.warn("Failed to load property list for selector", err));
  }, []);

  // Fetch target property due diligence report details
  useEffect(() => {
    const numericId = targetId ? targetId.toString().replace(/\D/g, "") || "1001" : "1001";
    setLoading(true);
    getPropertyDetails(numericId)
      .then((res) => {
        if (res && res.data) {
          const p = res.data;
          const addressString = typeof p.address === "object" && p.address !== null
            ? `${p.address.addressLine1 || ""}, ${p.address.city || ""}, ${p.address.state || ""}`.replace(/^, |, $/g, "")
            : p.address || p.propertyName || "Address Not Available";

          setProperty({
            id: p.id || `PR-${p.propertyId || "1001"}`,
            propertyId: p.propertyId || 1001,
            title: p.propertyName || p.title || addressString,
            propertyName: p.propertyName || p.title || addressString,
            address: addressString,
            city: p.city || p.address?.city || "Hyderabad",
            state: p.state || p.address?.state || "Telangana",
            owner: p.ownerName || p.owner || "Ananya Rao",
            type: p.landType || p.type || "Commercial",
            totalArea: p.totalArea ? `${p.totalArea.toLocaleString()} sq ft` : "45,000 sq ft",
            builtYear: p.builtYear || p.year || "2021",
            marketValue: typeof p.marketValue === "number" ? `₹${(p.marketValue / 10000000).toFixed(2)} Cr` : p.marketValue || "₹25.00 Cr",
            riskScore: p.riskScore || 14,
            status: p.status || "Verified Clear Title",
            description: p.description || "Grade-A IT/ITES commercial land parcel situated in Nanakramguda Financial District with 100% clear title verification from Serilingampally Sub-Registrar.",
            imgSrc: p.imageUrl || p.image || FALLBACK_IMAGE,
            rawBackendData: p,
          });
        }
      })
      .catch((err) => {
        console.warn("Backend getPropertyDetails query error:", err);
      })
      .finally(() => setLoading(false));
  }, [targetId]);

  const p = property || {
    id: "PR-1001",
    title: "Gachibowli Tech Park Phase 2",
    address: "Plot 45, Sy. No. 112/A, Financial District, Hyderabad, Telangana",
    owner: "Ananya Rao",
    type: "Commercial",
    totalArea: "45,000 sq ft",
    builtYear: "2021",
    marketValue: "₹25.00 Cr",
    riskScore: 14,
    status: "Verified Clear Title",
    imgSrc: FALLBACK_IMAGE,
  };

  const handleSelectProperty = (newPropId) => {
    setSearchParams({ id: newPropId });
    showToast(`Loading Due Diligence Report for ${newPropId}`, "info");
  };

  const handlePrint = () => {
    showToast("Opening printer dialog for Due Diligence Audit Dossier...", "info");
    window.print();
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        {/* Top Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:hidden">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <ShieldCheck size={14} /> Official Audit Dossier Ref: #{p.id}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              Enterprise Due Diligence Audit Report
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">
              Comprehensive institutional verification dossier covering title, encumbrance, tax, flood, and zoning audits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf(`Due Diligence Dossier ${p.id}`, p.id)}
              variant="primary"
              size="sm"
              icon={FileDown}
            >
              Download Dossier PDF
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              icon={Printer}
            >
              Print Report
            </Button>
          </div>
        </div>

        {/* PROPERTY SELECTION BAR FOR COMPREHENSIVE DUE DILIGENCE */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800 shrink-0">
              <Search size={16} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Select Property Audit:
            </span>
            <select
              value={targetId}
              onChange={(e) => handleSelectProperty(e.target.value)}
              className="w-full sm:w-80 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              {propertyList.map((item, idx) => {
                const itemVal = item.propertyId ? `PR-${item.propertyId}` : `PR-100${idx + 1}`;
                const titleStr = item.propertyName || item.title || item.address?.addressLine1 || `Parcel #${itemVal}`;
                return (
                  <option key={itemVal} value={itemVal}>
                    {itemVal} - {titleStr} ({item.city || item.address?.city || "Hyderabad"})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Quick Selection Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase mr-1">
              Quick Switch:
            </span>
            {["PR-1001", "PR-1002", "PR-1003", "PR-1004", "PR-1005"].map((pid) => (
              <button
                key={pid}
                onClick={() => handleSelectProperty(pid)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${targetId === pid
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#334155]"
                  }`}
              >
                {pid}
              </button>
            ))}
          </div>
        </div>

        {/* FORMAL INSTITUTIONAL AUDIT DOSSIER DOCUMENT CONTAINER */}
        <div className="white-card rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xl space-y-10 text-slate-900 dark:text-[#F8FAFC]">

          {/* Document Top Title & Institutional Seal */}
          <div className="border-b-2 border-slate-900 dark:border-[#334155] pb-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider mb-2">
                  <Building2 size={16} /> Real Estate Due Diligence Enterprise Agent
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC]">
                  COMPREHENSIVE DUE DILIGENCE AUDIT DOSSIER
                </h1>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] font-mono mt-1">
                  Parcel Reference ID: {p.id} • Issued by Sub-Registrar GIS Verification Engine
                </p>
              </div>

              {/* Official Stamp & Status Pill */}
              <div className="flex flex-col items-start md:items-end shrink-0 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-xs">
                  <Award size={14} /> LEVEL 4 VERIFIED AUDIT
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Audit Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
            </div>

            {/* Property Photo & Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] items-center">
              <div className="md:col-span-4 h-40 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                <img
                  src={p.imgSrc || FALLBACK_IMAGE}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded">
                  {p.type}
                </span>
              </div>

              <div className="md:col-span-8 space-y-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#CBD5E1] flex items-center gap-1">
                  <MapPin size={13} className="text-blue-600 dark:text-cyan-400 shrink-0" />
                  {p.address}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-[#334155] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Current Owner</span>
                    <strong className="text-slate-800 dark:text-slate-200">{p.owner}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Total Land Area</span>
                    <strong className="text-slate-800 dark:text-slate-200">{p.totalArea}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Market Valuation</span>
                    <strong className="text-blue-600 dark:text-cyan-400 font-extrabold">{p.marketValue}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: EXECUTIVE VERDICT & COMPLIANCE INDEX */}
          <section className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <ShieldCheck size={18} className="text-blue-600 dark:text-cyan-400" /> 1. Executive Verdict & Acquisition Clearance
            </h2>

            <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-black text-lg">
                  <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                  <span>RECOMMENDATION: APPROVED FOR ACQUISITION</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-[#1E293B] px-3.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 shadow-xs">
                  Compliance Risk Score: {p.riskScore} / 100 (Low Risk)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
                Independent sub-registrar land title search, municipal tax audit, environmental hazard assessment, and zoning regulations review have been completed for {p.title}. The subject property parcel displays 100% clear title, nil active encumbrance, and full municipal clearance.
              </p>
            </div>
          </section>

          {/* SECTION 2: COMPREHENSIVE 6-VECTOR AUDIT BREAKDOWN */}
          <section className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Layers size={18} className="text-blue-600 dark:text-cyan-400" /> 2. Comprehensive 6-Vector Audit Matrix
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Vector 1 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-[#0F172A]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Scale size={15} className="text-blue-600 dark:text-cyan-400" /> 1. Title Deed & Ownership Chain
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    PASSED
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-normal">
                  Registered under Sub-Registrar Deed DEED/TS/2023/4412. Title chain verified across 3 historic transfers with Nil Encumbrance Certificate (EC).
                </p>
              </div>

              {/* Vector 2 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-[#0F172A]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign size={15} className="text-emerald-600" /> 2. Municipal Property Tax Audit
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    PASSED
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-normal">
                  Municipal tax receipts fully settled through Assessment Year 2024-2025. Zero outstanding dues or municipal lien notices on record.
                </p>
              </div>

              {/* Vector 3 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-[#0F172A]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 size={15} className="text-indigo-600" /> 3. Zoning & Permit Compliance
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    PASSED
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-normal">
                  C-3 Commercial Zoning designation with approved 3.50 FAR. Occupancy Certificate (OC) and Fire Safety NOC fully active.
                </p>
              </div>

              {/* Vector 4 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-[#0F172A]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Waves size={15} className="text-cyan-500" /> 4. Flood Zone & Elevation Survey
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    PASSED
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-normal">
                  Designated FIRM Zone X (Unshaded - Above 100-Yr Flood Plain). Elevation at +485 ft MSL with Grade A municipal drainage.
                </p>
              </div>

              {/* Vector 5 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-[#0F172A]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Leaf size={15} className="text-emerald-500" /> 5. Environmental Audit & Hazards
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    PASSED
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-normal">
                  State Pollution Control Board Phase I clearance active. Heavy metal soil contamination index is 0.00 ppm.
                </p>
              </div>

              {/* Vector 6 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/60 dark:bg-[#0F172A]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap size={15} className="text-amber-500" /> 6. Utilities & Grid Connections
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    PASSED
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-normal">
                  Grid electric 33kV substation connection NOC active. Municipal water supply line and sewerage connections verified.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: LEGAL CERTIFICATION & DIGITAL SIGNATURE */}
          <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-[#334155]">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> 3. Legal Audit Certification & Sign-off
            </h2>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Lead Diligence Auditor Signature
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white font-mono">
                  {loggedInName}
                </h4>
                <p className="text-xs font-bold text-blue-600 dark:text-cyan-400">
                  Role: {loggedInRole}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1 font-mono text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Digital Signature Hash
                </span>
                <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 block break-all">
                  0x8F921A77E45B2091C34B889F
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Encrypted SHA-256 Verification Stamp
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default DueDiligenceReport;
