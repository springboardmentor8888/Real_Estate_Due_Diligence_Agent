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
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import { formatCurrency } from "../data/comparableData";

const DEFAULT_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80";

const PropertyDetails = () => {
  const { id, propertyId } = useParams();
  const targetId = id || propertyId;
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Initialize state
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!location.state?.property);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState({});

  useEffect(() => {
    // 2. Always fetch fresh nested details from backend
    if (targetId) {
      fetchPropertyFromBackend(targetId);
    }
  }, [targetId]);

  const fetchPropertyFromBackend = async (propId) => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 🚀 Concurrent requests across all 6 backend modules
      const [propRes, zoningRes, ownershipRes, historyRes, taxRes, riskRes] =
        await Promise.allSettled([
          axios.get(`http://localhost:8080/api/properties/${propId}`, {
            headers,
          }),
          axios.get(`http://localhost:8080/api/zoning/property/${propId}`, {
            headers,
          }),
          axios.get(`http://localhost:8080/api/ownership/property/${propId}`, {
            headers,
          }),
          axios.get(`http://localhost:8080/api/property-history/${propId}`, {
            headers,
          }),
          axios.get(`http://localhost:8080/api/property-tax/property/${propId}`, {
            headers,
          }),
          axios.get(`http://localhost:8080/api/properties/${propId}/risk-assessment`, {
            headers,
          }),
        ]);

      // Extract fresh API data to override location.state cache
      let propertyData =
        propRes.status === "fulfilled" && propRes.value.data
          ? propRes.value.data
          : location.state?.property || {};

      if (zoningRes.status === "fulfilled" && zoningRes.value.data) {
        propertyData = {
          ...propertyData,
          zoningList: zoningRes.value.data,
        };
      }

      if (ownershipRes.status === "fulfilled" && ownershipRes.value.data) {
        propertyData = {
          ...propertyData,
          ownershipList: ownershipRes.value.data,
        };
      }

      if (historyRes.status === "fulfilled" && historyRes.value.data) {
        propertyData = {
          ...propertyData,
          historyList: historyRes.value.data,
        };
      }

      if (taxRes.status === "fulfilled" && taxRes.value.data) {
        propertyData = {
          ...propertyData,
          taxList: taxRes.value.data,
        };
      }

      if (riskRes.status === "fulfilled" && riskRes.value.data) {
        propertyData = {
          ...propertyData,
          riskAssessment: riskRes.value.data,
        };
      }

      setProperty(propertyData);
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

  const propertyImages =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls
      : property.images && property.images.length > 0
      ? property.images
      : property.imageUrl
      ? [property.imageUrl]
      : property.image
      ? [property.image]
      : [DEFAULT_PROPERTY_IMAGE];

  const selectedImage =
    selectedImages[property.id] || propertyImages[0] || DEFAULT_PROPERTY_IMAGE;

  const displayPrice =
    property.marketValue ||
    (property.price
      ? typeof property.price === "number"
        ? formatCurrency(property.price)
        : property.price
      : "N/A");

  const risk = property.riskAssessment;

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
              {property.propertyType || property.property_type || property.type || "Residential"}
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
                (property.sqft ? `${property.sqft} sqft` : null) ||
                (property.squareFeet ? `${property.squareFeet} sqft` : "N/A")}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaShieldAlt className={`text-3xl ${
            risk?.overallRisk === "LOW" ? "text-green-600" :
            risk?.overallRisk === "HIGH" ? "text-red-600" : "text-yellow-600"
          }`} />
          <div>
            <p className="text-gray-500 text-sm">Risk Assessment</p>
            <h3 className="font-bold">
              {risk?.overallRisk
                ? `${risk.overallRisk} (${risk.riskScore ?? 0}/100)`
                : "PENDING"}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Real Property Information with Key Fallbacks */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Information
          </h2>

          <div className="space-y-5">
            {[
              ["Property ID", property.id ? `#${property.id}` : "N/A"],
              [
                "Property Type",
                property.propertyType || property.property_type || property.type || "Residential",
              ],
              [
                "Survey Number",
                property.surveyNo || property.survey_no || property.surveyNumber || "N/A",
              ],
              [
                "Registration No.",
                property.registrationNo || property.registration_no || property.registrationNumber || "N/A",
              ],
              [
                "Registration Date",
                property.registrationDate ||
                  property.registration_date ||
                  (property.createdAt
                    ? new Date(property.createdAt).toLocaleDateString()
                    : "N/A"),
              ],
              [
                "Area",
                property.area ||
                  (property.sqft ? `${property.sqft} sqft` : null) ||
                  (property.squareFeet ? `${property.squareFeet} sqft` : "N/A"),
              ],
              [
                "Pincode",
                property.pincode || property.zipCode || property.zip_code || "N/A",
              ],
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

        {/* Dynamic Owner Details mapped to OwnershipRecordResponse */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaUser className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Ownership History
            </h2>
          </div>

          {property.ownershipList && property.ownershipList.length > 0 ? (
            <div className="space-y-4">
              {property.ownershipList.map((record, idx) => (
                <div
                  key={record.id || idx}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                      Owner Name
                    </span>
                    <span className="font-bold text-gray-800 text-sm">
                      {record.ownerName || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-200 pb-2 gap-4">
                    <span className="text-gray-500 text-sm">Purchase Date</span>
                    <span className="font-medium text-gray-800 text-right text-sm">
                      {record.purchaseDate
                        ? new Date(record.purchaseDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 text-sm">Purchase Price</span>
                    <span className="font-bold text-green-700 text-right text-sm">
                      {record.purchasePrice
                        ? formatCurrency(record.purchasePrice)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No ownership history records found for this property.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Real Due Diligence & Risk Assessment Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaShieldAlt className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Due Diligence Status
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-gray-600 font-medium">Risk Score</span>
              <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase ${
                risk?.overallRisk === "LOW" ? "bg-green-100 text-green-800" :
                risk?.overallRisk === "HIGH" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {risk?.riskScore != null ? `${risk.riskScore} / 100 (${risk.overallRisk})` : "Audit Pending"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-gray-600 font-medium">Title & Ownership</span>
              <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase ${
                property.ownershipList && property.ownershipList.length > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {property.ownershipList && property.ownershipList.length > 0 ? "Verified" : "Pending Verification"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-gray-600 font-medium">Zoning Compliance</span>
              <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase ${
                property.zoningList && property.zoningList.length > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {property.zoningList && property.zoningList.length > 0 ? "Compliant" : "Pending Audit"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-gray-600 font-medium">Tax Clearance</span>
              <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase ${
                property.taxList && property.taxList.length > 0 && property.taxList[0].paymentStatus === "PAID"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {property.taxList && property.taxList.length > 0 ? property.taxList[0].paymentStatus : "Unverified"}
              </span>
            </div>

            {risk?.recommendation && (
              <div className="mt-4 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                  Recommendation
                </p>
                <p className="text-sm text-blue-950 font-medium leading-relaxed">{risk.recommendation}</p>
              </div>
            )}

            <button
              onClick={() => navigate(`/risk-assessment/${property.id}`, { state: { riskAssessment: property.riskAssessment } })}
              className="mt-2 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer shadow"
            >
              Open Detailed Risk Assessment
            </button>
          </div>
        </div>

        {/* Dynamic Zoning Information mapped to backend List<ZoningInfoResponse> */}
        <div className="bg-white rounded-2xl shadow p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FaMapMarkedAlt className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Zoning Information
            </h2>
          </div>

          {property.zoningList && property.zoningList.length > 0 ? (
            <div className="space-y-4">
              {property.zoningList.map((zoning, idx) => (
                <div
                  key={zoning.id || idx}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
                      Zoning Code
                    </span>
                    <span className="font-bold text-gray-800 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {zoning.zoningCode || zoning.zoning_code || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-200 pb-2 gap-4">
                    <span className="text-gray-500 text-sm">Description</span>
                    <span className="font-medium text-gray-800 text-right text-sm">
                      {zoning.zoningDescription || zoning.zoning_description || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 text-sm">Permitted Use</span>
                    <span className="font-medium text-green-700 text-right text-sm">
                      {zoning.permittedUse || zoning.permitted_use || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No zoning records found for this property.</p>
            </div>
          )}
        </div>
      </div>

      {/* Real Property Tax Assessment Card */}
      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <FaMoneyBillWave className="text-2xl text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Property Tax Assessment
          </h2>
        </div>

        {property.taxList && property.taxList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.taxList.map((tax, idx) => (
              <div
                key={tax.id || idx}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3"
              >
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                    Tax Year
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {tax.taxYear || tax.tax_year || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-2 gap-4">
                  <span className="text-gray-500 text-sm">Assessed Amount</span>
                  <span className="font-bold text-gray-800 text-right text-sm">
                    {tax.taxAmount || tax.tax_amount
                      ? formatCurrency(tax.taxAmount || tax.tax_amount)
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-500 text-sm">Payment Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      tax.paymentStatus === "PAID" || tax.payment_status === "PAID" || tax.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tax.paymentStatus || tax.payment_status || "UNPAID"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">No tax history records found for this property.</p>
          </div>
        )}
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
                property.bedrooms || "N/A",
                "bg-blue-50",
                "text-blue-700",
              ],
              [
                "Bathrooms",
                property.bathrooms || "N/A",
                "bg-green-50",
                "text-green-700",
              ],
              [
                "Parking",
                property.parking || "N/A",
                "bg-yellow-50",
                "text-yellow-700",
              ],
              [
                "Furnishing",
                property.furnishing || "N/A",
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
          onClick={() =>
            navigate(`/property-history/${property.id}`, {
              state: { historyList: property.historyList, address: property.address },
            })
          }
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