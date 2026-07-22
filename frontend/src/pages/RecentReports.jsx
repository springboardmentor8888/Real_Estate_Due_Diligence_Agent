import { FaFilePdf, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";

const reports = [
  {
    name: "654 Maple Drive Report",
    date: "Apr 3, 2026",
  },
  {
    name: "789 Pine Road Report",
    date: "Feb 10, 2026",
  },
  {
    name: "456 Oak Avenue",
    date: "Jan 8, 2026",
  },
];

const RecentReports = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Reports</h2>

        <Link
          to="/reports"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {reports.map((report, index) => (
          <div
            key={index}
            className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <FaFilePdf className="text-red-600" />
              </div>

              <div>
                <h3 className="font-medium text-gray-800">{report.name}</h3>

                <p className="text-sm text-gray-500">{report.date}</p>
              </div>
            </div>

            <button className="text-gray-500 hover:text-blue-600">
              <FaDownload />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReports;
