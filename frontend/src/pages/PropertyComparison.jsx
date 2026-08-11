import { useEffect, useState } from "react";
import { FaArrowLeft, FaBalanceScale, FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatDate,
  formatMoney,
  getComparisonBundle,
  getProperty,
  searchProperties,
  unavailable,
} from "../services/dueDiligenceService";
import { saveComparisonSelection } from "../utils/reportDataBuilder";

const emptySearch = {
  city: "",
  state: "",
  zipCode: "",
  propertyType: "",
};

function latest(records, field) {
  return [...(records || [])].sort((a, b) => new Date(b[field] || 0) - new Date(a[field] || 0))[0] || null;
}

function latestTax(records) {
  return [...(records || [])].sort((a, b) => Number(b.taxYear || 0) - Number(a.taxYear || 0))[0] || null;
}

function ComparisonTable({ title, rows, a, b }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
            <tr>
              <th className="w-56 p-4">Field</th>
              <th className="p-4">Property A</th>
              <th className="p-4">Property B</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, readA, readB = readA]) => {
              const aValue = unavailable(readA(a));
              const bValue = unavailable(readB(b));
              const differs = String(aValue) !== String(bValue);

              return (
                <tr key={label} className="border-t border-gray-100">
                  <td className="p-4 font-semibold text-gray-800">{label}</td>
                  <td className={`p-4 ${differs ? "bg-blue-50/60" : ""}`}>{aValue}</td>
                  <td className={`p-4 ${differs ? "bg-amber-50/60" : ""}`}>{bValue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RecordComparison({ title, columns, recordsA, recordsB }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        {[
          ["Property A", recordsA],
          ["Property B", recordsB],
        ].map(([label, records]) => (
          <div key={label} className="border-b border-gray-100 p-5 lg:border-b-0 lg:border-r last:border-r-0">
            <h3 className="mb-4 font-bold text-gray-900">{label}</h3>
            {records.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-gray-50 text-left text-gray-500">
                    <tr>
                      {columns.map(([heading]) => (
                        <th key={heading} className="p-3">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={record.id || index} className="border-t border-gray-100">
                        {columns.map(([heading, reader]) => (
                          <td key={heading} className="p-3 align-top text-gray-700">
                            {unavailable(reader(record))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                No data returned from the connected source.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function PurchasePriceChart({ a, b }) {
  const rows = [];
  (a.ownership || []).forEach((record) => {
    if (record.purchaseDate && record.purchasePrice !== null && record.purchasePrice !== undefined) {
      rows.push({ date: record.purchaseDate, propertyA: Number(record.purchasePrice) });
    }
  });
  (b.ownership || []).forEach((record) => {
    if (record.purchaseDate && record.purchasePrice !== null && record.purchasePrice !== undefined) {
      const existing = rows.find((item) => item.date === record.purchaseDate);
      if (existing) existing.propertyB = Number(record.purchasePrice);
      else rows.push({ date: record.purchaseDate, propertyB: Number(record.purchasePrice) });
    }
  });
  rows.sort((left, right) => new Date(left.date) - new Date(right.date));

  if (rows.length < 2) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-gray-600 shadow-sm">
        Historical purchase price chart requires at least two dated ownership purchase records.
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Historical Purchase Price Comparison</h2>
      <p className="mt-1 text-sm text-gray-500">
        Uses actual ownership purchaseDate and purchasePrice records only.
      </p>
      <div className="mt-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis tickFormatter={(value) => formatMoney(value)} width={92} />
            <Tooltip formatter={(value) => formatMoney(value)} labelFormatter={formatDate} />
            <Line type="monotone" dataKey="propertyA" stroke="#2563eb" strokeWidth={3} name="Property A" connectNulls />
            <Line type="monotone" dataKey="propertyB" stroke="#f59e0b" strokeWidth={3} name="Property B" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function MarketValueChart({ a, b }) {
  const rows = [];
  (a.valuation?.valueHistory || []).forEach((record) => {
    if (record.year && record.marketValue !== null && record.marketValue !== undefined) {
      rows.push({ year: record.year, propertyA: Number(record.marketValue) });
    }
  });
  (b.valuation?.valueHistory || []).forEach((record) => {
    if (record.year && record.marketValue !== null && record.marketValue !== undefined) {
      const existing = rows.find((item) => item.year === record.year);
      if (existing) existing.propertyB = Number(record.marketValue);
      else rows.push({ year: record.year, propertyB: Number(record.marketValue) });
    }
  });
  rows.sort((left, right) => Number(left.year) - Number(right.year));

  if (rows.length < 2) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-gray-600 shadow-sm">
        Market value history chart requires at least two backend valuation history points.
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Market Value History</h2>
      <p className="mt-1 text-sm text-gray-500">
        Uses backend valuation valueHistory.marketValue, not ownership purchasePrice.
      </p>
      <div className="mt-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => formatMoney(value)} width={92} />
            <Tooltip formatter={(value) => formatMoney(value)} />
            <Line type="monotone" dataKey="propertyA" stroke="#2563eb" strokeWidth={3} name="Property A" connectNulls />
            <Line type="monotone" dataKey="propertyB" stroke="#16a34a" strokeWidth={3} name="Property B" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ComparableContext({ comparison }) {
  const items = [
    ["Property A Comparable Count", comparison.a.valuation?.comparablePropertyCount],
    ["Property B Comparable Count", comparison.b.valuation?.comparablePropertyCount],
    ["Property A Similarity Score", comparison.a.valuation?.similarityScore],
    ["Property B Similarity Score", comparison.b.valuation?.similarityScore],
    ["Property A Valuation Remark", comparison.a.valuation?.valuationRemark],
    ["Property B Valuation Remark", comparison.b.valuation?.valuationRemark],
    ["Property A Backend Comparables", comparison.a.comparables?.length],
    ["Property B Backend Comparables", comparison.b.comparables?.length],
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Comparable Property Context</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-2 text-lg font-bold text-gray-900">{unavailable(value)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComparisonSummary({ comparison }) {
  const statements = [];
  const aPermit = latest(comparison.a.permits, "issueDate");
  const bPermit = latest(comparison.b.permits, "issueDate");
  const aFlood = comparison.a.flood?.[0];
  const bFlood = comparison.b.flood?.[0];

  if (aPermit?.status && bPermit?.status && aPermit.status !== bPermit.status) {
    statements.push(`Permit statuses differ: Property A is "${aPermit.status}" and Property B is "${bPermit.status}".`);
  }
  if (aFlood?.floodRiskLevel && bFlood?.floodRiskLevel && aFlood.floodRiskLevel !== bFlood.floodRiskLevel) {
    statements.push(`Flood risk levels differ: Property A is "${aFlood.floodRiskLevel}" and Property B is "${bFlood.floodRiskLevel}".`);
  }
  if (comparison.a.zoning?.length && comparison.b.zoning?.length) {
    statements.push("Both properties have zoning information returned by the backend.");
  }
  if (comparison.a.riskAssessment?.overallRisk && comparison.b.riskAssessment?.overallRisk && comparison.a.riskAssessment.overallRisk !== comparison.b.riskAssessment.overallRisk) {
    statements.push(`Backend overall risk differs: Property A is "${comparison.a.riskAssessment.overallRisk}" and Property B is "${comparison.b.riskAssessment.overallRisk}".`);
  }
  if (comparison.a.valuation?.currentMarketValue && comparison.b.valuation?.currentMarketValue) {
    statements.push("Both properties have backend currentMarketValue available from the valuation endpoint.");
  }
  if (!comparison.a.ownership?.length || !comparison.b.ownership?.length) {
    statements.push("One or both properties are missing ownership purchase records, limiting valuation comparison.");
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Evidence-Based Comparison Summary</h2>
      {statements.length ? (
        <div className="mt-4 space-y-3">
          {statements.map((statement) => (
            <p key={statement} className="rounded-lg bg-gray-50 p-4 text-gray-700">{statement}</p>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-gray-50 p-4 text-gray-600">
          No material differences can be summarized from the currently available backend values.
        </p>
      )}
    </section>
  );
}

function PropertySummary({ label, property }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{label}</p>
      <h3 className="mt-2 text-xl font-bold text-gray-900">{unavailable(property?.address)}</h3>
      <p className="mt-2 text-gray-500">
        {unavailable(property?.city)}, {unavailable(property?.state)} {unavailable(property?.zipCode)}
      </p>
      <p className="mt-2 text-sm text-gray-500">Property ID: {unavailable(property?.id)}</p>
    </div>
  );
}

function PropertyComparison() {
  const navigate = useNavigate();
  const { propertyId, compareId } = useParams();
  const [propertyA, setPropertyA] = useState(null);
  const [search, setSearch] = useState(emptySearch);
  const [results, setResults] = useState([]);
  const [selectedB, setSelectedB] = useState(compareId || "");
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBase() {
      try {
        setLoading(true);
        const property = await getProperty(propertyId);
        if (active) setPropertyA(property);
      } catch {
        if (active) setError("Unable to load the selected property.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBase();
    return () => {
      active = false;
    };
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId || !selectedB) return;

    let active = true;
    async function loadComparison() {
      try {
        setError("");
        const data = await getComparisonBundle(propertyId, selectedB);
        if (active) {
          setComparison(data);
          saveComparisonSelection(propertyId, selectedB);
        }
      } catch {
        if (active) setError("Unable to load comparison data for both properties.");
      }
    }

    loadComparison();
    return () => {
      active = false;
    };
  }, [propertyId, selectedB]);

  const runSearch = async (event) => {
    event.preventDefault();
    try {
      setSearching(true);
      setError("");
      const data = await searchProperties(search);
      setResults(data.filter((property) => String(property.id) !== String(propertyId)));
    } catch {
      setResults([]);
      setError("Unable to search properties for comparison.");
    } finally {
      setSearching(false);
    }
  };

  const overviewRows = [
    ["Address", (item) => item.property?.address],
    ["City", (item) => item.property?.city],
    ["State", (item) => item.property?.state],
    ["ZIP", (item) => item.property?.zipCode],
    ["Property Type", (item) => item.property?.propertyType],
    ["Price", (item) => formatMoney(item.property?.price)],
    ["Created At", (item) => formatDate(item.property?.createdAt)],
  ];

  const riskRows = [
    ["Risk Score", (item) => item.riskAssessment?.riskScore !== null && item.riskAssessment?.riskScore !== undefined ? `${item.riskAssessment.riskScore} / 100` : null],
    ["Overall Risk", (item) => item.riskAssessment?.overallRisk],
    ["Risk Factors", (item) => item.riskAssessment?.riskFactors?.join(", ")],
    ["Recommendation", (item) => item.riskAssessment?.recommendation],
  ];

  const valuationRows = [
    ["Current Market Value", (item) => formatMoney(item.valuation?.currentMarketValue)],
    ["Previous Market Value", (item) => formatMoney(item.valuation?.previousMarketValue)],
    ["Growth Percentage", (item) => item.valuation?.growthPercentage],
    ["Comparable Property Count", (item) => item.valuation?.comparablePropertyCount],
    ["Similarity Score", (item) => item.valuation?.similarityScore],
    ["Valuation Remark", (item) => item.valuation?.valuationRemark],
  ];

  const ownershipRows = [
    ["Owner", (item) => latest(item.ownership, "purchaseDate")?.ownerName],
    ["Purchase Date", (item) => formatDate(latest(item.ownership, "purchaseDate")?.purchaseDate)],
    ["Historical Purchase Price", (item) => formatMoney(latest(item.ownership, "purchaseDate")?.purchasePrice)],
  ];

  const taxRows = [
    ["Latest Tax Year", (item) => latestTax(item.tax)?.taxYear],
    ["Tax Amount", (item) => formatMoney(latestTax(item.tax)?.taxAmount)],
    ["Payment Status", (item) => latestTax(item.tax)?.paymentStatus],
  ];

  const floodRows = [
    ["Flood Zone", (item) => item.flood?.[0]?.floodZoneCode],
    ["Risk Level", (item) => item.flood?.[0]?.floodRiskLevel],
    ["Insurance Required", (item) => (item.flood?.[0] ? (item.flood[0].floodInsuranceRequired ? "Yes" : "No") : null)],
  ];

  const permitRows = [
    ["Permit Number", (item) => latest(item.permits, "issueDate")?.permitNumber],
    ["Permit Type", (item) => latest(item.permits, "issueDate")?.permitType],
    ["Status", (item) => latest(item.permits, "issueDate")?.status],
    ["Issue Date", (item) => formatDate(latest(item.permits, "issueDate")?.issueDate)],
  ];

  const zoningRows = [
    ["Zoning Code", (item) => item.zoning?.[0]?.zoningCode],
    ["Description", (item) => item.zoning?.[0]?.zoningDescription],
    ["Permitted Use", (item) => item.zoning?.[0]?.permittedUse],
  ];

  const environmentalRows = [
    ["Environmental Risk", (item) => item.environmental?.[0]?.environmentalRisk],
    ["Contamination Level", (item) => item.environmental?.[0]?.contaminationLevel],
    ["Remarks", (item) => item.environmental?.[0]?.remarks],
  ];

  if (loading) {
    return <div className="px-8 py-10"><div className="h-48 animate-pulse rounded-xl bg-gray-100" /></div>;
  }

  return (
    <div className="px-6 py-8 lg:px-8">
      <button
        onClick={() => navigate(`/property-details/${propertyId}`)}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Selected Comparison Property</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Compare Properties</h1>
        <p className="mt-2 max-w-3xl text-gray-500">
          Property A stays fixed. Search backend records and select Property B for an evidence-based side-by-side comparison.
        </p>
      </header>

      {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <PropertySummary label="Property A" property={propertyA} />
        <PropertySummary label="Property B" property={comparison?.b?.property || results.find((item) => String(item.id) === String(selectedB))} />
      </div>

      <form onSubmit={runSearch} className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Compare With Another Property</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {["city", "state", "zipCode", "propertyType"].map((field) => (
            <label key={field}>
              <span className="text-sm font-semibold capitalize text-gray-700">{field === "zipCode" ? "ZIP Code" : field}</span>
              <input
                value={search[field]}
                onChange={(event) => setSearch((current) => ({ ...current, [field]: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={searching}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            <FaSearch />
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {results.map((property) => (
            <div key={property.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-gray-900">{unavailable(property.address)}</p>
                <p className="text-sm text-gray-500">
                  {unavailable(property.city)}, {unavailable(property.state)} | {unavailable(property.propertyType)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedB(property.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50"
              >
                <FaBalanceScale />
                Select
              </button>
            </div>
          ))}
        </div>
      </form>

      {comparison && (
        <div className="space-y-8">
          <ComparisonTable title="Property Overview" rows={overviewRows} a={comparison.a} b={comparison.b} />
          <ComparisonTable title="Risk Assessment" rows={riskRows} a={comparison.a} b={comparison.b} />
          <ComparisonTable title="Property Valuation" rows={valuationRows} a={comparison.a} b={comparison.b} />
          <ComparableContext comparison={comparison} />
          <ComparisonSummary comparison={comparison} />
          <MarketValueChart a={comparison.a} b={comparison.b} />
          <PurchasePriceChart a={comparison.a} b={comparison.b} />
          <ComparisonTable title="Ownership" rows={ownershipRows} a={comparison.a} b={comparison.b} />
          <ComparisonTable title="Tax" rows={taxRows} a={comparison.a} b={comparison.b} />
          <ComparisonTable title="Flood Risk" rows={floodRows} a={comparison.a} b={comparison.b} />
          <ComparisonTable title="Permits" rows={permitRows} a={comparison.a} b={comparison.b} />
          <ComparisonTable title="Zoning" rows={zoningRows} a={comparison.a} b={comparison.b} />
          <ComparisonTable title="Environmental" rows={environmentalRows} a={comparison.a} b={comparison.b} />
          <RecordComparison
            title="Purchase History"
            recordsA={comparison.a.ownership || []}
            recordsB={comparison.b.ownership || []}
            columns={[
              ["Owner", (record) => record.ownerName],
              ["Purchase Date", (record) => formatDate(record.purchaseDate)],
              ["Historical Purchase Price", (record) => formatMoney(record.purchasePrice)],
            ]}
          />
          <RecordComparison
            title="Property History"
            recordsA={comparison.a.history || []}
            recordsB={comparison.b.history || []}
            columns={[
              ["Event Type", (record) => record.eventType],
              ["Event Date", (record) => formatDate(record.eventDate)],
              ["Description", (record) => record.description],
            ]}
          />
          <RecordComparison
            title="Tax History"
            recordsA={comparison.a.tax || []}
            recordsB={comparison.b.tax || []}
            columns={[
              ["Tax Year", (record) => record.taxYear],
              ["Tax Amount", (record) => formatMoney(record.taxAmount)],
              ["Payment Status", (record) => record.paymentStatus],
            ]}
          />
          <RecordComparison
            title="Flood Records"
            recordsA={comparison.a.flood || []}
            recordsB={comparison.b.flood || []}
            columns={[
              ["Zone Code", (record) => record.floodZoneCode],
              ["Risk Level", (record) => record.floodRiskLevel],
              ["Insurance Required", (record) => (record.floodInsuranceRequired ? "Yes" : "No")],
            ]}
          />
          <RecordComparison
            title="Permit Records"
            recordsA={comparison.a.permits || []}
            recordsB={comparison.b.permits || []}
            columns={[
              ["Permit Number", (record) => record.permitNumber],
              ["Permit Type", (record) => record.permitType],
              ["Status", (record) => record.status],
              ["Issue Date", (record) => formatDate(record.issueDate)],
            ]}
          />
          <RecordComparison
            title="Zoning Records"
            recordsA={comparison.a.zoning || []}
            recordsB={comparison.b.zoning || []}
            columns={[
              ["Zoning Code", (record) => record.zoningCode],
              ["Description", (record) => record.zoningDescription],
              ["Permitted Use", (record) => record.permittedUse],
            ]}
          />
          <RecordComparison
            title="Environmental Records"
            recordsA={comparison.a.environmental || []}
            recordsB={comparison.b.environmental || []}
            columns={[
              ["Environmental Risk", (record) => record.environmentalRisk],
              ["Contamination Level", (record) => record.contaminationLevel],
              ["Remarks", (record) => record.remarks],
            ]}
          />
        </div>
      )}
    </div>
  );
}

export default PropertyComparison;
