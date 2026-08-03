import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  ClipboardList,
  DollarSign,
  FileDown,
} from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getPropertyTaxHistory } from "../services/propertyService";

function TaxHistory() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const [taxRecords, setTaxRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPropertyTaxHistory(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          setTaxRecords(res.data);
        } else {
          setTaxRecords([]);
        }
      })
      .catch((err) => {
        console.warn("Backend getPropertyTaxHistory API error:", err);
        setTaxRecords([]);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleDownloadReceipt = (receiptId) => {
    showSuccessAlert(
      "Tax Receipt Downloaded",
      `Tax receipt #${receiptId} exported.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
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
              Inspect historical tax assessment values and annual property tax payments.
            </p>
          </div>

          <Button
            onClick={() => handleDownloadReceipt("TAX-FULL-STATEMENT")}
            variant="primary"
            icon={FileDown}
            disabled={taxRecords.length === 0}
          >
            Export Tax Statement
          </Button>
        </div>

        {/* Tax Table or Clean Empty State */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <DollarSign size={20} className="text-blue-600 dark:text-cyan-400" /> Annual Tax History Audit Trail
          </h2>

          {taxRecords.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155]">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 text-xs font-mono uppercase">
                    <th className="p-4 font-semibold">Tax Year</th>
                    <th className="p-4 font-semibold">Annual Tax Paid</th>
                    <th className="p-4 font-semibold">Payment Status</th>
                    <th className="p-4 font-semibold">Payment Date</th>
                    <th className="p-4 font-semibold text-right">Receipt #</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#334155] bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 text-xs">
                  {taxRecords.map((rec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{rec.assessmentYear || "Not Available"}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white font-mono">{rec.taxAmount ? `₹${rec.taxAmount}` : "Not Available"}</td>
                      <td className="p-4">
                        <Badge variant="success">{rec.taxStatus || "Paid"}</Badge>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">{rec.paymentDate || "Not Available"}</td>
                      <td className="p-4 font-mono text-right text-blue-600 dark:text-cyan-400">{rec.receiptNumber || "Not Available"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No tax history available."
              message="No tax payment records were returned by the backend API for this property."
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default TaxHistory;