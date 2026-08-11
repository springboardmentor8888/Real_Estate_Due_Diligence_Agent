import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBalanceScale,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaFileAlt,
  FaFilePdf,
  FaHistory,
  FaHome,
  FaMapMarkerAlt,
<<<<<<< HEAD
  FaMoneyBillWave,
  FaPhone,
  FaRulerCombined,
  FaSchool,
  FaShoppingCart,
  FaSubway,
  FaUser,
  FaExclamationTriangle,
=======
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

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
  const available = records.length > 0;

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
          {error ? "Unable to retrieve" : available ? "Available" : "Not available"}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {error || (available ? `${records.length} record(s) returned.` : "No data returned from the connected source.")}
      </p>
    </div>
  );
}

function PropertyDetails() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD

  // 1. Initialize state
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!location.state?.property);
=======
  const [property, setProperty] = useState(null);
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diligenceLoading, setDiligenceLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
  const [error, setError] = useState("");

  useEffect(() => {
<<<<<<< HEAD
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
=======
    let active = true;

    async function loadProperty() {
      if (!propertyId) {
        setError("Property ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getProperty(propertyId);
        if (active) setProperty(data);
      } catch {
        if (active) setError("Unable to load property details from the backend.");
      } finally {
        if (active) setLoading(false);
      }
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
    }

    async function loadOverviewSources() {
      try {
        setDiligenceLoading(true);
        const data = await getDueDiligenceBundle(propertyId);
        if (active) setBundle(data);
      } finally {
        if (active) setDiligenceLoading(false);
      }
    }

    loadProperty();
    loadOverviewSources();
    return () => {
      active = false;
    };
  }, [propertyId]);

  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-xl bg-gray-100" />
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
          <h1 className="mt-4 text-2xl font-bold">Property Details Unavailable</h1>
          <p className="mt-2">{error || "No property data returned."}</p>
          <button
            onClick={() => navigate("/search-property")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
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
=======
  const sources = [
    ["Ownership", bundle?.ownership || [], bundle?.errors?.ownership],
    ["Tax", bundle?.tax || [], bundle?.errors?.tax],
    ["Flood", bundle?.flood || [], bundle?.errors?.flood],
    ["Permits", bundle?.permits || [], bundle?.errors?.permits],
    ["Zoning", bundle?.zoning || [], bundle?.errors?.zoning],
    ["Environmental", bundle?.environmental || [], bundle?.errors?.environmental],
  ];

  const handleDownloadFullPdf = async () => {
    try {
      setPdfLoading(true);
      setPdfMessage("Preparing your due diligence report...");
      const reportData = await buildReportData(property.id);
      exportReportToPDF(reportData);
      setPdfMessage("Due diligence report downloaded successfully.");
    } catch {
      setPdfMessage("Unable to download the due diligence report.");
    } finally {
      setPdfLoading(false);
    }
  };
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c

  const risk = property.riskAssessment;

  return (
    <div className="px-6 py-8 lg:px-8">
      <button
        onClick={() => navigate("/search-property")}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
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
<<<<<<< HEAD
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
=======
            <h1 className="text-3xl font-bold text-gray-900">{unavailable(property.address)}</h1>
            <p className="mt-2 flex items-center gap-2 text-gray-500">
              <FaMapMarkerAlt className="text-red-500" />
              {unavailable(property.city)}, {unavailable(property.state)} {unavailable(property.zipCode)}
            </p>
          </div>
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/property-history/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
            >
              <FaHistory />
              Property History
            </button>
            <button
<<<<<<< HEAD
              onClick={() => navigate(`/risk-assessment/${property.id}`, { state: { riskAssessment: property.riskAssessment } })}
              className="mt-2 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer shadow"
=======
              onClick={() => navigate(`/risk-assessment/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
            >
              <FaShieldAlt />
              Risk Assessment
            </button>
            <button
              onClick={() => navigate(`/property-comparison/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
            >
              <FaBalanceScale />
              Compare Property
            </button>
            <button
              onClick={() => navigate(`/report/${property.id}`)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              <FaFileAlt />
              Generate Report
            </button>
            <button
              onClick={handleDownloadFullPdf}
              disabled={pdfLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-400"
            >
              <FaFilePdf />
              {pdfLoading ? "Preparing PDF..." : "Download Full PDF"}
            </button>
          </div>
        </div>
<<<<<<< HEAD

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
=======
        {pdfMessage && (
          <p className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {pdfMessage}
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
          </p>
        )}
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DataTile title="Property ID" value={unavailable(property.id)} icon={<FaClipboardCheck />} />
        <DataTile title="Property Type" value={unavailable(property.propertyType)} icon={<FaHome />} />
        <DataTile title="Price" value={formatMoney(property.price)} icon={<FaClipboardCheck />} />
        <DataTile title="ZIP Code" value={unavailable(property.zipCode)} icon={<FaMapMarkerAlt />} />
        <DataTile title="Created At" value={formatDate(property.createdAt)} icon={<FaHistory />} />
      </section>

<<<<<<< HEAD
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
=======
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Property Overview</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c
          {[
            ["Address", property.address],
            ["City", property.city],
            ["State", property.state],
            ["ZIP Code", property.zipCode],
            ["Property Type", property.propertyType],
            ["Price", formatMoney(property.price)],
            ["Created At", formatDate(property.createdAt)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-gray-100 pb-3">
              <span className="text-gray-500">{label}</span>
              <span className="text-right font-semibold text-gray-900">{unavailable(value)}</span>
            </div>
          ))}
        </div>
      </section>

<<<<<<< HEAD
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
=======
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Due Diligence Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Source availability for this property. Open a workflow action for full details.
            </p>
          </div>
          {diligenceLoading && <span className="text-sm font-semibold text-blue-600">Checking sources...</span>}
        </div>
>>>>>>> 885fa567cad458bd35648e055908ee0119747e6c

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sources.map(([label, records, sourceError]) => (
            <SourceStatus key={label} label={label} records={records} error={sourceError} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default PropertyDetails;
