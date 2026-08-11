import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { formatDate, formatMoney, unavailable } from "../services/dueDiligenceService";

function safeFileName(value) {
  return String(value || "property-report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function objectRows(fields, record) {
  return fields.map(([label, field, formatter]) => [
    label,
    unavailable(formatter ? formatter(record?.[field]) : record?.[field]),
  ]);
}

function mapRows(records, fields) {
  return (records || []).map((record) => {
    const row = {};
    fields.forEach(([label, field, formatter]) => {
      row[label] = unavailable(formatter ? formatter(record?.[field]) : record?.[field]);
    });
    return row;
  });
}

function latestRecord(records, field) {
  return [...(records || [])].sort((left, right) => new Date(right[field] || 0) - new Date(left[field] || 0))[0] || null;
}

function latestTaxRecord(records) {
  return [...(records || [])].sort((left, right) => Number(right.taxYear || 0) - Number(left.taxYear || 0))[0] || null;
}

function comparisonRows(comparison) {
  if (!comparison || comparison.error) return [];
  const a = comparison.propertyA || comparison.a;
  const b = comparison.propertyB || comparison.b;

  const aOwner = latestRecord(a.ownership || [], "purchaseDate");
  const bOwner = latestRecord(b.ownership || [], "purchaseDate");
  const aTax = latestTaxRecord(a.tax || []);
  const bTax = latestTaxRecord(b.tax || []);
  const aPermit = latestRecord(a.permits || [], "issueDate");
  const bPermit = latestRecord(b.permits || [], "issueDate");
  const aHistory = latestRecord(a.history || [], "eventDate");
  const bHistory = latestRecord(b.history || [], "eventDate");
  const aFlood = (a.flood || [])[0] || null;
  const bFlood = (b.flood || [])[0] || null;
  const aZoning = (a.zoning || [])[0] || null;
  const bZoning = (b.zoning || [])[0] || null;
  const aEnvironmental = (a.environmental || [])[0] || null;
  const bEnvironmental = (b.environmental || [])[0] || null;

  return [
    ["Property Overview", "", ""],
    ["Address", unavailable(a.property?.address), unavailable(b.property?.address)],
    ["City", unavailable(a.property?.city), unavailable(b.property?.city)],
    ["State", unavailable(a.property?.state), unavailable(b.property?.state)],
    ["ZIP Code", unavailable(a.property?.zipCode), unavailable(b.property?.zipCode)],
    ["Property Type", unavailable(a.property?.propertyType), unavailable(b.property?.propertyType)],
    ["Price", formatMoney(a.property?.price), formatMoney(b.property?.price)],
    ["Created At", unavailable(a.property?.createdAt), unavailable(b.property?.createdAt)],
    ["Risk Assessment", "", ""],
    ["Risk Score", unavailable(a.riskAssessment?.riskScore), unavailable(b.riskAssessment?.riskScore)],
    ["Overall Risk", unavailable(a.riskAssessment?.overallRisk), unavailable(b.riskAssessment?.overallRisk)],
    ["Recommendation", unavailable(a.riskAssessment?.recommendation), unavailable(b.riskAssessment?.recommendation)],
    ["Valuation", "", ""],
    ["Current Market Value", formatMoney(a.valuation?.currentMarketValue), formatMoney(b.valuation?.currentMarketValue)],
    ["Previous Market Value", formatMoney(a.valuation?.previousMarketValue), formatMoney(b.valuation?.previousMarketValue)],
    ["Growth Percentage", unavailable(a.valuation?.growthPercentage), unavailable(b.valuation?.growthPercentage)],
    ["Comparable Count", unavailable(a.valuation?.comparablePropertyCount), unavailable(b.valuation?.comparablePropertyCount)],
    ["Similarity Score", unavailable(a.valuation?.similarityScore), unavailable(b.valuation?.similarityScore)],
    ["Valuation Remark", unavailable(a.valuation?.valuationRemark), unavailable(b.valuation?.valuationRemark)],
    ["Ownership", "", ""],
    ["Owner", unavailable(aOwner?.ownerName), unavailable(bOwner?.ownerName)],
    ["Purchase Date", unavailable(aOwner?.purchaseDate), unavailable(bOwner?.purchaseDate)],
    ["Historical Purchase Price", formatMoney(aOwner?.purchasePrice), formatMoney(bOwner?.purchasePrice)],
    ["Purchase History", "", ""],
    ["Purchase History Count", unavailable(a.ownership?.length), unavailable(b.ownership?.length)],
    ["Property History", "", ""],
    ["Latest Event", unavailable(aHistory?.eventType), unavailable(bHistory?.eventType)],
    ["Latest Event Date", unavailable(aHistory?.eventDate), unavailable(bHistory?.eventDate)],
    ["Latest Event Description", unavailable(aHistory?.description), unavailable(bHistory?.description)],
    ["Tax History", "", ""],
    ["Latest Tax Year", unavailable(aTax?.taxYear), unavailable(bTax?.taxYear)],
    ["Latest Tax Amount", formatMoney(aTax?.taxAmount), formatMoney(bTax?.taxAmount)],
    ["Latest Payment Status", unavailable(aTax?.paymentStatus), unavailable(bTax?.paymentStatus)],
    ["Flood", "", ""],
    ["Flood Zone", unavailable(aFlood?.floodZoneCode), unavailable(bFlood?.floodZoneCode)],
    ["Flood Risk Level", unavailable(aFlood?.floodRiskLevel), unavailable(bFlood?.floodRiskLevel)],
    ["Insurance Required", unavailable(aFlood?.floodInsuranceRequired ? "Yes" : "No"), unavailable(bFlood?.floodInsuranceRequired ? "Yes" : "No")],
    ["Permits", "", ""],
    ["Latest Permit Number", unavailable(aPermit?.permitNumber), unavailable(bPermit?.permitNumber)],
    ["Latest Permit Type", unavailable(aPermit?.permitType), unavailable(bPermit?.permitType)],
    ["Latest Permit Status", unavailable(aPermit?.status), unavailable(bPermit?.status)],
    ["Zoning", "", ""],
    ["Zoning Code", unavailable(aZoning?.zoningCode), unavailable(bZoning?.zoningCode)],
    ["Zoning Description", unavailable(aZoning?.zoningDescription), unavailable(bZoning?.zoningDescription)],
    ["Permitted Use", unavailable(aZoning?.permittedUse), unavailable(bZoning?.permittedUse)],
    ["Environmental", "", ""],
    ["Environmental Risk", unavailable(aEnvironmental?.environmentalRisk), unavailable(bEnvironmental?.environmentalRisk)],
    ["Contamination Level", unavailable(aEnvironmental?.contaminationLevel), unavailable(bEnvironmental?.contaminationLevel)],
    ["Environmental Remarks", unavailable(aEnvironmental?.remarks), unavailable(bEnvironmental?.remarks)],
  ];
}

export function buildReportSections(reportData) {
  const property = reportData.property || {};
  const risk = reportData.riskAssessment || {};
  const valuation = reportData.valuation || {};

  const sections = [
    {
      title: "Property Overview",
      columns: ["Field", "Value"],
      rows: [
        ["Property ID", unavailable(property.id)],
        ["Address", unavailable(property.address)],
        ["City", unavailable(property.city)],
        ["State", unavailable(property.state)],
        ["ZIP Code", unavailable(property.zipCode)],
        ["Property Type", unavailable(property.propertyType)],
        ["Price", formatMoney(property.price)],
        ["Created At", formatDate(property.createdAt)],
      ],
    },
    {
      title: "Risk Assessment",
      columns: ["Field", "Value"],
      rows: [
        ["Risk Score", `${unavailable(risk.riskScore)} / 100`],
        ["Overall Risk", unavailable(risk.overallRisk)],
        ["Recommendation", unavailable(risk.recommendation)],
      ],
    },
    {
      title: "Risk Factors",
      columns: ["#", "Backend Risk Factor"],
      rows: (risk.riskFactors || []).map((factor, index) => [index + 1, factor]),
    },
    {
      title: "Property Valuation",
      columns: ["Field", "Value"],
      rows: [
        ["Current Market Value", formatMoney(valuation.currentMarketValue)],
        ["Previous Market Value", formatMoney(valuation.previousMarketValue)],
        ["Growth Percentage", unavailable(valuation.growthPercentage)],
        ["Comparable Property Count", unavailable(valuation.comparablePropertyCount)],
        ["Similarity Score", unavailable(valuation.similarityScore)],
        ["Valuation Remark", unavailable(valuation.valuationRemark)],
      ],
    },
    {
      title: "Value History",
      columns: ["Year", "Market Value", "Source"],
      rows: (valuation.valueHistory || []).map((record) => [
        unavailable(record.year),
        formatMoney(record.marketValue),
        unavailable(record.source),
      ]),
    },
    {
      title: "Comparable Properties",
      columns: ["Property ID", "Address", "City", "State", "ZIP", "Type"],
      rows: (reportData.comparableProperties || []).map((record) => [
        unavailable(record.propertyId),
        unavailable(record.address),
        unavailable(record.city),
        unavailable(record.state),
        unavailable(record.zipCode),
        unavailable(record.propertyType),
      ]),
    },
    {
      title: "Ownership & Purchase History",
      columns: ["Owner", "Purchase Date", "Historical Purchase Price"],
      rows: (reportData.ownership || []).map((record) => [
        unavailable(record.ownerName),
        formatDate(record.purchaseDate),
        formatMoney(record.purchasePrice),
      ]),
    },
    {
      title: "Property History",
      columns: ["Event Type", "Event Date", "Description"],
      rows: (reportData.propertyHistory || []).map((record) => [
        unavailable(record.eventType),
        formatDate(record.eventDate),
        unavailable(record.description),
      ]),
    },
    {
      title: "Tax History",
      columns: ["Tax Year", "Tax Amount", "Payment Status"],
      rows: (reportData.tax || []).map((record) => [
        unavailable(record.taxYear),
        formatMoney(record.taxAmount),
        unavailable(record.paymentStatus),
      ]),
    },
    {
      title: "Flood Zone",
      columns: ["Flood Zone Code", "Risk Level", "Insurance Required"],
      rows: (reportData.flood || []).map((record) => [
        unavailable(record.floodZoneCode),
        unavailable(record.floodRiskLevel),
        record.floodInsuranceRequired ? "Yes" : "No",
      ]),
    },
    {
      title: "Permits",
      columns: ["Permit Number", "Permit Type", "Status", "Issue Date"],
      rows: (reportData.permits || []).map((record) => [
        unavailable(record.permitNumber),
        unavailable(record.permitType),
        unavailable(record.status),
        formatDate(record.issueDate),
      ]),
    },
    {
      title: "Zoning",
      columns: ["Zoning Code", "Description", "Permitted Use"],
      rows: (reportData.zoning || []).map((record) => [
        unavailable(record.zoningCode),
        unavailable(record.zoningDescription),
        unavailable(record.permittedUse),
      ]),
    },
    {
      title: "Environmental",
      columns: ["Environmental Risk", "Contamination Level", "Remarks"],
      rows: (reportData.environmental || []).map((record) => [
        unavailable(record.environmentalRisk),
        unavailable(record.contaminationLevel),
        unavailable(record.remarks),
      ]),
    },
    {
      title: "Data / Source Information",
      columns: ["Item", "Information"],
      rows: [
        ["Report Source", "GET /api/reports/{propertyId}"],
        ["Risk Source", "Backend RiskAssessmentResponse riskScore, overallRisk, riskFactors and recommendation."],
        ["Valuation Source", "Backend PropertyValuationResponse currentMarketValue, previousMarketValue, growthPercentage and valueHistory."],
        ["Historical Purchase Price", "Ownership purchasePrice is displayed separately from market value."],
        ["Comparison", reportData.comparison && !reportData.comparison.error ? "Explicit Property A/B comparison included." : "No explicit Property A/B comparison was performed."],
      ],
    },
  ];

  const comparedRows = comparisonRows(reportData.comparison);
  if (comparedRows.length) {
    sections.push({
      title: "Property Comparison",
      columns: ["Field", "Property A", "Property B"],
      rows: comparedRows,
    });
  }

  return sections;
}

function drawPageNumbers(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${page} of ${pageCount}`, 180, 288);
    doc.text("Real Estate Due Diligence Agent", 14, 288);
  }
}

export function exportReportToPDF(reportData) {
  const doc = new jsPDF();
  const property = reportData.property || {};
  const title = unavailable(property.address);

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("Due Diligence Report", 14, 13);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date(reportData.generatedAt).toLocaleString("en-IN")}`, 124, 13);
  doc.text(`Property ID: ${unavailable(property.id)}`, 14, 22);
  doc.text(`Risk: ${unavailable(reportData.riskAssessment?.overallRisk)} (${unavailable(reportData.riskAssessment?.riskScore)}/100)`, 124, 22);

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(13);
  doc.text(title, 14, 40);

  let cursor = 48;
  buildReportSections(reportData).forEach((section) => {
    if (cursor > 250) {
      doc.addPage();
      cursor = 18;
    }

    doc.setFontSize(13);
    doc.setTextColor(31, 41, 55);
    doc.text(section.title, 14, cursor);

    autoTable(doc, {
      startY: cursor + 5,
      head: [section.columns],
      body: section.rows.length
        ? section.rows
        : [Array(section.columns.length).fill("No data returned from the connected source.")],
      styles: { fontSize: 8.5, cellPadding: 3, overflow: "linebreak" },
      headStyles: { fillColor: "#2563eb", textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 16, right: 14, bottom: 16, left: 14 },
    });

    cursor = doc.lastAutoTable.finalY + 14;
  });

  drawPageNumbers(doc);
  doc.save(`${safeFileName(title)}-due-diligence.pdf`);
}

