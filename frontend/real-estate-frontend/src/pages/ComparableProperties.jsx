import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Building2,
  MapPin,
  TrendingUp,
  Ruler,
  Compass,
  FileDown,
  Printer,
  SlidersHorizontal,
  CheckCircle2,
  ExternalLink,
  Search,
} from "lucide-react";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import { showToast } from "../utils/swal";

function ComparableProperties() {
  const [filterRadius, setFilterRadius] = useState("5km");

  // Subject Property Baseline Data
  const subjectProperty = {
    id: "PR-1001",
    title: "Prestige Cyber Heights",
    address: "Plot 42, Electronic City Phase 1, Bengaluru, Karnataka",
    marketValue: "₹4.20 Cr",
    pricePerSqFt: "₹8,400 / sq.ft",
    area: "5,000 sq.ft",
    builtYear: 2021,
    appreciationRate: "+12.4%",
    type: "Commercial Office",
  };

  // Demo Regional Comparables Dataset
  const comparables = [
    {
      id: "CMP-201",
      title: "Brigade Tech Park Tower A",
      address: "128 IT Corridor, Whitefield, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      marketValue: "₹4.45 Cr",
      pricePerSqFt: "₹8,900 / sq.ft",
      area: "5,000 sq.ft",
      builtYear: 2022,
      appreciation: "+14.1%",
      distance: "2.4 km away",
      similarityScore: 96,
      status: "Verified Clear",
      variant: "success",
    },
    {
      id: "CMP-202",
      title: "Embassy GolfLinks Block C",
      address: "77 Inner Ring Road, Domlur, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      marketValue: "₹4.10 Cr",
      pricePerSqFt: "₹8,200 / sq.ft",
      area: "5,000 sq.ft",
      builtYear: 2020,
      appreciation: "+11.8%",
      distance: "3.8 km away",
      similarityScore: 92,
      status: "Verified Clear",
      variant: "success",
    },
    {
      id: "CMP-203",
      title: "RMZ Infinity Workspace",
      address: "Old Madras Road, Benniganahalli, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      marketValue: "₹3.95 Cr",
      pricePerSqFt: "₹7,900 / sq.ft",
      area: "5,000 sq.ft",
      builtYear: 2019,
      appreciation: "+9.5%",
      distance: "4.5 km away",
      similarityScore: 88,
      status: "Minor Lien Settled",
      variant: "warning",
    },
    {
      id: "CMP-204",
      title: "Bagmane World Technology Centre",
      address: "Marathahalli-Sarjapur Ring Rd, Mahadevapura, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      marketValue: "₹4.60 Cr",
      pricePerSqFt: "₹9,200 / sq.ft",
      area: "5,000 sq.ft",
      builtYear: 2023,
      appreciation: "+15.8%",
      distance: "5.1 km away",
      similarityScore: 84,
      status: "Verified Clear",
      variant: "success",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Compass size={14} /> Regional Market Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🏢 Comparable Property Analysis & Valuation Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Benchmark market valuation, price per sq.ft, appreciation rates, and physical similarity against nearby verified registry land parcels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf("Comparable Properties Analysis", subjectProperty.id)}
              variant="primary"
              size="sm"
              icon={FileDown}
            >
              Download PDF
            </Button>
            <Button
              onClick={() => exportToExcel("Comparable Properties Data", comparables)}
              variant="secondary"
              size="sm"
              icon={Printer}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* Subject Property Baseline Hero Card */}
        <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  SUBJECT PROPERTY
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-[#94A3B8]">Parcel #{subjectProperty.id}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                {subjectProperty.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] flex items-center gap-1">
                <MapPin size={14} className="text-rose-500 shrink-0" /> {subjectProperty.address}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-center font-mono">
              <div>
                <p className="text-[10px] uppercase text-slate-400 dark:text-[#94A3B8] font-bold">Assessed Value</p>
                <p className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] mt-0.5">{subjectProperty.marketValue}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 dark:text-[#94A3B8] font-bold">Price / Sq.Ft</p>
                <p className="text-sm font-bold text-blue-600 dark:text-cyan-400 mt-1">{subjectProperty.pricePerSqFt}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 dark:text-[#94A3B8] font-bold">Total Area</p>
                <p className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] mt-1">{subjectProperty.area}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 dark:text-[#94A3B8] font-bold">1-Yr Trend</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">{subjectProperty.appreciationRate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparable Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
              <Building2 size={20} className="text-blue-600 dark:text-cyan-400" /> Regional Comparables (4 Verified Parcels)
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#94A3B8]">
              <SlidersHorizontal size={14} />
              <span>Radius: <strong>Within 5 km</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comparables.map((comp) => (
              <div
                key={comp.id}
                className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] hover-lift flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-[#94A3B8] bg-slate-100 dark:bg-[#0F172A] px-2 py-0.5 rounded border border-slate-200 dark:border-[#334155]">
                      {comp.distance}
                    </span>
                    <Badge variant={comp.variant}>{comp.status}</Badge>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-base leading-tight">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1 line-clamp-2">
                      {comp.address}
                    </p>
                  </div>

                  {/* Similarity Gauge Pill */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                    <div className="flex justify-between text-xs font-mono font-bold mb-1">
                      <span className="text-slate-500 dark:text-[#94A3B8]">Similarity Index</span>
                      <span className="text-blue-600 dark:text-cyan-400">{comp.similarityScore}% Match</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#1E293B] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-cyan-400 h-full rounded-full"
                        style={{ width: `${comp.similarityScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Details Footer */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-[#334155] text-xs font-mono">
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] uppercase font-bold">Valuation</p>
                    <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-0.5">{comp.marketValue}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] uppercase font-bold">Price / Sq.Ft</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{comp.pricePerSqFt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehensive Comparison Matrix Table */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600 dark:text-cyan-400" /> Side-by-Side Property Comparison Matrix
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-mono uppercase">
                  <th className="p-4 font-semibold">Attribute</th>
                  <th className="p-4 font-semibold text-cyan-300 bg-slate-800">Subject Property</th>
                  {comparables.map((c) => (
                    <th key={c.id} className="p-4 font-semibold">{c.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#334155] text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0F172A]">
                <tr className="hover:bg-slate-50 dark:hover:bg-[#1E293B]">
                  <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC] font-mono">Market Valuation</td>
                  <td className="p-4 font-bold text-cyan-600 dark:text-cyan-400 bg-slate-50 dark:bg-[#1E293B] font-mono">{subjectProperty.marketValue}</td>
                  {comparables.map((c) => (
                    <td key={c.id} className="p-4 font-mono font-bold">{c.marketValue}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-[#1E293B]">
                  <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC] font-mono">Price / Sq.Ft</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC] bg-slate-50 dark:bg-[#1E293B] font-mono">{subjectProperty.pricePerSqFt}</td>
                  {comparables.map((c) => (
                    <td key={c.id} className="p-4 font-mono">{c.pricePerSqFt}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-[#1E293B]">
                  <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC] font-mono">1-Year Appreciation</td>
                  <td className="p-4 font-bold text-emerald-600 bg-slate-50 dark:bg-[#1E293B] font-mono">{subjectProperty.appreciationRate}</td>
                  {comparables.map((c) => (
                    <td key={c.id} className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{c.appreciation}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-[#1E293B]">
                  <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC] font-mono">Proximity Distance</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC] bg-slate-50 dark:bg-[#1E293B] font-mono">Baseline (0 km)</td>
                  {comparables.map((c) => (
                    <td key={c.id} className="p-4 font-mono">{c.distance}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-[#1E293B]">
                  <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC] font-mono">Year Built</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC] bg-slate-50 dark:bg-[#1E293B] font-mono">{subjectProperty.builtYear}</td>
                  {comparables.map((c) => (
                    <td key={c.id} className="p-4 font-mono">{c.builtYear}</td>
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
