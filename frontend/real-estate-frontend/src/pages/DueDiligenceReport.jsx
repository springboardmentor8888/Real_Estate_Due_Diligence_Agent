import React from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
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
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  Scale,
} from "lucide-react";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";

function DueDiligenceReport() {
  const report = {
    reportId: "DDR-2025-8841",
    generatedDate: "28-July-2026",
    auditorName: "Rama Charan (Senior Auditor)",
    auditorOrganization: "Global Real Estate Capital Inc",
    property: {
      id: "PR-1001",
      title: "Prestige Cyber Heights",
      address: "Plot 42, Electronic City Phase 1, Bengaluru, Karnataka",
      pincode: "560100",
      owner: "Rama Charan",
      type: "Commercial Office Building",
      totalArea: "5,000 sq.ft",
      builtYear: 2021,
      marketValue: "₹4,20,00,000",
      riskScore: 88,
      riskLevel: "Low Risk",
      status: "APPROVED FOR ACQUISITION",
    },
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:hidden">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-[#94A3B8] uppercase">
              Official Report Ref: #{report.reportId}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              Enterprise Due Diligence Audit Report
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf("Due Diligence Audit Report", report.property.id)}
              variant="primary"
              size="sm"
              icon={FileDown}
            >
              Download PDF
            </Button>
            <Button
              onClick={() => exportToExcel("Due Diligence Report Data", [report.property])}
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
                <Building2 size={16} /> Global Real Estate Due Diligence Agency
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
                COMPREHENSIVE DUE DILIGENCE AUDIT REPORT
              </h1>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1 font-mono">
                Property Parcel ID: {report.property.id} • Report ID: {report.reportId}
              </p>
            </div>

            <div className="text-left md:text-right font-mono text-xs text-slate-500 dark:text-[#CBD5E1] space-y-1">
              <p><strong className="text-slate-800 dark:text-[#F8FAFC]">Date:</strong> {report.generatedDate}</p>
              <p><strong className="text-slate-800 dark:text-[#F8FAFC]">Lead Auditor:</strong> {report.auditorName}</p>
              <p><strong className="text-slate-800 dark:text-[#F8FAFC]">Organization:</strong> {report.auditorOrganization}</p>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <ShieldCheck size={18} className="text-blue-600 dark:text-cyan-400" /> 1. Executive Summary & Verdict
            </h2>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="success" className="text-xs px-3 py-1 font-bold">
                    {report.property.status}
                  </Badge>
                  <span className="text-xs font-mono text-slate-500 dark:text-[#94A3B8]">Score: {report.property.riskScore}/100</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#CBD5E1] leading-relaxed">
                  The subject property ({report.property.title}) has undergone exhaustive verification across state land registries, tax assessor records, municipal zoning codes, FEMA flood maps, EPA environmental hazards, and building permits. Title chain is 100% clean with zero encumbrances.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Property Identification */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Building2 size={18} className="text-blue-600 dark:text-cyan-400" /> 2. Property Information & Attributes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <p className="text-slate-400 dark:text-[#94A3B8] uppercase font-bold text-[10px]">Property Name</p>
                <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-1">{report.property.title}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <p className="text-slate-400 dark:text-[#94A3B8] uppercase font-bold text-[10px]">Registered Owner</p>
                <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-1">{report.property.owner}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <p className="text-slate-400 dark:text-[#94A3B8] uppercase font-bold text-[10px]">Property Type</p>
                <p className="font-bold text-slate-900 dark:text-[#F8FAFC] mt-1">{report.property.type}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                <p className="text-slate-400 dark:text-[#94A3B8] uppercase font-bold text-[10px]">Market Valuation</p>
                <p className="font-bold text-blue-600 dark:text-cyan-400 mt-1">{report.property.marketValue}</p>
              </div>
            </div>
          </section>

          {/* Section 3: Ownership Records */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <User size={18} className="text-blue-600 dark:text-cyan-400" /> 3. Ownership Records & Sub-Registrar Title
            </h2>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs space-y-2">
              <p><strong>Deed Ref:</strong> #OWN-2020-1458 (Warranty Deed)</p>
              <p><strong>Sub-Registrar Jurisdiction:</strong> Electronic City Sub-Registrar, Bengaluru</p>
              <p><strong>Encumbrance Status:</strong> Verified Lien Free (0 Mortgages / 0 Judgments)</p>
            </div>
          </section>

          {/* Section 4: Property Tax History */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <DollarSign size={18} className="text-blue-600 dark:text-cyan-400" /> 4. Property Tax History
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#334155] text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 font-mono uppercase">
                  <tr>
                    <th className="p-3">FY Year</th>
                    <th className="p-3">Assessed Value</th>
                    <th className="p-3">Annual Tax</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#334155] bg-white dark:bg-[#0F172A]">
                  <tr>
                    <td className="p-3 font-mono font-bold">FY 2025-26</td>
                    <td className="p-3">₹4.20 Cr</td>
                    <td className="p-3 font-mono font-bold">₹3.40 Lakhs</td>
                    <td className="p-3"><Badge variant="success">Paid in Full</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5: Zoning & Building Envelope */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Building2 size={18} className="text-blue-600 dark:text-cyan-400" /> 5. Zoning Regulations & FAR
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
              Zone R1-A Commercial/Mixed Use. Allowable Floor Area Ratio (FAR): 2.0. Maximum height limit: 18 meters.
            </p>
          </section>

          {/* Section 6: Flood Zone Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Waves size={18} className="text-blue-600 dark:text-cyan-400" /> 6. Flood Zone & Elevation Survey
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
              FEMA FIRM Zone X (Unshaded). Minimal flood hazard zone. Topographic elevation: +42.5m MSL.
            </p>
          </section>

          {/* Section 7: Environmental Records */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Leaf size={18} className="text-blue-600 dark:text-cyan-400" /> 7. Environmental Records & AQI
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
              State Pollution Control Board Phase I clearance certified. Air Quality Index: AQI 22 (Good). Zero heavy metal contamination.
            </p>
          </section>

          {/* Section 8: Building Permit History */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Map size={18} className="text-blue-600 dark:text-cyan-400" /> 8. Building Permit History
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
              All 3 historical permits (Building Occupancy #PMT-1024, Electrical Upgrade #PMT-0982, Sewer Connection #PMT-0741) are fully approved and closed.
            </p>
          </section>

          {/* Section 9: Utility Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Zap size={18} className="text-blue-600 dark:text-cyan-400" /> 9. Utility Grid Connections
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
              State DISCOM Power 200A, Municipal Water & Sewer, Piped City Gas, and Gigabit Fiber Internet all active.
            </p>
          </section>

          {/* Section 10: Comparable Valuation */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <TrendingUp size={18} className="text-blue-600 dark:text-cyan-400" /> 10. Comparable Market Valuation
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
              Subject valuation of ₹8,400/sq.ft is well-aligned with regional comparable average of ₹8,600/sq.ft within a 5 km radius.
            </p>
          </section>

          {/* Section 11: Risk Assessment Matrix */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <Scale size={18} className="text-blue-600 dark:text-cyan-400" /> 11. Risk Assessment Matrix
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1]">
              Overall Composite Risk Rating: 88/100 (Low Risk). No high-severity risks identified across any audit vector.
            </p>
          </section>

          {/* Section 12: Final Recommendation */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 dark:border-[#334155] pb-2">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> 12. Final Recommendation
            </h2>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              RECOMMENDATION: PROCEED WITH ACQUISITION. Property parcel PR-1001 meets all institutional due diligence criteria.
            </div>
          </section>

          {/* Section 13: Auditor Sign-off */}
          <section className="pt-8 border-t border-slate-300 dark:border-[#334155] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
            <div>
              <p className="font-bold text-slate-900 dark:text-[#F8FAFC]">Auditor Signature: Rama Charan</p>
              <p className="text-slate-500 dark:text-[#94A3B8]">Senior Real Estate Due Diligence Architect</p>
            </div>
            <div className="text-slate-500 dark:text-[#94A3B8]">
              <p>Digital Seal: #VERIFIED-SEAL-2026</p>
            </div>
          </section>

        </div>
      </div>
    </MainLayout>
  );
}

export default DueDiligenceReport;
