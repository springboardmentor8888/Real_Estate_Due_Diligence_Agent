import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Building2,
  Ruler,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Compass,
} from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getZoningInformation } from "../services/propertyService";

function Zoning() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const defaultZoning = {
    code: "R1-A",
    title: "Low-Density Mixed Use & Commercial Office",
    landUse: "Commercial Primary",
    heightLimit: "18.0 Meters (approx 4 stories)",
    far: "2.0 Floor Area Ratio",
    setbacks: "Front: 6m | Rear: 8m | Side: 3m",
    authority: "Bangalore Development Authority (BDA)",
    status: "100% Fully Compliant",
  };

  const [zoning, setZoning] = useState(defaultZoning);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getZoningInformation(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const z = res.data[0];
          setZoning({
            code: z.zoneCode || "R1-A",
            title: z.zoneName || "Low-Density Mixed Use & Commercial Office",
            landUse: z.landUse || "Commercial Primary",
            heightLimit: z.buildingRestrictions || "18.0 Meters (approx 4 stories)",
            far: "2.0 Floor Area Ratio",
            setbacks: "Front: 6m | Rear: 8m | Side: 3m",
            authority: "Bangalore Development Authority (BDA)",
            status: z.complianceStatus || "100% Fully Compliant",
          });
        }
      })
      .catch((err) => {
        console.warn("Backend getZoningInformation API error, using default mock:", err);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleRequestZoningCert = () => {
    showSuccessAlert(
      "Zoning Certificate Requested",
      "Official R1-A Zoning Compliance Certificate request sent to BDA City Planning Authority."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-mono font-bold mb-3">
              <Building2 size={14} /> BDA City Planning & Zoning Board
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🏢 Zoning Regulations & Land Use Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Review building height restrictions, Floor Area Ratio (FAR), setback requirements, and permitted land use classifications.
            </p>
          </div>

          <Button onClick={handleRequestZoningCert} variant="primary" icon={Compass}>
            Request Zoning Certificate
          </Button>
        </div>

        {/* Hero Zone Code Box */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 border border-slate-800 dark:border-[#334155] shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Primary Zone Classification
              </span>
              <h2 className="text-4xl font-extrabold text-white mt-1">
                Zone {zoning.code}
              </h2>
              <p className="text-slate-300 text-sm mt-2">{zoning.title}</p>
            </div>

            <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-[#334155] rounded-2xl p-6 text-center">
              <p className="text-xs font-mono text-cyan-300 uppercase">Compliance Status</p>
              <Badge variant="success" className="mt-2 text-sm px-4 py-1.5 font-bold">
                {zoning.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Building Limits Grid */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
            <Ruler size={20} className="text-blue-600 dark:text-cyan-400" /> Building & Envelope Constraints
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Max Height Limit</p>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{zoning.heightLimit}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">Roof ridge elevation limit</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Floor Area Ratio (FAR)</p>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{zoning.far}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">Max allowable build area</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Setback Requirements</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{zoning.setbacks}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">Minimum lot line clearance</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Planning Authority</p>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">{zoning.authority}</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">Municipal Jurisdiction</p>
            </div>
          </div>
        </div>

        {/* Allowed Land Use Chips */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" /> Permitted Land Uses
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {[
              "Commercial Office Space",
              "Accessory Workspaces",
              "IT / Tech Park Development",
              "Private Parking Facility",
              "Rooftop Solar PV Systems",
              "Urban Commercial Landscaping",
            ].map((use, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold"
              >
                <CheckCircle2 size={14} />
                {use}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Zoning;