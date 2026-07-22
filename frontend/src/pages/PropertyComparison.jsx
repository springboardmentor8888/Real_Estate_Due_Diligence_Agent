import { useState } from "react";

const properties = [
  {
    id: 1,
    name: "Luxury Villa",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    address: "MVP Colony, Visakhapatnam",
    owner: "Rajesh Kumar",
    type: "Villa",
    area: "3200 sq.ft",
    price: "₹1.25 Cr",
    status: "Verified",
    surveyNo: "SV12345",
    registrationNo: "REG98765",
    encumbrance: "Clear",
    litigation: "No",
  },
  {
    id: 2,
    name: "Modern Apartment",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    address: "Madhurawada, Visakhapatnam",
    owner: "Anil Sharma",
    type: "Apartment",
    area: "1650 sq.ft",
    price: "₹82 Lakhs",
    status: "Pending",
    surveyNo: "SV54321",
    registrationNo: "REG65432",
    encumbrance: "Under Review",
    litigation: "No",
  },
  {
    id: 3,
    name: "Independent House",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    address: "Gajuwaka, Visakhapatnam",
    owner: "Suresh Reddy",
    type: "House",
    area: "2400 sq.ft",
    price: "₹98 Lakhs",
    status: "Verified",
    surveyNo: "SV67890",
    registrationNo: "REG24680",
    encumbrance: "Clear",
    litigation: "No",
  },
];

const PropertyComparison = () => {
  const [property1, setProperty1] = useState(properties[0].id);
  const [property2, setProperty2] = useState(properties[1].id);

  const firstProperty = properties.find((p) => p.id === Number(property1));
  const secondProperty = properties.find((p) => p.id === Number(property2));

  return (
    <div className="p-8">
      {/* Heading */}

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Property Comparison
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Compare two properties side by side for better decision making.
        </p>
      </div>

      {/* Selection */}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
          <div>
            <label className="block mb-2 font-semibold">
              Select Property 1
            </label>

            <select
              value={property1}
              onChange={(e) => setProperty1(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {properties.map((property) => (
                <option
                  key={property.id}
                  value={property.id}
                  disabled={property.id === Number(property2)}
                >
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-lg">
              VS
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Select Property 2
            </label>

            <select
              value={property2}
              onChange={(e) => setProperty2(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {properties.map((property) => (
                <option
                  key={property.id}
                  value={property.id}
                  disabled={property.id === Number(property1)}
                >
                  {property.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Table */}

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left w-1/4">Feature</th>

              <th className="p-4 text-center">{firstProperty.name}</th>

              <th className="p-4 text-center">{secondProperty.name}</th>
            </tr>
          </thead>

          <tbody>
            {/* Image */}

            <tr className="border-b">
              <td className="p-4 font-semibold">Image</td>

              <td className="p-4 text-center">
                <img
                  src={firstProperty.image}
                  alt={firstProperty.name}
                  className="w-56 h-36 object-cover rounded-lg mx-auto"
                />
              </td>

              <td className="p-4 text-center">
                <img
                  src={secondProperty.image}
                  alt={secondProperty.name}
                  className="w-56 h-36 object-cover rounded-lg mx-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
                />
              </td>
            </tr>

            {/* Address */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Address</td>

              <td className="p-4">{firstProperty.address}</td>

              <td className="p-4">{secondProperty.address}</td>
            </tr>

            {/* Owner */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Owner</td>

              <td className="p-4">{firstProperty.owner}</td>

              <td className="p-4">{secondProperty.owner}</td>
            </tr>

            {/* Property Type */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Property Type</td>

              <td className="p-4">{firstProperty.type}</td>

              <td className="p-4">{secondProperty.type}</td>
            </tr>

            {/* Area */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Area</td>

              <td className="p-4">{firstProperty.area}</td>

              <td className="p-4">{secondProperty.area}</td>
            </tr>

            {/* Price */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Market Value</td>

              <td className="p-4 font-semibold text-green-600">
                {firstProperty.price}
              </td>

              <td className="p-4 font-semibold text-green-600">
                {secondProperty.price}
              </td>
            </tr>

            {/* Status */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Status</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    firstProperty.status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {firstProperty.status}
                </span>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    secondProperty.status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {secondProperty.status}
                </span>
              </td>
            </tr>

            {/* Survey Number */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Survey Number</td>

              <td className="p-4">{firstProperty.surveyNo}</td>

              <td className="p-4">{secondProperty.surveyNo}</td>
            </tr>

            {/* Registration Number */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Registration Number</td>

              <td className="p-4">{firstProperty.registrationNo}</td>

              <td className="p-4">{secondProperty.registrationNo}</td>
            </tr>

            {/* Encumbrance */}

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-semibold">Encumbrance</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    firstProperty.encumbrance === "Clear"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {firstProperty.encumbrance}
                </span>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    secondProperty.encumbrance === "Clear"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {secondProperty.encumbrance}
                </span>
              </td>
            </tr>

            {/* Litigation */}
            <tr className="hover:bg-gray-50">
              <td className="p-4 font-semibold">Litigation</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    firstProperty.litigation === "No"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {firstProperty.litigation}
                </span>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    secondProperty.litigation === "No"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {secondProperty.litigation}
                </span>
              </td>
            </tr>
            <tr className="bg-blue-50">
              <td className="p-4 font-semibold">Recommended</td>

              <td className="p-4 text-center">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    firstProperty.status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {firstProperty.status === "Verified" ? (
                    <>
                      <span>✅</span>
                      <span>Recommended</span>
                    </>
                  ) : (
                    <>
                      <span>⚠️</span>
                      <span>Review Required</span>
                    </>
                  )}
                </span>
              </td>

              <td className="p-4 text-center">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    secondProperty.status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {secondProperty.status === "Verified" ? (
                    <>
                      <span>✅</span>
                      <span>Recommended</span>
                    </>
                  ) : (
                    <>
                      <span>⚠️</span>
                      <span>Review Required</span>
                    </>
                  )}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Action Buttons */}

      <div className="flex justify-center gap-4 mt-8 flex-wrap">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
          View Property 1
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition">
          View Property 2
        </button>

        <button
          onClick={() => {
            setProperty1(properties[0].id);
            setProperty2(properties[1].id);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg transition"
        >
          Reset Comparison
        </button>
      </div>
    </div>
  );
};

export default PropertyComparison;
