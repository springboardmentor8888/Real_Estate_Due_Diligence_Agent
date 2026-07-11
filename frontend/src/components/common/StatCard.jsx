import { Link } from "react-router-dom";

const StatCard = ({
  icon,
  title,
  value,
  change,
  changeColor,
  iconBg,
  iconColor,
  link,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition duration-300">
      <div className="flex items-center gap-4">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <div className={`text-3xl ${iconColor}`}>{icon}</div>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-1">{value}</h2>

          {link ? (
            <Link
              to={link}
              className={`text-sm mt-1 ${changeColor} hover:underline`}
            >
              {change}
            </Link>
          ) : (
            <p className={`text-sm mt-1 ${changeColor}`}>{change}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
