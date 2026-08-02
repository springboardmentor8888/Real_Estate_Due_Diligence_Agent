import { FaArrowLeft, FaFilePdf, FaFileAlt } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate, useParams } from "react-router-dom";

import RiskFactorCard from "../components/risk/RiskFactorCard";
import RiskScoreGauge from "../components/risk/RiskScoreGauge";
import { buildReportData } from "../data/reportData";
import { getRiskClasses } from "../data/riskData";
import { exportReportToPDF } from "../utils/exportUtils";

const RiskAssessment = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const reportData = buildReportData(propertyId);
  const { property } = reportData;
  const { risk } = reportData;
  const classes = getRiskClasses(risk.riskLevel);
  const riskChartData = risk.factors.map((factor) => ({
    name: factor.label.replace(" Risk", "").replace(" Status", ""),
    score: factor.score,
  }));
  const actionItems = risk.factors
    .filter((factor) => factor.level !== "Low")
    .map((factor) => factor.detail);

  return (
    <div className="px-8 pt-5 pb-8">
      <button
        onClick={() => navigate(`/property-details/${property.id}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Risk Assessment</h1>

        <p className="text-gray-500 mt-3 text-lg">
          Detailed risk scoring for {property.title} across legal, financial, and regulatory factors.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Selected Property
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-800">{property.title}</h2>
            <p className="mt-2 text-gray-500">
              {property.address} - {property.pincode}
            </p>
          </div>

          <span className={`w-fit rounded-full px-4 py-2 font-semibold ${classes.badge}`}>
            {risk.riskLevel} Risk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Overall Risk Score
          </h2>

          <RiskScoreGauge score={risk.overallScore} level={risk.riskLevel} />
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
                <Bar dataKey="score" fill={classes.hex} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {risk.factors.map((factor) => (
            <RiskFactorCard key={factor.id} factor={factor} />
          ))}
      </div>

      <div className={`bg-white rounded-2xl shadow p-6 mt-8 border-l-4 ${classes.border}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommendation</h2>
        <p className="text-gray-600 leading-8">{risk.recommendation}</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Priorities</h2>
        {actionItems.length > 0 ? (
          <div className="space-y-3">
            {actionItems.map((item) => (
              <div key={item} className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
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
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          <FaFilePdf />
          Export Risk Report
        </button>

        <button
          onClick={() => navigate(`/reports/${property.id}`)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          <FaFileAlt />
          View Full Due Diligence Report
        </button>
      </div>
    </div>
  );
};

export default RiskAssessment;
