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

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ValueHistoryChart from "../components/comparable/ValueHistoryChart";
import ReportHeader from "../components/report/ReportHeader";
import ReportSection from "../components/report/ReportSection";
import RiskFactorCard from "../components/risk/RiskFactorCard";
import RiskScoreGauge from "../components/risk/RiskScoreGauge";

import { getRiskClasses } from "../data/riskData";
import { formatCurrency } from "../data/comparableData";

import {
  exportReportToExcel,
  exportReportToPDF,
} from "../utils/exportUtils";

function getTimelineDotClass(color) {
  if (color === "green") return "bg-green-500";
  if (color === "blue") return "bg-blue-500";
  if (color === "yellow") return "bg-yellow-500";

  return "bg-purple-500";
}

function getTimelineColor(index) {
  const colors = ["green", "blue", "yellow", "purple"];

  return colors[index % colors.length];
}

function getRiskFactorId(text) {
  const value = String(text || "").toLowerCase();

  if (
    value.includes("tax") ||
    value.includes("payment") ||
    value.includes("due")
  ) {
    return "tax";
  }

  if (
    value.includes("flood") ||
    value.includes("water")
  ) {
    return "flood";
  }

  if (
    value.includes("permit") ||
    value.includes("building")
  ) {
    return "permit";
  }

  if (
    value.includes("zoning") ||
    value.includes("land use")
  ) {
    return "zoning";
  }

  if (
    value.includes("owner") ||
    value.includes("ownership")
  ) {
    return "ownership";
  }

  return "legal";
}

function getRiskFactorLabel(id) {
  const labels = {
    legal: "Legal Risk",
    tax: "Tax Due Analysis",
    flood: "Flood Risk Status",
    permit: "Permit Compliance",
    zoning: "Zoning Compliance",
    ownership: "Ownership Verification",
  };

  return labels[id] || "Risk Factor";
}

function buildExecutiveSummary(reportData) {
  const property = reportData.property;
  const risk = reportData.risk;
  const valuation = reportData.valuation;

  const propertyName =
    property.title ||
    property.address ||
    `Property ${property.id}`;

  const address =
    property.address ||
    "Address not available";

  const riskLevel =
    risk.riskLevel ||
    "Unknown";

  const score =
    risk.overallScore ?? "N/A";

  const comparableCount =
    reportData.comparables?.length || 0;

  let valuationMessage =
    "Current market valuation data is available.";

  if (
    valuation.currentPrice !== null &&
    valuation.growthPercentage !== null
  ) {
    const growth =
      Number(valuation.growthPercentage).toFixed(1);

    const direction =
      Number(valuation.growthPercentage) >= 0
        ? "increased"
        : "decreased";

    valuationMessage =
      `The recorded market value has ${direction} by ${Math.abs(
        growth
      )}% compared with the previous valuation.`;
  }

  if (valuation.history.length === 0) {
    valuationMessage =
      "No valuation history is currently available from the backend.";
  }

  return (
    `${propertyName} at ${address} has an overall ` +
    `${riskLevel.toLowerCase()} risk profile with a safety score of ` +
    `${score}/100. ` +
    `${valuationMessage} ` +
    `${comparableCount} comparable properties were found in the backend. ` +
    `${risk.recommendation || "No recommendation is currently available."}`
  );
}

function normalizeReportResponse(apiReport) {
  const backendProperty =
    apiReport?.property || {};

  const backendRisk =
    apiReport?.riskAssessment || {};

  const backendValuation =
    apiReport?.valuation || {};

  const comparables =
    Array.isArray(apiReport?.comparableProperties)
      ? apiReport.comparableProperties
      : [];

  const propertyHistory =
    Array.isArray(apiReport?.propertyHistory)
      ? apiReport.propertyHistory
      : [];

  

  const currentMarketValue =
    backendValuation.currentMarketValue ?? null;

  const property = {
    id: backendProperty.id,

    title:
      backendProperty.address ||
      `Property ${backendProperty.id}`,

    address:
      backendProperty.address ||
      "Address not available",

    pincode:
      backendProperty.zipCode ||
      "Not available",

    city:
      backendProperty.city ||
      "Not available",

    state:
      backendProperty.state ||
      "Not available",

    propertyType:
      backendProperty.propertyType ||
      "Not available",

    createdAt:
      backendProperty.createdAt ||
      null,

    marketValue:
      currentMarketValue !== null
        ? formatCurrency(currentMarketValue)
        : "Not available",

    marketValueValue:
      currentMarketValue,

    owner:
      apiReport?.ownershipHistory?.[0]?.ownerName ||
      "Not available",

    email:
      "Not available",

    phone:
      "Not available",

    status:
      "Available",

    area:
      "Not available",

    bedrooms:
      "Not available",

    bathrooms:
      "Not available",

    parking:
      "Not available",

    furnishing:
      "Not available",

    surveyNo:
      "Not available",

    registrationNo:
      "Not available",

    registrationDate:
      "Not available",

    taxStatus:
      apiReport?.taxHistory?.length > 0
        ? "Records Available"
        : "No Records",

    mortgage:
      apiReport?.ownershipHistory?.length > 0
        ? "Ownership Records Available"
        : "No Records",

    litigation:
      "Not available",

    verificationStatus:
      backendProperty.id
        ? "Verified"
        : "Not available",

    description:
      "Due diligence information retrieved from the backend.",

    documents: [],

    zoning: {
      zoneType:
        apiReport?.zoningInfo?.[0]?.zoningCode ||
        "Not available",

      landUse:
        apiReport?.zoningInfo?.[0]?.permittedUse ||
        "Not available",

      far:
        "Not available",

      maxHeight:
        "Not available",

      plotCoverage:
        "Not available",

      authority:
        "Not available",

      regulations:
        "Not available",

      lastUpdated:
        "Not available",

      status:
        apiReport?.zoningInfo?.length > 0
          ? "Available"
          : "Not available",
    },
  };

  

  const riskFactors =
    Array.isArray(backendRisk.riskFactors)
      ? backendRisk.riskFactors.map(
          (factor, index) => {

            const id =
              getRiskFactorId(factor);

            return {
              id: `${id}-${index}`,

              factorType: id,

              label:
                getRiskFactorLabel(id),

              score:
                backendRisk.riskScore ?? 0,

              level:
                backendRisk.overallRisk ||
                "Unknown",

              detail:
                factor,
            };
          }
        )
      : [];

  const risk = {
    overallScore:
      backendRisk.riskScore ?? 0,

    riskLevel:
      backendRisk.overallRisk ||
      "Unknown",

    factors:
      riskFactors,

    recommendation:
      backendRisk.recommendation ||
      "No recommendation available.",
  };

  

  

  const backendHistory =
    Array.isArray(
      backendValuation.valueHistory
    )
      ? backendValuation.valueHistory
      : [];

  

  

  const history = backendHistory.map((item) => ({
    year: Number(item.year),
    value: Number(item.marketValue),
  }));

  const valuation = {

    currentPrice:
      backendValuation.currentMarketValue ??
      null,

    avgComparablePrice:
      null,

    percentDiff:
      0,

    positionLabel:
      backendValuation.valuationRemark ||
      "Comparable price data not available",

    comparableCount:
      backendValuation.comparablePropertyCount ??
      comparables.length,

    similarityScore:
      backendValuation.similarityScore ??
      0,

    valuationRemark:
      backendValuation.valuationRemark ||
      "No valuation remark available.",

    history,

    marketTrend:
      history,

    growthPercentage:
      backendValuation.growthPercentage ??
      null,

    previousMarketValue:
      backendValuation.previousMarketValue ??
      null,
  };

  

  const timeline =
    propertyHistory.map(
      (item, index) => ({

        date:
          item.eventDate
            ? new Date(
                item.eventDate
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )
            : "Date unavailable",

        title:
          item.eventType ||
          "Property History Event",

        description:
          item.description ||
          "No description available.",

        color:
          getTimelineColor(index),
      })
    );

  

  const checklist = [

    {
      label:
        "Registration Verified",

      verified:
        !!backendProperty.id,
    },

    {
      label:
        "Owner Identity Verified",

      verified:
        Array.isArray(
          apiReport?.ownershipHistory
        ) &&
        apiReport.ownershipHistory.length > 0,
    },

    {
      label:
        "Tax Records Updated",

      verified:
        Array.isArray(
          apiReport?.taxHistory
        ) &&
        apiReport.taxHistory.length > 0,
    },

    {
      label:
        "Zoning Records Checked",

      verified:
        Array.isArray(
          apiReport?.zoningInfo
        ) &&
        apiReport.zoningInfo.length > 0,
    },

    {
      label:
        "Flood Zone Checked",

      verified:
        Array.isArray(
          apiReport?.floodZoneInfo
        ) &&
        apiReport.floodZoneInfo.length > 0,
    },

    {
      label:
        "Building Permits Checked",

      verified:
        Array.isArray(
          apiReport?.permitHistory
        ) &&
        apiReport.permitHistory.length > 0,
    },

    {
      label:
        "Environmental Records Checked",

      verified:
        Array.isArray(
          apiReport?.environmentalRecords
        ) &&
        apiReport.environmentalRecords.length > 0,
    },
  ];

  

  return {

    reportId:
      `DDR-${backendProperty.id || "UNKNOWN"}`,

    generatedOn:
      apiReport?.generatedOn
        ? new Date(
            apiReport.generatedOn
          ).toLocaleString("en-IN")
        : "Not available",

    property,

    risk,

    valuation,

    comparables:
      comparables.map((item) => ({

        id:
          item.propertyId,

        name:
          item.address ||
          `Property ${item.propertyId}`,

        address:
          item.address ||
          "Address not available",

        price:
          null,

        pricePerSqft:
          null,

        area:
          "Not available",

        distance:
          "Not available",

        propertyType:
          item.propertyType ||
          "Not available",

        city:
          item.city ||
          "Not available",

        state:
          item.state ||
          "Not available",

        pincode:
          item.zipCode ||
          "Not available",
      })),

    timeline,

    documents: [],

    checklist,

    backendData:
      apiReport,
  };
}

