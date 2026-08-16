import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBalanceScale,
  FaBed,
  FaBath,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaFileAlt,
  FaFilePdf,
  FaHistory,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaRulerCombined,
  FaShieldAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import {
  formatDate,
  formatMoney,
  getDueDiligenceBundle,
  getProperty,
  unavailable,
} from "../services/dueDiligenceService";
import { exportReportToPDF } from "../utils/exportUtils";
import { buildReportData } from "../utils/reportDataBuilder";

function DataTile({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-blue-50 p-3 text-blue-600">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SourceStatus({ label, records, error }) {
  const available = records && records.length > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-gray-800">{label}</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            error
              ? "bg-red-100 text-red-700"
              : available
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
          }`}
        >
          {error
            ? "Unable to retrieve"
            : available
              ? "Available"
              : "Not available"}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {error ||
          (available
            ? `${records.length} record(s) returned.`
            : "No data returned from the connected source.")}
      </p>
    </div>
  );
}

const getUserRole = () => {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const role =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    user.role ||
    "";

  return String(role)
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

function PropertyDetails() {
  const { propertyId, id } = useParams();
  const targetId = id || propertyId;
  const userRole = getUserRole();
  const isBuyer = userRole === "BUYER";
  const navigate = useNavigate();
  const location = useLocation();

  const [property, setProperty] = useState(location.state?.property || null);
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diligenceLoading, setDiligenceLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [buyLoading, setBuyLoading] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [purchaseStatusLoading, setPurchaseStatusLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPropertyAndBundle() {
      if (!targetId) {
        setError("Property ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [propRes, bundleData, purchaseRes] = await Promise.allSettled([
          axios.get(`http://localhost:8080/api/properties/${targetId}`, {
            headers,
          }),

          getDueDiligenceBundle(targetId),

          axios.get(
            `http://localhost:8080/api/purchases/property/${targetId}/status`,
            { headers },
          ),
        ]);

        if (propRes.status === "fulfilled" && propRes.value.data) {
          const propertyData = propRes.value.data;

          if (active) {
            setProperty(propertyData);

            const images = propertyData.imageUrls || [];

            if (images.length > 0) {
              setSelectedImage(images[0]);
            } else if (propertyData.imageUrl) {
              setSelectedImage(propertyData.imageUrl);
            }
          }
        } else {
          const fallbackData = await getProperty(targetId);

          if (active) {
            setProperty(fallbackData);

            const images = fallbackData.imageUrls || [];

            if (images.length > 0) {
              setSelectedImage(images[0]);
            } else if (fallbackData.imageUrl) {
              setSelectedImage(fallbackData.imageUrl);
            }
          }
        }

        if (bundleData.status === "fulfilled" && bundleData.value) {
          if (active) setBundle(bundleData.value);
        }
        if (purchaseRes.status === "fulfilled") {
          if (active) {
            setPurchaseStatus(purchaseRes.value.data);
          }
        }
      } catch (err) {
        console.error("Failed to load property details:", err);
        if (active) setError("Unable to load property details from backend.");
      } finally {
        if (active) {
          setLoading(false);
          setDiligenceLoading(false);
          setPurchaseStatusLoading(false);
        }
      }
    }

    loadPropertyAndBundle();
    return () => {
      active = false;
    };
  }, [targetId]);

  const handleBuyProperty = async () => {
    try {
      setBuyLoading(true);
      setPurchaseStatus(null);

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await axios.post(
        `http://localhost:8080/api/purchases/property/${targetId}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      setPurchaseStatus(response.data);

      alert(
        "Purchase request submitted successfully. It is now pending Legal and Financial approval.",
      );
    } catch (error) {
      console.error("Purchase request failed:", error);

      alert(
        error.response?.data?.message || "Unable to submit purchase request.",
      );
    } finally {
      setBuyLoading(false);
    }
  };

  const handleDownloadFullPdf = async () => {
    try {
      setPdfLoading(true);
      setPdfMessage("Preparing your due diligence report...");
      const reportData = await buildReportData(targetId);
      exportReportToPDF(reportData);
      setPdfMessage("Due diligence report downloaded successfully.");
    } catch (err) {
      console.error("PDF Export error:", err);
      setPdfMessage("Unable to download the due diligence report.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="px-8 py-10">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
          <FaExclamationTriangle className="mx-auto text-3xl" />
          <h1 className="mt-4 text-2xl font-bold">
            Property Details Unavailable
          </h1>
          <p className="mt-2">{error || "No property data returned."}</p>
          <button
            onClick={() => navigate("/search-property")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const sources = [
    ["Ownership", bundle?.ownership || [], bundle?.errors?.ownership],
    ["Tax", bundle?.tax || [], bundle?.errors?.tax],
    ["Flood", bundle?.flood || [], bundle?.errors?.flood],
    ["Permits", bundle?.permits || [], bundle?.errors?.permits],
    ["Zoning", bundle?.zoning || [], bundle?.errors?.zoning],
    [
      "Environmental",
      bundle?.environmental || [],
      bundle?.errors?.environmental,
    ],
  ];

  const risk = bundle?.riskAssessment || property.riskAssessment;

  return (
    <div className="px-6 py-8 lg:px-8">
      <button
        onClick={() => navigate("/search-property")}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer"
      >
        <FaArrowLeft />
        Back to Search
      </button>

      <header className="sticky top-0 z-10 -mx-6 border-b border-gray-200 bg-gray-50/95 px-6 py-5 backdrop-blur lg:-mx-8 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Property Details
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {unavailable(property.address)}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-gray-500">
              <FaMapMarkerAlt className="text-red-500" />
              {unavailable(property.city)}, {unavailable(property.state)}{" "}
              {unavailable(property.zipCode || property.pincode)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isBuyer && !purchaseStatusLoading && (
              <>
                {!purchaseStatus ? (
                  <button
                    onClick={handleBuyProperty}
                    disabled={buyLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                  >
                    <FaShoppingCart />
                    {buyLoading ? "Submitting..." : "Buy Property"}
                  </button>
                ) : purchaseStatus.status === "COMPLETED" ? (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5 font-semibold text-gray-600">
                    Sold
                  </span>
                ) : purchaseStatus.status === "PENDING" ? (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2.5 font-semibold text-yellow-700">
                    Purchase Pending
                  </span>
                ) : (
                  <button
                    onClick={handleBuyProperty}
                    disabled={buyLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50 cursor-pointer transition"
                  >
                    <FaShoppingCart />
                    {buyLoading ? "Submitting..." : "Buy Property"}
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => navigate(`/property-history/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer transition"
            >
              <FaHistory />
              Property History
            </button>
            <button
              onClick={() =>
                navigate(`/risk-assessment/${property.id}`, {
                  state: { riskAssessment: risk },
                })
              }
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer transition"
            >
              <FaShieldAlt />
              Risk Assessment
            </button>
            <button
              onClick={() => navigate(`/property-comparison/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer transition"
            >
              <FaBalanceScale />
              Compare Property
            </button>
            <button
              onClick={() => navigate(`/reports/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 cursor-pointer transition"
            >
              <FaFileAlt />
              Generate Report
            </button>
            <button
              onClick={handleDownloadFullPdf}
              disabled={pdfLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-400 cursor-pointer transition"
            >
              <FaFilePdf />
              {pdfLoading ? "Preparing PDF..." : "Download Full PDF"}
            </button>
          </div>
        </div>

        {pdfMessage && (
          <p className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {pdfMessage}
          </p>
        )}
      </header>

      {purchaseStatus && (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Purchase Request</p>

              <p className="mt-1 text-sm text-gray-600">
                Legal Review:{" "}
                <span className="font-semibold">
                  {purchaseStatus.legalStatus}
                </span>
              </p>

              <p className="text-sm text-gray-600">
                Financial Review:{" "}
                <span className="font-semibold">
                  {purchaseStatus.financialStatus}
                </span>
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                purchaseStatus.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : purchaseStatus.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {purchaseStatus.status}
            </span>
          </div>

          {/* COMPLETED PURCHASE MESSAGE */}
          {purchaseStatus.status === "COMPLETED" && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-4">
              <p className="font-semibold text-green-800">
                Purchase Request Approved
              </p>

              <p className="mt-1 text-sm leading-6 text-green-700">
                Your property purchase request has been approved by both the
                Legal Reviewer and Financial Institution. Our Real Estate Agent
                or Administrator will contact you shortly to proceed with the
                further purchase process.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PROPERTY IMAGE GALLERY */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Property Images
        </h2>

        {(() => {
          const images =
            property.imageUrls?.length > 0
              ? property.imageUrls
              : property.imageUrl
                ? [property.imageUrl]
                : [];

          if (images.length === 0) {
            return (
              <div className="h-80 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                No property images available
              </div>
            );
          }

          return (
            <>
              {/* MAIN IMAGE */}
              <div className="w-full flex justify-center">
                <img
                  src={selectedImage || images[0]}
                  alt="Main Property"
                  className="w-full max-w-4xl h-[450px] object-cover rounded-xl border shadow-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5 max-w-4xl mx-auto">
                {images
                  .filter((image) => image !== selectedImage)
                  .slice(0, 3)
                  .map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className="rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition"
                    >
                      <img
                        src={image}
                        alt={`Property thumbnail ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </button>
                  ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* SUMMARY DATA TILES */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"></section>

      {/* SUMMARY DATA TILES */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <DataTile
          title="Property ID"
          value={unavailable(property.id ? `#${property.id}` : null)}
          icon={<FaClipboardCheck />}
        />
        <DataTile
          title="Property Type"
          value={unavailable(property.propertyType || property.property_type)}
          icon={<FaHome />}
        />
        <DataTile
          title="Market Value"
          value={formatMoney(property.price || property.marketValue)}
          icon={<FaMoneyBillWave />}
        />
        <DataTile
          title="Bedrooms"
          value={unavailable(
            property.bedrooms != null ? `${property.bedrooms} Beds` : null,
          )}
          icon={<FaBed />}
        />
        <DataTile
          title="Bathrooms"
          value={unavailable(
            property.bathrooms != null ? `${property.bathrooms} Baths` : null,
          )}
          icon={<FaBath />}
        />
        <DataTile
          title="Area / Square Feet"
          value={unavailable(
            property.area ||
              (property.sqft ? `${property.sqft} sqft` : null) ||
              (property.squareFeet ? `${property.squareFeet} sqft` : null),
          )}
          icon={<FaRulerCombined />}
        />
      </section>

      {/* DETAILED OVERVIEW TABLE */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Property Overview</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Address", property.address],
            ["City", property.city],
            ["State", property.state],
            ["ZIP Code", property.zipCode || property.pincode],
            ["Property Type", property.propertyType || property.property_type],
            [
              "Bedrooms",
              property.bedrooms != null
                ? `${property.bedrooms} Bedrooms`
                : null,
            ],
            [
              "Bathrooms",
              property.bathrooms != null
                ? `${property.bathrooms} Bathrooms`
                : null,
            ],
            ["Survey Number", property.surveyNo || property.survey_no],
            [
              "Registration No.",
              property.registrationNo || property.registration_no,
            ],
            [
              "Price / Market Value",
              formatMoney(property.price || property.marketValue),
            ],
            ["Created At", formatDate(property.createdAt)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4 border-b border-gray-100 pb-3"
            >
              <span className="text-gray-500">{label}</span>
              <span className="text-right font-semibold text-gray-900">
                {unavailable(value)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* DUE DILIGENCE OVERVIEW */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Due Diligence Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Source availability for this property. Click action buttons above
              for detailed workflows.
            </p>
          </div>
          {diligenceLoading && (
            <span className="text-sm font-semibold text-blue-600">
              Checking sources...
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sources.map(([label, records, sourceError]) => (
            <SourceStatus
              key={label}
              label={label}
              records={records}
              error={sourceError}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default PropertyDetails;
