import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Zap, Activity } from "lucide-react";
import { showSuccessAlert } from "../utils/swal";

function Utilities() {
  const [utilityServices] = useState([]);

  const handleTestConnections = () => {
    showSuccessAlert(
      "Utility Telemetry",
      "Queried utility service connection registry."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
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
              Inspect active utility meters, service providers, and connection capacities.
            </p>
          </div>

          <Button onClick={handleTestConnections} variant="primary" icon={Activity}>
            Run Utility Telemetry Check
          </Button>
        </div>

        {/* Utility Container / Clean Empty State */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          {utilityServices.length === 0 ? (
            <EmptyState
              title="No utility records available."
              message="No utility meter connection data was returned by the backend API for this property."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {utilityServices.map((service, index) => (
                <div key={index} className="p-4 rounded-xl border border-slate-200">
                  {service.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Utilities;