import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { formatCurrency } from "../data/comparableData";

const brandBlue = "#2563eb";

function addTitle(doc, reportData, title) {
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(title, 14, 14);
  doc.setFontSize(10);
  doc.text(`Generated on ${reportData.generatedOn}`, 145, 14);
  doc.setTextColor(31, 41, 55);
}

function table(doc, title, head, body) {
  if (doc.lastAutoTable && doc.lastAutoTable.finalY > 250) {
    doc.addPage();
    doc.lastAutoTable = null;
  }

  doc.setFontSize(13);
  doc.text(title, 14, doc.lastAutoTable ? doc.lastAutoTable.finalY + 14 : 34);

  autoTable(doc, {
    startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 18 : 38,
    head: [head],
    body,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: brandBlue, textColor: 255 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });
}

function safeFileName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function propertyRows(property) {
  return [
    ["Property", property.title],
    ["Address", property.address],
    ["Pincode", property.pincode],
    ["City", property.city],
    ["State", property.state],
    ["Owner", property.owner],
    ["Contact Number", property.phone],
    ["Email", property.email],
    ["Property Type", property.propertyType],
    ["Status", property.status],
    ["Area", property.area],
    ["Bedrooms / Usage", property.bedrooms],
    ["Bathrooms", property.bathrooms],
    ["Parking", property.parking],
    ["Furnishing", property.furnishing],
    ["Survey Number", property.surveyNo],
    ["Registration Number", property.registrationNo],
    ["Registration Date", property.registrationDate],
    ["Market Value", property.marketValue],
    ["Description", property.description],
  ];
}

function zoningRows(property) {
  return [
    ["Zone Type", property.zoning.zoneType],
    ["Land Use", property.zoning.landUse],
    ["FAR / FSI", property.zoning.far],
    ["Maximum Height", property.zoning.maxHeight],
    ["Plot Coverage", property.zoning.plotCoverage],
    ["Authority", property.zoning.authority],
    ["Applicable Regulations", property.zoning.regulations],
    ["Last Updated", property.zoning.lastUpdated],
    ["Approval Status", property.zoning.status],
  ];
}

function dueDiligenceRows(property) {
  return [
    ["Registration Verified", "Verified"],
    ["Owner Verification", property.verificationStatus],
    ["Tax Status", property.taxStatus],
    ["Mortgage", property.mortgage],
    ["Litigation", property.litigation],
  ];
}

export function exportReportToPDF(reportData, options = {}) {
  const sectionsOnly = options.sectionsOnly || [];
  const riskOnly = sectionsOnly.includes("risk");
  const doc = new jsPDF();

  addTitle(doc, reportData, riskOnly ? "Risk Assessment Report" : "Due Diligence Report");

  if (!riskOnly && reportData.property) {
    table(
      doc,
      "Property Information",
      ["Field", "Value"],
      propertyRows(reportData.property),
    );

    table(
      doc,
      "Due Diligence Status",
      ["Check", "Result"],
      dueDiligenceRows(reportData.property),
    );

    table(
      doc,
      "Zoning Information",
      ["Field", "Value"],
      zoningRows(reportData.property),
    );
  }

  table(
    doc,
    "Risk Summary",
    ["Metric", "Value"],
    [
      ["Overall Risk", reportData.risk.riskLevel],
      ["Risk Score", `${reportData.risk.overallScore}/100`],
      ["Recommendation", reportData.risk.recommendation],
    ],
  );

  table(
    doc,
    "Risk Factors",
    ["Factor", "Score", "Level", "Detail"],
    reportData.risk.factors.map((factor) => [
      factor.label,
      `${factor.score}/100`,
      factor.level,
      factor.detail,
    ]),
  );

  if (!riskOnly && reportData.valuation) {
    table(
      doc,
      "Valuation Summary",
      ["Metric", "Value"],
      [
        ["Current Price", formatCurrency(reportData.valuation.currentPrice)],
        ["Comparable Average", formatCurrency(reportData.valuation.avgComparablePrice)],
        ["Market Difference", reportData.valuation.positionLabel],
        ["Comparable Count", reportData.valuation.comparableCount],
      ],
    );

    table(
      doc,
      "Comparable Properties",
      ["Name", "Address", "Price", "Price / Sq.ft", "Area", "Distance"],
      reportData.comparables.map((listing) => [
        listing.name,
        listing.address,
        formatCurrency(listing.price),
        formatCurrency(listing.pricePerSqft),
        listing.area,
        listing.distance,
      ]),
    );

    table(
      doc,
      "Property Timeline",
      ["Date", "Event", "Detail"],
      reportData.timeline.map((item) => [item.date, item.title, item.description]),
    );

    table(
      doc,
      "Supporting Documents",
      ["Document", "Status"],
      reportData.documents.map((docName) => [docName, "Available for review"]),
    );
  }

  if (!riskOnly && reportData.checklist) {
    table(
      doc,
      "Due Diligence Checklist",
      ["Item", "Status"],
      reportData.checklist.map((item) => [item, "Verified"]),
    );
  }

  doc.save(`${safeFileName(reportData.property.title)}-due-diligence.pdf`);
}

export function exportReportToExcel(reportData) {
  const wb = XLSX.utils.book_new();

  const summaryRows = [
    ["Generated On", reportData.generatedOn],
    ["Property", reportData.property.title],
    ["Address", reportData.property.address],
    ["Pincode", reportData.property.pincode],
    ["Owner", reportData.property.owner],
    ["Property Type", reportData.property.propertyType],
    ["Area", reportData.property.area],
    ["Current Price", formatCurrency(reportData.valuation.currentPrice)],
    ["Comparable Average", formatCurrency(reportData.valuation.avgComparablePrice)],
    ["Market Difference", reportData.valuation.positionLabel],
    ["Overall Risk", reportData.risk.riskLevel],
    ["Risk Score", reportData.risk.overallScore],
  ];

  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), "Summary");
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([["Field", "Value"], ...propertyRows(reportData.property)]),
    "Property Information",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([["Check", "Result"], ...dueDiligenceRows(reportData.property)]),
    "Due Diligence",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([["Field", "Value"], ...zoningRows(reportData.property)]),
    "Zoning",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      reportData.risk.factors.map((factor) => ({
        Factor: factor.label,
        Score: factor.score,
        Level: factor.level,
        Detail: factor.detail,
      })),
    ),
    "Risk Assessment",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      reportData.comparables.map((listing) => ({
        Name: listing.name,
        Address: listing.address,
        Price: listing.price,
        "Price Per Sqft": listing.pricePerSqft,
        Area: listing.area,
        Distance: listing.distance,
      })),
    ),
    "Comparable Properties",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      reportData.valuation.history.map((item) => ({
        Year: item.year,
        Value: formatCurrency(item.value),
      })),
    ),
    "Value History",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      reportData.valuation.marketTrend.map((item) => ({
        Month: item.month,
        "Average Price": formatCurrency(item.avgPrice),
      })),
    ),
    "Market Trend",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      reportData.timeline.map((item) => ({
        Date: item.date,
        Event: item.title,
        Detail: item.description,
      })),
    ),
    "Timeline",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      reportData.documents.map((docName) => ({
        Document: docName,
        Status: "Available for review",
      })),
    ),
    "Documents",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      reportData.checklist.map((item) => ({
        Item: item,
        Status: "Verified",
      })),
    ),
    "Checklist",
  );

  const workbookOutput = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([workbookOutput], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${safeFileName(reportData.property.title)}-due-diligence.xlsx`);
}