function appendSheet(wb, name, records, fields) {
  const data = records.length ? mapRows(records, fields) : [{ Status: "No data returned from the connected source." }];
  const sheet = XLSX.utils.json_to_sheet(data);
  sheet["!cols"] = Object.keys(data[0]).map(() => ({ wch: 26 }));
  sheet["!freeze"] = { xSplit: 0, ySplit: 1 };
  XLSX.utils.book_append_sheet(wb, sheet, name.slice(0, 31));
}

export function exportReportToExcel(reportData) {
  const wb = XLSX.utils.book_new();
  const property = reportData.property || {};
  const risk = reportData.riskAssessment || {};
  const valuation = reportData.valuation || {};

  const overviewSheet = XLSX.utils.aoa_to_sheet([
    ["Field", "Value"],
    ...objectRows([
      ["Property ID", "id"],
      ["Address", "address"],
      ["City", "city"],
      ["State", "state"],
      ["ZIP Code", "zipCode"],
      ["Property Type", "propertyType"],
      ["Price", "price", formatMoney],
      ["Created At", "createdAt", formatDate],
    ], property),
  ]);
  overviewSheet["!cols"] = [{ wch: 28 }, { wch: 44 }];
  XLSX.utils.book_append_sheet(wb, overviewSheet, "Property Overview");

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Field", "Value"],
      ["Risk Score", unavailable(risk.riskScore)],
      ["Overall Risk", unavailable(risk.overallRisk)],
      ["Recommendation", unavailable(risk.recommendation)],
    ]),
    "Risk Assessment",
  );
  appendSheet(wb, "Risk Factors", (risk.riskFactors || []).map((factor, index) => ({ index: index + 1, factor })), [
    ["#", "index"],
    ["Backend Risk Factor", "factor"],
  ]);
  appendSheet(wb, "Property Valuation", [valuation], [
    ["Current Market Value", "currentMarketValue", formatMoney],
    ["Previous Market Value", "previousMarketValue", formatMoney],
    ["Growth Percentage", "growthPercentage"],
    ["Comparable Count", "comparablePropertyCount"],
    ["Similarity Score", "similarityScore"],
    ["Valuation Remark", "valuationRemark"],
  ]);
  appendSheet(wb, "Value History", valuation.valueHistory || [], [
    ["Year", "year"],
    ["Market Value", "marketValue", formatMoney],
    ["Source", "source"],
  ]);
  appendSheet(wb, "Comparable Properties", reportData.comparableProperties, [
    ["Property ID", "propertyId"],
    ["Address", "address"],
    ["City", "city"],
    ["State", "state"],
    ["ZIP Code", "zipCode"],
    ["Property Type", "propertyType"],
  ]);
  appendSheet(wb, "Ownership Purchase", reportData.ownership, [
    ["Owner Name", "ownerName"],
    ["Purchase Date", "purchaseDate", formatDate],
    ["Historical Purchase Price", "purchasePrice", formatMoney],
  ]);
  appendSheet(wb, "Property History", reportData.propertyHistory, [
    ["Event Type", "eventType"],
    ["Event Date", "eventDate", formatDate],
    ["Description", "description"],
  ]);
  appendSheet(wb, "Tax History", reportData.tax, [
    ["Tax Year", "taxYear"],
    ["Tax Amount", "taxAmount", formatMoney],
    ["Payment Status", "paymentStatus"],
  ]);
  appendSheet(wb, "Flood Zone", reportData.flood, [
    ["Flood Zone Code", "floodZoneCode"],
    ["Flood Risk Level", "floodRiskLevel"],
    ["Insurance Required", "floodInsuranceRequired"],
  ]);
  appendSheet(wb, "Permits", reportData.permits, [
    ["Permit Number", "permitNumber"],
    ["Permit Type", "permitType"],
    ["Status", "status"],
    ["Issue Date", "issueDate", formatDate],
  ]);
  appendSheet(wb, "Zoning", reportData.zoning, [
    ["Zoning Code", "zoningCode"],
    ["Description", "zoningDescription"],
    ["Permitted Use", "permittedUse"],
  ]);
  appendSheet(wb, "Environmental", reportData.environmental, [
    ["Environmental Risk", "environmentalRisk"],
    ["Contamination Level", "contaminationLevel"],
    ["Remarks", "remarks"],
  ]);

  const comparedRows = comparisonRows(reportData.comparison);
  if (comparedRows.length) {
    const comparisonSheet = XLSX.utils.aoa_to_sheet([["Field", "Property A", "Property B"], ...comparedRows]);
    comparisonSheet["!cols"] = [{ wch: 28 }, { wch: 44 }, { wch: 44 }];
    comparisonSheet["!freeze"] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, comparisonSheet, "Property Comparison");
  }

  const workbookOutput = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([workbookOutput], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${safeFileName(property.address)}-due-diligence.xlsx`);
}
