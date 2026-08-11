import { useEffect, useState } from "react";
import { FaArrowLeft, FaExclamationTriangle, FaHistory, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import {
  formatDate,
  getProperty,
  getPropertyHistory,
  unavailable,
} from "../services/dueDiligenceService";

function PropertyHistory() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [history, setHistory] = useState([]);
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
        const [propertyData, historyData] = await Promise.all([
          getProperty(propertyId),
          getPropertyHistory(propertyId),
        ]);

        if (active) {
          setProperty(propertyData);
          setHistory(historyData);
        }
      } catch {
        if (active) setError("Unable to load property history from the backend.");
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
        onClick={() => navigate(propertyId ? `/property-details/${propertyId}` : "/search-property")}
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
          {property && ` | ${unavailable(property.city)}, ${unavailable(property.state)} ${unavailable(property.zipCode)}`}
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
          <h2 className="mt-4 text-xl font-bold text-gray-900">No history records returned</h2>
          <p className="mt-2 text-gray-500">
            No data returned from the connected property history source.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-8 flex items-center gap-3 text-xl font-bold text-gray-900">
            <FaHistory className="text-blue-600" />
            Timeline
          </h2>

          <div className="relative border-l-4 border-blue-100 pl-8">
            {history.map((item) => (
              <article key={item.id || `${item.eventDate}-${item.eventType}`} className="relative mb-9 last:mb-0">
                <span className="absolute -left-[43px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600 shadow" />
                <p className="text-sm font-semibold text-blue-600">{formatDate(item.eventDate)}</p>
                <h3 className="mt-1 text-lg font-bold text-gray-900">{unavailable(item.eventType)}</h3>
                <p className="mt-2 max-w-3xl text-gray-600">{unavailable(item.description)}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyHistory;
