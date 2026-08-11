import {
  getComparisonBundle,
  getReport,
} from "../services/dueDiligenceService";

const comparisonKey = (propertyId) => `dueDiligenceComparison:${propertyId}`;

export function saveComparisonSelection(propertyId, compareId) {
  if (!propertyId || !compareId) return;
  sessionStorage.setItem(comparisonKey(propertyId), String(compareId));
}

export function getComparisonSelection(propertyId) {
  return sessionStorage.getItem(comparisonKey(propertyId));
}

export function normalizeReportResponse(report, comparison = null) {
  return {
    property: report?.property || null,
    riskAssessment: report?.riskAssessment || null,
    valuation: report?.valuation || null,
    comparableProperties: report?.comparableProperties || [],
    propertyHistory: report?.propertyHistory || [],
    ownership: report?.ownershipHistory || [],
    purchaseHistory: report?.ownershipHistory || [],
    tax: report?.taxHistory || [],
    zoning: report?.zoningInfo || [],
    flood: report?.floodZoneInfo || [],
    permits: report?.permitHistory || [],
    environmental: report?.environmentalRecords || [],
    generatedAt: report?.generatedOn || new Date().toISOString(),
    comparison,
    rawReport: report,
  };
}

export async function buildReportData(propertyId, options = {}) {
  const report = await getReport(propertyId);
  const compareId = options.compareId || getComparisonSelection(propertyId);

  let comparison = null;
  if (compareId && String(compareId) !== String(propertyId)) {
    try {
      comparison = await getComparisonBundle(propertyId, compareId);
    } catch (error) {
      comparison = {
        error: error.response?.data?.message || "Unable to retrieve comparison data.",
      };
    }
  }

  return normalizeReportResponse(report, comparison);
}
