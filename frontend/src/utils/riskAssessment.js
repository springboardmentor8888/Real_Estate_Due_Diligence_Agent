export function getBackendRiskBadgeClass(overallRisk) {
  const value = String(overallRisk || "").toUpperCase();

  if (value === "HIGH") return "bg-red-100 text-red-700 border-red-200";
  if (value === "MEDIUM") return "bg-amber-100 text-amber-800 border-amber-200";
  if (value === "LOW") return "bg-green-100 text-green-700 border-green-200";

  return "bg-gray-100 text-gray-600 border-gray-200";
}

export function getBackendRiskBarClass(riskScore) {
  const score = Number(riskScore || 0);

  if (score >= 60) return "bg-red-600";
  if (score >= 30) return "bg-amber-500";

  return "bg-green-500";
}
