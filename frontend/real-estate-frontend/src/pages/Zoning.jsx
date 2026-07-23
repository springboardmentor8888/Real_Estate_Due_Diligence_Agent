import React from "react";
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

function Zoning() {
  const zoning = {
    code: "R1-A",
    title: "Low-Density Single-Family Residential",
    landUse: "Residential Primary",
    heightLimit: "15.0 Meters (approx 3 stories)",
    far: "1.2 Floor Area Ratio",
    setbacks: "Front: 6m | Rear: 8m | Side: 3m",
    authority: "Metropolitan City Planning Department",
    status: "100% Fully Compliant",
  };

  const handleRequestZoningCert = () => {
    showSuccessAlert(
      "Zoning Certificate Requested",
      "Official R1-A Zoning Compliance Certificate request sent to City Planning Department."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-mono font-bold mb-3">
              <Building2 size={14} /> City Planning & Zoning Board
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              🏢 Zoning Regulations & Land Use Audit
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Review building height restrictions, Floor Area Ratio (FAR), setback requirements, and permitted land use classifications.
            </p>
          </div>

          <Button onClick={handleRequestZoningCert} variant="primary" icon={Compass}>
            Request Zoning Certificate
          </Button>
        </div>

        {/* Hero Zone Code Box */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 border border-slate-800 shadow-xl relative overflow-hidden">
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

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
              <p className="text-xs font-mono text-cyan-300 uppercase">Compliance Status</p>
              <Badge variant="success" className="mt-2 text-sm px-4 py-1.5">
                {zoning.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Building Limits Grid */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Ruler size={20} className="text-blue-600" /> Building & Envelope Constraints
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Max Height Limit</p>
              <h3 className="text-lg font-bold text-slate-900 mt-2">{zoning.heightLimit}</h3>
              <p className="text-xs text-slate-500 mt-1">Roof ridge elevation limit</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Floor Area Ratio (FAR)</p>
              <h3 className="text-lg font-bold text-slate-900 mt-2">{zoning.far}</h3>
              <p className="text-xs text-slate-500 mt-1">Max allowable build area</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Setback Requirements</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{zoning.setbacks}</h3>
              <p className="text-xs text-slate-500 mt-1">Minimum lot line clearance</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <p className="text-xs text-slate-400 font-mono uppercase">Planning Authority</p>
              <h3 className="text-base font-bold text-slate-900 mt-2">{zoning.authority}</h3>
              <p className="text-xs text-slate-500 mt-1">Municipal Jurisdiction</p>
            </div>
          </div>
        </div>

        {/* Allowed Land Use Chips */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-600" /> Permitted Land Uses
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {[
              "Single-Family Residence",
              "Accessory Dwelling Unit (ADU)",
              "Home Occupation / Office",
              "Private Garage & Carport",
              "Solar Energy Systems",
              "Residential Landscaping",
            ].map((use, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold"
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