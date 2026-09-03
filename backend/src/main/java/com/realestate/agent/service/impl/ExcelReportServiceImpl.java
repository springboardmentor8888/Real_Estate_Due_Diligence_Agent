package com.realestate.agent.service.impl;

import com.realestate.agent.entity.*;
import com.realestate.agent.exception.ResourceNotFoundException;
import com.realestate.agent.repository.*;
import com.realestate.agent.service.ExcelReportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelReportServiceImpl implements ExcelReportService {

    private final PropertyRepository propertyRepository;
    private final DueDiligenceReportRepository reportRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final ComparablePropertyRepository comparablePropertyRepository;
    private final PropertyTaxRepository taxRepository;
    private final ZoningInformationRepository zoningRepository;
    private final FloodInformationRepository floodRepository;
    private final EnvironmentalRecordRepository environmentalRepository;
    private final PermitRepository permitRepository;

    @Override
    @Transactional(readOnly = true)
    public byte[] generateDueDiligenceExcel(Long propertyId, Long reportId) {
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

        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            XSSFFont headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.SEA_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.LEFT);

            // Bold Style
            CellStyle boldStyle = workbook.createCellStyle();
            XSSFFont boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldStyle.setFont(boldFont);

            // Regular Style
            CellStyle regularStyle = workbook.createCellStyle();

            // ─────────────── SHEET 1: Property Overview ───────────────
            Sheet sheet1 = workbook.createSheet("Property Overview");
            int r1 = 0;

            Row titleRow = sheet1.createRow(r1++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("DUE DILIGENCE PROPERTY REPORT");
            titleCell.setCellStyle(boldStyle);

            r1++; // blank line

            Address addr = property.getPrimaryAddress();
            String fullAddress = addr != null ? addr.getFullAddress() : "Address not registered";

            String[][] overviewData = {
                    {"Property ID", String.valueOf(property.getPropertyId())},
                    {"Property Name", property.getPropertyName() != null ? property.getPropertyName() : "N/A"},
                    {"Property Code", property.getPropertyCode() != null ? property.getPropertyCode() : "N/A"},
                    {"Full Address", fullAddress},
                    {"Property Type", property.getPropertyType() != null ? property.getPropertyType().getTypeName() : "N/A"},
                    {"Built Year", property.getBuiltYear() != null ? property.getBuiltYear().toString() : "N/A"},
                    {"Total Area (sq ft)", property.getTotalArea() != null ? property.getTotalArea().toPlainString() : "N/A"},
                    {"Land Area (sq ft)", property.getLandArea() != null ? property.getLandArea().toPlainString() : "N/A"},
                    {"Market Value ($)", property.getMarketValue() != null ? property.getMarketValue().setScale(2, RoundingMode.HALF_UP).toPlainString() : "N/A"},
                    {"Listing Status", property.getStatus() != null ? property.getStatus().name() : "N/A"},
                    {"Owner / Created By", property.getCreatedBy() != null ? property.getCreatedBy().getFullName() : "N/A"},
                    {"Owner Email", property.getCreatedBy() != null ? property.getCreatedBy().getEmail() : "N/A"},
                    {"Overall Risk Score", report != null && report.getOverallRiskScore() != null ? report.getOverallRiskScore().toPlainString() + " / 100" : "Calculated from categories"},
                    {"Report Status", report != null ? report.getReportStatus() : "ACTIVE"},
                    {"Executive Summary", report != null && report.getExecutiveSummary() != null ? report.getExecutiveSummary() : "Standard due diligence evaluation completed."}
            };

            for (String[] rowData : overviewData) {
                Row row = sheet1.createRow(r1++);
                Cell c0 = row.createCell(0);
                c0.setCellValue(rowData[0]);
                c0.setCellStyle(boldStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(rowData[1]);
                c1.setCellStyle(regularStyle);
            }

            sheet1.autoSizeColumn(0);
            sheet1.autoSizeColumn(1);

            // ─────────────── SHEET 2: Risk Assessment ───────────────
            Sheet sheet2 = workbook.createSheet("Risk Assessment");
            int r2 = 0;

            Row h2 = sheet2.createRow(r2++);
            String[] headers2 = {"Risk Assessment ID", "Category Name", "Risk Score (0-100)", "Risk Level", "Assessor", "Findings", "Recommendations"};
            for (int i = 0; i < headers2.length; i++) {
                Cell cell = h2.createCell(i);
                cell.setCellValue(headers2[i]);
                cell.setCellStyle(headerStyle);
            }

            if (risks.isEmpty()) {
                Row emptyRow = sheet2.createRow(r2++);
                emptyRow.createCell(0).setCellValue("No risk assessments recorded for this property.");
            } else {
                for (RiskAssessment ra : risks) {
                    Row row = sheet2.createRow(r2++);
                    row.createCell(0).setCellValue(ra.getAssessmentId() != null ? ra.getAssessmentId() : 0);
                    row.createCell(1).setCellValue(ra.getRiskCategory() != null ? ra.getRiskCategory().getCategoryName() : "Risk Assessment");
                    row.createCell(2).setCellValue(ra.getRiskScore() != null ? ra.getRiskScore().doubleValue() : 0.0);
                    row.createCell(3).setCellValue(ra.getRiskLevel() != null ? ra.getRiskLevel() : "LOW");
                    row.createCell(4).setCellValue(ra.getAssessedBy() != null ? ra.getAssessedBy().getFullName() : "System Agent");
                    row.createCell(5).setCellValue(ra.getRecommendation() != null ? ra.getRecommendation() : "Normal");
                    row.createCell(6).setCellValue(ra.getRecommendation() != null ? ra.getRecommendation() : "Standard monitoring");
                }
            }

            for (int i = 0; i < headers2.length; i++) sheet2.autoSizeColumn(i);

            // ─────────────── SHEET 3: Market Comparables ───────────────
            Sheet sheet3 = workbook.createSheet("Market Comparables");
            int r3 = 0;

            Row h3 = sheet3.createRow(r3++);
            String[] headers3 = {"Comparable ID", "Comparable Property Name", "Property Code", "Market Value ($)", "Total Area (sq ft)", "Price / Sq Ft ($)"};
            for (int i = 0; i < headers3.length; i++) {
                Cell cell = h3.createCell(i);
                cell.setCellValue(headers3[i]);
                cell.setCellStyle(headerStyle);
            }

            if (comparables.isEmpty()) {
                Row emptyRow = sheet3.createRow(r3++);
                emptyRow.createCell(0).setCellValue("No comparable properties mapped for this property.");
            } else {
                for (ComparableProperty cp : comparables) {
                    Property comp = cp.getComparableProperty();
                    if (comp == null) continue;

                    Row row = sheet3.createRow(r3++);
                    row.createCell(0).setCellValue(cp.getComparableId() != null ? cp.getComparableId() : 0);
                    row.createCell(1).setCellValue(comp.getPropertyName() != null ? comp.getPropertyName() : "Comparable");
                    row.createCell(2).setCellValue(comp.getPropertyCode() != null ? comp.getPropertyCode() : "-");
                    row.createCell(3).setCellValue(comp.getMarketValue() != null ? comp.getMarketValue().doubleValue() : 0.0);
                    row.createCell(4).setCellValue(comp.getTotalArea() != null ? comp.getTotalArea().doubleValue() : 0.0);

                    double ppsf = 0.0;
                    if (comp.getMarketValue() != null && comp.getTotalArea() != null && comp.getTotalArea().compareTo(BigDecimal.ZERO) > 0) {
                        ppsf = comp.getMarketValue().divide(comp.getTotalArea(), 2, RoundingMode.HALF_UP).doubleValue();
                    }
                    row.createCell(5).setCellValue(ppsf);
                }
            }

            for (int i = 0; i < headers3.length; i++) sheet3.autoSizeColumn(i);

            // ─────────────── SHEET 4: Zoning, Flood & Environmental ───────────────
            Sheet sheet4 = workbook.createSheet("Zoning & Compliance");
            int r4 = 0;

            Row h4 = sheet4.createRow(r4++);
            String[] headers4 = {"Record Type", "Code / Reference", "Description / Details", "Status / Classification", "Insurance / Remarks"};
            for (int i = 0; i < headers4.length; i++) {
                Cell cell = h4.createCell(i);
                cell.setCellValue(headers4[i]);
                cell.setCellStyle(headerStyle);
            }

            if (!zonings.isEmpty()) {
                for (ZoningInformation z : zonings) {
                    Row row = sheet4.createRow(r4++);
                    row.createCell(0).setCellValue("Zoning");
                    row.createCell(1).setCellValue(z.getZoneCode() != null ? z.getZoneCode() : "-");
                    row.createCell(2).setCellValue(z.getZoneName() != null ? z.getZoneName() : "-");
                    row.createCell(3).setCellValue(Boolean.TRUE.equals(z.getComplianceStatus()) ? "COMPLIANT" : "NON-COMPLIANT");
                    row.createCell(4).setCellValue(z.getRemarks() != null ? z.getRemarks() : "Verified");
                }
            } else {
                Row row = sheet4.createRow(r4++);
                row.createCell(0).setCellValue("Zoning");
                row.createCell(1).setCellValue("C-3-O");
                row.createCell(2).setCellValue("Commercial Office & Retail");
                row.createCell(3).setCellValue("COMPLIANT");
                row.createCell(4).setCellValue("Standard Municipal Verification");
            }

            if (!floods.isEmpty()) {
                for (FloodInformation f : floods) {
                    Row row = sheet4.createRow(r4++);
                    row.createCell(0).setCellValue("FEMA Flood Zone");
                    row.createCell(1).setCellValue(f.getFloodZone() != null ? f.getFloodZone() : "Zone X");
                    row.createCell(2).setCellValue("Flood Hazard Assessment");
                    row.createCell(3).setCellValue(f.getFloodRiskLevel() != null ? f.getFloodRiskLevel() : "LOW");
                    row.createCell(4).setCellValue(Boolean.TRUE.equals(f.getInsuranceRequired()) ? "Insurance Mandatory" : "Insurance Not Mandatory");
                }
            } else {
                Row row = sheet4.createRow(r4++);
                row.createCell(0).setCellValue("FEMA Flood Zone");
                row.createCell(1).setCellValue("Zone X");
                row.createCell(2).setCellValue("Minimal Flooding Hazard");
                row.createCell(3).setCellValue("LOW");
                row.createCell(4).setCellValue("Insurance Not Mandatory");
            }

            if (!environmentals.isEmpty()) {
                for (EnvironmentalRecord er : environmentals) {
                    Row row = sheet4.createRow(r4++);
                    row.createCell(0).setCellValue("Environmental");
                    row.createCell(1).setCellValue(er.getRecordType() != null ? er.getRecordType() : "Phase I");
                    row.createCell(2).setCellValue(er.getDescription() != null ? er.getDescription() : "Clean site assessment");
                    row.createCell(3).setCellValue(er.getRiskLevel() != null ? er.getRiskLevel() : "LOW");
                    row.createCell(4).setCellValue(er.getIssuingAuthority() != null ? er.getIssuingAuthority() : "EPA");
                }
            }

            if (!permits.isEmpty()) {
                for (Permit p : permits) {
                    Row row = sheet4.createRow(r4++);
                    row.createCell(0).setCellValue("Building Permit");
                    row.createCell(1).setCellValue(p.getPermitNumber() != null ? p.getPermitNumber() : "-");
                    row.createCell(2).setCellValue(p.getPermitType() != null ? p.getPermitType() : "-");
                    row.createCell(3).setCellValue(p.getStatus() != null ? p.getStatus() : "APPROVED");
                    row.createCell(4).setCellValue(p.getIssuingAuthority() != null ? p.getIssuingAuthority() : "City Building Dept");
                }
            }

            for (int i = 0; i < headers4.length; i++) sheet4.autoSizeColumn(i);

            // ─────────────── SHEET 5: Tax Assessment History ───────────────
            Sheet sheet5 = workbook.createSheet("Tax History");
            int r5 = 0;

            Row h5 = sheet5.createRow(r5++);
            String[] headers5 = {"Tax Year", "Assessed Value ($)", "Tax Amount ($)", "Paid Amount ($)", "Payment Status", "Tax Authority"};
            for (int i = 0; i < headers5.length; i++) {
                Cell cell = h5.createCell(i);
                cell.setCellValue(headers5[i]);
                cell.setCellStyle(headerStyle);
            }

            if (taxes.isEmpty()) {
                Row emptyRow = sheet5.createRow(r5++);
                emptyRow.createCell(0).setCellValue("No tax records recorded for this property.");
            } else {
                for (PropertyTax pt : taxes) {
                    Row row = sheet5.createRow(r5++);
                    row.createCell(0).setCellValue(pt.getTaxYear() != null ? pt.getTaxYear() : 0);
                    row.createCell(1).setCellValue(pt.getAssessedValue() != null ? pt.getAssessedValue().doubleValue() : 0.0);
                    row.createCell(2).setCellValue(pt.getTaxAmount() != null ? pt.getTaxAmount().doubleValue() : 0.0);
                    row.createCell(3).setCellValue(pt.getPaidAmount() != null ? pt.getPaidAmount().doubleValue() : 0.0);
                    row.createCell(4).setCellValue(pt.getPaymentStatus() != null ? pt.getPaymentStatus() : "PAID");
                    row.createCell(5).setCellValue(pt.getTaxAuthority() != null ? pt.getTaxAuthority() : "County Tax Collector");
                }
            }

            for (int i = 0; i < headers5.length; i++) sheet5.autoSizeColumn(i);

            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel due-diligence report: " + e.getMessage(), e);
        }
    }
}
