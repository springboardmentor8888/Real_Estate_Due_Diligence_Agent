import {
  getComparableListings,
  getMarketTrend,
  getValuationSummary,
  getValueHistory,
} from "./comparableData";
import { getPropertyById } from "./propertyData";
import { getRiskAssessment } from "./riskData";

export const propertyTimeline = [
  {
    date: "12 Jan 2023",
    title: "Property Registered",
    description: "Registration completed successfully.",
    color: "green",
  },
  {
    date: "15 Mar 2023",
    title: "Ownership Transfer",
    description: "Ownership chain updated and verified.",
    color: "blue",
  },
  {
    date: "20 Jun 2024",
    title: "Tax Assessment Updated",
    description: "Latest property tax records reviewed.",
    color: "yellow",
  },
  {
    date: "10 Oct 2024",
    title: "Site Inspection",
    description: "Physical inspection and public-record checks completed.",
    color: "purple",
  },
  {
    date: "05 Jan 2025",
    title: "Due Diligence Completed",
    description: "Legal, tax, zoning, and ownership checks consolidated.",
    color: "green",
  },
];

export const dueDiligenceChecklist = [
  "Registration Verified",
  "Owner Identity Verified",
  "Tax Records Updated",
  "Encumbrance Certificate Verified",
  "Survey Records Checked",
  "Litigation Check Completed",
  "Property Inspection Completed",
];

export function buildExecutiveSummary(reportData) {
  const direction = reportData.valuation.percentDiff >= 0 ? "above" : "below";
  const percent = Math.abs(reportData.valuation.percentDiff).toFixed(1);

  return `${reportData.property.title} at ${reportData.property.address} has an overall ${reportData.risk.riskLevel.toLowerCase()} risk profile with a safety score of ${reportData.risk.overallScore}/100. The property is valued ${percent}% ${direction} the current comparable average, based on ${reportData.comparables.length} nearby listings. Tax status is ${reportData.property.taxStatus.toLowerCase()}, mortgage status is ${reportData.property.mortgage.toLowerCase()}, and litigation status is ${reportData.property.litigation.toLowerCase()}. Standard closing verification is recommended before purchase execution.`;
}

export function buildReportData(propertyId = "PROP001") {
  const property = getPropertyById(propertyId);
  const valuation = getValuationSummary(property.id);

  return {
    reportId: `DDR-2026-${property.id.replace("PROP", "")}`,
    generatedOn: "30 Jul 2026",
    property,
    risk: getRiskAssessment(property.id),
    valuation: {
      ...valuation,
      history: getValueHistory(property.id),
      marketTrend: getMarketTrend(property.id),
    },
    comparables: getComparableListings(property.id),
    documents: property.documents,
    timeline: propertyTimeline,
    checklist: dueDiligenceChecklist,
  };
}
