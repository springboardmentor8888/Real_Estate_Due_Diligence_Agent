import { useState, useEffect } from "react";
import {
  FaHome,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
  FaUser,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

import { formatCurrency } from "../data/comparableData";

// 🏡 Expanded pool of high-res architecture & property images
const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", // Modern House
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", // Suburban Villa
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800", // Contemporary Glass Villa
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", // Luxury Estate
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", // White Minimalist Villa
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", // Modern Mansion
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", // Classic Brick House
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800", // Cozy Home
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", // Resort Style Villa
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", // Contemporary Bungalow
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", // Modern Exterior
  "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800", // High-rise Apartment
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", // Luxury Apartment Complex
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", // Commercial Tower
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800", // Modern Loft
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", // Modern Condo
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", // Interior/Apartment
  "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800", // Pool House
];

const PROPERTY_TYPES = [
  "Residential",
  "Villa",
  "Apartment",
  "Commercial",
  "Independent House",
];

// Helper: Enhanced Hash algorithm (FNV-1a variant) for distinct image distribution
const getImageForAddress = (str = "") => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const index = Math.abs(hash) % PROPERTY_IMAGES.length;
  return PROPERTY_IMAGES[index];
};

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
    fetchPropertiesFromBackend();
  }, []);

  const fetchPropertiesFromBackend = async () => {
    try {
      setFetchingProps(true);
      const token = localStorage.getItem("token");

      const localSaved = JSON.parse(
        localStorage.getItem("custom_properties") || "[]"
      );

      let dbProps = [];
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/properties",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        dbProps = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];
      } catch (err) {
        console.error("Backend GET failed, using local backup:", err);
      }

      const combined = [...localSaved];
      dbProps.forEach((dbItem) => {
        if (!combined.some((c) => c.id === dbItem.id)) {
          combined.push(dbItem);
        }
      });

      setProperties(combined);
    } finally {
      setFetchingProps(false);
    }
  };

  // 🗑️ REMOVE CARD FUNCTION
  const handleRemoveProperty = async (id, e) => {
    e.stopPropagation();

    setProperties((prev) => prev.filter((item) => item.id !== id));

    const localSaved = JSON.parse(
      localStorage.getItem("custom_properties") || "[]"
    );
    const updatedLocal = localSaved.filter((item) => item.id !== id);
    localStorage.setItem("custom_properties", JSON.stringify(updatedLocal));

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/v1/properties/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.warn("Backend delete endpoint not reachable or unsupported.");
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

    const token = localStorage.getItem("token");

    // Dynamic photo assignment via hashing address + city
    const uniqueImage = getImageForAddress(
      formData.address.trim().toLowerCase() + formData.city.trim().toLowerCase()
    );
    const randomType =
      PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];
    const randomPrice =
      Math.floor(Math.random() * (250 - 45 + 1) + 45) * 100000;

    const newProperty = {
      id: Date.now(),
      title: `${randomType} in ${formData.city}`,
      address: `${formData.address}, ${formData.city}`,
      city: formData.city,
      state: formData.state,
      pincode: formData.zipCode,
      status: "Pending",
      owner: "Under Verification",
      propertyType: randomType,
      marketValueValue: randomPrice,
      image: uniqueImage,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/properties/due-diligence",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.id) {
        newProperty.id = response.data.id;
      }
      setSuccessMsg("Property submitted successfully & saved!");
    } catch (err) {
      console.warn("Backend POST call failed, saving locally anyway:", err);
      setSuccessMsg("Property saved locally!");
    } finally {
      const existing = JSON.parse(
        localStorage.getItem("custom_properties") || "[]"
      );
      const updatedLocal = [newProperty, ...existing];
      localStorage.setItem("custom_properties", JSON.stringify(updatedLocal));

      setProperties((prev) => [newProperty, ...prev]);

      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMsg("");
        setFormData({ address: "", city: "", state: "", zipCode: "" });
      }, 1000);

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

    const priceVal = property.priceValue || property.marketValueValue || 0;

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
            No properties found matching your criteria. Try submitting a new address using the "Run New Due Diligence Check" button above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const displayImage =
                property.image || getImageForAddress(property.address);

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden group relative"
                >
                  <div className="overflow-hidden relative">
                    <img
                      src={displayImage}
                      alt={property.title || "Property"}
                      className="w-full h-52 object-cover transition duration-500 group-hover:scale-105"
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

                  <div className="p-5">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg">
                          {property.title || property.address || "Property Item"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {property.city || "Location"} -{" "}
                          {property.pincode || property.zipCode || "N/A"}
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
                        {property.status || "Pending"}
                      </span>
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

                    {property.marketValueValue ? (
                      <p className="text-blue-600 font-semibold mt-2">
                        {formatCurrency(property.marketValueValue)}
                      </p>
                    ) : null}

                    <button
                      onClick={() =>
                        navigate(`/property-details/${property.id}`)
                      }
                      className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer"
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