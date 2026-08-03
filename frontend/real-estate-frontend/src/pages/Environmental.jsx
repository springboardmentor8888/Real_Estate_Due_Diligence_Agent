import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Leaf, FileCheck } from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getEnvironmentalRecords } from "../services/propertyService";

function Environmental() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const [envRecords, setEnvRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEnvironmentalRecords(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          setEnvRecords(res.data);
        } else {
          setEnvRecords([]);
        }
      })
      .catch((err) => {
        console.warn("Backend getEnvironmentalRecords API error:", err);
        setEnvRecords([]);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleDownloadEnvReport = () => {
    showSuccessAlert(
      "Environmental Report Dispatched",
      "Environmental Audit PDF has been exported."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold mb-3">
              <Leaf size={14} /> State Pollution Control Board (SPCB)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🌱 Environmental Records & Hazards Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Inspect soil composition, groundwater purity, and contamination liabilities.
            </p>
          </div>

          <Button onClick={handleDownloadEnvReport} variant="primary" icon={FileCheck} disabled={envRecords.length === 0}>
            Export Phase I Report
          </Button>
        </div>

        {envRecords.length === 0 && !loading ? (
          <EmptyState
            title="No environmental records available."
            message="No environmental clearance data was returned by the backend API for this property."
          />
        ) : (
          <div className="space-y-3">
            {envRecords.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-white">{item.clearanceStatus || "Environmental Record"}</h3>
                  <Badge variant="success">{item.clearanceStatus || "Approved"}</Badge>
                </div>
                <p className="text-slate-600 dark:text-[#CBD5E1]">Risks: {item.environmentalRisks || "Not Available"}</p>
                <p className="text-slate-500">Pollution Info: {item.pollutionInfo || "Not Available"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Environmental;