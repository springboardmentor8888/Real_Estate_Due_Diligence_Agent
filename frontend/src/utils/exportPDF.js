import jsPDF from "jspdf";

export const exportPDF = (report) => {
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(67, 56, 202);
  doc.text("Real Estate Due Diligence Report", 20, 20);

  // Property Information
  doc.setDrawColor(67, 56, 202);
  doc.line(20, 25, 190, 25);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Property Information", 20, 35);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  doc.text(`Property ID : ${report.propertyId}`, 25, 45);
  doc.text(`Owner : ${report.owner}`, 25, 53);
  doc.text(`Address : ${report.address}`, 25, 61);
  doc.text(`Area : ${report.area}`, 25, 69);

  // Risk Assessment
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Risk Assessment", 20, 85);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  doc.text(`Legal Status : ${report.legalStatus}`, 25, 95);
  doc.text(`Flood Risk : ${report.floodRisk}`, 25, 103);
  doc.text(`Financial Risk : ${report.financialRisk}`, 25, 111);

  // Comparable Properties
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Comparable Properties", 20, 128);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  doc.text("Property ID", 20, 140);
  doc.text("Location", 80, 140);
  doc.text("Price", 145, 140);

  doc.line(20, 143, 190, 143);

  doc.text("CP001", 20, 152);
  doc.text("Madhapur", 80, 152);
  doc.text("₹72,00,000", 145, 152);

  doc.text("CP002", 20, 160);
  doc.text("Gachibowli", 80, 160);
  doc.text("₹76,50,000", 145, 160);

  doc.text("CP003", 20, 168);
  doc.text("Kondapur", 80, 168);
  doc.text("₹74,20,000", 145, 168);

  // Market Value
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Estimated Market Value", 20, 185);

  doc.setTextColor(67, 56, 202);
  doc.setFontSize(20);
  doc.text(report.estimatedValue, 20, 197);

  // Recommendation
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Recommendation", 20, 215);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text(report.recommendation, 25, 225);

  doc.save("Due_Diligence_Report.pdf");
};