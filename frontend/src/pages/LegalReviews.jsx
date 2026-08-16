import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080";

function LegalReviews() {
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");

  const [purchase, setPurchase] = useState(null);
  const [property, setProperty] = useState(null);

  const [riskAssessment, setRiskAssessment] = useState(null);
  const [ownership, setOwnership] = useState([]);
  const [taxHistory, setTaxHistory] = useState([]);
  const [valuation, setValuation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  // --------------------------------------------------
  // Load pending legal purchase requests
  // --------------------------------------------------

  useEffect(() => {
    fetchPendingPurchases();
  }, []);

  const fetchPendingPurchases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API}/api/purchases/legal/pending`, {
        headers: getHeaders(),
      });

      const data = Array.isArray(response.data) ? response.data : [];

      setPurchases(data);

      // Automatically select first pending request
      if (data.length > 0) {
        setSelectedPurchaseId(String(data[0].id));
      } else {
        setSelectedPurchaseId("");
      }
    } catch (err) {
      console.error("Error loading legal reviews:", err);
      setError("Unable to load pending legal reviews.");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // When buyer / purchase is selected
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedPurchaseId) {
      setPurchase(null);
      setProperty(null);
      setRiskAssessment(null);
      setOwnership([]);
      setTaxHistory([]);
      setValuation(null);
      return;
    }

    const selected = purchases.find(
      (item) => String(item.id) === String(selectedPurchaseId),
    );

    if (selected) {
      setPurchase(selected);
      loadPropertyInformation(selected.propertyId);
    }
  }, [selectedPurchaseId, purchases]);

  // --------------------------------------------------
  // Load all property information
  // --------------------------------------------------

  const loadPropertyInformation = async (propertyId) => {
    try {
      setDetailsLoading(true);
      setError("");
      setSuccess("");

      const headers = {
        headers: getHeaders(),
      };

      const [
        propertyResponse,
        riskResponse,
        ownershipResponse,
        taxResponse,
        valuationResponse,
      ] = await Promise.all([
        axios.get(`${API}/api/properties/${propertyId}`, headers),

        axios.get(
          `${API}/api/properties/${propertyId}/risk-assessment`,
          headers,
        ),

        axios.get(`${API}/api/ownership/property/${propertyId}`, headers),

        axios.get(`${API}/api/property-tax/property/${propertyId}`, headers),

        axios.get(`${API}/api/properties/${propertyId}/valuation`, headers),
      ]);

      setProperty(propertyResponse.data);
      setRiskAssessment(riskResponse.data);

      setOwnership(
        Array.isArray(ownershipResponse.data) ? ownershipResponse.data : [],
      );

      setTaxHistory(Array.isArray(taxResponse.data) ? taxResponse.data : []);

      setValuation(valuationResponse.data);
    } catch (err) {
      console.error("Error loading legal review information:", err);

      setError("Unable to load complete property review information.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // --------------------------------------------------
  // Approve legal review
  // --------------------------------------------------

  const handleApprove = async () => {
    if (!purchase) return;

    const confirmed = window.confirm(
      "Are you sure you want to approve this legal review?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await axios.put(
        `${API}/api/purchases/${purchase.id}/legal/approve`,
        {},
        {
          headers: getHeaders(),
        },
      );

      setSuccess("Legal review approved successfully.");

      // Refresh pending requests
      await fetchPendingPurchases();

      setPurchase(null);
      setProperty(null);
      setRiskAssessment(null);
      setOwnership([]);
      setTaxHistory([]);
      setValuation(null);
    } catch (err) {
      console.error("Error approving legal review:", err);

      setError(
        err.response?.data?.message || "Unable to approve legal review.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // Reject legal review
  // --------------------------------------------------

  const handleReject = async () => {
    if (!purchase) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject this legal review?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await axios.put(
        `${API}/api/purchases/${purchase.id}/legal/reject`,
        {},
        {
          headers: getHeaders(),
        },
      );

      setSuccess("Legal review rejected successfully.");

      await fetchPendingPurchases();

      setPurchase(null);
      setProperty(null);
      setRiskAssessment(null);
      setOwnership([]);
      setTaxHistory([]);
      setValuation(null);
    } catch (err) {
      console.error("Error rejecting legal review:", err);

      setError(err.response?.data?.message || "Unable to reject legal review.");
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // Risk color
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="px-8 pt-6 pb-8">
        <h1 className="text-3xl font-bold text-gray-800">Legal Reviews</h1>

        <p className="mt-2 text-gray-500">
          Review and verify legal information for properties.
        </p>

        <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
          <p className="text-gray-500">Loading pending legal reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 pt-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Legal Reviews</h1>

        <p className="mt-2 text-gray-500">
          Review and verify legal and due-diligence information before approving
          the buyer's purchase request.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {success}
        </div>
      )}

      {/* Pending Purchase Selection */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Pending Legal Reviews
        </h2>

        {purchases.length === 0 ? (
          <p className="mt-4 text-gray-500">
            No pending legal reviews available.
          </p>
        ) : (
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Buyer / Purchase Request
            </label>

            <select
              value={selectedPurchaseId}
              onChange={(e) => setSelectedPurchaseId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {purchases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.buyerName} — {item.propertyAddress}
                  {item.city ? `, ${item.city}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Buyer */}
      {purchase && (
        <>
          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Buyer Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <InfoItem label="Buyer" value={purchase.buyerName} />

              <InfoItem label="Email" value={purchase.buyerEmail} />

              <InfoItem label="Legal Status" value={purchase.legalStatus} />

              <InfoItem
                label="Financial Status"
                value={purchase.financialStatus}
              />
            </div>
          </div>

          {detailsLoading ? (
            <div className="mt-6 rounded-xl border bg-white p-8 shadow-sm">
              <p className="text-gray-500">
                Loading property risk and evidence...
              </p>
            </div>
          ) : (
            <>
              {/* Property Information */}
              {property && (
                <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Property Information
                  </h2>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <InfoItem label="Address" value={property.address} />

                    <InfoItem label="City" value={property.city} />

                    <InfoItem label="State" value={property.state} />

                    <InfoItem
                      label="Property Type"
                      value={property.propertyType}
                    />

                    <InfoItem
                      label="Price"
                      value={
                        property.price != null
                          ? `₹${Number(property.price).toLocaleString("en-IN")}`
                          : "N/A"
                      }
                    />

                    <InfoItem label="Area" value={property.area} />

                    <InfoItem label="Bedrooms" value={property.bedrooms} />

                    <InfoItem label="Bathrooms" value={property.bathrooms} />

                    <InfoItem label="Survey Number" value={property.surveyNo} />

                    <InfoItem
                      label="Registration Number"
                      value={property.registrationNo}
                    />
                  </div>
                </div>
              )}

              {/* Risk Assessment */}
              {riskAssessment && (
                <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Risk Assessment
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Review the overall due-diligence risk before approving
                        the purchase.
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 font-semibold ${getRiskClass(
                        riskAssessment.overallRisk,
                      )}`}
                    >
                      {riskAssessment.overallRisk}
                    </span>
                  </div>

                  {/* Overall Score */}
                  <div className="mt-6 rounded-lg bg-gray-50 p-5">
                    <p className="text-gray-500">Overall Risk Score</p>

                    <p className="mt-1 text-4xl font-bold text-gray-800">
                      {riskAssessment.riskScore ?? 0}/100
                    </p>
                  </div>

                  {/* Scores */}
                  <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
                    <ScoreCard
                      title="Ownership"
                      score={riskAssessment.ownershipScore}
                    />

                    <ScoreCard
                      title="Legal"
                      score={riskAssessment.legalScore}
                    />

                    <ScoreCard title="Tax" score={riskAssessment.taxScore} />

                    <ScoreCard
                      title="Flood"
                      score={riskAssessment.floodScore}
                    />

                    <ScoreCard
                      title="Permit"
                      score={riskAssessment.permitScore}
                    />

                    <ScoreCard
                      title="Zoning"
                      score={riskAssessment.zoningScore}
                    />
                  </div>

                  {/* Risk Factors */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Risk Factors
                    </h3>

                    {riskAssessment.riskFactors?.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {riskAssessment.riskFactors.map((factor, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800"
                          >
                            {factor}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-gray-500">
                        No significant risk factors identified.
                      </p>
                    )}
                  </div>

                  {/* Recommendation */}
                  {riskAssessment.recommendation && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Recommendation
                      </h3>

                      <div className="mt-3 rounded-lg bg-blue-50 px-5 py-4 text-blue-800">
                        {riskAssessment.recommendation}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ownership + Tax */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Ownership */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Ownership History
                    </h2>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      {ownership.length} Records
                    </span>
                  </div>

                  {ownership.length === 0 ? (
                    <p className="mt-4 text-gray-500">
                      No ownership records available.
                    </p>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {ownership.map((record) => (
                        <div
                          key={record.id}
                          className="rounded-lg bg-gray-50 p-4"
                        >
                          <InfoRow label="Owner" value={record.ownerName} />

                          <InfoRow
                            label="Purchase Date"
                            value={record.purchaseDate}
                          />

                          <InfoRow
                            label="Historical Purchase Price"
                            value={
                              record.purchasePrice != null
                                ? `₹${Number(
                                    record.purchasePrice,
                                  ).toLocaleString("en-IN")}`
                                : "N/A"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tax */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Property Tax History
                    </h2>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      {taxHistory.length} Records
                    </span>
                  </div>

                  {taxHistory.length === 0 ? (
                    <p className="mt-4 text-gray-500">
                      No tax records available.
                    </p>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {taxHistory.map((tax) => (
                        <div key={tax.id} className="rounded-lg bg-gray-50 p-4">
                          <InfoRow label="Tax Year" value={tax.taxYear} />

                          <InfoRow
                            label="Tax Amount"
                            value={
                              tax.taxAmount != null
                                ? `₹${Number(tax.taxAmount).toLocaleString(
                                    "en-IN",
                                  )}`
                                : "N/A"
                            }
                          />

                          <InfoRow
                            label="Payment Status"
                            value={tax.paymentStatus}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Market Value History */}
              {valuation && (
                <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Market Value History
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Historical property valuation and market growth.
                      </p>
                    </div>

                    {valuation.currentMarketValue && (
                      <div className="rounded-lg bg-blue-50 px-5 py-3">
                        <p className="text-sm text-gray-500">
                          Current Market Value
                        </p>

                        <p className="text-xl font-bold text-blue-700">
                          ₹
                          {Number(valuation.currentMarketValue).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Growth */}
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoItem
                      label="Previous Market Value"
                      value={
                        valuation.previousMarketValue
                          ? `₹${Number(
                              valuation.previousMarketValue,
                            ).toLocaleString("en-IN")}`
                          : "N/A"
                      }
                    />

                    <InfoItem
                      label="Growth"
                      value={
                        valuation.growthPercentage != null
                          ? `${valuation.growthPercentage}%`
                          : "N/A"
                      }
                    />

                    <InfoItem
                      label="Comparable Properties"
                      value={valuation.comparablePropertyCount ?? 0}
                    />
                  </div>

                  {/* History Table */}
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                            Year
                          </th>

                          <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                            Market Value
                          </th>

                          <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                            Source
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {valuation.valueHistory?.map((item, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="px-4 py-3">{item.year}</td>

                            <td className="px-4 py-3 font-medium">
                              ₹
                              {Number(item.marketValue).toLocaleString("en-IN")}
                            </td>

                            <td className="px-4 py-3 text-gray-500">
                              {item.source || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Final Decision */}
              <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800">
                  Legal Review Decision
                </h2>

                <p className="mt-2 text-gray-500">
                  After reviewing the property information, risk assessment,
                  ownership and tax records, choose whether to approve or reject
                  this purchase request.
                </p>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {actionLoading ? "Processing..." : "✓ Approve Legal Review"}
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {actionLoading ? "Processing..." : "✕ Reject Legal Review"}
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// --------------------------------------------------
// Small reusable components
// --------------------------------------------------

const InfoItem = ({ label, value }) => (
  <div className="rounded-lg bg-gray-50 p-4">
    <p className="text-sm text-gray-500">{label}</p>

    <p className="mt-1 break-words font-semibold text-gray-800">
      {value ?? "N/A"}
    </p>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-gray-200 py-2 last:border-b-0">
    <span className="text-gray-500">{label}</span>

    <span className="text-right font-medium text-gray-800">
      {value ?? "N/A"}
    </span>
  </div>
);

const ScoreCard = ({ title, score }) => (
  <div className="rounded-lg border p-4">
    <p className="text-sm text-gray-500">{title}</p>

    <p className="mt-1 text-2xl font-bold text-gray-800">{score ?? 0}/100</p>
  </div>
);

export default LegalReviews;
