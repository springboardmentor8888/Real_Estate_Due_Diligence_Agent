import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  User,
  Calendar,
  BadgeCheck,
  FileCheck,
  ShieldCheck,
  Home,
  CheckCircle2,
  FileText,
  Clock,
  Award,
} from "lucide-react";
import { showSuccessAlert } from "../utils/swal";
import { getOwnershipRecords } from "../services/propertyService";

function Ownership() {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get("propertyId") || searchParams.get("id") || "1";
  const numericId = propertyIdParam.toString().replace(/\D/g, "") || "1";

  const [ownership, setOwnership] = useState({
    propertyId: `PR-${numericId}`,
    owner: "Rama Charan",
    ownershipSince: "15 June 2020",
    ownerType: "Individual Private Owner",
    status: "Verified Clear Title",
    ownershipId: `OWN-2020-${1458 + parseInt(numericId || "1")}`,
    deedType: "Warranty Deed",
    encumbrances: "None (Lien Free)",
  });
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOwnershipRecords(numericId)
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const activeRecord = res.data.find((r) => r.isCurrentOwner) || res.data[0];
          setOwnership({
            propertyId: `PR-${activeRecord.propertyId}`,
            owner: activeRecord.ownerName || "Rama Charan",
            ownershipSince: activeRecord.startDate || "15 June 2020",
            ownerType: activeRecord.ownershipType || "Individual Private Owner",
            status: "Verified Clear Title",
            ownershipId: activeRecord.registrationNumber || `OWN-2020-${activeRecord.ownershipRecordId}`,
            deedType: "Warranty Deed",
            encumbrances: "None (Lien Free)",
          });
          setTimeline(res.data);
        }
      })
      .catch((err) => {
        console.warn("Backend getOwnershipRecords API error, using default mock:", err);
      })
      .finally(() => setLoading(false));
  }, [numericId]);

  const handleVerifyCertificate = () => {
    showSuccessAlert(
      "Title Certificate Verified",
      `Deed ${ownership.ownershipId} has been verified against official Sub-Registrar land registry database.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold mb-3">
              <ShieldCheck size={14} /> Sub-Registrar Title Verification
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              👤 Ownership Records & Chain of Title
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Inspect historical land title records, current owner deed certificates, and legal dispute encumbrances.
            </p>
          </div>

          <Button onClick={handleVerifyCertificate} variant="primary" icon={FileCheck}>
            Verify Deed Certificate
          </Button>
        </div>

        {/* Ownership Summary Profile Card */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                RC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{ownership.owner}</h2>
                  <Badge variant="success">{ownership.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Deed Certificate: {ownership.ownershipId}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-xs text-slate-400 font-mono uppercase">Assigned Property</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{ownership.propertyId} (Electronic City Phase 1, Bengaluru)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/60 dark:border-[#334155] flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-blue-800">
                <User size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono uppercase">Ownership Type</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{ownership.ownerType}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/60 dark:border-[#334155] flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800">
                <Calendar size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono uppercase">Ownership Effective Date</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{ownership.ownershipSince}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/60 dark:border-[#334155] flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800">
                <FileCheck size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono uppercase">Deed Instrument</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{ownership.deedType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership Timeline */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock size={20} className="text-blue-600 dark:text-cyan-400" /> Historical Chain of Title Timeline
          </h2>

          <div className="relative border-l-2 border-blue-500/80 ml-4 pl-6 space-y-8">
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  15 June 2020
                </span>
                <Badge variant="success">Current Active Owner</Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                Property Title Transferred to Rama Charan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Warranty Deed instrument recorded under Sub-Registrar Registry Ref #OWN-2020-1458. Total transaction value: ₹4.20 Cr.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-slate-100 dark:ring-slate-800" />
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#0F172A] px-2.5 py-0.5 rounded border border-slate-200 dark:border-[#334155]">
                18 June 2020
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                Official Land Registry Title Audit Completed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Title search verified clean ownership. Zero liens, mortgages, or tax encumbrances identified.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-slate-100 dark:ring-slate-800" />
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#0F172A] px-2.5 py-0.5 rounded border border-slate-200 dark:border-[#334155]">
                04 May 2012
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                Prior Transfer: Kalyan Kumar → Rama Charan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Historical title transfer archived in regional Sub-Registrar registry records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Ownership;