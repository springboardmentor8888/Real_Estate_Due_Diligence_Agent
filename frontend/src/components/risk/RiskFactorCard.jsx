import {
  FaClipboardCheck,
  FaFileInvoiceDollar,
  FaGavel,
  FaMapMarkedAlt,
  FaUserCheck,
  FaWater,
} from "react-icons/fa";

function getRiskClasses(level = "LOW") {
  const normalized = String(level || "LOW").toUpperCase();
  if (normalized === "HIGH") {
    return { badge: "bg-red-100 text-red-700", text: "text-red-700", bg: "bg-red-500" };
  }
  if (normalized === "MEDIUM") {
    return { badge: "bg-amber-100 text-amber-700", text: "text-amber-700", bg: "bg-amber-500" };
  }
  return { badge: "bg-green-100 text-green-700", text: "text-green-700", bg: "bg-green-500" };
}

const iconMap = {
  legal: <FaGavel />,
  tax: <FaFileInvoiceDollar />,
  flood: <FaWater />,
  permit: <FaClipboardCheck />,
  zoning: <FaMapMarkedAlt />,
  ownership: <FaUserCheck />,
};

const RiskFactorCard = ({ factor }) => {
  const classes = getRiskClasses(factor.level);

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-3 text-xl ${classes.badge}`}>
            {iconMap[factor.id]}
          </div>

          <div>
            <h3 className="font-bold text-gray-800">{factor.label}</h3>
            <p className="text-sm text-gray-500">{factor.detail}</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes.badge}`}>
          {factor.score}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">Risk level</span>
          <span className={`font-semibold ${classes.text}`}>{factor.level}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${classes.bg}`}
            style={{ width: `${factor.score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskFactorCard;
