import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Home,
  User,
  Building2,
  MapPin,
  Ruler,
  Printer,
  Share2,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Waves,
  Leaf,
  Map,
  Clock,
  ChevronRight,
  FolderOpen,
  History,
  ImageOff,
} from "lucide-react";
import { showToast } from "../utils/swal";
import {
  getPropertyDetails,
  getOwnershipRecords,
  getPropertyTaxHistory,
  getZoningInformation,
  getFloodZoneInformation,
  getEnvironmentalRecords,
  getPermitRecords,
} from "../services/propertyService";

function PropertyDetails() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const targetId = searchParams.get("id") || location.state?.property?.id || location.state?.property?.propertyId;

  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Sub-record states from real backend APIs
  const [ownershipRecords, setOwnershipRecords] = useState([]);
  const [taxHistory, setTaxHistory] = useState([]);
  const [zoningInfo, setZoningInfo] = useState(null);
  const [floodInfo, setFloodInfo] = useState(null);
  const [environmentalRecords, setEnvironmentalRecords] = useState([]);
  const [permitRecords, setPermitRecords] = useState([]);

  useEffect(() => {
    if (!targetId) return;
    const numericId = targetId.toString().replace(/\D/g, "");
    if (numericId) {
      setLoading(true);

      // Fetch core property details from backend API
      getPropertyDetails(numericId)
        .then((res) => {
          if (res && res.data) {
            const p = res.data;
            const addressString = p.address
              ? `${p.address.addressLine1 || ""}, ${p.address.city || ""}, ${p.address.state || ""}`.replace(/^, |, $/g, "")
              : p.propertyName || "Address Not Available";

            setProperty({
              id: `PR-${p.propertyId}`,
              propertyId: p.propertyId,
              numericId: p.propertyId,
              title: p.propertyName || addressString,
              address: addressString,
              city: p.address?.city || "Not Available",
              state: p.address?.state || "Not Available",
              pincode: p.address?.postalCode || "Not Available",
              type: p.propertyType || "Not Available",
              owner: p.createdByEmail ? p.createdByEmail.split("@")[0] : "Not Available",
              score: p.marketValue ? `₹${(p.marketValue / 1000000).toFixed(2)} Cr` : "Not Available",
              status: p.status || "Verified Clear",
              variant: p.status === "Verified Clear Title" ? "success" : "warning",
              area: p.totalArea ? `${p.totalArea} sq ft` : "Not Available",
              year: p.builtYear || "Not Available",
              surveyNo: p.surveyNumber || `SY-${p.propertyId}`,
              marketValue: p.marketValue ? `₹${(p.marketValue / 1000000).toFixed(2)} Cr` : "Not Available",
              imageUrl: p.imageUrl || null,
              description: p.description || null,
              rawBackendData: p,
            });
          }
        })
        .catch((err) => {
          console.warn("Backend getPropertyDetails query error:", err);
        })
        .finally(() => setLoading(false));

      // Fetch verification sub-records from backend API endpoints
      getOwnershipRecords(numericId).then((res) => res?.data && setOwnershipRecords(Array.isArray(res.data) ? res.data : [res.data])).catch(() => setOwnershipRecords([]));
      getPropertyTaxHistory(numericId).then((res) => res?.data && setTaxHistory(Array.isArray(res.data) ? res.data : [res.data])).catch(() => setTaxHistory([]));
      getZoningInformation(numericId).then((res) => res?.data && setZoningInfo(res.data)).catch(() => setZoningInfo(null));
      getFloodZoneInformation(numericId).then((res) => res?.data && setFloodInfo(res.data)).catch(() => setFloodInfo(null));
      getEnvironmentalRecords(numericId).then((res) => res?.data && setEnvironmentalRecords(Array.isArray(res.data) ? res.data : [res.data])).catch(() => setEnvironmentalRecords([]));
      getPermitRecords(numericId).then((res) => res?.data && setPermitRecords(Array.isArray(res.data) ? res.data : [res.data])).catch(() => setPermitRecords([]));
    }
  }, [targetId]);

  const handlePrint = () => {
    showToast(`Opening system print dialog for ${property?.id || "Workspace"}...`, "info");
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Property workspace link copied!`, "success");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "ownership", label: "Ownership Records", icon: User },
    { id: "tax", label: "Property Tax History", icon: DollarSign },
    { id: "zoning", label: "Zoning Information", icon: Building2 },
    { id: "flood", label: "Flood Zone Verification", icon: Waves },
    { id: "permits", label: "Permit Records", icon: Map },
    { id: "environmental", label: "Environmental Records", icon: Leaf },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "reports", label: "Report History", icon: History },
  ];

  if (!property && !loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-12">
          <EmptyState
            title="No Property Selected"
            message="Please select a valid property from the Property Search page to view its details."
            actionLabel="Go to Property Search"
            onAction={() => (window.location.href = "/property-search")}
          />
        </div>
      </MainLayout>
    );
  }

  const p = property || {};
  const imgSrc = p.imageUrl || p.image || null;

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Breadcrumb Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-slate-500 dark:text-[#CBD5E1] font-semibold">
            <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <Link to="/property-search" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              Property Search
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-900 dark:text-white font-bold">Property Details</span>
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} variant="secondary" size="sm" icon={Printer}>
              Print Workspace
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm" icon={Share2}>
              Share
            </Button>
          </div>
        </div>

        {/* Professional Workspace Header Card */}
        <div className="white-card rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Header Image or No Image Available Placeholder */}
            <div className="lg:col-span-4 h-56 lg:h-auto relative bg-slate-100 dark:bg-[#0F172A] overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#334155]">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500 space-y-1.5 w-full h-full">
                  <ImageOff size={36} />
                  <span className="text-xs font-mono font-bold">No Image Available</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="text-xs font-mono font-bold bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/20">
                  APN: {p.id || p.propertyId ? `PR-${p.propertyId || p.id}` : "Not Available"}
                </span>
              </div>
            </div>

            {/* Header Info */}
            <div className="lg:col-span-8 p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {p.type || "Property Parcel"}
                  </span>
                  <Badge variant={p.variant || "success"}>{p.status || "Verified"}</Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
                  {p.title || p.propertyName || p.address || "Property Parcel"}
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] flex items-center gap-1.5 font-medium">
                  <MapPin size={15} className="text-blue-600 dark:text-cyan-400 shrink-0" />
                  <span>{p.address || "Address Not Available"}, {p.city || "Not Available"}, {p.state || "Not Available"} - PIN {p.pincode || "Not Available"}</span>
                </p>
              </div>

              {/* Quick Header Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-[#334155] text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Registered Owner</span>
                  <p className="font-bold text-slate-900 dark:text-white truncate">{p.owner || "Not Available"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Plot Area</span>
                  <p className="font-bold text-slate-900 dark:text-white">{p.area || "Not Available"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Zoning</span>
                  <p className="font-bold text-slate-900 dark:text-white">{p.zoning || "Not Available"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Audit Score</span>
                  <p className="font-bold text-blue-600 dark:text-cyan-400 font-mono">{p.score || "Not Available"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs Bar */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-[#334155] shadow-xs overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0F172A]"
                  }`}
              >
                <IconComp size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Active Tab Panels */}
        <div className="white-card rounded-2xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs min-h-[320px]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Property Overview & Audit Summary
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                {p.description || "Not Available"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Assessed Market Value</span>
                  <p className="font-bold text-slate-900 dark:text-white">{p.marketValue || p.assessedVal || "Not Available"}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Built Year</span>
                  <p className="font-bold text-slate-900 dark:text-white">{p.year || "Not Available"}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Survey Number</span>
                  <p className="font-bold text-slate-900 dark:text-white font-mono">{p.surveyNo || "Not Available"}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OWNERSHIP RECORDS */}
          {activeTab === "ownership" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Ownership Records
              </h3>
              {ownershipRecords.length > 0 ? (
                <div className="space-y-3 text-xs">
                  {ownershipRecords.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155]">
                      <p className="font-bold text-slate-900 dark:text-white">{item.ownerName || item.owner || "Not Available"}</p>
                      <p className="text-slate-500 font-mono">Deed: {item.deedNumber || "Not Available"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No ownership records available." message="No ownership deed records were returned by the backend API." />
              )}
            </div>
          )}

          {/* TAB 3: PROPERTY TAX HISTORY */}
          {activeTab === "tax" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Property Tax History
              </h3>
              {taxHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-[#334155] text-slate-400 uppercase font-mono">
                        <th className="py-2.5 px-3">Year</th>
                        <th className="py-2.5 px-3">Tax Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                      {taxHistory.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-3 font-bold font-mono">{item.year || "Not Available"}</td>
                          <td className="py-3 px-3">{item.taxAmount ? `₹${item.taxAmount}` : "Not Available"}</td>
                          <td className="py-3 px-3"><Badge variant="success">{item.status || "Paid"}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No tax history available." message="No tax payment records were returned by the backend API." />
              )}
            </div>
          )}

          {/* TAB 4: ZONING INFORMATION */}
          {activeTab === "zoning" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Zoning Information
              </h3>
              {zoningInfo ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Code: {zoningInfo.zoningCode || "Not Available"}</p>
                  <p className="text-slate-500">Details: {zoningInfo.description || "Not Available"}</p>
                </div>
              ) : (
                <EmptyState title="No zoning information available." message="No zoning data was returned by the backend API." />
              )}
            </div>
          )}

          {/* TAB 5: FLOOD ZONE VERIFICATION */}
          {activeTab === "flood" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Flood Zone Verification
              </h3>
              {floodInfo ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Zone: {floodInfo.zoneName || "Not Available"}</p>
                  <p className="text-slate-500">Risk Rating: {floodInfo.riskRating || "Not Available"}</p>
                </div>
              ) : (
                <EmptyState title="No flood zone information available." message="No flood risk data was returned by the backend API." />
              )}
            </div>
          )}

          {/* TAB 6: PERMIT RECORDS */}
          {activeTab === "permits" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Permit Records
              </h3>
              {permitRecords.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {permitRecords.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155]">
                      <p className="font-bold text-slate-900 dark:text-white">Permit #{item.permitNumber || "Not Available"}</p>
                      <p className="text-slate-500">{item.description || "Not Available"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No permit records available." message="No building permit records were returned by the backend API." />
              )}
            </div>
          )}

          {/* TAB 7: ENVIRONMENTAL RECORDS */}
          {activeTab === "environmental" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Environmental Audit Records
              </h3>
              {environmentalRecords.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {environmentalRecords.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155]">
                      <p className="font-bold text-slate-900 dark:text-white">{item.auditName || "Environmental Clearance"}</p>
                      <p className="text-slate-500">{item.status || "Not Available"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No environmental records available." message="No environmental assessment data was returned by the backend API." />
              )}
            </div>
          )}

          {/* TAB 8: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Associated Documents
              </h3>
              <EmptyState title="No documents available." message="No documents were returned by the backend API." />
            </div>
          )}

          {/* TAB 9: REPORT HISTORY */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Generated Due Diligence Report History
              </h3>
              <EmptyState title="No reports generated." message="No historical reports exist for this property in the backend." />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default PropertyDetails;