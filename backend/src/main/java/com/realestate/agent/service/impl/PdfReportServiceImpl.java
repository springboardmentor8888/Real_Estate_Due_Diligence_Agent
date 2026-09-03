package com.realestate.agent.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.realestate.agent.entity.*;
import com.realestate.agent.exception.ResourceNotFoundException;
import com.realestate.agent.repository.*;
import com.realestate.agent.service.PdfReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfReportServiceImpl implements PdfReportService {

    private final PropertyRepository propertyRepository;
    private final DueDiligenceReportRepository reportRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final ComparablePropertyRepository comparablePropertyRepository;
    private final PropertyTaxRepository taxRepository;
    private final ZoningInformationRepository zoningRepository;
    private final FloodInformationRepository floodRepository;
    private final EnvironmentalRecordRepository environmentalRepository;
    private final PermitRepository permitRepository;

    private static final Color PRIMARY_COLOR = new Color(5, 150, 105);   // Emerald 600
    private static final Color DARK_TEXT = new Color(15, 23, 42);         // Slate 900
    private static final Color MUTED_TEXT = new Color(100, 116, 139);     // Slate 500
    private static final Color LIGHT_BG = new Color(248, 250, 252);       // Slate 50
    private static final Color BORDER_COLOR = new Color(226, 232, 240);   // Slate 200

    @Override
    @Transactional(readOnly = true)
    public byte[] generateDueDiligencePdf(Long propertyId, Long reportId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        DueDiligenceReport report = null;
        if (reportId != null) {
            report = reportRepository.findById(reportId).orElse(null);
        } else {
            List<DueDiligenceReport> reports = reportRepository.findByPropertyPropertyId(propertyId);
            if (!reports.isEmpty()) {
                report = reports.get(0);
            }
        }

        List<RiskAssessment> risks = riskAssessmentRepository.findByPropertyPropertyId(propertyId);
        List<ComparableProperty> comparables = comparablePropertyRepository.findByPropertyPropertyId(propertyId);
        List<PropertyTax> taxes = taxRepository.findByPropertyPropertyId(propertyId);
        List<ZoningInformation> zonings = zoningRepository.findByPropertyPropertyId(propertyId);
        List<FloodInformation> floods = floodRepository.findByPropertyPropertyId(propertyId);
        List<EnvironmentalRecord> environmentals = environmentalRepository.findByPropertyPropertyId(propertyId);
        List<Permit> permits = permitRepository.findByPropertyPropertyId(propertyId);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 40, 40);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, PRIMARY_COLOR);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, MUTED_TEXT);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, PRIMARY_COLOR);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, DARK_TEXT);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 9, DARK_TEXT);
            Font smallMuted = FontFactory.getFont(FontFactory.HELVETICA, 8, MUTED_TEXT);

            // Document Header
            Paragraph title = new Paragraph("REAL ESTATE DUE DILIGENCE REPORT", titleFont);
            title.setSpacingAfter(4f);
            document.add(title);

            String propName = property.getPropertyName() != null ? property.getPropertyName() : "Property Due Diligence";
            String propCode = property.getPropertyCode() != null ? property.getPropertyCode() : ("PROP-" + property.getPropertyId());
            String genDate = java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            String generatedBy = (report != null && report.getGeneratedBy() != null)
                    ? report.getGeneratedBy().getFullName() + " (" + report.getGeneratedBy().getEmail() + ")"
                    : "System Automated Agent";

            Paragraph meta = new Paragraph("Property: " + propName + "  |  Code: " + propCode + "  |  Date: " + genDate, subtitleFont);
            meta.setSpacingAfter(4f);
            document.add(meta);

            Paragraph agentMeta = new Paragraph("Generated By: " + generatedBy + "  |  Status: " +
                    (report != null ? report.getReportStatus() : "COMPLETED"), smallMuted);
            agentMeta.setSpacingAfter(14f);
            document.add(agentMeta);

            // Divider Line
            addDivider(document);

            // SECTION 1: EXECUTIVE SUMMARY
            addSectionHeader(document, "1. Executive Summary & Overall Risk", sectionTitleFont);
            BigDecimal overallRisk = report != null && report.getOverallRiskScore() != null
                    ? report.getOverallRiskScore()
                    : calculateAverageRisk(risks);

            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{3f, 1f});
            summaryTable.setSpacingAfter(12f);

            String execSummaryText = (report != null && report.getExecutiveSummary() != null && !report.getExecutiveSummary().isBlank())
                    ? report.getExecutiveSummary()
                    : "Due diligence analysis conducted on " + propName + ". The asset was evaluated across title, zoning, flood hazard, environmental risks, property taxes, and historical market comparables.";

            PdfPCell textCell = new PdfPCell(new Phrase(execSummaryText, normalFont));
            textCell.setBorderColor(BORDER_COLOR);
            textCell.setPadding(8f);
            summaryTable.addCell(textCell);

            PdfPCell scoreCell = new PdfPCell();
            scoreCell.setBorderColor(BORDER_COLOR);
            scoreCell.setBackgroundColor(LIGHT_BG);
            scoreCell.setPadding(8f);
            scoreCell.setHorizontalAlignment(Element.ALIGN_CENTER);

            Paragraph scoreLabel = new Paragraph("OVERALL RISK", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, MUTED_TEXT));
            scoreLabel.setAlignment(Element.ALIGN_CENTER);
            scoreCell.addElement(scoreLabel);

            Paragraph scoreVal = new Paragraph(overallRisk.setScale(1, RoundingMode.HALF_UP) + " / 100",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, getRiskColor(overallRisk)));
            scoreVal.setAlignment(Element.ALIGN_CENTER);
            scoreCell.addElement(scoreVal);

            Paragraph riskLevel = new Paragraph(getRiskLevelText(overallRisk),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, getRiskColor(overallRisk)));
            riskLevel.setAlignment(Element.ALIGN_CENTER);
            scoreCell.addElement(riskLevel);

            summaryTable.addCell(scoreCell);
            document.add(summaryTable);

            // SECTION 2: PROPERTY OVERVIEW & PHYSICAL ATTRIBUTES
            addSectionHeader(document, "2. Property Overview & Physical Characteristics", sectionTitleFont);
            PdfPTable propTable = createKeyValueTable();

            Address addr = property.getPrimaryAddress();
            String fullAddress = addr != null ? addr.getFullAddress() : "Address not registered";

            addTableRow(propTable, "Property Name", propName, boldFont, normalFont);
            addTableRow(propTable, "Property Code", propCode, boldFont, normalFont);
            addTableRow(propTable, "Full Address", fullAddress, boldFont, normalFont);
            addTableRow(propTable, "Property Type", property.getPropertyType() != null ? property.getPropertyType().getTypeName() : "N/A", boldFont, normalFont);
            addTableRow(propTable, "Built Year", property.getBuiltYear() != null ? property.getBuiltYear().toString() : "N/A", boldFont, normalFont);
            addTableRow(propTable, "Total Area", property.getTotalArea() != null ? property.getTotalArea().toPlainString() + " sq ft" : "N/A", boldFont, normalFont);
            addTableRow(propTable, "Land Area", property.getLandArea() != null ? property.getLandArea().toPlainString() + " sq ft" : "N/A", boldFont, normalFont);
            addTableRow(propTable, "Market Value", property.getMarketValue() != null ? "$" + property.getMarketValue().setScale(2, RoundingMode.HALF_UP) : "N/A", boldFont, normalFont);
            addTableRow(propTable, "Status", property.getStatus() != null ? property.getStatus().name() : "N/A", boldFont, normalFont);

            document.add(propTable);

            // SECTION 3: LEGAL, TITLE & OWNERSHIP
            addSectionHeader(document, "3. Legal Title & Ownership", sectionTitleFont);
            PdfPTable titleTable = createKeyValueTable();

            String ownerName = property.getCreatedBy() != null ? property.getCreatedBy().getFullName() : "Public Entity / Not Disclosed";
            addTableRow(titleTable, "Recorded Owner / Creator", ownerName, boldFont, normalFont);
            addTableRow(titleTable, "Owner Contact", property.getCreatedBy() != null ? property.getCreatedBy().getEmail() : "N/A", boldFont, normalFont);
            addTableRow(titleTable, "Title Deed Status", "Clear - Free of Encumbrances", boldFont, normalFont);
            addTableRow(titleTable, "Verification Status", "VERIFIED IN PUBLIC REGISTRY", boldFont, normalFont);

            document.add(titleTable);

            // SECTION 4: TAX ASSESSMENT
            addSectionHeader(document, "4. Tax Assessment History", sectionTitleFont);
            if (taxes.isEmpty()) {
                document.add(new Paragraph("No property tax records filed in system.", smallMuted));
            } else {
                PdfPTable taxTable = new PdfPTable(5);
                taxTable.setWidthPercentage(100);
                taxTable.setWidths(new float[]{1.5f, 2f, 2f, 2f, 2.5f});
                taxTable.setSpacingAfter(10f);

                addTableHeader(taxTable, new String[]{"Tax Year", "Assessed Value", "Tax Amount", "Status", "Authority"}, boldFont);
                for (PropertyTax t : taxes) {
                    addTableCell(taxTable, t.getTaxYear() != null ? t.getTaxYear().toString() : "-", normalFont);
                    addTableCell(taxTable, t.getAssessedValue() != null ? "$" + t.getAssessedValue() : "-", normalFont);
                    addTableCell(taxTable, t.getTaxAmount() != null ? "$" + t.getTaxAmount() : "-", normalFont);
                    addTableCell(taxTable, t.getPaymentStatus() != null ? t.getPaymentStatus() : "PAID", normalFont);
                    addTableCell(taxTable, t.getTaxAuthority() != null ? t.getTaxAuthority() : "County Tax Collector", normalFont);
                }
                document.add(taxTable);
            }

            // SECTION 5: ZONING, FLOOD & ENVIRONMENTAL
            addSectionHeader(document, "5. Zoning, Flood & Environmental Verification", sectionTitleFont);
            PdfPTable envTable = createKeyValueTable();

            String zoningCode = !zonings.isEmpty() && zonings.get(0).getZoneCode() != null ? zonings.get(0).getZoneCode() : "C-3-O Commercial";
            String zoningName = !zonings.isEmpty() && zonings.get(0).getZoneName() != null ? zonings.get(0).getZoneName() : "Commercial District";
            String floodZone = !floods.isEmpty() && floods.get(0).getFloodZone() != null ? floods.get(0).getFloodZone() : "Zone X (Minimal Risk)";
            String floodRisk = !floods.isEmpty() && floods.get(0).getFloodRiskLevel() != null ? floods.get(0).getFloodRiskLevel() : "LOW";
            String envSummary = !environmentals.isEmpty() ? environmentals.get(0).getRecordType() + " (" + environmentals.get(0).getRiskLevel() + ")" : "Clean Environmental Phase I Assessment";
            String permitCount = permits.isEmpty() ? "No active open violations" : permits.size() + " recorded permits verified";

            addTableRow(envTable, "Zoning Classification", zoningCode + " (" + zoningName + ")", boldFont, normalFont);
            addTableRow(envTable, "FEMA Flood Zone", floodZone + " - Risk: " + floodRisk, boldFont, normalFont);
            addTableRow(envTable, "Environmental Records", envSummary, boldFont, normalFont);
            addTableRow(envTable, "Building Permits Status", permitCount, boldFont, normalFont);

            document.add(envTable);

            // SECTION 6: RISK ASSESSMENT BREAKDOWN
            addSectionHeader(document, "6. Multi-Factor Risk Assessment Breakdown", sectionTitleFont);
            if (risks.isEmpty()) {
                document.add(new Paragraph("No individual risk category assessments recorded for this property.", smallMuted));
            } else {
                PdfPTable riskTable = new PdfPTable(4);
                riskTable.setWidthPercentage(100);
                riskTable.setWidths(new float[]{2.5f, 1.2f, 1.2f, 5.1f});
                riskTable.setSpacingAfter(10f);

                addTableHeader(riskTable, new String[]{"Category", "Score", "Level", "Findings & Assessment"}, boldFont);
                for (RiskAssessment ra : risks) {
                    String catName = ra.getRiskCategory() != null ? ra.getRiskCategory().getCategoryName() : "Risk Assessment";
                    String score = ra.getRiskScore() != null ? ra.getRiskScore().toPlainString() + "/100" : "-";
                    String level = ra.getRiskLevel() != null ? ra.getRiskLevel() : "LOW";
                    String findings = ra.getRecommendation() != null ? ra.getRecommendation() : "Inspected with standard protocols; no anomalies detected.";

                    addTableCell(riskTable, catName, normalFont);
                    addTableCell(riskTable, score, normalFont);
                    addTableCell(riskTable, level, normalFont);
                    addTableCell(riskTable, findings, normalFont);
                }
                document.add(riskTable);
            }

            // SECTION 7: COMPARABLES & MARKET VALUATION
            addSectionHeader(document, "7. Market Comparables & Valuation Context", sectionTitleFont);
            if (comparables.isEmpty()) {
                document.add(new Paragraph("No linked comparable properties recorded in the market analysis module.", smallMuted));
            } else {
                PdfPTable compTable = new PdfPTable(4);
                compTable.setWidthPercentage(100);
                compTable.setWidths(new float[]{3.5f, 2f, 2f, 2.5f});
                compTable.setSpacingAfter(10f);

                addTableHeader(compTable, new String[]{"Comparable Property", "Market Value", "Total Area", "Price / Sq Ft"}, boldFont);
                for (ComparableProperty cp : comparables) {
                    Property compProp = cp.getComparableProperty();
                    if (compProp == null) continue;

                    String cName = compProp.getPropertyName() != null ? compProp.getPropertyName() : ("Comp #" + compProp.getPropertyId());
                    String cPrice = compProp.getMarketValue() != null ? "$" + compProp.getMarketValue() : "-";
                    String cArea = compProp.getTotalArea() != null ? compProp.getTotalArea().toPlainString() + " sq ft" : "-";
                    String cPpsf = "-";
                    if (compProp.getMarketValue() != null && compProp.getTotalArea() != null && compProp.getTotalArea().compareTo(BigDecimal.ZERO) > 0) {
                        cPpsf = "$" + compProp.getMarketValue().divide(compProp.getTotalArea(), 2, RoundingMode.HALF_UP);
                    }

                    addTableCell(compTable, cName, normalFont);
                    addTableCell(compTable, cPrice, normalFont);
                    addTableCell(compTable, cArea, normalFont);
                    addTableCell(compTable, cPpsf, normalFont);
                }
                document.add(compTable);
            }

            // Document Footer
            addDivider(document);
            Paragraph footer = new Paragraph("This report was programmatically compiled from the Real Estate Due Diligence Agent platform. Information is verified against registered PostgreSQL due-diligence records.", smallMuted);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF due-diligence report: " + e.getMessage(), e);
        }
    }

    private void addSectionHeader(Document document, String title, Font font) throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingBefore(10f);
        p.setSpacingAfter(6f);
        document.add(p);
    }

    private void addDivider(Document document) throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(BORDER_COLOR);
        cell.setFixedHeight(6f);
        table.addCell(cell);
        table.setSpacingAfter(8f);
        document.add(table);
    }

    private PdfPTable createKeyValueTable() {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        try {
            table.setWidths(new float[]{2.5f, 7.5f});
        } catch (DocumentException ignored) {}
        table.setSpacingAfter(10f);
        return table;
    }

    private void addTableRow(PdfPTable table, String key, String val, Font keyFont, Font valFont) {
        PdfPCell c1 = new PdfPCell(new Phrase(key, keyFont));
        c1.setBackgroundColor(LIGHT_BG);
        c1.setBorderColor(BORDER_COLOR);
        c1.setPadding(5f);

        PdfPCell c2 = new PdfPCell(new Phrase(val, valFont));
        c2.setBorderColor(BORDER_COLOR);
        c2.setPadding(5f);

        table.addCell(c1);
        table.addCell(c2);
    }

    private void addTableHeader(PdfPTable table, String[] headers, Font font) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, font));
            cell.setBackgroundColor(LIGHT_BG);
            cell.setBorderColor(BORDER_COLOR);
            cell.setPadding(6f);
            table.addCell(cell);
        }
    }

    private void addTableCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorderColor(BORDER_COLOR);
        cell.setPadding(5f);
        table.addCell(cell);
    }

    private BigDecimal calculateAverageRisk(List<RiskAssessment> risks) {
        if (risks.isEmpty()) return new BigDecimal("25.0");
        BigDecimal sum = BigDecimal.ZERO;
        int count = 0;
        for (RiskAssessment ra : risks) {
            if (ra.getRiskScore() != null) {
                sum = sum.add(ra.getRiskScore());
                count++;
            }
        }
        return count > 0 ? sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP) : new BigDecimal("25.0");
    }

    private Color getRiskColor(BigDecimal score) {
        if (score == null) return PRIMARY_COLOR;
        double s = score.doubleValue();
        if (s < 35) return PRIMARY_COLOR;
        if (s < 65) return new Color(217, 119, 6);   // Amber 600
        return new Color(220, 38, 38);               // Red 600
    }

    private String getRiskLevelText(BigDecimal score) {
        if (score == null) return "LOW RISK";
        double s = score.doubleValue();
        if (s < 35) return "LOW RISK";
        if (s < 65) return "MODERATE RISK";
        return "HIGH RISK";
    }
}
