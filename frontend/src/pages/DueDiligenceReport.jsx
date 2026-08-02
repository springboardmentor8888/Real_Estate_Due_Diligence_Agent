import {
  FaArrowLeft,
  FaCheckCircle,
  FaClipboardCheck,
  FaFileExcel,
  FaFilePdf,
  FaFolderOpen,
  FaHistory,
  FaInfoCircle,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import ValueHistoryChart from "../components/comparable/ValueHistoryChart";
import ReportHeader from "../components/report/ReportHeader";
import ReportSection from "../components/report/ReportSection";
import RiskFactorCard from "../components/risk/RiskFactorCard";
import RiskScoreGauge from "../components/risk/RiskScoreGauge";
import {
  buildExecutiveSummary,
  buildReportData,
} from "../data/reportData";
import { getRiskClasses } from "../data/riskData";
import { formatCurrency } from "../data/comparableData";
import { exportReportToExcel, exportReportToPDF } from "../utils/exportUtils";

function getTimelineDotClass(color) {
  if (color === "green") return "bg-green-500";
  if (color === "blue") return "bg-blue-500";
  if (color === "yellow") return "bg-yellow-500";
  return "bg-purple-500";
}

const DueDiligenceReport = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const reportData = buildReportData(propertyId);
  const summary = buildExecutiveSummary(reportData);
  const riskClasses = getRiskClasses(reportData.risk.riskLevel);
  const isAboveMarket = reportData.valuation.percentDiff >= 0;

  return (
    <div className="p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Due Diligence Report</h1>

        <p className="text-gray-500 mt-3 text-lg">
          Consolidated findings and risk analysis for {reportData.property.title}.
        </p>
      </div>

      <ReportHeader reportData={reportData} />

      <div className="space-y-8">
        <ReportSection
          title="Executive Summary"
          icon={<FaInfoCircle className="text-blue-600" />}
        >
          <p className="text-gray-600 leading-8">{summary}</p>
        </ReportSection>

        <ReportSection title="Risk Score" icon={<FaShieldAlt className={riskClasses.text} />}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 p-4">
              <RiskScoreGauge
                score={reportData.risk.overallScore}
                level={reportData.risk.riskLevel}
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.risk.factors.map((factor) => (
                <RiskFactorCard key={factor.id} factor={factor} />
              ))}
            </div>
          </div>
        </ReportSection>

        <ReportSection title="Property Timeline" icon={<FaHistory className="text-blue-600" />}>
          <div className="relative border-l-4 border-blue-200 ml-4">
            {reportData.timeline.map((item) => (
              <div key={`${item.date}-${item.title}`} className="mb-10 ml-8 relative last:mb-0">
                <div
                  className={`absolute -left-[42px] top-1 h-5 w-5 rounded-full border-4 border-white shadow ${getTimelineDotClass(
                    item.color,
                  )}`}
                />

                <p className="text-sm text-gray-400">{item.date}</p>
                <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection
          title="Valuation Summary"
          icon={<FaMoneyBillWave className="text-green-600" />}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Current Price</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {formatCurrency(reportData.valuation.currentPrice)}
                </h3>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Market Average</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {formatCurrency(reportData.valuation.avgComparablePrice)}
                </h3>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Price Position</p>
                <span
                  className={`mt-2 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    isAboveMarket
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {reportData.valuation.positionLabel}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2">
              <ValueHistoryChart data={reportData.valuation.history} />
            </div>
          </div>
        </ReportSection>

        <ReportSection
          title="Supporting Documents"
          icon={<FaFolderOpen className="text-purple-600" />}
        >
          <div className="space-y-4">
            {reportData.documents.map((doc) => (
              <div
                key={doc}
                className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <FaFilePdf className="text-red-600 text-xl" />
                  <span className="font-medium">{doc}</span>
                </div>

                <button className="text-blue-600 hover:underline">View</button>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection
          title="Due Diligence Checklist"
          icon={<FaClipboardCheck className="text-green-600" />}
        >
          <div className="space-y-5">
            {reportData.checklist.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
              >
                <span className="font-medium text-gray-700">{item}</span>

                <span className="flex items-center gap-2 text-green-600 font-semibold">
                  <FaCheckCircle />
                  Verified
                </span>
              </div>
            ))}
          </div>
        </ReportSection>
      </div>

      <div className="flex justify-end gap-4 mt-10 flex-wrap">
        <button
          onClick={() => exportReportToPDF(reportData)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          <FaFilePdf />
          Export as PDF
        </button>

        <button
          onClick={() => exportReportToExcel(reportData)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          <FaFileExcel />
          Export as Excel
        </button>

        <button
          onClick={() => navigate(`/property-details/${reportData.property.id}`)}
          className="flex items-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition"
        >
          <FaArrowLeft />
          Back to Property Details
        </button>
      </div>
    </div>
  );
};

export default DueDiligenceReport;
