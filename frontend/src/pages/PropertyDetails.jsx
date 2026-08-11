import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBalanceScale,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaFileAlt,
  FaFilePdf,
  FaHistory,
  FaHome,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import {
  formatDate,
  formatMoney,
  getDueDiligenceBundle,
  getProperty,
  unavailable,
} from "../services/dueDiligenceService";
import { exportReportToPDF } from "../utils/exportUtils";
import { buildReportData } from "../utils/reportDataBuilder";

function DataTile({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-blue-50 p-3 text-blue-600">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SourceStatus({ label, records, error }) {
  const available = records.length > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-gray-800">{label}</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            error
              ? "bg-red-100 text-red-700"
              : available
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {error ? "Unable to retrieve" : available ? "Available" : "Not available"}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {error || (available ? `${records.length} record(s) returned.` : "No data returned from the connected source.")}
      </p>
    </div>
  );
}

function PropertyDetails() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diligenceLoading, setDiligenceLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProperty() {
      if (!propertyId) {
        setError("Property ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getProperty(propertyId);
        if (active) setProperty(data);
      } catch {
        if (active) setError("Unable to load property details from the backend.");
      } finally {
        if (active) setLoading(false);
      }
    }

    async function loadOverviewSources() {
      try {
        setDiligenceLoading(true);
        const data = await getDueDiligenceBundle(propertyId);
        if (active) setBundle(data);
      } finally {
        if (active) setDiligenceLoading(false);
      }
    }

    loadProperty();
    loadOverviewSources();
    return () => {
      active = false;
    };
  }, [propertyId]);

  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="px-8 py-10">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
          <FaExclamationTriangle className="mx-auto text-3xl" />
          <h1 className="mt-4 text-2xl font-bold">Property Details Unavailable</h1>
          <p className="mt-2">{error || "No property data returned."}</p>
          <button
            onClick={() => navigate("/search-property")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const sources = [
    ["Ownership", bundle?.ownership || [], bundle?.errors?.ownership],
    ["Tax", bundle?.tax || [], bundle?.errors?.tax],
    ["Flood", bundle?.flood || [], bundle?.errors?.flood],
    ["Permits", bundle?.permits || [], bundle?.errors?.permits],
    ["Zoning", bundle?.zoning || [], bundle?.errors?.zoning],
    ["Environmental", bundle?.environmental || [], bundle?.errors?.environmental],
  ];

  const handleDownloadFullPdf = async () => {
    try {
      setPdfLoading(true);
      setPdfMessage("Preparing your due diligence report...");
      const reportData = await buildReportData(property.id);
      exportReportToPDF(reportData);
      setPdfMessage("Due diligence report downloaded successfully.");
    } catch {
      setPdfMessage("Unable to download the due diligence report.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 lg:px-8">
      <button
        onClick={() => navigate("/search-property")}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <FaArrowLeft />
        Back to Search
      </button>

      <header className="sticky top-0 z-10 -mx-6 border-b border-gray-200 bg-gray-50/95 px-6 py-5 backdrop-blur lg:-mx-8 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Property Details
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{unavailable(property.address)}</h1>
            <p className="mt-2 flex items-center gap-2 text-gray-500">
              <FaMapMarkerAlt className="text-red-500" />
              {unavailable(property.city)}, {unavailable(property.state)} {unavailable(property.zipCode)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/property-history/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
            >
              <FaHistory />
              Property History
            </button>
            <button
              onClick={() => navigate(`/risk-assessment/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
            >
              <FaShieldAlt />
              Risk Assessment
            </button>
            <button
              onClick={() => navigate(`/property-comparison/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
            >
              <FaBalanceScale />
              Compare Property
            </button>
            <button
              onClick={() => navigate(`/report/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              <FaFileAlt />
              Generate Report
            </button>
            <button
              onClick={handleDownloadFullPdf}
              disabled={pdfLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-400"
            >
              <FaFilePdf />
              {pdfLoading ? "Preparing PDF..." : "Download Full PDF"}
            </button>
          </div>
        </div>
        {pdfMessage && (
          <p className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {pdfMessage}
          </p>
        )}
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DataTile title="Property ID" value={unavailable(property.id)} icon={<FaClipboardCheck />} />
        <DataTile title="Property Type" value={unavailable(property.propertyType)} icon={<FaHome />} />
        <DataTile title="Price" value={formatMoney(property.price)} icon={<FaClipboardCheck />} />
        <DataTile title="ZIP Code" value={unavailable(property.zipCode)} icon={<FaMapMarkerAlt />} />
        <DataTile title="Created At" value={formatDate(property.createdAt)} icon={<FaHistory />} />
      </section>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Property Overview</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Address", property.address],
            ["City", property.city],
            ["State", property.state],
            ["ZIP Code", property.zipCode],
            ["Property Type", property.propertyType],
            ["Price", formatMoney(property.price)],
            ["Created At", formatDate(property.createdAt)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-gray-100 pb-3">
              <span className="text-gray-500">{label}</span>
              <span className="text-right font-semibold text-gray-900">{unavailable(value)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Due Diligence Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Source availability for this property. Open a workflow action for full details.
            </p>
          </div>
          {diligenceLoading && <span className="text-sm font-semibold text-blue-600">Checking sources...</span>}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sources.map(([label, records, sourceError]) => (
            <SourceStatus key={label} label={label} records={records} error={sourceError} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default PropertyDetails;
