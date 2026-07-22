import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTrash, FaEye, FaHeart } from "react-icons/fa";

const SavedProperties = () => {
  const navigate = useNavigate();

  const [savedProperties, setSavedProperties] = useState([
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      title: "Luxury Villa",
      address: "MVP Colony, Visakhapatnam",
      owner: "Rajesh Kumar",
      city: "Visakhapatnam",
      type: "Villa",
      status: "Verified",
      price: "₹1.25 Cr",
      area: "3200 sq.ft",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      title: "Modern Apartment",
      address: "Madhurawada, Visakhapatnam",
      owner: "Anil Sharma",
      city: "Visakhapatnam",
      type: "Apartment",
      status: "Pending",
      price: "₹82 Lakhs",
      area: "1650 sq.ft",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      title: "Independent House",
      address: "Gajuwaka, Visakhapatnam",
      owner: "Suresh Reddy",
      city: "Visakhapatnam",
      type: "House",
      status: "Verified",
      price: "₹98 Lakhs",
      area: "2400 sq.ft",
    },
  ]);

  const removeProperty = (id) => {
    setSavedProperties(
      savedProperties.filter((property) => property.id !== id),
    );
  };

  return (
    <div className="p-8">
      {/* Heading */}

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Saved Properties</h1>

        <p className="text-gray-500 mt-3 text-lg">
          View and manage your bookmarked properties.
        </p>
      </div>

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
                src={property.image}
                alt={property.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800">
                  {property.title}
                </h2>

                <div className="flex items-center text-gray-500 mt-2">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  {property.address}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Owner:</span>{" "}
                    {property.owner}
                  </p>

                  <p>
                    <span className="font-semibold">Type:</span> {property.type}
                  </p>

                  <p>
                    <span className="font-semibold">Area:</span> {property.area}
                  </p>

                  <p>
                    <span className="font-semibold">Price:</span>{" "}
                    {property.price}
                  </p>

                  <p>
                    <span className="font-semibold">Status:</span>

                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === "Verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {property.status}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate("/property-details")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <FaEye />
                    View Details
                  </button>

                  <button
                    onClick={() => removeProperty(property.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg flex items-center justify-center transition"
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
