import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaHistory,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import {
  formatDate,
  formatMoney,
  getProperty,
  getPropertyHistory,
  getTaxHistory,
  getPropertyValuation,
  unavailable,
} from "../services/dueDiligenceService";

function PropertyHistory() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [history, setHistory] = useState([]);
  const [taxHistory, setTaxHistory] = useState([]);
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      if (!propertyId) {
        setError("Property ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const [propertyData, historyData, taxHistoryData, valuationData] =
          await Promise.all([
            getProperty(propertyId),
            getPropertyHistory(propertyId),
            getTaxHistory(propertyId),
            getPropertyValuation(propertyId),
          ]);

        if (active) {
          setProperty(propertyData);
          setHistory(historyData || []);
          setTaxHistory(taxHistoryData || []);
          setValuation(valuationData || null);
        }
      } catch {
        if (active)
          setError("Unable to load property history from the backend.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      active = false;
    };
  }, [propertyId]);

  return (
    <div className="px-6 py-8 lg:px-8">
      <button
        onClick={() =>
          navigate(
            propertyId ? `/property-details/${propertyId}` : "/search-property",
          )
        }
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Property History
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {loading ? "Loading history" : unavailable(property?.address)}
        </h1>
        <p className="mt-2 flex items-center gap-2 text-gray-500">
          <FaMapMarkerAlt className="text-red-500" />
          Property ID: {unavailable(propertyId)}
          {property &&
            ` | ${unavailable(property.city)}, ${unavailable(property.state)} ${unavailable(property.zipCode)}`}
        </p>
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="mt-1" />
            <div>
              <p className="font-bold">Unable to retrieve history</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <FaHistory className="mx-auto text-3xl text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            No history records returned
          </h2>
          <p className="mt-2 text-gray-500">
            No data returned from the connected property history source.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* PROPERTY HISTORY / TIMELINE */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-8 flex items-center gap-3 text-xl font-bold text-gray-900">
              <FaHistory className="text-blue-600" />
              Timeline
            </h2>

            {history.length === 0 ? (
              <p className="text-gray-500">
                No property history records available.
              </p>
            ) : (
              <div className="relative border-l-4 border-blue-100 pl-8">
                {history.map((item) => (
                  <article
                    key={item.id || `${item.eventDate}-${item.eventType}`}
                    className="relative mb-9 last:mb-0"
                  >
                    <span className="absolute -left-[43px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600 shadow" />

                    <p className="text-sm font-semibold text-blue-600">
                      {formatDate(item.eventDate)}
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-gray-900">
                      {unavailable(item.eventType)}
                    </h3>

                    <p className="mt-2 max-w-3xl text-gray-600">
                      {unavailable(item.description)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* TAX HISTORY */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-900">
              <FaMoneyBillWave className="text-green-600" />
              Tax History
            </h2>

            {taxHistory.length === 0 ? (
              <p className="text-gray-500">No tax history records available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="px-4 py-3">Tax Year</th>
                      <th className="px-4 py-3">Tax Amount</th>
                      <th className="px-4 py-3">Payment Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {taxHistory.map((tax) => (
                      <tr key={tax.id} className="border-b border-gray-100">
                        <td className="px-4 py-4 font-medium">{tax.taxYear}</td>

                        <td className="px-4 py-4 font-semibold">
                          {formatMoney(tax.taxAmount)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              String(tax.paymentStatus).toUpperCase() === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {unavailable(tax.paymentStatus)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CURRENT VALUATION */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-900">
              <FaChartLine className="text-purple-600" />
              Current Valuation
            </h2>

            {!valuation ? (
              <p className="text-gray-500">
                No valuation information available.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm text-gray-500">Current Market Value</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {formatMoney(valuation.currentMarketValue)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Previous Value</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {formatMoney(valuation.previousMarketValue)}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-gray-500">Growth</p>
                  <p className="mt-2 text-xl font-bold text-green-600">
                    {valuation.growthPercentage != null
                      ? `${valuation.growthPercentage}%`
                      : "Not available"}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-gray-500">Comparable Properties</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {unavailable(valuation.comparablePropertyCount)}
                  </p>
                </div>

                <div className="rounded-xl bg-yellow-50 p-4">
                  <p className="text-sm text-gray-500">Similarity Score</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {valuation.similarityScore != null
                      ? `${valuation.similarityScore}%`
                      : "Not available"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* VALUATION HISTORY */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Valuation History
            </h2>

            {!valuation?.valueHistory || valuation.valueHistory.length === 0 ? (
              <p className="text-gray-500">
                No valuation history records available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">Market Value</th>
                      <th className="px-4 py-3">Source</th>
                    </tr>
                  </thead>

                  <tbody>
                    {valuation.valueHistory.map((item, index) => (
                      <tr
                        key={`${item.year}-${item.source}-${index}`}
                        className="border-b border-gray-100"
                      >
                        <td className="px-4 py-4 font-medium">{item.year}</td>

                        <td className="px-4 py-4 font-semibold">
                          {formatMoney(item.marketValue)}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {unavailable(item.source)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyHistory;
