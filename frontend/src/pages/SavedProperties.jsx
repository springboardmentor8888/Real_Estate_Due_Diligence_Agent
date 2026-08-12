import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaTrash,
  FaEye,
  FaHeart,
  FaUser,
  FaHome,
  FaBookmark,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";

function formatCurrency(value) {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

const SavedProperties = () => {
  const navigate = useNavigate();

  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get user-specific storage key
  const getSavedKey = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || user.email || "guest";
    return `savedProperties_${userId}`;
  };

  // 1. Fetch saved properties from user-scoped localStorage (with Backend Fallback)
  useEffect(() => {
    loadSavedProperties();

    // Listen for real-time updates across components/tabs
    const handleUpdate = () => loadSavedProperties();
    window.addEventListener("savedPropertiesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("savedPropertiesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const loadSavedProperties = async () => {
    setLoading(true);
    setError(null);

    // First attempt: Try fetching from backend if endpoint is active
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        "http://localhost:8080/api/properties/saved",
        { headers }
      );

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setSavedProperties(response.data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend saved endpoint not available, falling back to user local storage.");
    }

    // Second attempt: Fallback to reading saved properties saved locally for THIS user account
    try {
      const key = getSavedKey();
      const localData = JSON.parse(
        localStorage.getItem(key) || "[]"
      );
      setSavedProperties(localData);
    } catch (err) {
      console.error("Error loading saved properties from localStorage:", err);
      setError("Failed to load saved properties.");
      setSavedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Un-bookmark / remove property from saved list for current user
  const removeSavedProperty = (id, e) => {
    if (e) e.stopPropagation();

    try {
      const key = getSavedKey();
      const updated = savedProperties.filter((property) => property.id !== id);
      setSavedProperties(updated);
      localStorage.setItem(key, JSON.stringify(updated));

      // Dispatch event to update Sidebar counter instantly
      window.dispatchEvent(new Event("savedPropertiesUpdated"));
    } catch (err) {
      console.error("Failed to remove property from saved list:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Fetching saved properties...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <FaBookmark className="text-blue-600 text-3xl" /> Saved Properties
        </h1>
        <p className="text-gray-500 mt-3 text-lg">
          View and manage your bookmarked properties.
        </p>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {/* Empty State */}
      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center max-w-xl mx-auto border border-gray-100">
          <FaHeart className="text-5xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            No Saved Properties
          </h2>
          <p className="text-gray-500 mt-2 mb-6">
            Explore properties and click the bookmark icon on any card to save it here.
          </p>
          <button
            onClick={() => navigate("/search-property")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition cursor-pointer"
          >
            Search Properties
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {savedProperties.map((property) => {
            const displayImage =
              property.imageUrl ||
              property.image ||
              (property.images &&
                property.images.length > 0 &&
                (property.images[0].imageUrl || property.images[0])) ||
              (property.imageUrls &&
                property.imageUrls.length > 0 &&
                property.imageUrls[0]) ||
              DEFAULT_IMAGE;

            const priceVal =
              property.price || property.priceValue || property.marketValueValue;

            const riskText =
              property.riskLevel ||
              (property.riskScore > 70
                ? "High Risk"
                : property.riskScore > 30
                ? "Medium Risk"
                : "Low Risk");

            return (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition flex flex-col justify-between"
              >
                <div className="relative">
                  <img
                    src={displayImage}
                    alt={property.title || property.address || "Property Image"}
                    className="h-56 w-full object-cover"
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />

                  {/* UN-BOOKMARK BUTTON */}
                  <button
                    onClick={(e) => removeSavedProperty(property.id, e)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow transition cursor-pointer z-10"
                    title="Remove from Saved"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                        {property.title ||
                          property.street ||
                          property.address ||
                          "Property Item"}
                      </h2>

                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 flex-shrink-0 ${
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

                    <div className="flex items-center text-gray-500 mt-2">
                      <FaMapMarkerAlt className="mr-2 text-red-500 flex-shrink-0" />
                      <span className="truncate">
                        {property.address ||
                          `${property.city || ""}, ${property.state || ""}`}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaUser className="text-blue-600 flex-shrink-0" />
                        <span>
                          {property.owner ||
                            property.ownerName ||
                            "Pending Verification"}
                        </span>
                      </p>

                      <p className="flex items-center gap-2">
                        <FaHome className="text-green-600 flex-shrink-0" />
                        <span>
                          {property.propertyType ||
                            property.type ||
                            "Residential"}
                        </span>
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                        <span className="font-semibold text-gray-500">
                          Status:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            property.status === "Verified"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {property.status || "Pending"}
                        </span>
                      </div>

                      {priceVal ? (
                        <p className="text-blue-600 font-bold text-lg pt-1">
                          {formatCurrency(priceVal)}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm italic pt-1">
                          Price on Request
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() =>
                        navigate(`/property-details/${property.id}`, {
                          state: { property },
                        })
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition font-semibold cursor-pointer"
                    >
                      <FaEye />
                      View Details
                    </button>

                    <button
                      onClick={(e) => removeSavedProperty(property.id, e)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-4 rounded-lg flex items-center justify-center transition border border-red-200 cursor-pointer"
                      title="Remove from Saved"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedProperties;