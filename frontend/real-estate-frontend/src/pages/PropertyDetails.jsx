import React, { useState } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import InfoCard from "../components/property/InfoCard";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Home,
  User,
  Building2,
  MapPin,
  Ruler,
  BadgeCheck,
  Printer,
  Share2,
  Calendar,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Waves,
  Leaf,
  Map,
  Zap,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  ArrowLeft,
  Compass,
  RotateCcw,
} from "lucide-react";
import { showToast } from "../utils/swal";
import { INDIAN_PROPERTIES } from "../data/indianProperties";

function PropertyDetails() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Dynamic Lookup for the Selected Indian Property
  const targetId = searchParams.get("id") || location.state?.property?.id;
  const property =
    INDIAN_PROPERTIES.find((p) => p.id === targetId) ||
    location.state?.property ||
    INDIAN_PROPERTIES[0];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      showToast(`Refreshed due diligence records for ${property.id}`, "success");
    }, 500);
  };

  const handlePrint = () => {
    showToast(`Opening system print dialog for ${property.id}...`, "info");
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Property audit link for ${property.id} copied to clipboard!`, "success");
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/property-search"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Search Results
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Parcel ID: {property.id}
            </span>
            <Button onClick={handleRetry} variant="secondary" size="sm" icon={RotateCcw}>
              Refresh Audit
            </Button>
          </div>
        </div>

        {/* Flagship Hero Header Section (Clean Slate Theme) */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-8 lg:p-10 border border-slate-800 shadow-lg">
          <div className="relative z-10 space-y-6">
            {/* Top Bar: APN Badge & Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold bg-slate-800 text-cyan-300 px-3.5 py-1 rounded-full border border-slate-700">
                  {property.surveyNo} • APN: {property.id}
                </span>
                <Badge variant={property.variant}>{property.status}</Badge>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handlePrint} variant="secondary" size="sm" icon={Printer}>
                  Print Document
                </Button>
                <Button onClick={handleShare} variant="outline" size="sm" icon={Share2}>
                  Share Audit Link
                </Button>
              </div>
            </div>

            {/* Property Title & Unique Indian Address */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
                  <MapPin size={14} className="text-rose-400 shrink-0" />
                  <span>
                    {property.address} - PIN {property.pincode}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {property.title}
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  {property.description}
                </p>
              </div>

              {/* Diligence Score Gauge Card */}
              <div className="lg:col-span-4 shrink-0">
                <div className="rounded-2xl p-6 bg-slate-800/90 border border-slate-700 text-center shadow-md">
                  <p className="text-xs font-mono uppercase font-bold text-cyan-300 tracking-wider">
                    Due Diligence Score
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Award size={36} className="text-cyan-400" />
                    <span className="text-5xl font-extrabold text-white font-mono">
                      {property.score}
                    </span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-3 border ${
                      property.variant === "success"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                        : property.variant === "warning"
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                        : "bg-rose-500/20 text-rose-300 border-rose-400/30"
                    }`}
                  >
                    <ShieldCheck size={14} /> {property.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Information (Light Blue Section Card) */}
        <InfoCard
          title="Property Identification & Attributes"
          subtitle="Core land parcel metadata retrieved from official land registry records"
          icon={Home}
          variant="blue"
          collapsible
          defaultOpen
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Complete Address</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{property.address}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Registered Owner Name</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{property.owner}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">City & State</p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {property.city}, {property.state}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">PIN Code</p>
              <p className="text-sm font-bold text-slate-900 font-mono mt-1">{property.pincode}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Property Type</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{property.type}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Plot / Built Area</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{property.area}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Survey / Plot Number</p>
              <p className="text-sm font-bold text-slate-900 font-mono mt-1">{property.surveyNo}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Risk Assessment</p>
              <Badge variant={property.variant} className="mt-1">{property.status}</Badge>
            </div>
          </div>
        </InfoCard>

        {/* Ownership Records (Light Green Section Card) */}
        <InfoCard
          title="1. Ownership Records & Sub-Registrar Title"
          subtitle={`Retrieved from Sub-Registrar Office (${property.city}, ${property.state})`}
          icon={User}
          variant="green"
          collapsible
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/80 border border-emerald-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Current Registered Owner</p>
              <p className="text-base font-bold text-slate-900 mt-1">{property.owner}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-emerald-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Registration Jurisdiction</p>
              <p className="text-base font-bold text-slate-900 mt-1">{property.city} Sub-Registrar</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-emerald-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Deed Instrument #</p>
              <p className="text-base font-bold text-slate-900 font-mono mt-1">{property.deedId}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-emerald-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Encumbrance Status</p>
              <Badge variant={property.variant} className="mt-1">{property.status}</Badge>
            </div>
          </div>
        </InfoCard>

        {/* Tax History (Light Amber Section Card) */}
        <InfoCard
          title="2. Property Tax History Records"
          subtitle={`Verified by Municipal Corporation Tax Assessor (${property.city})`}
          icon={DollarSign}
          variant="amber"
          collapsible
          defaultOpen
        >
          <div className="overflow-x-auto rounded-xl border border-amber-200/80 bg-white">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-amber-100/80 text-amber-900 text-xs font-mono uppercase">
                  <th className="p-3.5 font-semibold">Tax Assessment Year</th>
                  <th className="p-3.5 font-semibold">Assessed Market Value</th>
                  <th className="p-3.5 font-semibold">Annual Tax Assessment</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold">Challan Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200/60">
                <tr className="hover:bg-amber-50/50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">FY 2025-26</td>
                  <td className="p-3.5 font-medium text-slate-700">{property.assessedVal}</td>
                  <td className="p-3.5 font-bold text-slate-900 font-mono">{property.taxStatus}</td>
                  <td className="p-3.5"><Badge variant={property.variant}>{property.status}</Badge></td>
                  <td className="p-3.5 text-xs text-slate-500 font-mono">CH-IND-2025-88</td>
                </tr>
              </tbody>
            </table>
          </div>
        </InfoCard>

        {/* Zoning Information (Light Blue Section Card) */}
        <InfoCard
          title="3. Zoning Information & Development Rules"
          subtitle={`Urban Development Authority (${property.state})`}
          icon={Building2}
          variant="blue"
          collapsible
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Zoning Code</p>
              <p className="text-base font-bold text-blue-700 font-mono mt-1">{property.zoning}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Max Height Limit</p>
              <p className="text-base font-bold text-slate-900 mt-1">18 Meters</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Allowable FAR</p>
              <p className="text-base font-bold text-slate-900 mt-1">2.0 Floor Area Ratio</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-blue-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Authority</p>
              <p className="text-base font-bold text-slate-900 mt-1">{property.city} Urban Authority</p>
            </div>
          </div>
        </InfoCard>

        {/* Flood Zone & Risk (Light Red Section Card) */}
        <InfoCard
          title="4. Flood Zone Information"
          subtitle="Irrigation & Flood Control Board Assessment"
          icon={Waves}
          variant="red"
          collapsible
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/80 border border-rose-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Flood Risk Rating</p>
              <p className="text-base font-bold text-slate-900 font-mono mt-1">{property.floodRisk}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-rose-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Disaster Clearance</p>
              <Badge variant={property.variant} className="mt-1">{property.status}</Badge>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-rose-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Mandatory Insurance</p>
              <p className="text-base font-bold text-slate-900 mt-1">Not Mandated</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-rose-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Survey Date</p>
              <p className="text-base font-bold text-slate-900 mt-1">2025 Regional Survey</p>
            </div>
          </div>
        </InfoCard>

        {/* Environmental Records (Light Cyan Section Card) */}
        <InfoCard
          title="5. Environmental Records"
          subtitle="State Pollution Control Board (SPCB) Assessment"
          icon={Leaf}
          variant="cyan"
          collapsible
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/80 border border-cyan-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Soil Composition</p>
              <p className="text-base font-bold text-slate-900 mt-1">Clear (No Lead / Radon)</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-cyan-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Water Quality</p>
              <p className="text-base font-bold text-slate-900 mt-1">Safe Potable Supply</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-cyan-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Air Quality Index</p>
              <p className="text-base font-bold text-emerald-700 font-mono mt-1">AQI 22 (Good)</p>
            </div>
            <div className="p-4 rounded-xl bg-white/80 border border-cyan-200/60">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">SPCB Hazard Clearance</p>
              <Badge variant={property.variant} className="mt-1">{property.status}</Badge>
            </div>
          </div>
        </InfoCard>

        {/* Permit Records (Light Purple Section Card) */}
        <InfoCard
          title="6. Permit Records"
          subtitle="Municipal Corporation Building Permit Archives"
          icon={Map}
          variant="purple"
          collapsible
          defaultOpen
        >
          <div className="overflow-x-auto rounded-xl border border-purple-200/80 bg-white">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-purple-100/80 text-purple-900 text-xs font-mono uppercase">
                  <th className="p-3.5 font-semibold">Permit Number</th>
                  <th className="p-3.5 font-semibold">Department Jurisdiction</th>
                  <th className="p-3.5 font-semibold">Scope of Work</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold">Issue Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-200/60">
                <tr className="hover:bg-purple-50/50">
                  <td className="p-3.5 font-mono font-bold text-purple-700">PMT-IND-1024</td>
                  <td className="p-3.5 font-medium text-slate-800">{property.city} Municipal DBI</td>
                  <td className="p-3.5 text-xs text-slate-600">Building Occupancy & Rooftop Solar PV</td>
                  <td className="p-3.5"><Badge variant="success">Approved & Closed</Badge></td>
                  <td className="p-3.5 text-xs font-mono text-slate-500">10-Jan-2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </InfoCard>

        {/* Utility Information (Light Gray Section Card) */}
        <InfoCard
          title="7. Utility Information"
          subtitle="Electricity Board, Water Supply & Gas Grid Status"
          icon={Zap}
          variant="gray"
          collapsible
          defaultOpen
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Electricity Grid</p>
              <p className="text-base font-bold text-slate-900 mt-1">State DISCOM Active</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Water & Sewer</p>
              <p className="text-base font-bold text-slate-900 mt-1">Municipal Metro Water</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Natural Gas Grid</p>
              <p className="text-base font-bold text-slate-900 mt-1">Piped City Gas Connected</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <p className="text-xs text-slate-500 font-mono uppercase font-bold">Fiber Internet</p>
              <p className="text-base font-bold text-slate-900 mt-1">Gigabit Fiber Ready</p>
            </div>
          </div>
        </InfoCard>
      </div>
    </MainLayout>
  );
}

export default PropertyDetails;