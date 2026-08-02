export const riskAssessments = {
  PROP001: {
    overallScore: 82,
    riskLevel: "Low",
    factors: [
      {
        id: "legal",
        label: "Legal Risk",
        score: 90,
        level: "Low",
        detail: "No active litigation or court-record exceptions found.",
      },
      {
        id: "tax",
        label: "Tax Due Analysis",
        score: 85,
        level: "Low",
        detail: "Property tax records are current with no unpaid dues.",
      },
      {
        id: "flood",
        label: "Flood Risk Status",
        score: 70,
        level: "Medium",
        detail: "Located in a moderate-risk drainage catchment area.",
      },
      {
        id: "permit",
        label: "Permit Compliance",
        score: 88,
        level: "Low",
        detail: "Building permits align with declared property usage.",
      },
      {
        id: "zoning",
        label: "Zoning Compliance",
        score: 95,
        level: "Low",
        detail: "Use, height, FAR, and coverage comply with zoning rules.",
      },
      {
        id: "ownership",
        label: "Ownership Verification",
        score: 92,
        level: "Low",
        detail: "Clear title with ownership chain independently verified.",
      },
    ],
    recommendation:
      "This property carries an overall low-risk profile and is recommended for purchase, subject to standard closing checks and final document review.",
  },
  PROP002: {
    overallScore: 68,
    riskLevel: "Medium",
    factors: [
      {
        id: "legal",
        label: "Legal Risk",
        score: 82,
        level: "Low",
        detail: "No active litigation found against the current owner.",
      },
      {
        id: "tax",
        label: "Tax Due Analysis",
        score: 62,
        level: "Medium",
        detail: "Latest tax ledger requires final municipal confirmation.",
      },
      {
        id: "flood",
        label: "Flood Risk Status",
        score: 58,
        level: "Medium",
        detail: "Coastal location requires seasonal flood and drainage review.",
      },
      {
        id: "permit",
        label: "Permit Compliance",
        score: 64,
        level: "Medium",
        detail: "Permit records are present but one renovation approval is pending.",
      },
      {
        id: "zoning",
        label: "Zoning Compliance",
        score: 72,
        level: "Medium",
        detail: "Residential coastal zoning review is in progress.",
      },
      {
        id: "ownership",
        label: "Ownership Verification",
        score: 78,
        level: "Low",
        detail: "Ownership chain is clear with no conflicting claim detected.",
      },
    ],
    recommendation:
      "This property is attractive but needs tax, coastal zoning, and permit closure before purchase. Proceed after the pending items are cleared.",
  },
  PROP003: {
    overallScore: 88,
    riskLevel: "Low",
    factors: [
      { id: "legal", label: "Legal Risk", score: 91, level: "Low", detail: "No litigation found." },
      { id: "tax", label: "Tax Due Analysis", score: 90, level: "Low", detail: "All dues are paid." },
      { id: "flood", label: "Flood Risk Status", score: 82, level: "Low", detail: "Low flood exposure for the apartment block." },
      { id: "permit", label: "Permit Compliance", score: 86, level: "Low", detail: "Occupancy certificate and approvals are available." },
      { id: "zoning", label: "Zoning Compliance", score: 89, level: "Low", detail: "Approved for multi-family residential use." },
      { id: "ownership", label: "Ownership Verification", score: 90, level: "Low", detail: "Ownership and association records match." },
    ],
    recommendation:
      "This apartment carries a low-risk profile and is suitable for purchase after routine closing checks.",
  },
  PROP004: {
    overallScore: 61,
    riskLevel: "Medium",
    factors: [
      { id: "legal", label: "Legal Risk", score: 80, level: "Low", detail: "No litigation found." },
      { id: "tax", label: "Tax Due Analysis", score: 84, level: "Low", detail: "Tax receipts are current." },
      { id: "flood", label: "Flood Risk Status", score: 76, level: "Low", detail: "Low flood exposure." },
      { id: "permit", label: "Permit Compliance", score: 66, level: "Medium", detail: "Commercial use documents need final reconciliation." },
      { id: "zoning", label: "Zoning Compliance", score: 72, level: "Medium", detail: "Commercial zoning is approved but frontage usage needs review." },
      { id: "ownership", label: "Ownership Verification", score: 48, level: "High", detail: "Mortgage closure evidence is required before transfer." },
    ],
    recommendation:
      "This commercial property needs mortgage closure and permit reconciliation before moving to contract execution.",
  },
  PROP005: {
    overallScore: 86,
    riskLevel: "Low",
    factors: [
      { id: "legal", label: "Legal Risk", score: 88, level: "Low", detail: "No active litigation found." },
      { id: "tax", label: "Tax Due Analysis", score: 92, level: "Low", detail: "Tax receipts are current." },
      { id: "flood", label: "Flood Risk Status", score: 78, level: "Low", detail: "Low-to-moderate monsoon exposure." },
      { id: "permit", label: "Permit Compliance", score: 84, level: "Low", detail: "Residential permits are verified." },
      { id: "zoning", label: "Zoning Compliance", score: 88, level: "Low", detail: "Compliant with CMDA residential rules." },
      { id: "ownership", label: "Ownership Verification", score: 87, level: "Low", detail: "Owner identity and title chain are verified." },
    ],
    recommendation:
      "This Chennai residence is low risk and suitable for purchase after final document collection.",
  },
  PROP006: {
    overallScore: 47,
    riskLevel: "High",
    factors: [
      { id: "legal", label: "Legal Risk", score: 45, level: "High", detail: "Boundary review may affect usable land area." },
      { id: "tax", label: "Tax Due Analysis", score: 42, level: "High", detail: "Tax clearance is pending." },
      { id: "flood", label: "Flood Risk Status", score: 63, level: "Medium", detail: "Drainage check is recommended before development." },
      { id: "permit", label: "Permit Compliance", score: 50, level: "Medium", detail: "Conversion and development approvals are incomplete." },
      { id: "zoning", label: "Zoning Compliance", score: 44, level: "High", detail: "Future residential use depends on conversion approval." },
      { id: "ownership", label: "Ownership Verification", score: 58, level: "Medium", detail: "Ownership is visible but survey boundaries need confirmation." },
    ],
    recommendation:
      "This land parcel is high risk until tax clearance, boundary validation, and land-use conversion are completed.",
  },
};

export function getRiskColor(level) {
  if (level === "High") return "red";
  if (level === "Medium") return "yellow";
  return "green";
}

export function getRiskClasses(level) {
  const color = getRiskColor(level);

  return {
    badge:
      color === "green"
        ? "bg-green-100 text-green-700"
        : color === "yellow"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700",
    text:
      color === "green"
        ? "text-green-600"
        : color === "yellow"
          ? "text-yellow-600"
          : "text-red-600",
    bg:
      color === "green"
        ? "bg-green-600"
        : color === "yellow"
          ? "bg-yellow-500"
          : "bg-red-600",
    border:
      color === "green"
        ? "border-green-500"
        : color === "yellow"
          ? "border-yellow-500"
          : "border-red-500",
    hex: color === "green" ? "#16a34a" : color === "yellow" ? "#ca8a04" : "#dc2626",
  };
}

export function getRiskAssessment(propertyId = "PROP001") {
  return riskAssessments[propertyId] || riskAssessments.PROP001;
}