const DueDiligenceReport = () => {

  const navigate =
    useNavigate();

  const { propertyId } =
    useParams();

  const [
    reportData,
    setReportData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  

  useEffect(() => {

    const fetchReport =
      async () => {

        try {

          setLoading(true);

          setError("");

          const token =
            localStorage.getItem(
              "token"
            );

          if (!token) {

            setError(
              "Please login to view the due diligence report."
            );

            return;
          }

          if (!propertyId) {

            setError(
              "Property ID is missing."
            );

            return;
          }

          const response =
            await axios.get(
              `http://localhost:8080/api/reports/${propertyId}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const normalizedReport =
            normalizeReportResponse(
              response.data
            );

          setReportData(
            normalizedReport
          );

        } catch (err) {

          console.error(
            "Failed to load due diligence report:",
            err
          );

          if (
            err.response?.status === 401
          ) {

            setError(
              "Your session has expired. Please login again."
            );

          } else if (
            err.response?.status === 403
          ) {

            setError(
              "You are not authorized to view this report."
            );

          } else if (
            err.response?.status === 404
          ) {

            setError(
              "Property/report not found."
            );

          } else {

            setError(
              "Unable to load due diligence report."
            );
          }

        } finally {

          setLoading(false);
        }
      };

    fetchReport();

  }, [propertyId]);

  

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <p className="text-gray-600 text-lg">
          Loading due diligence report...
        </p>

      </div>
    );
  }

  

  if (
    error ||
    !reportData
  ) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <p className="text-red-600 text-lg mb-4">
            {error ||
              "Report data unavailable."}
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  

  const summary =
    buildExecutiveSummary(
      reportData
    );

  const riskClasses =
    getRiskClasses(
      reportData.risk.riskLevel
    );

  const hasCurrentPrice =
    reportData.valuation.currentPrice !==
    null;

  const hasAveragePrice =
    reportData.valuation.avgComparablePrice !==
    null;

  const isAboveMarket =
    reportData.valuation.percentDiff >=
    0;

  

  return (

    <div className="max-w-7xl mx-auto px-6 py-10">

      {}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Due Diligence Report
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Consolidated findings and risk analysis for{" "}
          {reportData.property.title}.
        </p>

      </div>

      <ReportHeader
        reportData={reportData}
      />

      <div className="space-y-8">

        {

}

        <ReportSection
          title="Executive Summary"
          icon={
            <FaInfoCircle className="text-blue-600" />
          }
        >

          <p className="text-gray-600 leading-8">
            {summary}
          </p>

        </ReportSection>

        {

}

        <ReportSection
          title="Risk Score"
          icon={
            <FaShieldAlt
              className={riskClasses.text}
            />
          }
        >

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="rounded-xl border border-gray-200 p-4">

              <RiskScoreGauge
                score={
                  reportData.risk.overallScore
                }
                level={
                  reportData.risk.riskLevel
                }
              />

            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

              {reportData.risk.factors.length >
              0 ? (

                reportData.risk.factors.map(
                  (factor) => (

                    <RiskFactorCard
                      key={factor.id}
                      factor={{
                        ...factor,
                        id:
                          factor.factorType,
                      }}
                    />

                  )
                )

              ) : (

                <div className="md:col-span-2 rounded-xl border border-gray-200 p-6 text-gray-500">

                  No individual risk factors are
                  currently available from the backend.

                </div>

              )}

            </div>

          </div>

        </ReportSection>

        {

}

        <ReportSection
          title="Property Timeline"
          icon={
            <FaHistory className="text-blue-600" />
          }
        >

          <div className="relative border-l-4 border-blue-200 ml-4">

            {reportData.timeline.length >
            0 ? (

              reportData.timeline.map(
                (item) => (

                  <div
                    key={`${item.date}-${item.title}`}
                    className="mb-10 ml-8 relative last:mb-0"
                  >

                    <div
                      className={`absolute -left-[42px] top-1 h-5 w-5 rounded-full border-4 border-white shadow ${getTimelineDotClass(
                        item.color
                      )}`}
                    />

                    <p className="text-sm text-gray-400">
                      {item.date}
                    </p>

                    <h3 className="text-lg font-semibold mt-1">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {item.description}
                    </p>

                  </div>

                )
              )

            ) : (

              <div className="ml-8 text-gray-500">

                No property history records are
                currently available.

              </div>

            )}

          </div>

        </ReportSection>

        {

}

        <ReportSection
          title="Valuation Summary"
          icon={
            <FaMoneyBillWave className="text-green-600" />
          }
        >

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="space-y-4">

              {}

              <div className="rounded-xl border border-gray-200 p-4">

                <p className="text-sm text-gray-500">
                  Current Price
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-1">

                  {hasCurrentPrice
                    ? formatCurrency(
                        reportData.valuation.currentPrice
                      )
                    : "Not available"}

                </h3>

              </div>

              {}

              <div className="rounded-xl border border-gray-200 p-4">

                <p className="text-sm text-gray-500">
                  Market Average
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-1">

                  {hasAveragePrice
                    ? formatCurrency(
                        reportData.valuation.avgComparablePrice
                      )
                    : "Not available"}

                </h3>

              </div>

              {}

              <div className="rounded-xl border border-gray-200 p-4">

                <p className="text-sm text-gray-500">
                  Price Position
                </p>

                <span
                  className={`mt-2 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    hasCurrentPrice &&
                    hasAveragePrice
                      ? isAboveMarket
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {reportData.valuation.positionLabel}
                </span>

              </div>

              {}

              {reportData.valuation.growthPercentage !==
                null && (

                <div className="rounded-xl border border-gray-200 p-4">

                  <p className="text-sm text-gray-500">
                    Valuation Growth
                  </p>

                  <h3 className="text-2xl font-bold text-green-600 mt-1">

                    {Number(
                      reportData.valuation.growthPercentage
                    ).toFixed(2)}%

                  </h3>

                </div>

              )}

            </div>

            {}

            <div className="lg:col-span-2">

              {reportData.valuation.history.length >
              0 ? (

                <ValueHistoryChart
                  data={
                    reportData.valuation.history
                  }
                />

              ) : (

                <div className="h-80 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500">

                  Value history is not currently
                  available from the backend.

                </div>

              )}

            </div>

          </div>

        </ReportSection>

        {

}

        <ReportSection
          title="Supporting Documents"
          icon={
            <FaFolderOpen className="text-purple-600" />
          }
        >

          <div className="space-y-4">

            {reportData.documents.length >
            0 ? (

              reportData.documents.map(
                (doc) => (

                  <div
                    key={doc}
                    className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition"
                  >

                    <div className="flex items-center gap-3">

                      <FaFilePdf className="text-red-600 text-xl" />

                      <span className="font-medium">
                        {doc}
                      </span>

                    </div>

                    <button className="text-blue-600 hover:underline">
                      View
                    </button>

                  </div>

                )
              )

            ) : (

              <div className="rounded-xl border border-gray-200 p-6 text-gray-500">

                No supporting documents are
                currently recorded in the backend.

              </div>

            )}

          </div>

        </ReportSection>

        {

}

        <ReportSection
          title="Due Diligence Checklist"
          icon={
            <FaClipboardCheck className="text-green-600" />
          }
        >

          <div className="space-y-5">

            {reportData.checklist.map(
              (item) => (

                <div
                  key={item.label}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                >

                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>

                  {item.verified ? (

                    <span className="flex items-center gap-2 text-green-600 font-semibold">

                      <FaCheckCircle />

                      Verified

                    </span>

                  ) : (

                    <span className="flex items-center gap-2 text-gray-500 font-semibold">

                      Not Available

                    </span>

                  )}

                </div>

              )
            )}

          </div>

        </ReportSection>

      </div>

      {

}

      <div className="flex justify-end gap-4 mt-10 flex-wrap">

        <button
          onClick={() =>
            exportReportToPDF(
              reportData
            )
          }
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >

          <FaFilePdf />

          Export as PDF

        </button>

        <button
          onClick={() =>
            exportReportToExcel(
              reportData
            )
          }
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >

          <FaFileExcel />

          Export as Excel

        </button>

        <button
          onClick={() =>
            navigate(
              `/property-details/${reportData.property.id}`
            )
          }
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