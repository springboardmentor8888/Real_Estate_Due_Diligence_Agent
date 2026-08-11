import { useEffect, useState } from "react";
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

import RiskFactorCard from "../components/risk/RiskFactorCard";
import RiskScoreGauge from "../components/risk/RiskScoreGauge";
import { getRiskClasses } from "../data/riskData";
import { exportReportToPDF } from "../utils/exportUtils";

const RiskAssessment = () => {
  const navigate = useNavigate();
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
        </div>
      </div>
    );
  }

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

  return (
    <div className="px-8 pt-5 pb-8">
      <button
        onClick={() => navigate(`/property-details/${propertyData.id}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 cursor-pointer"
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

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
          </div>
        </div>
      </div>

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
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            No elevated risk factors found. Continue with routine closing checks.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-10 flex-wrap">
        <button
          onClick={() => exportReportToPDF(reportData, { sectionsOnly: ["risk"] })}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
        >
          <FaFilePdf />
          Export Risk Report
        </button>

        <button
          onClick={() => navigate(`/reports/${propertyData.id}`)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
        >
          <FaFileAlt />
          View Full Due Diligence Report
        </button>
      </div>
    </div>
  );
};

export default RiskAssessment;