import React, { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/purchases/completed/customers",
        {
          headers: getHeaders(),
        },
      );

      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading customers:", error);
      setError("Unable to load customers.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 pt-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>

        <p className="mt-2 text-gray-500">
          View customers whose property purchases have been fully approved.
        </p>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Completed Customers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Buyers approved by both Legal and Financial Review.
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            {customers.length} Customer{customers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading && (
          <div className="mt-8 py-10 text-center text-gray-500">
            Loading customers...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && customers.length === 0 && (
          <div className="mt-8 rounded-lg bg-gray-50 p-10 text-center">
            <p className="font-medium text-gray-700">
              No completed customers yet.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Customers will appear here after both legal and financial approval
              is completed.
            </p>
          </div>
        )}

        {!loading && !error && customers.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                    Customer
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                    Contact
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                    Property ID
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                    Property
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                    Location
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    {/* Customer */}
                    <td className="px-4 py-5">
                      <p className="font-semibold text-gray-800">
                        {customer.buyerName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Buyer ID: #{customer.buyerId}
                      </p>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-5">
                      <p className="text-sm text-gray-700">
                        {customer.buyerEmail}
                      </p>
                    </td>

                    {/* Property ID */}
                    <td className="px-4 py-5">
                      <span className="font-semibold text-gray-700">
                        #{customer.propertyId}
                      </span>
                    </td>

                    {/* Property */}
                    <td className="px-4 py-5">
                      <p className="font-medium text-gray-800">
                        {customer.propertyAddress}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {customer.propertyType}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-5 text-sm text-gray-600">
                      {customer.city}, {customer.state}
                      <br />
                      {customer.zipCode}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-5 font-semibold text-gray-800">
                      ₹{Number(customer.price || 0).toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-5">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        COMPLETED
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

export default Customers;
