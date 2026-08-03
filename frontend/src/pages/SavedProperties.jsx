import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTrash, FaEye, FaHeart } from "react-icons/fa";
import axios from "axios";

const SavedProperties = () => {
  const navigate = useNavigate();

  // State for live properties fetched from PostgreSQL DB
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default fallback image if property doesn't have one
  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800";

  // 1. Fetch live saved properties from Spring Boot Backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Replace URL if your endpoint is different (e.g. /api/v1/saved-properties)
        const response = await axios.get("http://localhost:8080/api/v1/properties");
        setSavedProperties(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching properties from database:", err);
        setError("Failed to load properties from backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // 2. Delete property from Backend DB & update UI state
  const removeProperty = async (id) => {
    try {
      // Send DELETE request to Spring Boot backend
      await axios.delete(`http://localhost:8080/api/v1/properties/${id}`);

      // Remove from local UI state on success
      setSavedProperties((prev) => prev.filter((property) => property.id !== id));
    } catch (err) {
      console.error("Failed to delete property:", err);
      // Optional fallback: remove from UI anyway if backend endpoint isn't ready
      setSavedProperties((prev) => prev.filter((property) => property.id !== id));
    }
  };

  // Loading State Indicator
  if (loading) {
    return (
      <div className="p-8 text-center min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Fetching properties from database...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Saved Properties</h1>
        <p className="text-gray-500 mt-3 text-lg">
          View and manage your bookmarked properties.
        </p>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Empty State */}
      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaHeart className="text-5xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">
            No Saved Properties
          </h2>
          <p className="text-gray-500 mt-2">
            Save properties from the Search Property page.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {savedProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={property.image || DEFAULT_IMAGE}
                alt={property.title || "Property Image"}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800">
                  {property.title || property.address || "Property Item"}
                </h2>

                <div className="flex items-center text-gray-500 mt-2">
                  <FaMapMarkerAlt className="mr-2 text-red-500 flex-shrink-0" />
                  <span>
                    {property.address ||
                      `${property.city || ""}, ${property.state || ""}`}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  {property.owner && (
                    <p>
                      <span className="font-semibold">Owner:</span> {property.owner}
                    </p>
                  )}

                  {property.type && (
                    <p>
                      <span className="font-semibold">Type:</span> {property.type}
                    </p>
                  )}

                  {property.area && (
                    <p>
                      <span className="font-semibold">Area:</span> {property.area}
                    </p>
                  )}

                  {property.price && (
                    <p>
                      <span className="font-semibold">Price:</span> {property.price}
                    </p>
                  )}

                  <p>
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === "Verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {property.status || "Pending"}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate(`/property-details/${property.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <FaEye />
                    View Details
                  </button>

                  <button
                    onClick={() => removeProperty(property.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg flex items-center justify-center transition"
                    title="Delete Property"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProperties;