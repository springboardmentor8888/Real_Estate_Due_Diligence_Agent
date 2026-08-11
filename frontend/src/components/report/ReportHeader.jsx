import { FaCalendarAlt, FaFileAlt, FaShieldAlt } from "react-icons/fa";

function getRiskClasses(level = "LOW") {
  const normalized = String(level || "LOW").toUpperCase();
  if (normalized === "HIGH") {
    return { badge: "bg-red-100 text-red-700", text: "text-red-700" };
  }
  if (normalized === "MEDIUM") {
    return { badge: "bg-amber-100 text-amber-700", text: "text-amber-700" };
  }
  return { badge: "bg-green-100 text-green-700", text: "text-green-700" };
}

const ReportHeader = ({ reportData }) => {
  const classes = getRiskClasses(reportData.risk.riskLevel);

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {reportData.property.title}
          </h2>
          <p className="mt-2 text-gray-500">{reportData.property.address}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
            <FaFileAlt className="text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Market Value</p>
              <p className="font-semibold">{reportData.property.marketValue}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
            <FaCalendarAlt className="text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Generated</p>
              <p className="font-semibold">{reportData.generatedOn}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
            <FaShieldAlt className={classes.text} />
            <div>
              <p className="text-xs text-gray-500">Overall Risk</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes.badge}`}>
                {reportData.risk.riskLevel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
