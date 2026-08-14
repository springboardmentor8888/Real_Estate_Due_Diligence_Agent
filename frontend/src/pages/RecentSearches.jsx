import { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const RecentSearches = () => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const fetchRecentSearches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get("http://localhost:8080/api/properties", { headers });
      const propertyList = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      // Map backend property records into recent searches format (take latest 5)
      const mappedList = propertyList.slice(0, 5).map((prop) => ({
        id: prop.id,
        address: prop.address || prop.title || `Property #${prop.id}`,
        location: [prop.city, prop.state, prop.zipCode || prop.pincode]
          .filter(Boolean)
          .join(", ") || "Location details on file",
        date: prop.createdAt
          ? new Date(prop.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently Added",
        status: prop.status || "Completed",
      }));

      setSearches(mappedList);
    } catch (err) {
      console.error("Error fetching live recent searches:", err);
      setSearches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recent Searches</h2>

        <Link
          to="/search-property"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b text-sm">
              <th className="pb-3 font-medium">Property Address</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Search Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-sm text-gray-400">
                  Loading recent searches...
                </td>
              </tr>
            ) : searches.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-sm text-gray-500">
                  No recent property searches found.
                </td>
              </tr>
            ) : (
              searches.map((property) => (
                <tr
                  key={property.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-medium text-gray-800">
                    {property.address}
                  </td>

                  <td className="text-gray-600 text-sm">
                    {property.location}
                  </td>

                  <td className="text-gray-600 text-sm">
                    {property.date}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        property.status.toLowerCase() === "completed" ||
                        property.status.toLowerCase() === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>

                  <td className="text-center">
                    <Link
                      to={`/property-details/${property.id}`}
                      className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                      title="View Property Details"
                    >
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSearches;