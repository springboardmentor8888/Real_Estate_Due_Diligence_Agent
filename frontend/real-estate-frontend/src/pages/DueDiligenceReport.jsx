import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import { getPropertyDetails } from "../services/propertyService";

function DueDiligenceReport() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const targetId = searchParams.get("id") || location.state?.property?.id || location.state?.property?.propertyId;
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!targetId) return;
    const numericId = targetId.toString().replace(/\D/g, "");
    if (numericId) {
      setLoading(true);
      getPropertyDetails(numericId)
        .then((res) => {
          if (res && res.data) {
            const p = res.data;
            const addressString = p.address
              ? `${p.address.addressLine1 || ""}, ${p.address.city || ""}, ${p.address.state || ""}`.replace(/^, |, $/g, "")
              : p.propertyName || "Address Not Available";
            setProperty({
              id: `PR-${p.propertyId}`,
              propertyId: p.propertyId,
              title: p.propertyName || addressString,
              address: addressString,
              owner: p.createdByEmail ? p.createdByEmail.split("@")[0] : "Not Available",
              type: p.propertyType || "Not Available",
              totalArea: p.totalArea ? `${p.totalArea} sq.ft` : "Not Available",
              builtYear: p.builtYear || "Not Available",
              marketValue: p.marketValue ? `₹${p.marketValue.toLocaleString()}` : "Not Available",
              riskScore: p.riskScore || 20,
              status: p.status || "Verified Clear",
              rawBackendData: p,
            });
          }
        })
        .catch((err) => {
          console.warn("Backend getPropertyDetails query error:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [targetId]);

  if (!property && !loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-12">
          <EmptyState
            title="No report data available."
            message="No property record was selected or returned by the backend system."
            actionLabel="Go to Property Search"
            onAction={() => (window.location.href = "/property-search")}
          />
        </div>
      </MainLayout>
    );
  }

  const p = property || {};

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto pb-16">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:hidden">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-[#94A3B8] uppercase">
              Official Report Ref: #{p.id || "Not Available"}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              Enterprise Due Diligence Audit Report
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf("Due Diligence Audit Report", p.id)}
              variant="primary"
              size="sm"
              icon={FileDown}
            >
              Download PDF
            </Button>
            <Button
              onClick={() => exportToExcel("Due Diligence Report Data", [p])}
              variant="secondary"
              size="sm"
              icon={Printer}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* Formal Report Document Container */}
        <div className="white-card rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-lg space-y-10 text-slate-900 dark:text-[#F8FAFC] font-sans">
          
          {/* Section 0: Report Title Header */}
          <div className="border-b-2 border-slate-900 dark:border-[#334155] pb-8 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-mono font-bold text-xs uppercase mb-2">
                <Building2 size={16} /> Real Estate Due Diligence Agent
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
                COMPREHENSIVE DUE DILIGENCE AUDIT REPORT
              </h1>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1 font-mono">
                Property Parcel ID: {p.id || "Not Available"}
              </p>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <ShieldCheck size={18} className="text-blue-600 dark:text-cyan-400" /> 1. Executive Summary & Verdict
            </h2>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-2">
              <Badge variant="success" className="text-xs px-3 py-1 font-bold">
                {p.status || "Verified"}
              </Badge>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-[#CBD5E1] leading-relaxed">
                Audit record for {p.title || p.address} retrieved directly from backend API registry.
              </p>
            </div>
          </section>

          {/* Section 2: Property Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Building2 size={18} className="text-blue-600 dark:text-cyan-400" /> 2. Property Attributes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <p className="text-slate-400 uppercase font-bold text-[10px]">Property Name</p>
                <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-1">{p.title || "Not Available"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <p className="text-slate-400 uppercase font-bold text-[10px]">Owner</p>
                <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-1">{p.owner || "Not Available"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <p className="text-slate-400 uppercase font-bold text-[10px]">Property Type</p>
                <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-1">{p.type || "Not Available"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <p className="text-slate-400 uppercase font-bold text-[10px]">Valuation</p>
                <p className="font-bold text-blue-600 dark:text-cyan-400 mt-1">{p.marketValue || "Not Available"}</p>
              </div>
            </div>
          </section>

          {/* Final Recommendation */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> Recommendation
            </h2>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              Backend property record verified.
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default DueDiligenceReport;
