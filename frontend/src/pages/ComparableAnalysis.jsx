import {
  FaArrowLeft,
  FaBalanceScale,
  FaChartBar,
  FaHome,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import ComparableListingCard from "../components/comparable/ComparableListingCard";
import MarketTrendChart from "../components/comparable/MarketTrendChart";
import ValuationComparisonChart from "../components/comparable/ValuationComparisonChart";
import ValueHistoryChart from "../components/comparable/ValueHistoryChart";
import StatCard from "../components/common/StatCard";
import {
  formatCompactCurrency,
  formatCurrency,
  getComparableListings,
  getMarketTrend,
  getValuationComparisonData,
  getValuationSummary,
  getValueHistory,
} from "../data/comparableData";
import { getPropertyById } from "../data/propertyData";

const ComparableAnalysis = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const property = getPropertyById(propertyId);
  const valuation = getValuationSummary(property.id);
  const comparableListings = getComparableListings(property.id);
  const isAboveMarket = valuation.percentDiff >= 0;

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(`/property-details/${property.id}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Comparable Property Analysis
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Market benchmarking for {property.title} against nearby comparable properties.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8 transition duration-300 hover:shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={property.image}
              alt={property.title}
              className="h-24 w-32 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>
              <p className="text-gray-500 mt-1">{property.address}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/property-comparison/${property.id}`)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <FaBalanceScale />
            Compare with Another Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<FaMapMarkerAlt />}
          title="Avg. Nearby Price"
          value={formatCompactCurrency(valuation.avgComparablePrice)}
          change="Based on verified listings"
          changeColor="text-blue-600"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon={<FaChartBar />}
          title="Price vs Market"
          value={valuation.positionLabel}
          change={formatCurrency(valuation.currentPrice)}
          changeColor={isAboveMarket ? "text-red-600" : "text-green-600"}
          iconBg={isAboveMarket ? "bg-red-100" : "bg-green-100"}
          iconColor={isAboveMarket ? "text-red-600" : "text-green-600"}
        />

        <StatCard
          icon={<FaHome />}
          title="Comparable Properties Found"
          value={valuation.comparableCount}
          change="Within selected market radius"
          changeColor="text-green-600"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Market Trends
          </h2>
          <MarketTrendChart data={getMarketTrend(property.id)} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Property Value History
          </h2>
          <ValueHistoryChart data={getValueHistory(property.id)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Valuation Comparison
        </h2>
        <ValuationComparisonChart data={getValuationComparisonData(property.id)} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nearby Listings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparableListings.map((listing) => (
            <ComparableListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10 flex-wrap">
        <button
          onClick={() => navigate(`/property-comparison/${property.id}`)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          <FaBalanceScale />
          Search Property to Compare
        </button>

        <button
          onClick={() => navigate(`/property-details/${property.id}`)}
          className="flex items-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition"
        >
          <FaArrowLeft />
          Back to Property Details
        </button>
      </div>
    </div>
  );
};

export default ComparableAnalysis;
