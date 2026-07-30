import { getPropertyById, getPropertyOptions } from "./propertyData";

const comparableOverrides = {
  PROP001: [
    ["Prime City Villa", "Banjara Hills, Hyderabad", 11800000, 4816, "0.4 km"],
    ["Lakeview Independent House", "Jubilee Hills, Hyderabad", 13200000, 5280, "0.8 km"],
    ["Garden Residence", "Madhapur, Hyderabad", 10900000, 4541, "1.1 km"],
    ["Corner Plot Villa", "Gachibowli, Hyderabad", 12750000, 5100, "1.6 km"],
    ["Metro Access Home", "Kondapur, Hyderabad", 11500000, 4693, "2.0 km"],
  ],
  PROP002: [
    ["Seaside Villa", "Rushikonda, Visakhapatnam", 11600000, 3741, "0.5 km"],
    ["Beachfront Duplex", "MVP Colony, Visakhapatnam", 12800000, 4129, "0.9 km"],
    ["Harbor View Home", "Waltair Uplands, Visakhapatnam", 11100000, 3700, "1.2 km"],
    ["Coastal Row House", "Yendada, Visakhapatnam", 12250000, 3952, "1.8 km"],
  ],
};

const listingImages = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
];

function buildSyntheticComparables(propertyId) {
  const property = getPropertyById(propertyId);
  const multipliers = [0.92, 0.97, 1.03, 1.08, 0.88];

  return multipliers.map((multiplier, index) => {
    const price = Math.round(property.marketValueValue * multiplier);
    const areaNumber = Number(property.area.replace(/\D/g, "")) || 2000;

    return {
      id: `${propertyId}-COMP-${index + 1}`,
      name: `${property.city} Comparable ${index + 1}`,
      address: `${property.city} Market Zone ${index + 1}, ${property.state}`,
      image: listingImages[index],
      price,
      pricePerSqft: Math.round(price / areaNumber),
      area: property.area,
      distance: `${(0.4 + index * 0.35).toFixed(1)} km`,
    };
  });
}

export function getComparableListings(propertyId = "PROP001") {
  const property = getPropertyById(propertyId);
  const overrides = comparableOverrides[property.id];

  if (!overrides) return buildSyntheticComparables(property.id);

  return overrides.map(([name, address, price, pricePerSqft, distance], index) => ({
    id: `${property.id}-COMP-${index + 1}`,
    name,
    address,
    image: listingImages[index],
    price,
    pricePerSqft,
    area: property.area,
    distance,
  }));
}

export function getMarketTrend(propertyId = "PROP001") {
  const property = getPropertyById(propertyId);
  const base = property.marketValueValue * 0.78;
  const labels = [
    "Feb 2025",
    "Mar 2025",
    "Apr 2025",
    "May 2025",
    "Jun 2025",
    "Jul 2025",
    "Aug 2025",
    "Sep 2025",
  ];

  return labels.map((month, index) => ({
    month,
    avgPrice: Math.round(base + property.marketValueValue * (index * 0.025)),
  }));
}

export function getValueHistory(propertyId = "PROP001") {
  const property = getPropertyById(propertyId);

  return [
    { year: "2021", value: Math.round(property.marketValueValue * 0.64) },
    { year: "2022", value: Math.round(property.marketValueValue * 0.7) },
    { year: "2023", value: Math.round(property.marketValueValue * 0.78) },
    { year: "2024", value: Math.round(property.marketValueValue * 0.88) },
    { year: "2025", value: property.marketValueValue },
  ];
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value) {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  return `${(value / 100000).toFixed(1)} L`;
}

export function getValuationSummary(propertyId = "PROP001") {
  const property = getPropertyById(propertyId);
  const comparableListings = getComparableListings(property.id);
  const avgComparablePrice =
    comparableListings.reduce((sum, listing) => sum + listing.price, 0) /
    comparableListings.length;
  const percentDiff =
    ((property.marketValueValue - avgComparablePrice) / avgComparablePrice) * 100;

  return {
    currentPrice: property.marketValueValue,
    avgComparablePrice,
    percentDiff,
    comparableCount: comparableListings.length,
    positionLabel:
      percentDiff >= 0
        ? `+${percentDiff.toFixed(1)}% above avg`
        : `${percentDiff.toFixed(1)}% below avg`,
  };
}

export function getValuationComparisonData(propertyId = "PROP001", compareId) {
  const property = getPropertyById(propertyId);
  const compareProperty = compareId ? getPropertyById(compareId) : null;
  const comparableRows = compareProperty
    ? [
        {
          name: compareProperty.title,
          price: compareProperty.marketValueValue,
          current: false,
          selected: true,
        },
      ]
    : getComparableListings(property.id).map((listing) => ({
        name: listing.name,
        price: listing.price,
        current: false,
      }));

  return [
    { name: property.title, price: property.marketValueValue, current: true },
    ...comparableRows,
  ];
}

export function getComparisonProperties(propertyId = "PROP001", compareId) {
  const first = getPropertyById(propertyId);
  const second = compareId ? getPropertyById(compareId) : getPropertyOptions(first.id)[0];

  return { first, second };
}
