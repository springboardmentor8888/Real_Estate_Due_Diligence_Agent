import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaFileAlt,
  FaFilePdf,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import RiskScoreGauge from "../components/risk/RiskScoreGauge";
import {
  formatDate,
  formatMoney,
  getDueDiligenceBundle,
  unavailable,
} from "../services/dueDiligenceService";
import { exportReportToPDF } from "../utils/exportUtils";

const levelClass = {
  LOW: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-amber-100 text-amber-800 border-amber-200",
  HIGH: "bg-red-100 text-red-700 border-red-200",
};

function scoreBarClass(score) {
  if (score >= 60) return "bg-red-600";
  if (score >= 30) return "bg-amber-500";
  return "bg-green-500";
}

function EvidenceCard({ title, rows, error }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            error
              ? "bg-red-100 text-red-700"
              : rows?.length
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {error
            ? "Unable to assess"
            : rows?.length
            ? "Records available"
            : "No records"}
        </span>
      </div>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : rows?.length ? (
        <div className="mt-4 space-y-3">
          {rows.slice(0, 4).map((row, index) => (
            <div
              key={`${title}-${index}`}
              className="rounded-lg bg-gray-50 p-3 text-sm"
            >
              {row.map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-gray-100 py-1 last:border-b-0"
                >
                  <span className="text-gray-500">{label}</span>
                  <span className="text-right font-semibold text-gray-800">
                    {unavailable(value)}
                  </span>
                </div>
              ))}
            </div>
          ))}
          {rows.length > 4 && (
            <p className="text-xs text-gray-500">
              Showing 4 of {rows.length} records.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
          No data returned from the connected source.
        </p>
      )}
    </article>
  );
}

function RiskAssessment() {
  const navigate = useNavigate();
  const { propertyId, id } = useParams();
  const targetId = id || propertyId;
  const location = useLocation();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRiskSources() {
      if (!targetId) return;
      try {
        setLoading(true);
        setError("");
        const data = await getDueDiligenceBundle(targetId);
        if (active) setBundle(data);
      } catch (err) {
        if (active) setError("Unable to load risk assessment.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRiskSources();
    return () => {
      active = false;
    };
  }, [targetId]);

  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="h-44 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  const risk = bundle?.riskAssessment;
  const property = bundle?.property;
  const score = Number(risk?.riskScore ?? 0);

  if (error || !property || !risk) {
    return (
      <div className="px-8 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <FaExclamationTriangle className="text-2xl mb-2" />
          <p className="font-semibold">
            {error || bundle?.errors?.riskAssessment || "Risk assessment is unavailable."}
          </p>
          <button
            onClick={() => navigate("/search-property")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const evidenceCards = [
    {
      title: "Ownership",
      error: bundle.errors?.ownership,
      rows: (bundle.ownership || []).map((record) => [
        ["Owner", record.ownerName],
        ["Purchase Date", formatDate(record.purchaseDate)],
        ["Historical Purchase Price", formatMoney(record.purchasePrice)],
      ]),
    },
    {
      title: "Tax",
      error: bundle.errors?.tax,
      rows: (bundle.tax || []).map((record) => [
        ["Tax Year", record.taxYear],
        ["Tax Amount", formatMoney(record.taxAmount)],
        ["Payment Status", record.paymentStatus],
      ]),
    },
    {
      title: "Flood",
      error: bundle.errors?.flood,
      rows: (bundle.flood || []).map((record) => [
        ["Flood Zone", record.floodZoneCode],
        ["Risk Level", record.floodRiskLevel],
        ["Insurance Required", record.floodInsuranceRequired ? "Yes" : "No"],
      ]),
    },
    {
      title: "Environmental",
      error: bundle.errors?.environmental,
      rows: (bundle.environmental || []).map((record) => [
        ["Environmental Risk", record.environmentalRisk],
        ["Contamination Level", record.contaminationLevel],
        ["Remarks", record.remarks],
      ]),
    },
    {
      title: "Permits",
      error: bundle.errors?.permits,
      rows: (bundle.permits || []).map((record) => [
        ["Permit Number", record.permitNumber],
        ["Permit Type", record.permitType],
        ["Status", record.status],
        ["Issue Date", formatDate(record.issueDate)],
      ]),
    },
    {
      title: "Zoning",
      error: bundle.errors?.zoning,
      rows: (bundle.zoning || []).map((record) => [
        ["Zoning Code", record.zoningCode],
        ["Description", record.zoningDescription],
        ["Permitted Use", record.permittedUse],
      ]),
    },
    {
      title: "Property History",
      error: bundle.errors?.history,
      rows: (bundle.history || []).map((record) => [
        ["Event Type", record.eventType],
        ["Event Date", formatDate(record.eventDate)],
        ["Description", record.description],
      ]),
    },
  ];

  const reportData = {
    property,
    risk: {
      overallScore: score,
      riskLevel: risk.overallRisk,
      factors: risk.riskFactors || [],
      recommendation: risk.recommendation,
    },
  };

  return (
    <div className="px-6 py-8 lg:px-8">
      <button
        onClick={() => navigate(`/property-details/${property.id || targetId}`)}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer"
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

      <header className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Risk Assessment
        </p>
        <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {unavailable(property.address)}
            </h1>
            <p className="mt-2 text-gray-500">
              Property ID: {unavailable(property.id || targetId)}
            </p>
          </div>
          <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full max-w-[240px]">
                <RiskScoreGauge score={score} level={risk.overallRisk} />
              </div>
              <div className="text-left lg:text-right">
                <p className="text-sm font-semibold text-gray-500">
                  Backend Risk Score
                </p>
                <p className="mt-1 text-4xl font-black text-gray-900">
                  {unavailable(risk.riskScore)}{" "}
                  <span className="text-lg font-bold">/ 100</span>
                </p>
                <span
                  className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-bold ${
                    levelClass[risk.overallRisk] ||
                    "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {unavailable(risk.overallRisk)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full ${scoreBarClass(score)}`}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
      </header>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <FaShieldAlt className="text-blue-600" />
          Risk Factors
        </h2>
        {risk.riskFactors?.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {risk.riskFactors.map((factor) => (
              <div
                key={factor}
                className="rounded-lg border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-900"
              >
                {factor}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-lg bg-gray-50 p-4 text-gray-600">
            No backend risk factors returned.
          </p>
        )}
      </section>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Recommendation</h2>
        <p className="mt-3 rounded-lg bg-blue-50 p-4 text-blue-900">
          {unavailable(risk.recommendation)}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Risk Evidence</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {evidenceCards.map((card) => (
            <EvidenceCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-end gap-4 flex-wrap">
        <button
          onClick={() => exportReportToPDF(reportData, { sectionsOnly: ["risk"] })}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 transition cursor-pointer"
        >
          <FaFilePdf />
          Export Risk Report
        </button>

        <button
          onClick={() => navigate(`/reports/${property.id || targetId}`)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
        >
          <FaFileAlt />
          Generate Due Diligence Report
        </button>
      </div>
    </div>
  );
}

export default RiskAssessment;