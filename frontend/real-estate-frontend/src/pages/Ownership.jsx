import React from "react";
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

function Ownership() {
  const ownership = {
    propertyId: "PR-1001",
    owner: "John Smith",
    ownershipSince: "15 June 2020",
    ownerType: "Individual Private Owner",
    status: "Verified Clear Title",
    ownershipId: "OWN-2020-1458",
    deedType: "Warranty Deed",
    encumbrances: "None (Lien Free)",
  };

  const handleVerifyCertificate = () => {
    showSuccessAlert(
      "Title Certificate Verified",
      `Deed ${ownership.ownershipId} has been verified against official HM Land Registry database.`
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold mb-3">
              <ShieldCheck size={14} /> Land Registry Verification
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              👤 Ownership Records & Chain of Title
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect historical land title records, current owner deed certificates, and legal dispute encumbrances.
            </p>
          </div>

          <Button onClick={handleVerifyCertificate} variant="primary" icon={FileCheck}>
            Verify Deed Certificate
          </Button>
        </div>

        {/* Ownership Summary Profile Card */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                JS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{ownership.owner}</h2>
                  <Badge variant="success">{ownership.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Deed Certificate: {ownership.ownershipId}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-xs text-slate-400 font-mono uppercase">Assigned Property</p>
              <p className="text-sm font-bold text-slate-900">{ownership.propertyId} (221B Baker Street)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
                <User size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono uppercase">Ownership Type</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ownership.ownerType}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
                <Calendar size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono uppercase">Ownership Effective Date</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ownership.ownershipSince}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60">
                <FileCheck size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-mono uppercase">Deed Instrument</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ownership.deedType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership Timeline */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" /> Historical Chain of Title Timeline
          </h2>

          <div className="relative border-l-2 border-blue-500/80 ml-4 pl-6 space-y-8">
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                  15 June 2020
                </span>
                <Badge variant="success">Current Active Owner</Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Property Title Transferred to John Smith
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Warranty Deed instrument recorded under Registry Ref #OWN-2020-1458. Total transaction value: $540,000.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100" />
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                18 June 2020
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Official Land Registry Title Audit Completed
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Title search verified clean ownership. Zero liens, mortgages, or tax encumbrances identified.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100" />
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                04 May 2012
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Prior Transfer: Arthur Pendelton → Baker Holdings LLC
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Historical title transfer archived in regional registry records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Ownership;