import { useState, useEffect } from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const RecentReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch live properties to populate recent reports
      const response = await axios.get("http://localhost:8080/api/properties", { headers });
      const propertyList = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      // Format properties into report items (take latest 3-4)
      const mappedReports = propertyList.slice(0, 4).map((prop) => ({
        propertyId: prop.id,
        name: prop.title || prop.address || `Property #${prop.id} Report`,
        date: prop.createdAt
          ? new Date(prop.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Available Now",
      }));

      setReports(mappedReports);
    } catch (err) {
      console.error("Error fetching live recent reports:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Reports
        </h2>

        {reports.length > 0 && (
          <Link
            to={`/reports/${reports[0].propertyId}`}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View Latest
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-sm text-gray-400">
            Loading recent reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-500">
            No recent reports found.
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.propertyId}
              className="flex items-center justify-between border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <FaFilePdf className="text-red-600 text-lg" />
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 line-clamp-1">
                    {report.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Generated: {report.date}
                  </p>
                </div>
              </div>

              <Link
                to={`/reports/${report.propertyId}`}
                className="text-gray-400 hover:text-blue-600 p-2 transition"
                title="View Due Diligence Report"
              >
                <FaDownload />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentReports;