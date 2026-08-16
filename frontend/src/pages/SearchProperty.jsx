import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
  FaUser,
  FaTrash,
  FaExclamationTriangle,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

import {
  getProperties,
  getRiskAssessment,
} from "../services/dueDiligenceService";

function formatCurrency(value) {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

const DEFAULT_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

const PROPERTY_TYPES = [
  "Residential",
  "Villa",
  "Apartment",
  "Commercial",
  "Independent House",
];

const SearchProperty = () => {
  const { showFilters, setShowFilters } = useOutletContext() || {};
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [filters, setFilters] = useState({
    type: "All",
    status: "All",
    city: "All",
    price: "All",
  });
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [fetchingProps, setFetchingProps] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const [error, setError] = useState("");
  const getSavedKey = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || user.email || "guest";
    return `savedProperties_${userId}`;
  };

  useEffect(() => {
    localStorage.removeItem("custom_properties");
    fetchPropertiesFromBackend();
    loadSavedProperties();
  }, []);

  const loadSavedProperties = () => {
    try {
      const key = getSavedKey();
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      setSavedIds(saved.map((p) => p.id));
    } catch {
      setSavedIds([]);
    }
  };

  const fetchPropertiesFromBackend = async () => {
    try {
      setFetchingProps(true);
      setError("");

      const data = await getProperties();

      const propertiesWithRisk = await Promise.all(
        data.map(async (property) => {
          let riskScore = null;
          let riskLevel = null;
          let purchaseStatus = null;

          // Get risk assessment
          try {
            const risk = await getRiskAssessment(property.id);

            riskScore = Number(risk?.riskScore ?? 0);
            riskLevel = risk?.overallRisk ?? null;
          } catch (riskError) {
            console.error(
              `Risk assessment failed for property ${property.id}:`,
              riskError,
            );
          }

          // Get purchase status
          try {
            const token =
              localStorage.getItem("token") ||
              localStorage.getItem("authToken");

            const response = await axios.get(
              `http://localhost:8080/api/purchases/property/${property.id}/status`,
              {
                headers: token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : {},
              },
            );

            purchaseStatus = response.data?.status || null;
          } catch (purchaseError) {
            // No purchase request for this property is okay
            if (purchaseError.response?.status !== 404) {
              console.error(
                `Purchase status failed for property ${property.id}:`,
                purchaseError,
              );
            }
          }

          return {
            ...property,
            riskScore,
            riskLevel,
            purchaseStatus,
          };
        }),
      );

      setProperties(propertiesWithRisk);
    } catch (err) {
      console.error("Backend GET failed:", err);
      setProperties([]);
      setError("Unable to load properties from the backend.");
    } finally {
      setFetchingProps(false);
    }
  };

  const handleToggleSaveProperty = (property, e) => {
    e.stopPropagation();
    try {
      const key = getSavedKey();
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const exists = existing.some((p) => p.id === property.id);

      let updated;
      if (exists) {
        updated = existing.filter((p) => p.id !== property.id);
      } else {
        updated = [...existing, property];
      }

      localStorage.setItem(key, JSON.stringify(updated));
      setSavedIds(updated.map((p) => p.id));

      window.dispatchEvent(new Event("savedPropertiesUpdated"));
    } catch (err) {
      console.error("Failed to update saved properties:", err);
    }
  };

  const handleRemoveProperty = async (id, e) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      await axios.delete(`http://localhost:8080/api/properties/${id}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });
      setProperties((prev) => prev.filter((item) => item.id !== id));

      alert("Property deleted successfully.");
    } catch (err) {
      console.error("Delete property failed:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Failed to delete property. Please try again.",
      );
    }
  };

  const filteredProperties = properties.filter((property) => {
    const normalizedQuery = query.trim().toLowerCase();

    const propAddress = property.address || "";
    const propCity = property.city || "";
    const propState = property.state || "";
    const propPincode = property.zipCode || property.pincode || "";
    const propOwner = property.owner || property.ownerName || "";
    const propType = property.propertyType || property.type || "";
    const propTitle = property.title || "";

    const searchableText = [
      propAddress,
      propCity,
      propState,
      propPincode,
      propOwner,
      propType,
      propTitle,
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      !normalizedQuery || searchableText.includes(normalizedQuery);

    const priceVal =
      property.price || property.priceValue || property.marketValueValue || 0;

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
      (filters.type === "All" ||
        propType.toLowerCase() === filters.type.toLowerCase()) &&
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
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by address, city, state, pincode, or property type"
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
                <button
                  onClick={() => setShowFilters(false)}
                  className="cursor-pointer"
                >
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
                <option>Mumbai</option>
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
                className="w-full bg-blue-600 text-white rounded-lg py-3 cursor-pointer hover:bg-blue-700 transition"
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
                property.imageUrl ||
                property.image ||
                (property.images &&
                  property.images.length > 0 &&
                  (property.images[0].imageUrl || property.images[0])) ||
                (property.imageUrls &&
                  property.imageUrls.length > 0 &&
                  property.imageUrls[0]) ||
                DEFAULT_PROPERTY_IMAGE;

              const priceVal =
                property.price ||
                property.priceValue ||
                property.marketValueValue;
              const riskScore = Number(property.riskScore);

              const riskText = Number.isFinite(riskScore)
                ? riskScore >= 60
                  ? "High Risk"
                  : riskScore >= 30
                    ? "Medium Risk"
                    : "Low Risk"
                : "Risk unavailable";
              const isSaved = savedIds.includes(property.id);

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden group relative flex flex-col justify-between"
                >
                  <div className="overflow-hidden relative">
                    <img
                      src={displayImage}
                      alt={property.title || property.address || "Property"}
                      className="w-full h-52 object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = DEFAULT_PROPERTY_IMAGE;
                      }}
                    />

                    <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                      <button
                        type="button"
                        onClick={(e) => handleToggleSaveProperty(property, e)}
                        title={isSaved ? "Remove from Saved" : "Save Property"}
                        className={`p-2 rounded-full shadow transition backdrop-blur-xs cursor-pointer ${
                          isSaved
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-white/90 text-gray-700 hover:text-blue-600 hover:bg-white"
                        }`}
                      >
                        {isSaved ? (
                          <FaBookmark className="text-xs" />
                        ) : (
                          <FaRegBookmark className="text-xs" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleRemoveProperty(property.id, e)}
                        title="Remove Property"
                        className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full shadow transition backdrop-blur-xs cursor-pointer"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-1">
                            {property.title ||
                              property.street ||
                              property.address ||
                              "Property Item"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {property.city || "Location"} -{" "}
                            {property.zipCode || property.pincode || "N/A"}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              property.purchaseStatus === "COMPLETED"
                                ? "bg-gray-200 text-gray-700"
                                : property.status === "Verified"
                                  ? "bg-green-100 text-green-700"
                                  : property.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {property.purchaseStatus === "COMPLETED"
                              ? "Sold"
                              : property.status || "Pending"}
                          </span>

                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                              riskText.includes("High")
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : riskText.includes("Medium")
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {riskText.includes("High") && (
                              <FaExclamationTriangle className="text-[10px]" />
                            )}
                            {riskText}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                        <span className="truncate">
                          {property.street || property.address || "N/A"}
                        </span>
                      </p>

                      <p className="flex items-center gap-2 text-gray-600">
                        <FaUser className="text-blue-600 flex-shrink-0" />
                        <span>
                          {property.owner ||
                            property.ownerName ||
                            "Pending Verification"}
                        </span>
                      </p>

                      <p className="flex items-center gap-2 text-gray-600">
                        <FaHome className="text-green-600 flex-shrink-0" />
                        <span>
                          {property.propertyType ||
                            property.type ||
                            "Residential"}
                        </span>
                      </p>

                      {(property.bedrooms ||
                        property.bathrooms ||
                        property.sqft ||
                        property.squareFeet) && (
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 my-2 pt-2 border-t border-gray-100">
                          {property.bedrooms > 0 && (
                            <span>🛏️ {property.bedrooms} Beds</span>
                          )}
                          {property.bathrooms > 0 && (
                            <span>🚿 {property.bathrooms} Baths</span>
                          )}
                          {(property.sqft || property.squareFeet) > 0 && (
                            <span>
                              📐 {property.sqft || property.squareFeet} sqft
                            </span>
                          )}
                        </div>
                      )}

                      {priceVal ? (
                        <p className="text-blue-600 font-bold text-lg mt-2">
                          {formatCurrency(priceVal)}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm mt-2 italic">
                          Price on Request
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/property-details/${property.id}`, {
                          state: { property },
                        })
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
    </div>
  );
};

export default SearchProperty;
