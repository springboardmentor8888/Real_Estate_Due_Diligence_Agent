import { useState } from "react";
import {
  FaArrowLeft,
  FaChartBar,
  FaCheckCircle,
  FaEnvelope,
  FaFileAlt,
  FaFilePdf,
  FaHistory,
  FaHome,
  FaHospital,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaRulerCombined,
  FaSchool,
  FaShoppingCart,
  FaSubway,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { getPropertyById } from "../data/propertyData";

const statusClass = {
  Verified: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "Under Review": "bg-red-100 text-red-700",
};

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const property = getPropertyById(propertyId);
  const [selectedImages, setSelectedImages] = useState({});
  const selectedImage = selectedImages[property.id] || property.images[0];
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Property Details
        </h1>

        <p className="text-gray-500 mt-3 text-base md:text-lg">
          Complete due diligence information for {property.title}.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <img
          src={selectedImage}
          alt={property.title}
          className="w-full h-64 md:h-96 lg:h-[450px] object-cover transition duration-500"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {property.images.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`${property.title} ${index + 1}`}
              onClick={() =>
                setSelectedImages({ ...selectedImages, [property.id]: image })
              }
              className={`h-20 md:h-28 w-full rounded-xl object-cover cursor-pointer transition border-4 hover:scale-[1.02] ${
                selectedImage === image
                  ? "border-blue-600"
                  : "border-transparent hover:border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
            <h3 className="font-bold text-green-600">{property.verificationStatus}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Information
          </h2>

          <div className="space-y-5">
            {[
              ["Property Type", property.propertyType],
              ["Survey Number", property.surveyNo],
              ["Registration No.", property.registrationNo],
              ["Registration Date", property.registrationDate],
              ["Area", property.area],
              ["Pincode", property.pincode],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b pb-3 gap-4">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-right">{value}</span>
              </div>
            ))}

            <div className="flex justify-between">
              <span className="text-gray-500">Market Value</span>
              <span className="font-bold text-blue-600">{property.marketValue}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Owner Details</h2>

          <div className="space-y-5">
            {[
              [<FaUser className="text-blue-600 text-xl" />, "Owner Name", property.owner, "bg-blue-100"],
              [<FaPhone className="text-green-600 text-xl" />, "Contact Number", property.phone, "bg-green-100"],
              [<FaEnvelope className="text-red-600 text-xl" />, "Email Address", property.email, "bg-red-100"],
              [<FaMapMarkerAlt className="text-purple-600 text-xl" />, "Property Address", property.address, "bg-purple-100"],
            ].map(([icon, label, value, bg]) => (
              <div key={label} className="flex items-center gap-4">
                <div className={`${bg} p-3 rounded-full`}>{icon}</div>
                <div>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <h3 className="font-semibold">{value}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Due Diligence Status
          </h2>

          <div className="space-y-4">
            {[
              ["Registration Verified", "Verified"],
              ["Owner Verification", property.verificationStatus],
              ["Tax Status", property.taxStatus],
              ["Mortgage", property.mortgage],
              ["Litigation", property.litigation],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span>{label}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    value === "Verified" || value === "Paid" || value === "No"
                      ? "bg-green-100 text-green-700"
                      : value === "Pending" || value === "Review Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}

            <button
              onClick={() => navigate(`/risk-assessment/${property.id}`)}
              className="mt-2 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Open Detailed Risk Assessment
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FaMapMarkedAlt className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Zoning Information</h2>
          </div>

          <div className="space-y-4">
            {[
              ["Zone Type", property.zoning.zoneType],
              ["Land Use", property.zoning.landUse],
              ["FAR / FSI", property.zoning.far],
              ["Maximum Height", property.zoning.maxHeight],
              ["Plot Coverage", property.zoning.plotCoverage],
              ["Authority", property.zoning.authority],
              ["Applicable Regulations", property.zoning.regulations],
              ["Last Updated", property.zoning.lastUpdated],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b pb-3 gap-4">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-800 text-right">{value}</span>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Approval Status</span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  statusClass[property.zoning.status] || "bg-yellow-100 text-yellow-700"
                }`}
              >
                <FaCheckCircle className="mr-2" />
                {property.zoning.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Property Documents
        </h2>

        <div className="space-y-4">
          {property.documents.map((doc) => (
            <div
              key={doc}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
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
            {[
              ["Bedrooms", property.bedrooms, "bg-blue-50", "text-blue-700"],
              ["Bathrooms", property.bathrooms, "bg-green-50", "text-green-700"],
              ["Parking", property.parking, "bg-yellow-50", "text-yellow-700"],
              ["Furnishing", property.furnishing, "bg-purple-50", "text-purple-700"],
            ].map(([label, value, bg, color]) => (
              <div key={label} className={`rounded-xl ${bg} p-4`}>
                <h3 className={`font-semibold ${color}`}>{label}</h3>
                <p className="text-gray-600 mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Nearby Amenities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            [<FaSchool className="mx-auto text-4xl text-blue-600" />, "Schools", "Within 1 km"],
            [<FaHospital className="mx-auto text-4xl text-red-600" />, "Hospital", "500 meters"],
            [<FaShoppingCart className="mx-auto text-4xl text-green-600" />, "Shopping Mall", "2 km"],
            [<FaSubway className="mx-auto text-4xl text-purple-600" />, "Metro Station", "800 meters"],
          ].map(([icon, title, distance]) => (
            <div key={title} className="rounded-xl bg-gray-50 p-5 text-center">
              {icon}
              <h3 className="font-semibold mt-3">{title}</h3>
              <p className="text-gray-500 text-sm">{distance}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10 flex-wrap">
        <button
          onClick={() => navigate(`/property-history/${property.id}`)}
          className="flex items-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition"
        >
          <FaHistory />
          Property History
        </button>

        <button
          onClick={() => navigate(`/property-comparison/${property.id}`)}
          className="flex items-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition"
        >
          <FaChartBar />
          Comparable Properties
        </button>

        <button
          onClick={() => navigate(`/reports/${property.id}`)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          <FaFileAlt />
          Generate Due Diligence Report
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
