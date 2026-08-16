import { useEffect, useState } from "react";
import axios from "axios";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");

    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const fetchPurchaseHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/purchases/my",
        {
          headers: getHeaders(),
        },
      );

      setPurchases(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading purchase history:", error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case "APPROVED":
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="px-8 pt-6 pb-8">
      <h1 className="text-3xl font-bold text-gray-800">Purchase History</h1>

      <p className="mt-2 text-gray-500">
        View your property purchase requests and approval status.
      </p>

      <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading purchase history...
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No purchase history found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b text-left text-sm text-gray-600">
                  <th className="p-4">Property</th>
                  <th className="p-4">Property ID</th>
                  <th className="p-4">Purchase Date</th>
                  <th className="p-4">Legal Review</th>
                  <th className="p-4">Financial Review</th>
                  <th className="p-4">Overall Status</th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">
                        {purchase.propertyAddress}
                      </p>

                      <p className="text-sm text-gray-500">
                        {purchase.city}, {purchase.state}
                      </p>
                    </td>

                    <td className="p-4 text-gray-600">
                      #{purchase.propertyId}
                    </td>

                    <td className="p-4 text-gray-600">
                      {purchase.createdAt
                        ? new Date(purchase.createdAt).toLocaleDateString(
                            "en-IN",
                          )
                        : "N/A"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                          purchase.legalStatus,
                        )}`}
                      >
                        {purchase.legalStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                          purchase.financialStatus,
                        )}`}
                      >
                        {purchase.financialStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                          purchase.status,
                        )}`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
