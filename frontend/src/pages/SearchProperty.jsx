import { useState } from "react";
import {
  FaHome,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";

import { formatCurrency } from "../data/comparableData";
import { properties } from "../data/propertyData";

const SearchProperty = () => {
  const { showFilters, setShowFilters } = useOutletContext();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    status: "All",
    city: "All",
    price: "All",
  });
  const navigate = useNavigate();

  const filteredProperties = properties.filter((property) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      [
        property.address,
        property.pincode,
        property.owner,
        property.propertyType,
        property.title,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesPrice =
      filters.price === "All" ||
      (filters.price === "Below50" && property.priceValue < 50) ||
      (filters.price === "50to100" &&
        property.priceValue >= 50 &&
        property.priceValue <= 100) ||
      (filters.price === "100to200" &&
        property.priceValue > 100 &&
        property.priceValue <= 200) ||
      (filters.price === "Above200" && property.priceValue > 200);

    return (
      matchesQuery &&
      (filters.type === "All" || property.propertyType === filters.type) &&
      (filters.status === "All" || property.status === filters.status) &&
      (filters.city === "All" || property.city === filters.city) &&
      matchesPrice
    );
  });

  return (
    <div className="px-8 pt-5 pb-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Search Property</h1>

        <p className="mt-3 text-gray-500 text-lg">
          Search, filter, and select a property to begin due diligence.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by address, pincode, owner name, or apartment type"
            className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="relative mt-8">
        {showFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowFilters(false)}
            />
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Filters</h2>

                <button onClick={() => setShowFilters(false)}>
                  <FaTimes />
                </button>
              </div>

              <label className="block mb-2 font-medium">Property Type</label>
              <select
                className="w-full border rounded-lg p-2 mb-5"
                value={filters.type}
                onChange={(event) =>
                  setFilters({ ...filters, type: event.target.value })
                }
              >
                <option>All</option>
                <option>Residential</option>
                <option>Villa</option>
                <option>Apartment</option>
                <option>Commercial</option>
                <option>Land</option>
              </select>

              <label className="block mb-2 font-medium">Status</label>
              <select
                className="w-full border rounded-lg p-2 mb-5"
                value={filters.status}
                onChange={(event) =>
                  setFilters({ ...filters, status: event.target.value })
                }
              >
                <option>All</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Under Review</option>
              </select>

              <label className="block mb-2 font-medium">City</label>
              <select
                className="w-full border rounded-lg p-2 mb-6"
                value={filters.city}
                onChange={(event) =>
                  setFilters({ ...filters, city: event.target.value })
                }
              >
                <option>All</option>
                <option>Hyderabad</option>
                <option>Visakhapatnam</option>
                <option>Vijayawada</option>
                <option>Bengaluru</option>
                <option>Chennai</option>
                <option>Pune</option>
              </select>

              <label className="block mb-2 font-medium">Price Range</label>
              <select
                className="w-full border rounded-lg p-2 mb-5"
                value={filters.price}
                onChange={(event) =>
                  setFilters({ ...filters, price: event.target.value })
                }
              >
                <option value="All">All</option>
                <option value="Below50">Below Rs. 50 Lakhs</option>
                <option value="50to100">Rs. 50 Lakhs - Rs. 1 Crore</option>
                <option value="100to200">Rs. 1 Crore - Rs. 2 Crore</option>
                <option value="Above200">Above Rs. 2 Crore</option>
              </select>

              <button
                className="w-full bg-blue-600 text-white rounded-lg py-3"
                onClick={() =>
                  setFilters({
                    type: "All",
                    status: "All",
                    city: "All",
                    price: "All",
                  })
                }
              >
                Reset Filters
              </button>
            </div>
          </>
        )}

        <h2 className="text-xl font-semibold mb-6">
          {filteredProperties.length} Properties Found
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden group"
            >
              <div className="overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-52 object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg">{property.title}</h3>
                    <p className="text-sm text-gray-500">
                      {property.city} - {property.pincode}
                    </p>
                  </div>

                  <span
                    className={`h-fit text-xs px-3 py-1 rounded-full ${
                      property.status === "Verified"
                        ? "bg-green-100 text-green-700"
                        : property.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <p className="mt-3 flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-red-500" />
                  {property.address}
                </p>

                <p className="flex items-center gap-2 text-gray-600">
                  <FaUser className="text-blue-600" />
                  {property.owner}
                </p>

                <p className="flex items-center gap-2 text-gray-600">
                  <FaHome className="text-green-600" />
                  {property.propertyType}
                </p>

                <p className="text-blue-600 font-semibold mt-2">
                  {formatCurrency(property.marketValueValue)}
                </p>

                <button
                  onClick={() => navigate(`/property-details/${property.id}`)}
                  className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Start Due Diligence
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchProperty;
