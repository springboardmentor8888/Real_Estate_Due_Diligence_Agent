import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    fetchReviewHistory();
  }, []);

  const fetchReviewHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/purchases/legal/history`,
        {
          headers: getHeaders(),
        },
      );

      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading review history:", error);

      setError(
        error.response?.data?.message || "Unable to load legal review history.",
      );

      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-8 pt-6 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Review History</h1>

        <p className="mt-2 text-gray-500">
          View previously completed legal reviews and their decisions.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Legal Review History
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Approved and rejected buyer purchase requests.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading review history...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No completed legal reviews found.</p>
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => {
              const approved = review.legalStatus === "APPROVED";

              return (
                <div
                  key={review.id}
                  className="p-6 hover:bg-gray-50 transition"
                >
                  {/* Property + Status */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {review.propertyAddress ||
                          `Property #${review.propertyId}`}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {review.city}, {review.state} {review.zipCode}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold w-fit ${
                        approved
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {approved ? "✓ APPROVED" : "✕ REJECTED"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <Info label="Purchase Request ID" value={`#${review.id}`} />

                    <Info label="Property ID" value={`#${review.propertyId}`} />

                    <Info label="Buyer Name" value={review.buyerName} />

                    <Info label="Buyer Email" value={review.buyerEmail} />

                    <Info label="Property Type" value={review.propertyType} />

                    <Info
                      label="Property Price"
                      value={
                        review.price != null
                          ? `₹${Number(review.price).toLocaleString("en-IN")}`
                          : "Not available"
                      }
                    />

                    <Info
                      label="Reviewed By"
                      value={review.legalReviewerName || "Not available"}
                    />

                    <Info
                      label="Reviewed On"
                      value={formatDate(review.legalReviewedAt)}
                    />
                  </div>

                  {/* Status information */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-lg bg-gray-100">
                      <span className="text-xs text-gray-500">
                        Legal Status
                      </span>

                      <p
                        className={`text-sm font-semibold ${
                          approved ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {review.legalStatus}
                      </p>
                    </div>

                    <div className="px-4 py-2 rounded-lg bg-gray-100">
                      <span className="text-xs text-gray-500">
                        Financial Status
                      </span>

                      <p className="text-sm font-semibold text-gray-700">
                        {review.financialStatus || "PENDING"}
                      </p>
                    </div>

                    <div className="px-4 py-2 rounded-lg bg-gray-100">
                      <span className="text-xs text-gray-500">
                        Overall Purchase Status
                      </span>

                      <p className="text-sm font-semibold text-gray-700">
                        {review.status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-xs text-gray-500">{label}</p>

    <p className="text-sm font-semibold text-gray-800 mt-1 break-words">
      {value || "Not available"}
    </p>
  </div>
);

export default ReviewHistory;
