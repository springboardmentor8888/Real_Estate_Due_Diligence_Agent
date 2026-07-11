import { FaBell, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const notifications = [
  {
    title: "Report Ready",
    message: "Property report has been generated successfully.",
    icon: <FaCheckCircle className="text-green-600" />,
  },
  {
    title: "New Alert",
    message: "Ownership records have been updated.",
    icon: <FaBell className="text-blue-600" />,
  },
  {
    title: "High Risk",
    message: "Environmental risk detected.",
    icon: <FaExclamationTriangle className="text-red-600" />,
  },
];

const Notifications = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Notifications</h2>

        <Link
          to="/alerts"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 border-b last:border-none pb-4"
          >
            <div className="mt-1">{item.icon}</div>

            <div>
              <h3 className="font-medium text-gray-800">{item.title}</h3>

              <p className="text-sm text-gray-500">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
