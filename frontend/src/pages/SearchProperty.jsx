import { useState, useEffect } from "react";
import {
  FaHome,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
  FaUser,
  FaPlus,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

import { formatCurrency } from "../data/comparableData";

// Static fallback image for properties without uploaded photos
const DEFAULT_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80";

const PROPERTY_TYPES = [
  "Residential",
  "Villa",
  "Apartment",
  "Commercial",
  "Independent House",
];

const SearchProperty = () => {
  const { showFilters, setShowFilters } = useOutletContext() || {};
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "All",
    status: "All",
    city: "All",
    price: "All",
  });
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [fetchingProps, setFetchingProps] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Clear out any old mock local storage properties once
    localStorage.removeItem("custom_properties");
    fetchPropertiesFromBackend();
  }, []);

  // 🎯 FETCH PROPERTIES FROM BOTH API ENDPOINTS TO PREVENT MISSING LISTINGS
  const fetchPropertiesFromBackend = async () => {
    try {
      setFetchingProps(true);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [mainRes, ddRes] = await Promise.allSettled([
        axios.get("http://localhost:8080/api/properties", { headers }),
        axios.get("http://localhost:8080/api/properties/due-diligence", { headers }),
      ]);

      let combinedProperties = [];

      // Extract from main /api/properties endpoint
      if (mainRes.status === "fulfilled" && mainRes.value.data) {
        const mainData = Array.isArray(mainRes.value.data)
          ? mainRes.value.data
          : mainRes.value.data?.content || [];
        combinedProperties = [...mainData];
      }

      // Extract from /api/properties/due-diligence endpoint and merge unique items
      if (ddRes.status === "fulfilled" && ddRes.value.data) {
        const ddData = Array.isArray(ddRes.value.data)
          ? ddRes.value.data
          : ddRes.value.data?.content || [];

        ddData.forEach((item) => {
          if (!combinedProperties.some((p) => p.id === item.id)) {
            combinedProperties.push(item);
          }
        });
      }

      setProperties(combinedProperties);
    } catch (err) {
      console.error("Backend GET failed:", err);
      setProperties([]);
    } finally {
      setFetchingProps(false);
    }
  };

  // 🗑️ PERMANENTLY REMOVE PROPERTY FROM UI & DATABASE
  const handleRemoveProperty = async (id, e) => {
    e.stopPropagation();

    // 1. Remove from React State immediately
    setProperties((prev) => prev.filter((item) => item.id !== id));

    // 2. Call Backend API to delete from Database
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8080/api/properties/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log(`Property ${id} deleted successfully from backend.`);
    } catch (err) {
      console.warn("Backend delete endpoint failed or property only existed in local state.", err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDueDiligenceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const token = localStorage.getItem("token") || localStorage.getItem("authToken");

    try {
      await axios.post(
        "http://localhost:8080/api/properties/due-diligence",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMsg("Due diligence triggered successfully!");
      
      // Refresh the property list directly from database
      setTimeout(() => {
        fetchPropertiesFromBackend();
        setShowAddModal(false);
        setSuccessMsg("");
        setFormData({ address: "", city: "", state: "", zipCode: "" });
      }, 1000);

    } catch (err) {
      console.error("Failed to trigger due diligence:", err);
      setError("Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const normalizedQuery = query.trim().toLowerCase();
    const propAddress = property.address || "";
    const propPincode = property.pincode || property.zipCode || "";
    const propOwner = property.owner || "";
    const propType = property.propertyType || property.type || "";
    const propTitle = property.title || "";

    const matchesQuery =
      !normalizedQuery ||
      [propAddress, propPincode, propOwner, propType, propTitle]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    const priceVal = property.price || property.priceValue || property.marketValueValue || 0;

    const matchesPrice =
      filters.price === "All" ||
      (filters.price === "Below50" && priceVal < 5000000) ||
      (filters.price === "50to100" &&
        priceVal >= 5000000 &&
        priceVal <= 10000000) ||
      (filters.price === "100to200" &&
        priceVal > 10000000 &&
        priceVal <= 20000000) ||
      (filters.price === "Above200" && priceVal > 20000000);

    return (
      matchesQuery &&
      (filters.type === "All" || propType === filters.type) &&
      (filters.status === "All" || property.status === filters.status) &&
      (filters.city === "All" ||
        (property.city &&
          property.city.toLowerCase() === filters.city.toLowerCase())) &&
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

        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow transition cursor-pointer"
        >
          <FaPlus /> Run New Due Diligence Check
        </button>
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
                className="w-full bg-blue-600 text-white rounded-lg py-3 cursor-pointer"
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
          {fetchingProps
            ? "Loading properties..."
            : `${filteredProperties.length} Properties Found`}
        </h2>

        {fetchingProps ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            No properties found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const displayImage =
                (property.imageUrls && property.imageUrls.length > 0 && property.imageUrls[0]) ||
                property.image ||
                DEFAULT_PROPERTY_IMAGE;

              const priceVal = property.price || property.priceValue || property.marketValueValue;
              const riskText = property.riskLevel || (property.riskScore > 70 ? "High Risk" : property.riskScore > 30 ? "Medium Risk" : "Low Risk");

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden group relative flex flex-col justify-between"
                >
                  <div className="overflow-hidden relative">
                    <img
                      src={displayImage}
                      alt={property.title || "Property"}
                      className="w-full h-52 object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = DEFAULT_PROPERTY_IMAGE;
                      }}
                    />

                    {/* 🗑️ REMOVE CARD BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveProperty(property.id, e)}
                      title="Remove Property"
                      className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full shadow transition backdrop-blur-xs cursor-pointer z-10"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-1">
                            {property.title || property.address || "Property Item"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {property.city || "Location"} -{" "}
                            {property.zipCode || property.pincode || "N/A"}
                          </p>
                        </div>

                        {/* BADGES CONTAINER */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          {/* 1. Verification Badge */}
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              property.status === "Verified"
                                ? "bg-green-100 text-green-700"
                                : property.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {property.status || "Pending"}
                          </span>

                          {/* 2. Risk Level Badge */}
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                              riskText.includes("High")
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : riskText.includes("Medium")
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {riskText.includes("High") && <FaExclamationTriangle className="text-[10px]" />}
                            {riskText}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                        <span className="truncate">{property.address}</span>
                      </p>

                      <p className="flex items-center gap-2 text-gray-600">
                        <FaUser className="text-blue-600 flex-shrink-0" />
                        <span>{property.owner || "Pending Verification"}</span>
                      </p>

                      <p className="flex items-center gap-2 text-gray-600">
                        <FaHome className="text-green-600 flex-shrink-0" />
                        <span>{property.propertyType || "Residential"}</span>
                      </p>

                      {/* Specs bar */}
                      {(property.bedrooms || property.bathrooms || property.sqft) && (
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 my-2 pt-2 border-t border-gray-100">
                          {property.bedrooms > 0 && <span>🛏️ {property.bedrooms} Beds</span>}
                          {property.bathrooms > 0 && <span>🚿 {property.bathrooms} Baths</span>}
                          {property.sqft > 0 && <span>📐 {property.sqft} sqft</span>}
                        </div>
                      )}

                      {priceVal ? (
                        <p className="text-blue-600 font-bold text-lg mt-2">
                          {formatCurrency(priceVal)}
                        </p>
                      ) : null}
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/property-details/${property.id}`)
                      }
                      className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer font-semibold"
                    >
                      Start Due Diligence
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Trigger Property Due Diligence
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter address details to submit to backend API.
            </p>

            <form onSubmit={handleDueDiligenceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. 100 Jubilee Hills"
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    required
                    placeholder="Hyderabad"
                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    required
                    placeholder="Telangana"
                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleFormChange}
                    required
                    placeholder="500033"
                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {successMsg && (
                <p className="text-green-600 font-medium text-sm mt-2">
                  {successMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loading ? "Submitting..." : "Submit Due Diligence"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchProperty;