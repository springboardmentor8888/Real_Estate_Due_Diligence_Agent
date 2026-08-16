import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const FinancialAssessment = () => {
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");

  const [property, setProperty] = useState(null);
  const [ownership, setOwnership] = useState([]);
  const [taxHistory, setTaxHistory] = useState([]);
  const [valuation, setValuation] = useState(null);
  const [assessment, setAssessment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  useEffect(() => {
    fetchPendingPurchases();
  }, []);

  // ---------------------------------------------------------
  // 1. GET PURCHASE REQUESTS WAITING FOR FINANCIAL APPROVAL
  // ---------------------------------------------------------

  const fetchPendingPurchases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/purchases/financial/pending`,
        {
          headers: getHeaders(),
        },
      );

      setPurchases(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading financial pending purchases:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load pending purchase requests.",
      );

      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 2. SELECT PURCHASE -> LOAD COMPLETE PROPERTY INFORMATION
  // ---------------------------------------------------------

  const handlePurchaseSelect = async (purchaseId) => {
    setSelectedPurchaseId(purchaseId);
    setProperty(null);
    setOwnership([]);
    setTaxHistory([]);
    setValuation(null);
    setAssessment(null);
    setMessage("");
    setError("");

    if (!purchaseId) {
      return;
    }

    const purchase = purchases.find(
      (item) => String(item.id) === String(purchaseId),
    );

    if (!purchase) {
      return;
    }

    try {
      setDetailsLoading(true);

      const propertyId = purchase.propertyId;

      const [
        propertyResponse,
        ownershipResponse,
        taxResponse,
        valuationResponse,
        assessmentResponse,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/properties/${propertyId}`, {
          headers: getHeaders(),
        }),

        axios.get(`${API_BASE_URL}/api/ownership/property/${propertyId}`, {
          headers: getHeaders(),
        }),

        axios.get(`${API_BASE_URL}/api/property-tax/property/${propertyId}`, {
          headers: getHeaders(),
        }),

        axios.get(`${API_BASE_URL}/api/properties/${propertyId}/valuation`, {
          headers: getHeaders(),
        }),

        axios.get(
          `${API_BASE_URL}/api/properties/${propertyId}/risk-assessment`,
          {
            headers: getHeaders(),
          },
        ),
      ]);

      setProperty(propertyResponse.data);

      setOwnership(
        Array.isArray(ownershipResponse.data) ? ownershipResponse.data : [],
      );

      setTaxHistory(Array.isArray(taxResponse.data) ? taxResponse.data : []);

      setValuation(valuationResponse.data);

      setAssessment(assessmentResponse.data);
    } catch (error) {
      console.error("Error loading financial review:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load complete property information.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 3. FINANCIAL APPROVE
  // ---------------------------------------------------------

  const handleApprove = async () => {
    if (!selectedPurchaseId) {
      setError("Please select a purchase request.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await axios.put(
        `${API_BASE_URL}/api/purchases/${selectedPurchaseId}/financial/approve`,
        {},
        {
          headers: getHeaders(),
        },
      );

      setMessage("Financial review approved successfully.");

      setSelectedPurchaseId("");
      setProperty(null);
      setOwnership([]);
      setTaxHistory([]);
      setValuation(null);
      setAssessment(null);

      await fetchPendingPurchases();
    } catch (error) {
      console.error("Financial approval failed:", error);

      setError(
        error.response?.data?.message || "Unable to approve financial review.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 4. FINANCIAL REJECT
  // ---------------------------------------------------------

  const handleReject = async () => {
    if (!selectedPurchaseId) {
      setError("Please select a purchase request.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this financial review?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await axios.put(
        `${API_BASE_URL}/api/purchases/${selectedPurchaseId}/financial/reject`,
        {},
        {
          headers: getHeaders(),
        },
      );

      setMessage("Financial review rejected successfully.");

      setSelectedPurchaseId("");
      setProperty(null);
      setOwnership([]);
      setTaxHistory([]);
      setValuation(null);
      setAssessment(null);

      await fetchPendingPurchases();
    } catch (error) {
      console.error("Financial rejection failed:", error);

      setError(
        error.response?.data?.message || "Unable to reject financial review.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------

  const formatMoney = (value) => {
    if (value === null || value === undefined) {
      return "Not available";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRiskClass = (risk) => {
    switch (risk) {
      case "HIGH":
        return "bg-red-100 text-red-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const selectedPurchase = purchases.find(
    (item) => String(item.id) === String(selectedPurchaseId),
  );

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="px-8 pt-5 pb-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Financial Assessment
        </h1>

        <p className="mt-2 text-gray-500">
          Review buyer purchase requests and verify the financial information
          before approval.
        </p>
      </div>

      {/* MESSAGES */}

      {message && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-5 py-4">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4">
          {error}
        </div>
      )}

      {/* PURCHASE REQUEST SELECTION */}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Pending Buyer Requests
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading purchase requests...</p>
        ) : purchases.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <p className="font-semibold text-green-700">
              No pending financial reviews.
            </p>

            <p className="text-sm text-green-600 mt-1">
              All purchase requests have been reviewed.
            </p>
          </div>
        ) : (
          <select
            value={selectedPurchaseId}
            onChange={(e) => handlePurchaseSelect(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Buyer / Purchase Request</option>

            {purchases.map((purchase) => (
              <option key={purchase.id} value={purchase.id}>
                {purchase.buyerName || "Buyer"} —{" "}
                {purchase.propertyAddress || `Property #${purchase.propertyId}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* SELECTED BUYER */}

      {selectedPurchase && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Buyer & Purchase Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Info label="Buyer" value={selectedPurchase.buyerName} />

            <Info label="Buyer Email" value={selectedPurchase.buyerEmail} />

            <Info label="Property" value={selectedPurchase.propertyAddress} />

            <Info
              label="Purchase Price"
              value={formatMoney(selectedPurchase.price)}
            />

            <Info label="Legal Review" value={selectedPurchase.legalStatus} />

            <Info
              label="Financial Review"
              value={selectedPurchase.financialStatus}
            />
          </div>
        </div>
      )}

      {detailsLoading && (
        <div className="bg-white rounded-xl shadow-sm border p-8 mt-6 text-center text-gray-500">
          Loading complete property financial information...
        </div>
      )}

      {/* PROPERTY INFORMATION */}

      {property && !detailsLoading && (
        <>
          {/* PROPERTY */}

          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Property Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Info label="Address" value={property.address} />

              <Info label="City" value={property.city} />

              <Info label="State" value={property.state} />

              <Info label="ZIP Code" value={property.zipCode} />

              <Info label="Property Type" value={property.propertyType} />

              <Info label="Current Price" value={formatMoney(property.price)} />
            </div>
          </div>

          {/* OWNERSHIP */}

          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Ownership History
            </h2>

            {ownership.length === 0 ? (
              <p className="text-gray-500">No ownership records available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-gray-500 text-sm">
                      <th className="pb-3">Owner</th>

                      <th className="pb-3">Purchase Date</th>

                      <th className="pb-3">Purchase Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ownership.map((record) => (
                      <tr key={record.id} className="border-b last:border-none">
                        <td className="py-4 font-medium">{record.ownerName}</td>

                        <td className="py-4 text-gray-600">
                          {formatDate(record.purchaseDate)}
                        </td>

                        <td className="py-4 text-gray-600">
                          {formatMoney(record.purchasePrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* TAX HISTORY */}

          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Property Tax History
            </h2>

            {taxHistory.length === 0 ? (
              <p className="text-gray-500">No tax history available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-gray-500 text-sm">
                      <th className="pb-3">Tax Year</th>

                      <th className="pb-3">Tax Amount</th>

                      <th className="pb-3">Payment Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {taxHistory.map((tax) => (
                      <tr key={tax.id} className="border-b last:border-none">
                        <td className="py-4 font-medium">{tax.taxYear}</td>

                        <td className="py-4">{formatMoney(tax.taxAmount)}</td>

                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              String(tax.paymentStatus || "").toUpperCase() ===
                              "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tax.paymentStatus || "UNKNOWN"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* MARKET VALUE HISTORY */}

          {valuation && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Market Value History
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Historical market value and property growth.
                </p>
              </div>

              {/* SUMMARY */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="bg-blue-50 rounded-lg p-5">
                  <p className="text-sm text-gray-500">Current Market Value</p>

                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {formatMoney(valuation.currentMarketValue)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-5">
                  <p className="text-sm text-gray-500">Previous Market Value</p>

                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {formatMoney(valuation.previousMarketValue)}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-5">
                  <p className="text-sm text-gray-500">Growth</p>

                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {valuation.growthPercentage ?? 0}%
                  </p>
                </div>
              </div>

              {/* HISTORY */}

              {valuation.valueHistory && valuation.valueHistory.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-gray-500 text-sm">
                        <th className="pb-3">Year</th>

                        <th className="pb-3">Market Value</th>

                        <th className="pb-3">Source</th>
                      </tr>
                    </thead>

                    <tbody>
                      {valuation.valueHistory.map((item, index) => (
                        <tr key={index} className="border-b last:border-none">
                          <td className="py-4 font-medium">{item.year}</td>

                          <td className="py-4 font-semibold text-blue-700">
                            {formatMoney(item.marketValue)}
                          </td>

                          <td className="py-4 text-gray-600">
                            {item.source || "Not available"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* RISK ASSESSMENT */}

          {assessment && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Risk Assessment
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Financial risk information
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full font-semibold ${getRiskClass(
                    assessment.overallRisk,
                  )}`}
                >
                  {assessment.overallRisk}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <p className="text-gray-500">Overall Risk Score</p>

                <p className="text-4xl font-bold text-gray-800 mt-1">
                  {assessment.riskScore}/100
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard
                  title="Ownership"
                  score={assessment.ownershipScore}
                />

                <ScoreCard title="Legal" score={assessment.legalScore} />

                <ScoreCard title="Tax" score={assessment.taxScore} />

                <ScoreCard title="Flood" score={assessment.floodScore} />

                <ScoreCard title="Permit" score={assessment.permitScore} />

                <ScoreCard title="Zoning" score={assessment.zoningScore} />
              </div>
            </div>
          )}

          {/* FINANCIAL DECISION */}

          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Financial Review Decision
            </h2>

            <p className="text-gray-500 mt-2">
              Review the buyer, ownership, tax history, market value and risk
              information before making your decision.
            </p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {actionLoading ? "Processing..." : "Approve Financial Review"}
              </button>

              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
              >
                Reject
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>

    <p className="font-semibold text-gray-800 mt-1">
      {value || "Not available"}
    </p>
  </div>
);

const ScoreCard = ({ title, score }) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-gray-500">{title}</p>

    <p className="text-2xl font-bold text-gray-800 mt-1">{score ?? 0}/100</p>
  </div>
);

export default FinancialAssessment;
