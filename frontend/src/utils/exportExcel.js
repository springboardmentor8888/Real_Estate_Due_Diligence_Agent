import * as XLSX from "xlsx";

export const exportExcel = (report) => {

  const data = [
    {
      PropertyID: report.propertyId,
      Owner: report.owner,
      Address: report.address,
      LegalStatus: report.legalStatus,
      FloodRisk: report.floodRisk,
      FinancialRisk: report.financialRisk,
      EstimatedValue: report.estimatedValue,
      Recommendation: report.recommendation
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Due Diligence"
  );

  XLSX.writeFile(
    workbook,
    "Due_Diligence_Report.xlsx"
  );

};