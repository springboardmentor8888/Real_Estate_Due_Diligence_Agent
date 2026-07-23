import React from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  ClipboardList,
  DollarSign,
  Calendar,
  FileDown,
  CheckCircle2,
  TrendingUp,
  Award,
} from "lucide-react";
import { showSuccessAlert, showToast } from "../utils/swal";

function TaxHistory() {
  const taxRecords = [
    { year: 2025, assessed: "$540,000", tax: "$4,200", status: "Paid", variant: "success", date: "12-Jan-2025", receipt: "TAX-2025-99" },
    { year: 2024, assessed: "$510,000", tax: "$4,000", status: "Paid", variant: "success", date: "10-Jan-2024", receipt: "TAX-2024-88" },
    { year: 2023, assessed: "$480,000", tax: "$3,850", status: "Paid", variant: "success", date: "15-Jan-2023", receipt: "TAX-2023-77" },
    { year: 2022, assessed: "$450,000", tax: "$3,600", status: "Paid", variant: "success", date: "14-Jan-2022", receipt: "TAX-2022-66" },
  ];

  const handleDownloadReceipt = (receiptId) => {
    showSuccessAlert(
      "Tax Receipt Downloaded",
      `Official Tax Certificate #${receiptId} has been exported.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold mb-3">
              <ClipboardList size={14} /> Municipal Assessor Records
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              📋 Property Tax History & Assessment
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect historical tax assessment values, annual property tax payments, and official municipal tax receipts.
            </p>
          </div>

          <Button
            onClick={() => handleDownloadReceipt("TAX-FULL-STATEMENT")}
            variant="primary"
            icon={FileDown}
          >
            Export Tax Statement
          </Button>
        </div>

        {/* Tax Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400">Total Taxes Paid (4 Yrs)</p>
            <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-2">$15,650</h3>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-3">
              <CheckCircle2 size={13} /> 100% On-Time Payment
            </span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400">Outstanding Tax Balance</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 font-mono mt-2">$0.00</h3>
            <span className="text-xs text-slate-400 font-medium block mt-3">No pending tax liens</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400">Next Assessment Cycle</p>
            <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-2">Jan 2026</h3>
            <span className="text-xs text-blue-600 font-bold block mt-3">Est. $4,350</span>
          </div>
        </div>

        {/* Tax Table */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <DollarSign size={20} className="text-blue-600" /> Annual Tax History Audit Trail
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-mono uppercase">
                  <th className="p-4 font-semibold">Tax Year</th>
                  <th className="p-4 font-semibold">Assessed Value</th>
                  <th className="p-4 font-semibold">Annual Tax Paid</th>
                  <th className="p-4 font-semibold">Payment Status</th>
                  <th className="p-4 font-semibold">Payment Date</th>
                  <th className="p-4 font-semibold text-right">Tax Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 bg-white">
                {taxRecords.map((rec) => (
                  <tr key={rec.year} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{rec.year}</td>
                    <td className="p-4 font-medium text-slate-700">{rec.assessed}</td>
                    <td className="p-4 font-bold text-slate-900 font-mono">{rec.tax}</td>
                    <td className="p-4">
                      <Badge variant={rec.variant}>{rec.status}</Badge>
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500">{rec.date}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDownloadReceipt(rec.receipt)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <FileDown size={14} />
                        <span>Receipt</span>
                      </button>
                    </td>
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

export default TaxHistory;