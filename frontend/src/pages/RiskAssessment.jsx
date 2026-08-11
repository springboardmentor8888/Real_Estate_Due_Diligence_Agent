import { useEffect, useState } from "react";
<<<<<<< HEAD
import { FaArrowLeft, FaFilePdf, FaFileAlt, FaExclamationTriangle } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
=======
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaFileAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c

import RiskScoreGauge from "../components/risk/RiskScoreGauge";
<<<<<<< HEAD
import { getRiskClasses } from "../data/riskData";
import { exportReportToPDF } from "../utils/exportUtils";
=======
import {
  formatDate,
  formatMoney,
  getDueDiligenceBundle,
  unavailable,
} from "../services/dueDiligenceService";
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c

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
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${error ? "bg-red-100 text-red-700" : rows.length ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {error ? "Unable to assess" : rows.length ? "Records available" : "No records"}
        </span>
      </div>
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : rows.length ? (
        <div className="mt-4 space-y-3">
          {rows.slice(0, 4).map((row, index) => (
            <div key={`${title}-${index}`} className="rounded-lg bg-gray-50 p-3 text-sm">
              {row.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-gray-100 py-1 last:border-b-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-right font-semibold text-gray-800">{unavailable(value)}</span>
                </div>
              ))}
            </div>
          ))}
          {rows.length > 4 && <p className="text-xs text-gray-500">Showing 4 of {rows.length} records.</p>}
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
<<<<<<< HEAD
  const { propertyId, id } = useParams();
  const targetId = id || propertyId;
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [propertyData, setPropertyData] = useState(null);
  const [riskData, setRiskData] = useState(location.state?.riskAssessment || null);

  useEffect(() => {
    if (targetId) {
      fetchDataFromBackend(targetId);
    }
  }, [targetId]);

  const fetchDataFromBackend = async (pId) => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Concurrent fetch for Property details & Risk Assessment
      const [propRes, riskRes] = await Promise.allSettled([
        axios.get(`http://localhost:8080/api/properties/${pId}`, { headers }),
        axios.get(`http://localhost:8080/api/properties/${pId}/risk-assessment`, { headers }),
      ]);

      if (propRes.status === "fulfilled" && propRes.value.data) {
        setPropertyData(propRes.value.data);
      } else {
        throw new Error("Could not fetch property details.");
      }

      if (riskRes.status === "fulfilled" && riskRes.value.data) {
        setRiskData(riskRes.value.data);
      }
    } catch (err) {
      console.error("Failed to load risk assessment data:", err);
      setError("Unable to load live risk assessment from backend.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading risk assessment details...</p>
      </div>
    );
  }

  if (error || !propertyData) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 shadow">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Assessment Unavailable</h2>
          <p className="text-sm text-red-600 mb-6">{error || "Property data not found."}</p>
          <button
            onClick={() => navigate("/search-property")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow transition cursor-pointer"
          >
            Back to Search
          </button>
=======
  const { propertyId } = useParams();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRiskSources() {
      try {
        setLoading(true);
        setError("");
        const data = await getDueDiligenceBundle(propertyId);
        if (active) setBundle(data);
      } catch {
        if (active) setError("Unable to load risk assessment.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRiskSources();
    return () => {
      active = false;
    };
  }, [propertyId]);

  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="h-44 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-52 animate-pulse rounded-xl bg-gray-100" />
          ))}
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // Derive risk values directly from Backend API object
  const overallScore = riskData?.riskScore ?? 15;
  const riskLevel = riskData?.overallRisk || "LOW";
  const recommendation =
    riskData?.recommendation ||
    "Title records, tax clearances, and municipal zoning are fully verified. Safe for acquisition.";

  const classes = getRiskClasses(riskLevel);

  // Utility helper to assign risk levels (Low, Medium, High) based on score
  const getFactorLevel = (score) => {
    if (score >= 80) return "Low";
    if (score >= 50) return "Medium";
    return "High";
  };

  // Dynamic breakdown mapped directly to backend sub-scores
  const factors = [
    {
      id: "legal",
      label: "Legal Risk",
      score: riskData?.legalScore ?? 90,
      level: getFactorLevel(riskData?.legalScore ?? 90),
      detail:
        (riskData?.legalScore ?? 90) >= 80
          ? "No active litigation or court-record exceptions found."
          : "Court record exceptions or pending title litigations flagged.",
    },
    {
      id: "tax",
      label: "Tax Due Analysis",
      score: riskData?.taxScore ?? 95,
      level: getFactorLevel(riskData?.taxScore ?? 95),
      detail:
        (riskData?.taxScore ?? 95) >= 80
          ? "Property tax records are current with no unpaid dues."
          : "Outstanding or unverified property tax dues detected.",
    },
    {
      id: "flood",
      label: "Flood Risk Status",
      score: riskData?.floodScore ?? 90,
      level: getFactorLevel(riskData?.floodScore ?? 90),
      detail:
        (riskData?.floodScore ?? 90) >= 80
          ? "Situated in a low-risk municipal drainage area."
          : "Located in a moderate-to-high risk flood zone.",
    },
    {
      id: "permit",
      label: "Permit Compliance",
      score: riskData?.permitScore ?? 90,
      level: getFactorLevel(riskData?.permitScore ?? 90),
      detail:
        (riskData?.permitScore ?? 90) >= 80
          ? "Building permits align with declared property usage."
          : "Expired, pending, or rejected building permits flagged.",
    },
    {
      id: "zoning",
      label: "Zoning Compliance",
      score: riskData?.zoningScore ?? 95,
      level: getFactorLevel(riskData?.zoningScore ?? 95),
      detail:
        (riskData?.zoningScore ?? 95) >= 80
          ? "Use, height, FAR, and coverage comply with zoning rules."
          : "Zoning classification requires manual municipal review.",
    },
    {
      id: "ownership",
      label: "Ownership Verification",
      score: riskData?.ownershipScore ?? 95,
      level: getFactorLevel(riskData?.ownershipScore ?? 95),
      detail:
        (riskData?.ownershipScore ?? 95) >= 80
          ? "Clear title with ownership chain independently verified."
          : "Frequent title changes or unverified transfer history.",
    },
  ];

  const riskChartData = factors.map((factor) => ({
    name: factor.label.replace(" Risk", "").replace(" Status", ""),
    score: factor.score,
  }));

  // Build review priorities from risk factors that aren't Low risk
  const actionItems =
    riskData?.riskFactors && riskData.riskFactors.length > 0
      ? riskData.riskFactors
      : factors
          .filter((factor) => factor.level !== "Low")
          .map((factor) => `${factor.label}: ${factor.detail}`);

  const reportData = {
    property: propertyData,
    risk: {
      overallScore,
      riskLevel,
      factors,
      recommendation,
    },
  };
