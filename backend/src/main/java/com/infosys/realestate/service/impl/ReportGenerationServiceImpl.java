package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.PublicRecordsReportResponse;
import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.RiskAssessment;
import com.infosys.realestate.entity.OwnershipRecord;
import com.infosys.realestate.entity.PropertyTaxRecord;
import com.infosys.realestate.entity.PublicRecord;
import com.infosys.realestate.service.ReportGenerationService;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportGenerationServiceImpl implements ReportGenerationService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public String generateReport(DueDiligenceReport report, RiskAssessment riskAssessment, String publicData) {
        // Return relative download path to backend
        return "/api/due-diligence/" + report.getProperty().getPropertyId() + "/export/pdf";
    }

    @Override
    public byte[] generatePdfReport(PublicRecordsReportResponse data) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font configurations
            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD, new Color(79, 70, 229));
            Font sectionFont = new Font(Font.HELVETICA, 14, Font.BOLD, new Color(31, 41, 55));
            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(55, 65, 81));
            Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD, new Color(31, 41, 55));
            Font whiteBoldFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
            Font footerFont = new Font(Font.HELVETICA, 8, Font.ITALIC, Color.GRAY);

            // Document Header
            Paragraph title = new Paragraph("DUE DILIGENCE REPORT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(15);
            document.add(title);

            // Property Details
            Paragraph propDetails = new Paragraph();
            propDetails.setFont(normalFont);
            propDetails.add(new Phrase("Property ID: ", boldFont));
            propDetails.add(new Phrase("#" + data.getPropertyId() + "\n", normalFont));
            propDetails.add(new Phrase("Address: ", boldFont));
            propDetails.add(new Phrase(data.getPropertyAddress() + ", " + data.getPropertyCity() + ", " + data.getPropertyState() + " " + data.getPropertyZipCode() + "\n", normalFont));
            propDetails.add(new Phrase("Generated On: ", boldFont));
            propDetails.add(new Phrase(java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "\n", normalFont));
            propDetails.setSpacingAfter(20);
            document.add(propDetails);

            // Overall Risk Banner Table
            PdfPTable riskTable = new PdfPTable(1);
            riskTable.setWidthPercentage(100);
            riskTable.setSpacingAfter(20);

            String riskLevel = data.getOverallRiskFlag();
            Color bannerColor;
            Color borderTextColor;
            String bannerText;

            if ("HIGH_RISK".equalsIgnoreCase(riskLevel)) {
                bannerColor = new Color(254, 226, 226); // soft red
                borderTextColor = new Color(153, 27, 27); // dark red
                bannerText = "Overall Assessment: HIGH RISK\nActive high-severity records or delinquent taxes detected. Proceed with caution.";
            } else if ("CONCERNS_FOUND".equalsIgnoreCase(riskLevel)) {
                bannerColor = new Color(254, 243, 199); // soft yellow
                borderTextColor = new Color(146, 64, 14); // dark orange
                bannerText = "Overall Assessment: CONCERNS FOUND\nThere are active medium-severity records that require review.";
            } else {
                bannerColor = new Color(209, 250, 229); // soft green
                borderTextColor = new Color(6, 95, 70); // dark green
                bannerText = "Overall Assessment: CLEAR\nThis property has no active liens, violations, or delinquent taxes.";
            }

            PdfPCell bannerCell = new PdfPCell(new Phrase(bannerText, new Font(Font.HELVETICA, 11, Font.BOLD, borderTextColor)));
            bannerCell.setBackgroundColor(bannerColor);
            bannerCell.setPadding(12);
            bannerCell.setBorderColor(borderTextColor);
            bannerCell.setBorderWidth(1f);
            riskTable.addCell(bannerCell);
            document.add(riskTable);

            // Stats summary table
            PdfPTable statsTable = new PdfPTable(4);
            statsTable.setWidthPercentage(100);
            statsTable.setSpacingAfter(25);

            addStatCell(statsTable, "Ownership Records", String.valueOf(data.getTotalOwnershipRecords()), normalFont, boldFont);
            addStatCell(statsTable, "Tax Records", String.valueOf(data.getTotalTaxRecords()), normalFont, boldFont);
            addStatCell(statsTable, "Public Records", String.valueOf(data.getTotalPublicRecords()), normalFont, boldFont);
            addStatCell(statsTable, "Active Issues", String.valueOf(data.getActivePublicRecordsCount()), normalFont, boldFont);
            document.add(statsTable);

            // 1. Ownership History Section
            Paragraph ownershipTitle = new Paragraph("Ownership History", sectionFont);
            ownershipTitle.setSpacingAfter(10);
            document.add(ownershipTitle);

            List<OwnershipRecord> ownershipList = data.getOwnershipHistory();
            if (ownershipList == null || ownershipList.isEmpty()) {
                document.add(new Paragraph("No ownership records available.", normalFont));
            } else {
                PdfPTable table = new PdfPTable(6);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{2f, 1.5f, 1.5f, 1.5f, 1.5f, 2f});
                table.setSpacingAfter(20);

                String[] headers = {"Owner", "Type", "Acquired", "Released", "Purchase Price", "Deed Ref"};
                addTableHeader(table, headers, whiteBoldFont, new Color(79, 70, 229));

                for (OwnershipRecord r : ownershipList) {
                    addTableCell(table, r.getOwnerName(), normalFont);
                    addTableCell(table, r.getOwnerType(), normalFont);
                    addTableCell(table, r.getAcquisitionDate() != null ? r.getAcquisitionDate().format(DATE_FORMATTER) : "—", normalFont);
                    addTableCell(table, r.getSaleDate() != null ? r.getSaleDate().format(DATE_FORMATTER) : "Present", normalFont);
                    addTableCell(table, r.getPurchasePrice() != null ? "$" + String.format("%,.2f", r.getPurchasePrice()) : "—", normalFont);
                    addTableCell(table, r.getDeedReference(), normalFont);
                }
                document.add(table);
            }

            // 2. Tax History Section
            Paragraph taxTitle = new Paragraph("Tax History", sectionFont);
            taxTitle.setSpacingAfter(10);
            document.add(taxTitle);

            List<PropertyTaxRecord> taxList = data.getTaxHistory();
            if (taxList == null || taxList.isEmpty()) {
                document.add(new Paragraph("No tax history records available.", normalFont));
            } else {
                PdfPTable table = new PdfPTable(7);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{1f, 1.5f, 1.5f, 1.5f, 1f, 1.5f, 1.5f});
                table.setSpacingAfter(20);

                String[] headers = {"Year", "Assessed Value", "Market Value", "Tax Amount", "Rate", "Status", "Pay Date"};
                addTableHeader(table, headers, whiteBoldFont, new Color(79, 70, 229));

                for (PropertyTaxRecord r : taxList) {
                    addTableCell(table, String.valueOf(r.getTaxYear()), normalFont);
                    addTableCell(table, r.getAssessedValue() != null ? "$" + String.format("%,.2f", r.getAssessedValue()) : "—", normalFont);
                    addTableCell(table, r.getMarketValue() != null ? "$" + String.format("%,.2f", r.getMarketValue()) : "—", normalFont);
                    addTableCell(table, r.getTaxAmount() != null ? "$" + String.format("%,.2f", r.getTaxAmount()) : "—", normalFont);
                    addTableCell(table, r.getTaxRate() != null ? r.getTaxRate() + "%" : "—", normalFont);
                    addTableCell(table, r.getPaymentStatus(), normalFont);
                    addTableCell(table, r.getPaymentDate(), normalFont);
                }
                document.add(table);
            }

            // 3. Public Records & Liens Section
            Paragraph publicTitle = new Paragraph("Public Records & Liens", sectionFont);
            publicTitle.setSpacingAfter(10);
            document.add(publicTitle);

            List<PublicRecord> publicList = data.getPublicRecords();
            if (publicList == null || publicList.isEmpty()) {
                document.add(new Paragraph("No public records or liens found.", normalFont));
            } else {
                PdfPTable table = new PdfPTable(7);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{1.5f, 2f, 1.2f, 1.2f, 1.5f, 1.5f, 1.5f});
                table.setSpacingAfter(20);

                String[] headers = {"Type", "Title / Desc", "Severity", "Status", "Filed Date", "Authority", "Ref #"};
                addTableHeader(table, headers, whiteBoldFont, new Color(79, 70, 229));

                for (PublicRecord r : publicList) {
                    addTableCell(table, r.getRecordType(), normalFont);
                    String desc = r.getRecordTitle() != null ? r.getRecordTitle() : r.getDescription();
                    addTableCell(table, desc, normalFont);
                    addTableCell(table, r.getSeverity(), normalFont);
                    addTableCell(table, r.getStatus(), normalFont);
                    addTableCell(table, r.getFilingDate() != null ? r.getFilingDate().format(DATE_FORMATTER) : "—", normalFont);
                    addTableCell(table, r.getSourceAgency(), normalFont);
                    addTableCell(table, r.getReferenceNumber(), normalFont);
                }
                document.add(table);
            }

            // Footer
            Paragraph footer = new Paragraph("Report generated by Diligence Agent. Confidential Document.", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        } finally {
            document.close();
        }

        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table, String[] headers, Font font, Color bgColor) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, font));
            cell.setBackgroundColor(bgColor);
            cell.setPadding(6);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            table.addCell(cell);
        }
    }

    private void addTableCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "—", font));
        cell.setPadding(6);
        table.addCell(cell);
    }

    private void addStatCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(10);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph valPara = new Paragraph(value, valueFont);
        valPara.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(valPara);

        Paragraph lblPara = new Paragraph(label, labelFont);
        lblPara.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(lblPara);

        table.addCell(cell);
    }

    @Override
    public byte[] generateExcelReport(PublicRecordsReportResponse data) {
        Workbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            // Font and Style Configurations
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.LEFT);

            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);

            org.apache.poi.ss.usermodel.Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            CellStyle boldStyle = workbook.createCellStyle();
            boldStyle.setFont(boldFont);

            // SHEET 1: Summary
            Sheet summarySheet = workbook.createSheet("Summary & Risk");
            Row titleRow = summarySheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("DUE DILIGENCE REPORT SUMMARY");
            titleCell.setCellStyle(boldStyle);

            addRow(summarySheet, 2, "Property ID", "#" + data.getPropertyId());
            addRow(summarySheet, 3, "Address", data.getPropertyAddress());
            addRow(summarySheet, 4, "City", data.getPropertyCity());
            addRow(summarySheet, 5, "State", data.getPropertyState());
            addRow(summarySheet, 6, "Zip Code", data.getPropertyZipCode());
            addRow(summarySheet, 7, "Overall Risk Flag", data.getOverallRiskFlag());
            addRow(summarySheet, 9, "Total Ownership Records", data.getTotalOwnershipRecords());
            addRow(summarySheet, 10, "Total Tax Records", data.getTotalTaxRecords());
            addRow(summarySheet, 11, "Total Public Records", data.getTotalPublicRecords());
            addRow(summarySheet, 12, "Active Issues Count", data.getActivePublicRecordsCount());

            summarySheet.autoSizeColumn(0);
            summarySheet.autoSizeColumn(1);

            // SHEET 2: Ownership History
            Sheet ownerSheet = workbook.createSheet("Ownership History");
            String[] ownerHeaders = {"Owner Name", "Owner Type", "Acquisition Date", "Sale Date", "Purchase Price", "Deed Reference"};
            Row ownerHeaderRow = ownerSheet.createRow(0);
            for (int i = 0; i < ownerHeaders.length; i++) {
                Cell cell = ownerHeaderRow.createCell(i);
                cell.setCellValue(ownerHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            List<OwnershipRecord> ownershipList = data.getOwnershipHistory();
            if (ownershipList != null) {
                for (OwnershipRecord r : ownershipList) {
                    Row row = ownerSheet.createRow(rowIdx++);
                    row.createCell(0).setCellValue(r.getOwnerName() != null ? r.getOwnerName() : "—");
                    row.createCell(1).setCellValue(r.getOwnerType() != null ? r.getOwnerType() : "—");
                    row.createCell(2).setCellValue(r.getAcquisitionDate() != null ? r.getAcquisitionDate().toString() : "—");
                    row.createCell(3).setCellValue(r.getSaleDate() != null ? r.getSaleDate().toString() : "Present");
                    Cell priceCell = row.createCell(4);
                    if (r.getPurchasePrice() != null) {
                        priceCell.setCellValue(r.getPurchasePrice());
                    } else {
                        priceCell.setCellValue("—");
                    }
                    row.createCell(5).setCellValue(r.getDeedReference() != null ? r.getDeedReference() : "—");
                }
            }
            for (int i = 0; i < ownerHeaders.length; i++) {
                ownerSheet.autoSizeColumn(i);
            }

            // SHEET 3: Tax History
            Sheet taxSheet = workbook.createSheet("Tax History");
            String[] taxHeaders = {"Year", "Assessed Value", "Market Value", "Tax Amount", "Tax Rate (%)", "Payment Status", "Payment Date"};
            Row taxHeaderRow = taxSheet.createRow(0);
            for (int i = 0; i < taxHeaders.length; i++) {
                Cell cell = taxHeaderRow.createCell(i);
                cell.setCellValue(taxHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            rowIdx = 1;
            List<PropertyTaxRecord> taxList = data.getTaxHistory();
            if (taxList != null) {
                for (PropertyTaxRecord r : taxList) {
                    Row row = taxSheet.createRow(rowIdx++);
                    row.createCell(0).setCellValue(r.getTaxYear() != null ? r.getTaxYear() : 0);
                    row.createCell(1).setCellValue(r.getAssessedValue() != null ? r.getAssessedValue() : 0.0);
                    row.createCell(2).setCellValue(r.getMarketValue() != null ? r.getMarketValue() : 0.0);
                    row.createCell(3).setCellValue(r.getTaxAmount() != null ? r.getTaxAmount() : 0.0);
                    row.createCell(4).setCellValue(r.getTaxRate() != null ? r.getTaxRate() : 0.0);
                    row.createCell(5).setCellValue(r.getPaymentStatus() != null ? r.getPaymentStatus() : "—");
                    row.createCell(6).setCellValue(r.getPaymentDate() != null ? r.getPaymentDate() : "—");
                }
            }
            for (int i = 0; i < taxHeaders.length; i++) {
                taxSheet.autoSizeColumn(i);
            }

            // SHEET 4: Public Records & Liens
            Sheet publicSheet = workbook.createSheet("Public Records & Liens");
            String[] publicHeaders = {"Record Type", "Title / Description", "Severity", "Status", "Filing Date", "Authority", "Reference Number"};
            Row publicHeaderRow = publicSheet.createRow(0);
            for (int i = 0; i < publicHeaders.length; i++) {
                Cell cell = publicHeaderRow.createCell(i);
                cell.setCellValue(publicHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            rowIdx = 1;
            List<PublicRecord> publicList = data.getPublicRecords();
            if (publicList != null) {
                for (PublicRecord r : publicList) {
                    Row row = publicSheet.createRow(rowIdx++);
                    row.createCell(0).setCellValue(r.getRecordType() != null ? r.getRecordType() : "—");
                    String desc = r.getRecordTitle() != null ? r.getRecordTitle() : r.getDescription();
                    row.createCell(1).setCellValue(desc != null ? desc : "—");
                    row.createCell(2).setCellValue(r.getSeverity() != null ? r.getSeverity() : "—");
                    row.createCell(3).setCellValue(r.getStatus() != null ? r.getStatus() : "—");
                    row.createCell(4).setCellValue(r.getFilingDate() != null ? r.getFilingDate().toString() : "—");
                    row.createCell(5).setCellValue(r.getSourceAgency() != null ? r.getSourceAgency() : "—");
                    row.createCell(6).setCellValue(r.getReferenceNumber() != null ? r.getReferenceNumber() : "—");
                }
            }
            for (int i = 0; i < publicHeaders.length; i++) {
                publicSheet.autoSizeColumn(i);
            }

            workbook.write(out);
        } catch (IOException e) {
            throw new RuntimeException("Error generating Excel report: " + e.getMessage(), e);
        } finally {
            try {
                workbook.close();
            } catch (IOException e) {
                // ignore
            }
        }

        return out.toByteArray();
    }

    private void addRow(Sheet sheet, int rowIdx, String label, Object value) {
        Row row = sheet.createRow(rowIdx);
        row.createCell(0).setCellValue(label);
        if (value instanceof Number) {
            row.createCell(1).setCellValue(((Number) value).doubleValue());
        } else if (value != null) {
            row.createCell(1).setCellValue(value.toString());
        } else {
            row.createCell(1).setCellValue("—");
        }
    }
}
