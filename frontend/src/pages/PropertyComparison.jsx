import { useMemo, useState } from "react";
import {
  FaBalanceScale,
  FaCheckCircle,
  FaFileAlt,
  FaHome,
  FaMapMarkerAlt,
  FaSearch,
  FaShieldAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import ValuationComparisonChart from "../components/comparable/ValuationComparisonChart";
import { formatCurrency } from "../data/comparableData";
import { getPropertyById, properties } from "../data/propertyData";
import { getRiskAssessment } from "../data/riskData";

const badgeClass = {
  Verified: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "Under Review": "bg-red-100 text-red-700",
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

const comparisonFields = [
  ["Address", (property) => property.address],
  ["Pincode", (property) => property.pincode],
  ["Owner", (property) => property.owner],
  ["Contact", (property) => property.phone],
  ["Email", (property) => property.email],
  ["Property Type", (property) => property.propertyType],
  ["Area", (property) => property.area],
  ["Bedrooms / Usage", (property) => property.bedrooms],
  ["Bathrooms", (property) => property.bathrooms],
  ["Parking", (property) => property.parking],
  ["Furnishing", (property) => property.furnishing],
  ["Market Value", (property) => property.marketValue],
  ["Survey Number", (property) => property.surveyNo],
  ["Registration Number", (property) => property.registrationNo],
  ["Registration Date", (property) => property.registrationDate],
  ["Verification", (property) => property.verificationStatus],
  ["Tax Status", (property) => property.taxStatus],
  ["Mortgage", (property) => property.mortgage],
  ["Litigation", (property) => property.litigation],
  ["Zoning", (property) => property.zoning.zoneType],
  ["Land Use", (property) => property.zoning.landUse],
  ["FAR / FSI", (property) => property.zoning.far],
  ["Zoning Status", (property) => property.zoning.status],
  ["Documents", (property) => property.documents.join(", ")],
];

function getRecommendation(selectedProperties) {
  return selectedProperties.reduce((best, property) => {
    const propertyRisk = getRiskAssessment(property.id);
    const bestRisk = getRiskAssessment(best.id);
    const propertyScore = propertyRisk.overallScore - property.marketValueValue / 1000000;
    const bestScore = bestRisk.overallScore - best.marketValueValue / 1000000;

    return propertyScore > bestScore ? property : best;
  }, selectedProperties[0]);
}

const SelectablePropertyCard = ({ property, selected, onToggle }) => (
  <div
    className={`bg-white rounded-xl shadow transition duration-300 overflow-hidden ${
      selected ? "ring-2 ring-blue-600" : "hover:shadow-xl"
    }`}
  >
    <img src={property.image} alt={property.title} className="h-48 w-full object-cover" />

    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{property.title}</h3>
          <p className="text-sm text-gray-500">
            {property.city} - {property.pincode}
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass[property.status]}`}>
          {property.status}
        </span>
      </div>

      <p className="mt-3 flex items-center gap-2 text-gray-600">
        <FaMapMarkerAlt className="text-red-500" />
        {property.address}
      </p>
      <p className="flex items-center gap-2 text-gray-600">
        <FaUser className="text-blue-600" />
        {property.owner}
      </p>
      <p className="flex items-center gap-2 text-gray-600">
        <FaHome className="text-green-600" />
        {property.propertyType}
      </p>
      <p className="mt-3 font-semibold text-blue-600">
        {formatCurrency(property.marketValueValue)}
      </p>

      <button
        onClick={() => onToggle(property.id)}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2 font-semibold transition ${
          selected
            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {selected ? <FaCheckCircle /> : <FaBalanceScale />}
        {selected ? "Selected" : "Select for Comparison"}
      </button>
    </div>
  </div>
);

const PropertyComparison = () => {
  const navigate = useNavigate();
  const { propertyId, compareId } = useParams();
  const initialIds = [propertyId, compareId].filter(Boolean);
  const [selectedIds, setSelectedIds] = useState(initialIds);
  const [query, setQuery] = useState("");
  const [comparisonGenerated, setComparisonGenerated] = useState(initialIds.length >= 2);

  const selectedProperties = selectedIds.map((id) => getPropertyById(id));
  const canGenerate = selectedProperties.length >= 2;

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return properties.filter((property) => {
      if (!normalizedQuery) return true;
      return [
        property.address,
        property.pincode,
        property.owner,
        property.propertyType,
        property.title,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query]);

  const toggleProperty = (selectedId) => {
    setComparisonGenerated(false);
    setSelectedIds((currentIds) =>
      currentIds.includes(selectedId)
        ? currentIds.filter((id) => id !== selectedId)
        : [...currentIds, selectedId],
    );
  };

  const removeSelectedProperty = (selectedId) => {
    setComparisonGenerated(false);
    setSelectedIds((currentIds) => currentIds.filter((id) => id !== selectedId));
  };

  const recommended = canGenerate ? getRecommendation(selectedProperties) : null;
  const chartData = selectedProperties.map((property, index) => ({
    name: property.title,
    price: property.marketValueValue,
    current: index === 0,
  }));

  return (
    <div className="p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Comparable Properties</h1>

        <p className="text-gray-500 mt-3 text-lg">
          Search and select two or more properties to generate a due-diligence comparison.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by address, pincode, owner name, or apartment type"
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            onClick={() => setComparisonGenerated(true)}
            disabled={!canGenerate}
            className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
              canGenerate
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <FaBalanceScale />
            Generate Comparison
          </button>
        </div>

        <div className="mt-5 min-h-14 rounded-xl border border-dashed border-gray-300 p-4">
          {selectedProperties.length === 0 ? (
            <p className="text-gray-500">
              No comparable properties selected yet. Select at least two properties below.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {selectedProperties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => removeSelectedProperty(property.id)}
                  className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100"
                >
                  {property.title}
                  <FaTimes className="text-sm" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {comparisonGenerated && canGenerate && (
        <>
          <div className="mb-8 rounded-2xl border-l-4 border-green-500 bg-white p-6 shadow">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-2xl text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Recommended: {recommended.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  Recommendation considers risk score, valuation, legal status, tax status,
                  zoning, and pending due-diligence items.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-800">
              <FaBalanceScale className="text-blue-600" />
              Valuation Comparison
            </h2>
            <ValuationComparisonChart data={chartData} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
            {selectedProperties.map((property) => {
              const risk = getRiskAssessment(property.id);

              return (
                <div key={property.id} className="rounded-2xl bg-white p-6 shadow">
                  <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{property.address}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <FaShieldAlt className="text-blue-600" />
                      Risk Score
                    </span>
                    <span className="text-3xl font-bold text-gray-800">
                      {risk.overallScore}
                    </span>
                  </div>
                  <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium ${badgeClass[risk.riskLevel]}`}>
                    {risk.riskLevel} Risk
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="w-56 p-4 text-left">Due Diligence Field</th>
                  {selectedProperties.map((property) => (
                    <th key={property.id} className="p-4 text-left">
                      {property.title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {comparisonFields.map(([label, readValue]) => (
                  <tr key={label} className="border-b transition hover:bg-gray-50">
                    <td className="p-4 font-semibold">{label}</td>
                    {selectedProperties.map((property) => (
                      <td key={`${property.id}-${label}`} className="p-4 align-top">
                        {readValue(property)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end gap-4 flex-wrap">
            <button
              onClick={() => navigate(`/reports/${recommended.id}`)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <FaFileAlt />
              Generate Report for Recommended Property
            </button>
          </div>
        </>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProperties.map((property) => (
          <SelectablePropertyCard
            key={property.id}
            property={property}
            selected={selectedIds.includes(property.id)}
            onToggle={toggleProperty}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyComparison;
