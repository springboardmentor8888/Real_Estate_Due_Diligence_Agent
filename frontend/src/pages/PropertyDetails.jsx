import { useState, useEffect } from "react";
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
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import { formatCurrency } from "../data/comparableData";

const DEFAULT_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80";

const statusClass = {
  Verified: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "Under Review": "bg-red-100 text-red-700",
};

const PropertyDetails = () => {
  const { id, propertyId } = useParams();
  const targetId = id || propertyId;
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Try reading property passed via navigate state first
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!location.state?.property);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState({});

  useEffect(() => {
    // 2. If property state wasn't passed directly, fetch from Spring Boot API using URL ID
    if (!property && targetId) {
      fetchPropertyFromBackend(targetId);
    }
  }, [targetId, property]);

  const fetchPropertyFromBackend = async (propId) => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `http://localhost:8080/api/properties/${propId}`,
        { headers }
      );
      setProperty(response.data);
    } catch (err) {
      console.error("Failed to fetch property details:", err);
      setError("Unable to load property details from backend.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 shadow">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
          <p className="text-sm text-red-600 mb-6">
            {error || "No property details available for this item."}
          </p>
          <button
            onClick={() => navigate("/search-property")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow transition cursor-pointer"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  // Handle Images Array
  const propertyImages =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls
      : property.images && property.images.length > 0
      ? property.images
      : property.image
      ? [property.image]
      : [DEFAULT_PROPERTY_IMAGE];

  const selectedImage =
    selectedImages[property.id] || propertyImages[0] || DEFAULT_PROPERTY_IMAGE;

  const displayPrice =
    property.marketValue ||
    (property.price ? formatCurrency(property.price) : "N/A");

  return (
    <div className="px-8 pt-5 pb-8">
      <button
        onClick={() => navigate("/search-property")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 cursor-pointer"
      >
        <FaArrowLeft />
        Back to Search
      </button>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Property Details
        </h1>

        <p className="text-gray-500 mt-3 text-base md:text-lg">
          Complete due diligence information for{" "}
          {property.title || property.address || "Property Item"}.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <img
          src={selectedImage}
          alt={property.title || "Property"}
          className="w-full h-64 md:h-96 lg:h-[450px] object-cover transition duration-500"
          onError={(e) => {
            e.target.src = DEFAULT_PROPERTY_IMAGE;
          }}
        />

        {propertyImages.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {propertyImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.title || "Property"} ${index + 1}`}
                onClick={() =>
                  setSelectedImages({ ...selectedImages, [property.id]: image })
                }
                className={`h-20 md:h-28 w-full rounded-xl object-cover cursor-pointer transition border-4 hover:scale-[1.02] ${
                  selectedImage === image
                    ? "border-blue-600"
                    : "border-transparent hover:border-gray-300"
                }`}
                onError={(e) => {
                  e.target.src = DEFAULT_PROPERTY_IMAGE;
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaHome className="text-3xl text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Property Type</p>
            <h3 className="font-bold">
              {property.propertyType || property.type || "Residential"}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaMoneyBillWave className="text-3xl text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Market Value</p>
            <h3 className="font-bold">{displayPrice}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaRulerCombined className="text-3xl text-purple-600" />
          <div>
            <p className="text-gray-500 text-sm">Area</p>
            <h3 className="font-bold">
              {property.area ||
                (property.sqft ? `${property.sqft} sqft` : "N/A")}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaCheckCircle className="text-3xl text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Verification</p>
            <h3 className="font-bold text-green-600">
              {property.verificationStatus || property.status || "Pending"}
            </h3>
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
              ["Property Type", property.propertyType || property.type || "Residential"],
              ["Survey Number", property.surveyNo || "PENDING-001"],
              ["Registration No.", property.registrationNo || "REG-2026-X"],
              ["Registration Date", property.registrationDate || "N/A"],
              ["Area", property.area || (property.sqft ? `${property.sqft} sqft` : "N/A")],
              ["Pincode", property.pincode || property.zipCode || "N/A"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between border-b pb-3 gap-4"
              >
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-right">{value}</span>
              </div>
            ))}

            <div className="flex justify-between">
              <span className="text-gray-500">Market Value</span>
              <span className="font-bold text-blue-600">{displayPrice}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Owner Details</h2>

          <div className="space-y-5">
            {[
              [
                <FaUser className="text-blue-600 text-xl" />,
                "Owner Name",
                property.owner || "Pending Verification",
                "bg-blue-100",
              ],
              [
                <FaPhone className="text-green-600 text-xl" />,
                "Contact Number",
                property.phone || "Not Provided",
                "bg-green-100",
              ],
              [
                <FaEnvelope className="text-red-600 text-xl" />,
                "Email Address",
                property.email || "Not Provided",
                "bg-red-100",
              ],
              [
                <FaMapMarkerAlt className="text-purple-600 text-xl" />,
                "Property Address",
                property.address || "N/A",
                "bg-purple-100",
              ],
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
              ["Registration Verified", property.status === "Verified" ? "Verified" : "Pending"],
              ["Owner Verification", property.verificationStatus || property.status || "Pending"],
              ["Tax Status", property.taxStatus || "Paid"],
              ["Mortgage", property.mortgage || "No"],
              ["Litigation", property.litigation || "No"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4"
              >
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
              className="mt-2 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
            >
              Open Detailed Risk Assessment
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FaMapMarkedAlt className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Zoning Information
            </h2>
          </div>

          <div className="space-y-4">
            {[
              ["Zone Type", property.zoning?.zoneType || "R1 - Residential"],
              ["Land Use", property.zoning?.landUse || "Primary Residential"],
              ["FAR / FSI", property.zoning?.far || "2.5"],
              ["Maximum Height", property.zoning?.maxHeight || "15 Meters"],
              ["Plot Coverage", property.zoning?.plotCoverage || "60%"],
              ["Authority", property.zoning?.authority || "Municipal Corporation"],
              ["Applicable Regulations", property.zoning?.regulations || "Master Plan 2031"],
              ["Last Updated", property.zoning?.lastUpdated || "2026-01-15"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b pb-3 gap-4"
              >
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-800 text-right">
                  {value}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Approval Status</span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  statusClass[property.zoning?.status] ||
                  "bg-green-100 text-green-700"
                }`}
              >
                <FaCheckCircle className="mr-2" />
                {property.zoning?.status || "Approved"}
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
          {(property.documents || [
            "Title Deed.pdf",
            "Encumbrance Certificate.pdf",
            "Approved Building Plan.pdf",
            "Latest Tax Receipt.pdf",
          ]).map((doc) => (
            <div
              key={doc}
              className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <FaFilePdf className="text-red-600 text-xl" />
                <span className="font-medium">{doc}</span>
              </div>

              <button className="text-blue-600 hover:underline cursor-pointer">
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Description
          </h2>
          <p className="text-gray-600 leading-8">
            {property.description ||
              "No detailed description provided for this property listing. Comprehensive due diligence checks are active to evaluate ownership, tax, and legal status."}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Features
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              [
                "Bedrooms",
                property.bedrooms || "3",
                "bg-blue-50",
                "text-blue-700",
              ],
              [
                "Bathrooms",
                property.bathrooms || "3",
                "bg-green-50",
                "text-green-700",
              ],
              [
                "Parking",
                property.parking || "2 Vehicles",
                "bg-yellow-50",
                "text-yellow-700",
              ],
              [
                "Furnishing",
                property.furnishing || "Semi-Furnished",
                "bg-purple-50",
                "text-purple-700",
              ],
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
            <div
              key={title}
              className="rounded-xl bg-gray-50 p-5 text-center"
            >
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
          className="flex items-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
        >
          <FaHistory />
          Property History
        </button>

        <button
          onClick={() => navigate(`/property-comparison/${property.id}`)}
          className="flex items-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
        >
          <FaChartBar />
          Comparable Properties
        </button>

        <button
          onClick={() => navigate(`/reports/${property.id}`)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
        >
          <FaFileAlt />
          Generate Due Diligence Report
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;