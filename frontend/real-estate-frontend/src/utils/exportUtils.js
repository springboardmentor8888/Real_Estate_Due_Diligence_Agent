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
      [reportTitle, "PR-1001", "John Smith", "Bengaluru", "Karnataka", "₹4.2 Cr", "92/100 (Low)", "Approved"],
      [reportTitle, "PR-1002", "Priya Sharma", "Mumbai", "Maharashtra", "₹6.8 Cr", "74/100 (Moderate)", "Conditional"],
      [reportTitle, "PR-1003", "Vikram Reddy", "Hyderabad", "Telangana", "₹3.5 Cr", "45/100 (High)", "Review Req"],
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
