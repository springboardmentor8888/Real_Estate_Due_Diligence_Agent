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
      provider: "Bangalore Electricity Supply Co (BESCOM)",
      status: "Active (Connected)",
      meterId: "MTR-E-4819",
      capacity: "200A Commercial Service",
      icon: Zap,
      gradient: "from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800",
      variant: "success",
    },
    {
      name: "Water & Sewer Connection",
      provider: "Bangalore Water Supply Board (BWSSB)",
      status: "Active (Connected)",
      meterId: "MTR-W-8812",
      capacity: "3/4 inch Mains Connection",
      icon: Droplets,
      gradient: "from-blue-500/10 to-cyan-500/5 text-blue-600 dark:text-cyan-400 border-blue-200/60 dark:border-blue-800",
      variant: "success",
    },
    {
      name: "Piped Natural Gas Grid",
      provider: "GAIL Gas Corporation India",
      status: "Active (Connected)",
      meterId: "MTR-G-1194",
      capacity: "PNG Commercial Meter",
      icon: Flame,
      gradient: "from-rose-500/10 to-amber-500/5 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800",
      variant: "success",
    },
    {
      name: "High-Speed Fiber Internet",
      provider: "Airtel Xstream Gigabit Fiber",
      status: "Active (Connected)",
      meterId: "ONT-F-9021",
      capacity: "1,000 Mbps Symmetric",
      icon: Wifi,
      gradient: "from-purple-500/10 to-indigo-500/5 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-800",
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
      <div className="space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold mb-3">
              <Zap size={14} /> Public Utility Infrastructure Grid
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              ⚡ Utilities & Grid Service Connections
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
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
                className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-[#334155] hover-lift flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border shadow-xs ${service.gradient}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-lg">{service.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#CBD5E1]">{service.provider}</p>
                    </div>
                  </div>
                  <Badge variant={service.variant}>{service.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-[#334155] text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                    <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Meter Serial ID</p>
                    <p className="font-mono font-bold text-slate-800 dark:text-[#F8FAFC] mt-0.5">{service.meterId}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
                    <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-mono uppercase font-bold">Service Capacity</p>
                    <p className="font-bold text-slate-800 dark:text-[#F8FAFC] mt-0.5">{service.capacity}</p>
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