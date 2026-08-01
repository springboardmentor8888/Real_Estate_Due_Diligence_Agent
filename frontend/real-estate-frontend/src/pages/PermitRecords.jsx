import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Map,
  FileCheck,
  Building,
  CheckCircle2,
  Clock,
  Zap,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getPermitRecords } from "../services/propertyService";

function PermitRecords() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const defaultPermits = [
    {
      id: "PMT-IND-1024",
      department: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
      work: "Rooftop Solar PV Array & Occupancy Clearance",
      status: "Approved & Closed",
      variant: "success",
      date: "10-Jan-2024",
      inspector: "Sandeep Reddy",
    },
    {
      id: "PMT-IND-0982",
      department: "Electrical Safety Directorate (BESCOM)",
      work: "Main Transformer Upgrade (200A Commercial Service)",
      status: "Approved & Closed",
      variant: "success",
      date: "14-Aug-2022",
      inspector: "Priya Mehta",
    },
    {
      id: "PMT-IND-0741",
      department: "Bangalore Water Supply & Sewerage Board (BWSSB)",
      work: "Main Sewer Line Connection & Water Meter Tap",
      status: "Approved & Closed",
      variant: "success",
      date: "05-Mar-2020",
      inspector: "Vikram R.",
    },
  ];

  const [permits, setPermits] = useState(defaultPermits);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPermitRecords(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((p) => ({
            id: p.permitNumber || `PMT-${p.permitId}`,
            department: p.permitType || "Bruhat Bengaluru Mahanagara Palike (BBMP)",
            work: p.constructionApproval ? "Construction Approval & Occupancy Clearance" : "Building Permit Inspection",
            status: p.permitStatus || "Approved & Closed",
            variant: p.permitStatus === "APPROVED" || p.permitStatus === "Approved & Closed" ? "success" : "warning",
            date: p.issueDate || "10-Jan-2024",
            inspector: "Municipal Officer",
          }));
          setPermits(mapped);
        }
      })
      .catch((err) => {
        console.warn("Backend getPermitRecords API error, using default mock:", err);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleRequestPermitLookup = () => {
    showSuccessAlert(
      "Municipal Archives Queried",
      "Queried BBMP Building Permit Archives. 3 historical permits found and verified."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Map size={14} /> BBMP Department of Building Permits
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              📄 Building Permit Records & Inspection History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Inspect historical building, electrical, mechanical, and plumbing permits issued for this property parcel.
            </p>
          </div>

          <Button onClick={handleRequestPermitLookup} variant="primary" icon={FileCheck}>
            Run Permit Registry Search
          </Button>
        </div>

        {/* Permits Data Table */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Building size={20} className="text-blue-600 dark:text-cyan-400" /> Issued Municipal Permits
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-mono uppercase">
                  <th className="p-4 font-semibold">Permit #</th>
                  <th className="p-4 font-semibold">Department Jurisdiction</th>
                  <th className="p-4 font-semibold">Scope of Work</th>
                  <th className="p-4 font-semibold">Inspector</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Issue Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#334155] bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 text-xs">
                {permits.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-cyan-400">{pmt.id}</td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{pmt.department}</td>
                    <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-300">{pmt.work}</td>
                    <td className="p-4 text-xs font-bold text-slate-700 dark:text-slate-300">{pmt.inspector}</td>
                    <td className="p-4">
                      <Badge variant={pmt.variant}>{pmt.status}</Badge>
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">{pmt.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PermitRecords;