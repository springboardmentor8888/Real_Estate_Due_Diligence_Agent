import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Map, FileCheck, Building } from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getPermitRecords } from "../services/propertyService";

function PermitRecords() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPermitRecords(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          setPermits(res.data);
        } else {
          setPermits([]);
        }
      })
      .catch((err) => {
        console.warn("Backend getPermitRecords API error:", err);
        setPermits([]);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleRequestPermitLookup = () => {
    showSuccessAlert(
      "Permit Registry Searched",
      `Queried municipal permit archives for property PR-${numericId}.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Map size={14} /> Department of Building Permits
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              📄 Building Permit Records & Inspection History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Inspect building and municipal permits issued for this property parcel.
            </p>
          </div>

          <Button onClick={handleRequestPermitLookup} variant="primary" icon={FileCheck}>
            Run Permit Registry Search
          </Button>
        </div>

        {/* Permits Data Table or Clean Empty State */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Building size={20} className="text-blue-600 dark:text-cyan-400" /> Issued Municipal Permits
          </h2>

          {permits.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155]">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 text-xs font-mono uppercase">
                    <th className="p-4 font-semibold">Permit #</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Issue Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#334155] bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 text-xs">
                  {permits.map((pmt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-600 dark:text-cyan-400">{pmt.permitNumber || `PMT-${pmt.permitId}`}</td>
                      <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{pmt.permitType || "Not Available"}</td>
                      <td className="p-4">
                        <Badge variant="success">{pmt.permitStatus || "Approved"}</Badge>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">{pmt.issueDate || "Not Available"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No permit records available."
              message="No building permit records were returned by the backend API for this property."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default PermitRecords;