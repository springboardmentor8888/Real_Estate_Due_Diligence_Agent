import { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaFileExcel,
  FaFilePdf,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { formatDate, formatMoney, unavailable } from "../services/dueDiligenceService";
import {
  buildReportSections,
  exportReportToExcel,
  exportReportToPDF,
} from "../utils/exportUtils";
import { buildReportData } from "../utils/reportDataBuilder";

function ReportSection({ title, columns, rows }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="p-4">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-t border-gray-100">
                  {row.map((value, cellIndex) => (
                    <td key={`${title}-${index}-${cellIndex}`} className="p-4 align-top text-gray-700">
                      {unavailable(value)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="border-t border-gray-100">
                <td className="p-4 text-gray-500" colSpan={columns.length}>
                  No data returned from the connected source.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DueDiligenceReport() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReportPreview() {
      try {
        setLoading(true);
        setError("");
        const data = await buildReportData(propertyId);
        if (active) setReportData(data);
      } catch {
        if (active) setError("Unable to prepare the report from connected data sources.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReportPreview();
    return () => {
      active = false;
    };
  }, [propertyId]);

  const reportSections = useMemo(
    () => (reportData ? buildReportSections(reportData) : []),
    [reportData],
  );

  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (error || !reportData?.property) {
    return (
      <div className="px-8 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "Report data unavailable."}
        </div>
      </div>
    );
  }

  const risk = reportData.riskAssessment || {};
  const valuation = reportData.valuation || {};

  return (
    <div className="px-6 py-8 lg:px-8">
      <button
        onClick={() => navigate(`/property-details/${propertyId}`)}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

      <header className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Due Diligence Report</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{unavailable(reportData.property.address)}</h1>
            <p className="mt-2 text-gray-500">
              Property ID {unavailable(reportData.property.id)} | Generated {formatDate(reportData.generatedAt)}
            </p>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-gray-500">Risk Score</p>
              <p className="font-bold text-gray-900">{unavailable(risk.riskScore)} / 100</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-gray-500">Overall Risk</p>
              <p className="font-bold text-gray-900">{unavailable(risk.overallRisk)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-gray-500">Current Market Value</p>
              <p className="font-bold text-gray-900">{formatMoney(valuation.currentMarketValue)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-gray-500">Growth / Comparables</p>
              <p className="font-bold text-gray-900">
                {unavailable(valuation.growthPercentage)}% / {unavailable(valuation.comparablePropertyCount)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportReportToPDF(reportData)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              <FaFilePdf />
              Export PDF
            </button>
            <button
              onClick={() => exportReportToExcel(reportData)}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              <FaFileExcel />
              Export Excel
            </button>
          </div>
        </div>
      </header>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5 text-blue-900">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="mt-1" />
          <p>
            This report uses the backend ReportResponse as its source of truth. Historical purchase price is displayed separately from backend market valuation.
          </p>
        </div>
      </section>

      <div className="space-y-8">
        {reportSections.map((section) => (
          <ReportSection
            key={section.title}
            title={section.title}
            columns={section.columns}
            rows={section.rows}
          />
        ))}
      </div>
    </div>
  );
}

export default DueDiligenceReport;
