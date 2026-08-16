import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await axios.get(
        "http://localhost:8080/api/purchases/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPurchases(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading purchases...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Purchases</h1>

      {purchases.length === 0 ? (
        <div className="bg-white p-6 rounded-xl border">
          No purchases found.
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-white p-6 rounded-xl border shadow-sm"
            >
              <h2 className="text-lg font-semibold">
                Property #{purchase.propertyId}
              </h2>

              <p className="mt-2">
                Status: <span className="font-semibold">{purchase.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
