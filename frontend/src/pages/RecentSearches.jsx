import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const recentSearches = [
  {
    address: "123 Main Street",
    location: "Austin, TX 78701",
    date: "Dec 12, 2025",
    status: "Completed",
  },
  {
    address: "456 Oak Avenue",
    location: "Dallas, TX 75201",
    date: "Jan 10, 2026",
    status: "Completed",
  },
  {
    address: "789 Pine Road",
    location: "Houston, TX 77001",
    date: "Feb 8, 2026",
    status: "Completed",
  },
  {
    address: "321 Elm Street",
    location: "San Antonio, TX 78201",
    date: "Mar 19, 2026",
    status: "In Progress",
  },
  {
    address: "654 Maple Drive",
    location: "Plano, TX 75023",
    date: "April 3, 2026",
    status: "Completed",
  },
];

const RecentSearches = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Searches</h2>

        <Link
          to="/search-property"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3">Property Address</th>
            <th className="pb-3">Location</th>
            <th className="pb-3">Search Date</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {recentSearches.map((property, index) => (
            <tr
              key={index}
              className="border-b last:border-none hover:bg-gray-50"
            >
              <td className="py-4 font-medium">{property.address}</td>

              <td>{property.location}</td>

              <td>{property.date}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {property.status}
                </span>
              </td>

              <td className="text-center">
                <button className="text-gray-600 hover:text-blue-600">
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSearches;
