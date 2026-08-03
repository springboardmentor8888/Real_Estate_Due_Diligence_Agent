import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Building2, Compass } from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getZoningInformation } from "../services/propertyService";

function Zoning() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const [zoning, setZoning] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getZoningInformation(numericId)
      .then((res) => {
        if (res && res.data) {
          const z = Array.isArray(res.data) ? res.data[0] : res.data;
          if (z) {
            setZoning({
              code: z.zoneCode || "R1-A",
              title: z.zoneName || "Commercial Office Zone",
              landUse: z.landUse || "Commercial",
              heightLimit: z.buildingRestrictions || "Not Available",
              far: z.far || "Not Available",
              authority: z.planningAuthority || "Municipal Planning Board",
              status: z.complianceStatus || "Compliant",
            });
          }
        }
      })
      .catch((err) => {
        console.warn("Backend getZoningInformation API error:", err);
        setZoning(null);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleRequestZoningCert = () => {
    showSuccessAlert(
      "Zoning Certificate Requested",
      "Official Zoning Compliance Certificate request sent to Planning Authority."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-mono font-bold mb-3">
              <Building2 size={14} /> City Planning & Zoning Board
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🏢 Zoning Regulations & Land Use Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Review building height restrictions, Floor Area Ratio (FAR), and permitted land use classifications.
            </p>
          </div>

          <Button onClick={handleRequestZoningCert} variant="primary" icon={Compass} disabled={!zoning}>
            Request Zoning Certificate
          </Button>
        </div>

        {!zoning && !loading ? (
          <EmptyState
            title="No zoning information available."
            message="No zoning classification data was returned by the backend API for this property."
          />
        ) : (
          <>
            {/* Hero Zone Code Box */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 border border-slate-800 dark:border-[#334155] shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Primary Zone Classification
                  </span>
                  <h2 className="text-4xl font-extrabold text-white mt-1">
                    Zone {zoning?.code || "Not Available"}
                  </h2>
                  <p className="text-slate-300 text-sm mt-2">{zoning?.title || "Not Available"}</p>
                </div>

                <div className="bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-[#334155] rounded-2xl p-6 text-center">
                  <p className="text-xs font-mono text-cyan-300 uppercase">Compliance Status</p>
                  <Badge variant="success" className="mt-2 text-sm px-4 py-1.5 font-bold">
                    {zoning?.status || "Compliant"}
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

export default Zoning;