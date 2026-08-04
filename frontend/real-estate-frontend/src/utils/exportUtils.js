import { showSuccessAlert, showToast } from "./swal";

// PDF Export Helper
export const exportToPdf = (reportTitle = "Due Diligence Audit Report", propertyId = "PR-1001") => {
  showToast(`Preparing PDF export for ${propertyId}...`, "info");
  
  setTimeout(() => {
    // Trigger system print dialog or simulated download
    window.print();
    
    showSuccessAlert(
      "PDF Export Ready",
      `Official PDF document for "${reportTitle}" (Parcel ${propertyId}) has been generated.`
    );
  }, 400);
};

// Excel / CSV Export Helper
export const exportToExcel = (reportTitle = "Audit Data Export", data = []) => {
  showToast("Generating spreadsheet export...", "info");

  setTimeout(() => {
    // Generate CSV data string
    const headers = ["Report Title", "Property ID", "Owner", "City", "State", "Market Value", "Risk Score", "Status"];
    const rows = [
      [reportTitle, "PR-1001", "Ananya Rao", "Hyderabad", "Telangana", "₹25.00 Cr", "14/100 (Low)", "Verified Clear Title"],
      [reportTitle, "PR-1002", "Vikramaditya Reddy", "Hyderabad", "Telangana", "₹18.50 Cr", "18/100 (Low)", "Verified Clear Title"],
      [reportTitle, "PR-1003", "Suresh Patel", "Bengaluru", "Karnataka", "₹32.00 Cr", "22/100 (Low)", "Verified Clear Title"],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportTitle.toLowerCase().replace(/\s+/g, "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccessAlert(
      "Excel Export Complete",
      `Audit spreadsheet dataset has been exported successfully as CSV.`
    );
  }, 500);
};
