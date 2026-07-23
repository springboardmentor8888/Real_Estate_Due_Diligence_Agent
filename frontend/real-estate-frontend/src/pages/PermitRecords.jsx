import React from "react";
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

function PermitRecords() {
  const permits = [
    {
      id: "PMT-1024",
      department: "Building Inspection Dept",
      work: "Rooftop Solar PV Array Installation",
      status: "Approved & Closed",
      variant: "success",
      date: "10-Jan-2024",
      inspector: "Mark Vance",
    },
    {
      id: "PMT-0982",
      department: "Electrical Safety Division",
      work: "Main Panel Upgrade (200A Service)",
      status: "Approved & Closed",
      variant: "success",
      date: "14-Aug-2022",
      inspector: "Sarah Connor",
    },
    {
      id: "PMT-0741",
      department: "Plumbing & Sanitation Dept",
      work: "Main Sewer Line Connection & Backflow Check",
      status: "Approved & Closed",
      variant: "success",
      date: "22-May-2020",
      inspector: "David Miller",
    },
  ];

  const handleRequestPermitLookup = () => {
    showSuccessAlert(
      "Municipal Search Executed",
      "Queried City Building Permit Archives. 3 historical permits found."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold mb-3">
              <Map size={14} /> Department of Building Inspection (DBI)
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              📄 Building Permit Records & Inspection History
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect historical building, electrical, mechanical, and plumbing permits issued for this property parcel.
            </p>
          </div>

          <Button onClick={handleRequestPermitLookup} variant="primary" icon={FileCheck}>
            Run Permit Registry Search
          </Button>
        </div>

        {/* Permits Data Table */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Building size={20} className="text-blue-600" /> Issued Municipal Permits
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
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
              <tbody className="divide-y divide-slate-200/70 bg-white">
                {permits.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600">{pmt.id}</td>
                    <td className="p-4 font-medium text-slate-800">{pmt.department}</td>
                    <td className="p-4 text-xs font-medium text-slate-600">{pmt.work}</td>
                    <td className="p-4 text-xs text-slate-500">{pmt.inspector}</td>
                    <td className="p-4">
                      <Badge variant={pmt.variant}>{pmt.status}</Badge>
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500">{pmt.date}</td>
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