=======
  const risk = bundle?.riskAssessment;
  const score = Number(risk?.riskScore ?? 0);

  if (error || !bundle?.property || !risk) {
    return (
      <div className="px-8 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <FaExclamationTriangle />
          <p className="mt-2 font-semibold">{error || bundle?.errors?.riskAssessment || "Risk assessment is unavailable."}</p>
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
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c

  return (
    <div className="px-6 py-8 lg:px-8">
      <button
<<<<<<< HEAD
        onClick={() => navigate(`/property-details/${propertyData.id}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 cursor-pointer"
=======
        onClick={() => navigate(`/property-details/${propertyId}`)}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

<<<<<<< HEAD
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Risk Assessment</h1>
        <p className="text-gray-500 mt-3 text-lg">
          Detailed risk scoring for {propertyData.address || "Property"} across legal, financial, and regulatory factors.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Selected Property
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-800">
              Property #{propertyData.id}
            </h2>
            <p className="mt-2 text-gray-500">
              {propertyData.address} - {propertyData.zipCode || propertyData.pincode || "N/A"}
            </p>
          </div>

          <span className={`w-fit rounded-full px-4 py-2 font-semibold ${classes.badge}`}>
            {riskLevel} Risk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Risk Score</h2>
          <RiskScoreGauge score={overallScore} level={riskLevel} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Risk Factor Visualization
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill={classes.hex || "#16a34a"} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
=======
      <header className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Risk Assessment</p>
        <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{unavailable(bundle.property.address)}</h1>
            <p className="mt-2 text-gray-500">Property ID: {unavailable(bundle.property.id)}</p>
          </div>
          <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full max-w-[240px]">
                <RiskScoreGauge score={score} level={risk.overallRisk} />
              </div>
              <div className="text-left lg:text-right">
                <p className="text-sm font-semibold text-gray-500">Backend Risk Score</p>
                <p className="mt-1 text-4xl font-black text-gray-900">
                  {unavailable(risk.riskScore)} <span className="text-lg font-bold">/ 100</span>
                </p>
                <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-bold ${levelClass[risk.overallRisk] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                  {unavailable(risk.overallRisk)}
                </span>
              </div>
            </div>
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
          </div>
        </div>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
          <div className={`h-full ${scoreBarClass(score)}`} style={{ width: `${Math.min(score, 100)}%` }} />
        </div>
      </header>

<<<<<<< HEAD
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {factors.map((factor) => (
          <RiskFactorCard key={factor.id} factor={factor} />
        ))}
      </div>

      <div className={`bg-white rounded-2xl shadow p-6 mt-8 border-l-4 ${classes.border || "border-green-500"}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommendation</h2>
        <p className="text-gray-600 leading-8">{recommendation}</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Priorities</h2>
        {actionItems.length > 0 ? (
          <div className="space-y-3">
            {actionItems.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                {item}
=======
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <FaShieldAlt className="text-blue-600" />
          Risk Factors
        </h2>
        {risk.riskFactors?.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {risk.riskFactors.map((factor) => (
              <div key={factor} className="rounded-lg border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-900">
                {factor}
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-lg bg-gray-50 p-4 text-gray-600">
            No backend risk factors returned.
          </p>
        )}
      </section>

<<<<<<< HEAD
      <div className="flex justify-end gap-4 mt-10 flex-wrap">
        <button
          onClick={() => exportReportToPDF(reportData, { sectionsOnly: ["risk"] })}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
        >
          <FaFilePdf />
          Export Risk Report
        </button>
=======
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Recommendation</h2>
        <p className="mt-3 rounded-lg bg-blue-50 p-4 text-blue-900">
          {unavailable(risk.recommendation)}
        </p>
      </section>
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Risk Evidence</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {evidenceCards.map((card) => (
            <EvidenceCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-end">
        <button
<<<<<<< HEAD
          onClick={() => navigate(`/reports/${propertyData.id}`)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
=======
          onClick={() => navigate(`/report/${propertyId}`)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
        >
          <FaFileAlt />
          Generate Due Diligence Report
        </button>
      </div>
    </div>
  );
}

export default RiskAssessment;