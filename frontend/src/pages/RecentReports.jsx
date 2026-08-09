import { FaFilePdf, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";

const reports = [
  {
    name: "123 Park Street Report",
    date: "Aug 9, 2026",
    propertyId: 1,
  },
  {
    name: "789 Pine Road Report",
    date: "Feb 10, 2026",
    propertyId: 3,
  },
  {
    name: "456 Oak Avenue Report",
    date: "Jan 8, 2026",
    propertyId: 2,
  },
];

const RecentReports = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Reports
        </h2>

        <Link
          to="/reports/1"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.propertyId}
            className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <FaFilePdf className="text-red-600" />
              </div>

              <div>
                <h3 className="font-medium text-gray-800">
                  {report.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {report.date}
                </p>
              </div>
            </div>

            <Link
              to={`/reports/${report.propertyId}`}
              className="text-gray-500 hover:text-blue-600"
              title="Open Report"
            >
              <FaDownload />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReports;