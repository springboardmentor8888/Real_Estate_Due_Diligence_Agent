import React from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Zap,
  Droplets,
  Flame,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Activity,
} from "lucide-react";
import { showSuccessAlert } from "../utils/swal";

function Utilities() {
  const utilityServices = [
    {
      name: "Electric Grid Power",
      provider: "City Power & Light Co",
      status: "Active (Connected)",
      meterId: "MTR-E-4819",
      capacity: "200A Single Phase",
      icon: Zap,
      gradient: "from-amber-500/10 to-orange-500/5 text-amber-600 border-amber-200/60",
      variant: "success",
    },
    {
      name: "Water & Sewer Connection",
      provider: "Municipal Water District",
      status: "Active (Connected)",
      meterId: "MTR-W-8812",
      capacity: "3/4 inch Tap Service",
      icon: Droplets,
      gradient: "from-blue-500/10 to-cyan-500/5 text-blue-600 border-blue-200/60",
      variant: "success",
    },
    {
      name: "Natural Gas Grid",
      provider: "Metropolitan Gas Corp",
      status: "Active (Connected)",
      meterId: "MTR-G-1194",
      capacity: "Standard Residential",
      icon: Flame,
      gradient: "from-rose-500/10 to-amber-500/5 text-rose-600 border-rose-200/60",
      variant: "success",
    },
    {
      name: "High-Speed Fiber Internet",
      provider: "Apex Telecom Fiber",
      status: "Active (Connected)",
      meterId: "ONT-F-9021",
      capacity: "1,000 Mbps Symmetric",
      icon: Wifi,
      gradient: "from-purple-500/10 to-indigo-500/5 text-purple-600 border-purple-200/60",
      variant: "success",
    },
  ];

  const handleTestConnections = () => {
    showSuccessAlert(
      "Utility Meters Polled",
      "All 4 utility service connections confirmed online & active."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold mb-3">
              <Zap size={14} /> Public Utility Infrastructure Grid
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ⚡ Utilities & Grid Service Connections
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect active utility meters, service providers, connection capacities, and municipal grid health.
            </p>
          </div>

          <Button onClick={handleTestConnections} variant="primary" icon={Activity}>
            Run Utility Telemetry Check
          </Button>
        </div>

        {/* Utility Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {utilityServices.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="glass-card rounded-3xl p-6 border border-slate-200/80 hover-lift flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border shadow-xs ${service.gradient}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{service.name}</h3>
                      <p className="text-xs text-slate-500">{service.provider}</p>
                    </div>
                  </div>
                  <Badge variant={service.variant}>{service.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Meter Serial ID</p>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">{service.meterId}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Service Capacity</p>
                    <p className="font-bold text-slate-800 mt-0.5">{service.capacity}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

export default Utilities;