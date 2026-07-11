import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaHome,
  FaRulerCombined,
  FaMoneyBillWave,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaFileAlt,
  FaCheckCircle,
  FaHistory,
  FaFilePdf,
  FaSchool,
  FaHospital,
  FaShoppingCart,
  FaSubway,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const property = {
  id: "PROP001",
  title: "Luxury Independent Villa",
  address: "123 MG Road, Hyderabad, Telangana",
  owner: "Rajesh Kumar",
  email: "rajesh@gmail.com",
  phone: "+91 9876543210",
  propertyType: "Residential",
  area: "2450 sq.ft",
  surveyNo: "SY-4587",
  registrationNo: "REG-2025-4587",
  registrationDate: "12 Jan 2023",
  marketValue: "₹1.25 Crore",
  taxStatus: "Paid",
  mortgage: "No",
  litigation: "No",

  description:
    "A premium independent villa located in Hyderabad with excellent road connectivity, nearby schools, hospitals, shopping centers and schools. The property has clear legal ownership, verified registration records, updated tax receipts and no active litigation.",

  images: [
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800",
  ],

  documents: [
    "Sale Deed",
    "Tax Receipt",
    "Encumbrance Certificate",
    "Survey Map",
  ],
};

const PropertyDetails = () => {
  const [selectedImage, setSelectedImage] = useState(property.images[0]);
  const navigate = useNavigate();
  return (
    <div className="px-8 pt-5 pb-8">
      <button
        onClick={() => navigate("/search-property")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft />
        Back to Search
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Property Details</h1>

        <p className="text-gray-500 mt-3 text-lg">
          Complete due diligence information for the selected property.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <img
          src={selectedImage}
          alt={property.title}
          className="w-full h-[450px] object-cover"
        />

        <div className="grid grid-cols-4 gap-4 p-4">
          {property.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Property ${index + 1}`}
              onClick={() => setSelectedImage(image)}
              className={`h-28 w-full rounded-xl object-cover cursor-pointer transition border-4 ${
                selectedImage === image
                  ? "border-blue-600"
                  : "border-transparent hover:border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaHome className="text-3xl text-blue-600" />

          <div>
            <p className="text-gray-500 text-sm">Property Type</p>

            <h3 className="font-bold">{property.propertyType}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaMoneyBillWave className="text-3xl text-green-600" />

          <div>
            <p className="text-gray-500 text-sm">Market Value</p>

            <h3 className="font-bold">{property.marketValue}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaRulerCombined className="text-3xl text-purple-600" />

          <div>
            <p className="text-gray-500 text-sm">Area</p>

            <h3 className="font-bold">{property.area}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaCheckCircle className="text-3xl text-green-600" />

          <div>
            <p className="text-gray-500 text-sm">Verification</p>

            <h3 className="font-bold text-green-600">Verified</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Information
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Property ID</span>
              <span className="font-semibold">{property.id}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Property Type</span>
              <span className="font-semibold">{property.propertyType}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Survey Number</span>
              <span className="font-semibold">{property.surveyNo}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Registration No.</span>
              <span className="font-semibold">{property.registrationNo}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Registration Date</span>
              <span className="font-semibold">{property.registrationDate}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">Area</span>
              <span className="font-semibold">{property.area}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Market Value</span>
              <span className="font-bold text-blue-600">
                {property.marketValue}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Owner Details
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUser className="text-blue-600 text-xl" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">Owner Name</p>

                <h3 className="font-semibold">{property.owner}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaPhone className="text-green-600 text-xl" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">Contact Number</p>

                <h3 className="font-semibold">{property.phone}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FaEnvelope className="text-red-600 text-xl" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">Email Address</p>

                <h3 className="font-semibold">{property.email}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <FaMapMarkerAlt className="text-purple-600 text-xl" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">Property Address</p>

                <h3 className="font-semibold">{property.address}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Due Diligence Status
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Registration Verified</span>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Owner Verification</span>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Tax Status</span>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                {property.taxStatus}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Mortgage</span>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                {property.mortgage}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Litigation</span>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                {property.litigation}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Documents
          </h2>

          <div className="space-y-4">
            {property.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <FaFilePdf className="text-red-600 text-xl" />

                  <span className="font-medium">{doc}</span>
                </div>

                <button className="text-blue-600 hover:underline">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Description
          </h2>

          <p className="text-gray-600 leading-8">{property.description}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Features
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-700">Bedrooms</h3>
              <p className="text-gray-600 mt-1">4 Bedrooms</p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <h3 className="font-semibold text-green-700">Bathrooms</h3>
              <p className="text-gray-600 mt-1">3 Bathrooms</p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <h3 className="font-semibold text-yellow-700">Parking</h3>
              <p className="text-gray-600 mt-1">2 Car Parking</p>
            </div>

            <div className="rounded-xl bg-purple-50 p-4">
              <h3 className="font-semibold text-purple-700">Furnishing</h3>
              <p className="text-gray-600 mt-1">Semi Furnished</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Nearby Amenities
        </h2>

        <div className="grid grid-cols-4 gap-6">
          <div className="rounded-xl bg-gray-50 p-5 text-center">
            <FaSchool className="mx-auto text-4xl text-blue-600" />
            <h3 className="font-semibold mt-3">Schools</h3>
            <p className="text-gray-500 text-sm">Within 1 km</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5 text-center">
            <FaHospital className="mx-auto text-4xl text-red-600" />
            <h3 className="font-semibold mt-3">Hospital</h3>
            <p className="text-gray-500 text-sm">500 meters</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5 text-center">
            <FaShoppingCart className="mx-auto text-4xl text-green-600" />
            <h3 className="font-semibold mt-3">Shopping Mall</h3>
            <p className="text-gray-500 text-sm">2 km</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5 text-center">
            <FaSubway className="mx-auto text-4xl text-purple-600" />
            <h3 className="font-semibold mt-3">Metro Station</h3>
            <p className="text-gray-500 text-sm">800 meters</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10">
        <button className="flex items-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition">
          <FaHistory />
          Property History
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition">
          <FaFileAlt />
          Generate Due Diligence Report
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
