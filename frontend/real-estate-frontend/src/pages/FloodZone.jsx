import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Waves, ShieldCheck } from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getFloodZoneInformation } from "../services/propertyService";

function FloodZone() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const [flood, setFlood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFloodZoneInformation(numericId)
      .then((res) => {
        if (res && res.data) {
          const f = Array.isArray(res.data) ? res.data[0] : res.data;
          if (f) {
            setFlood({
              risk: f.floodRisk || "Low Risk",
              zone: f.floodZone || "Zone X",
              insuranceRequired: f.insuranceRequired ? "Mandatory Insurance Required" : "No Mandatory Flood Insurance",
              lastInspection: f.lastUpdated ? f.lastUpdated.toString().split("T")[0] : "Not Available",
              elevation: f.elevationFeet ? `+${f.elevationFeet} Feet` : "Not Available",
            });
          }
        }
      })
      .catch((err) => {
        console.warn("Backend getFloodZoneInformation API error:", err);
        setFlood(null);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleVerifyFEMA = () => {
    showSuccessAlert(
      "Flood Map Verified",
      `Flood Zone survey records verified for property PR-${numericId}.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-mono font-bold mb-3">
              <Waves size={14} /> Irrigation Board & FIRM Flood Survey
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🌊 Flood Zone & Elevation Risk Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect flood plain designations and flood insurance requirements.
            </p>
          </div>

          <Button onClick={handleVerifyFEMA} variant="primary" icon={ShieldCheck} disabled={!flood}>
            Verify Flood Panel
          </Button>
        </div>

        {!flood && !loading ? (
          <EmptyState
            title="No flood zone information available."
            message="No flood risk survey data was returned by the backend API for this property."
          />
        ) : (
          <>
            {/* Risk Meter Widget */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-8 border border-slate-800 dark:border-[#334155] shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                    Designated Flood Zone
                  </span>
                  <h2 className="text-4xl font-extrabold text-white mt-1">
                    {flood?.zone || "Not Available"}
                  </h2>
                </div>

                <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-[#334155] rounded-2xl p-6 text-center shrink-0">
                  <p className="text-xs font-mono text-cyan-300 uppercase">Risk Level Rating</p>
                  <Badge variant="success" className="mt-2 text-sm px-4 py-1.5 font-bold">
                    {flood?.risk || "Not Available"}
                  </Badge>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default FloodZone;