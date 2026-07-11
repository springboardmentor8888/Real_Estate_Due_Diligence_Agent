import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const properties = [
  {
    id: "PROP001",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    address: "123 MG Road, Hyderabad",
    city: "Hyderabad",
    owner: "Rajesh Kumar",
    type: "Residential",
    status: "Verified",
    price: "₹75 Lakhs",
    priceValue: 75,
  },
  {
    id: "PROP002",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    address: "45 Beach Road, Visakhapatnam",
    city: "Visakhapatnam",
    owner: "Priya Sharma",
    type: "Villa",
    status: "Pending",
    price: "₹1.2 Crore",
    priceValue: 120,
  },
  {
    id: "PROP003",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    address: "78 Ring Road, Vijayawada",
    city: "Vijayawada",
    owner: "Arjun Reddy",
    type: "Apartment",
    status: "Verified",
    price: "₹65 Lakhs",
    priceValue: 65,
  },
  {
    id: "PROP004",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    address: "12 Lake View, Bengaluru",
    city: "Bengaluru",
    owner: "Sneha Patel",
    type: "Commercial",
    status: "Under Review",
    price: "₹2.1 Crore",
    priceValue: 210,
  },
  {
    id: "PROP005",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    address: "89 Park Avenue, Chennai",
    city: "Chennai",
    owner: "Rohit Verma",
    type: "Residential",
    status: "Verified",
    price: "₹95 Lakhs",
    priceValue: 95,
  },
  {
    id: "PROP006",
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800",
    address: "24 Green Valley, Pune",
    city: "Pune",
    owner: "Ananya Gupta",
    type: "Land",
    status: "Pending",
    price: "₹55 Lakhs",
    priceValue: 55,
  },
];

const SearchProperty = ({ showFilters, setShowFilters }) => {
  const [filters, setFilters] = useState({
    type: "All",
    status: "All",
    city: "All",
    price: "All",
  });
  const navigate = useNavigate();

  const filteredProperties = properties.filter((property) => {
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
      (filters.type === "All" || property.type === filters.type) &&
      (filters.status === "All" || property.status === filters.status) &&
      (filters.city === "All" || property.city === filters.city) &&
      matchesPrice
    );
  });

  return (
    <div className="px-8 pt-5 pb-8">
      <div className="text-center mb-10">
        <p className="mt-3 text-gray-500 text-lg">
          Browse and filter available properties for due diligence.
        </p>
      </div>
      <div className="relative mt-8">
        <>
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
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      type: e.target.value,
                    })
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
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value,
                    })
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
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      city: e.target.value,
                    })
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

                <div className="mb-5">
                  <label className="block mb-2 font-medium">Price Range</label>

                  <select
                    className="w-full border rounded-lg p-2"
                    value={filters.price}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        price: e.target.value,
                      })
                    }
                  >
                    <option value="All">All</option>
                    <option value="Below50">Below ₹50 Lakhs</option>
                    <option value="50to100">₹50 Lakhs - ₹1 Crore</option>
                    <option value="100to200">₹1 Crore - ₹2 Crore</option>
                    <option value="Above200">Above ₹2 Crore</option>
                  </select>
                </div>

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
        </>

        <div>
          <h2 className="text-xl font-semibold mb-6">
            {filteredProperties.length} Properties Found
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={property.image}
                  alt={property.id}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg">{property.id}</h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
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

                  <p className="mt-3 text-gray-600">📍 {property.address}</p>

                  <p className="text-gray-600">👤 {property.owner}</p>

                  <p className="text-gray-600">🏠 {property.type}</p>

                  <p className="text-blue-600 font-semibold mt-2">
                    {property.price}
                  </p>

                  <button
                    onClick={() => navigate("/property-details")}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProperty;
