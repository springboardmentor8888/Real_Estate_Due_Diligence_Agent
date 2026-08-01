import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { getPropertyTaxHistory } from "../services/propertyService";

function TaxHistory() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const defaultTaxRecords = [
    { year: "FY 2025-26", assessed: "₹4.20 Cr", tax: "₹3,40,000", status: "Paid in Full", variant: "success", date: "12-Jan-2025", receipt: "CH-IND-2025-88" },
    { year: "FY 2024-25", assessed: "₹3.90 Cr", tax: "₹3,15,000", status: "Paid in Full", variant: "success", date: "10-Jan-2024", receipt: "CH-IND-2024-77" },
    { year: "FY 2023-24", assessed: "₹3.60 Cr", tax: "₹2,90,000", status: "Paid in Full", variant: "success", date: "15-Jan-2023", receipt: "CH-IND-2023-66" },
    { year: "FY 2022-23", assessed: "₹3.30 Cr", tax: "₹2,65,000", status: "Paid in Full", variant: "success", date: "14-Jan-2022", receipt: "CH-IND-2022-55" },
  ];

  const [taxRecords, setTaxRecords] = useState(defaultTaxRecords);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPropertyTaxHistory(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((t) => ({
            year: t.assessmentYear ? `FY ${t.assessmentYear}` : "FY 2025-26",
            assessed: t.taxAmount ? `₹${(t.taxAmount * 10).toLocaleString()}` : "₹4.20 Cr",
            tax: t.taxAmount ? `₹${t.taxAmount.toLocaleString()}` : "₹3,40,000",
            status: t.taxStatus || "Paid in Full",
            variant: t.taxStatus === "PAID" || t.taxStatus === "Paid in Full" ? "success" : "warning",
            date: t.paymentDate || "12-Jan-2025",
            receipt: t.receiptNumber || `TAX-REC-${t.taxId}`,
          }));
          setTaxRecords(mapped);
        }
      })
      .catch((err) => {
        console.warn("Backend getPropertyTaxHistory API error, using default mock:", err);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleDownloadReceipt = (receiptId) => {
    showSuccessAlert(
      "Tax Receipt Downloaded",
      `Official Municipal Tax Assessment Receipt #${receiptId} has been exported.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <ClipboardList size={14} /> Municipal Corporation Tax Assessor
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              📋 Property Tax History & Assessment
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
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
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-[#334155] hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400">Total Taxes Paid (4 Yrs)</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">₹12.10 Lakhs</h3>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 mt-3">
              <CheckCircle2 size={13} /> 100% On-Time Payment
            </span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-[#334155] hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400">Outstanding Tax Balance</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-2">₹0.00</h3>
            <span className="text-xs text-slate-400 font-medium block mt-3">No pending tax liens</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-[#334155] hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400">Next Assessment Cycle</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">Jan 2026</h3>
            <span className="text-xs text-blue-600 dark:text-cyan-400 font-bold block mt-3">Est. ₹3.60 Lakhs</span>
          </div>
        </div>

        {/* Tax Table */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <DollarSign size={20} className="text-blue-600 dark:text-cyan-400" /> Annual Tax History Audit Trail
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155]">
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
              <tbody className="divide-y divide-slate-200 dark:divide-[#334155] bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 text-xs">
                {taxRecords.map((rec) => (
                  <tr key={rec.year} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{rec.year}</td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{rec.assessed}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white font-mono">{rec.tax}</td>
                    <td className="p-4">
                      <Badge variant={rec.variant}>{rec.status}</Badge>
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">{rec.date}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDownloadReceipt(rec.receipt)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
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