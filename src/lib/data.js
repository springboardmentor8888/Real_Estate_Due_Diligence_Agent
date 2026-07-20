const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const properties = [
  { 
    id: "P-10241", 
    address: "425 Market Street", 
    city: "San Francisco", 
    state: "CA", 
    type: "Office", 
    price: 48500000, 
    size: "182,000 sqft", 
    owner: "Blackrock Real Estate Trust", 
    risk: "Low", 
    riskScore: 18, 
    image: img("photo-1486406146926-c627a92ad1ab"), 
    yearBuilt: 2014, 
    cap: 5.4 
  },
  { 
    id: "P-10242", 
    address: "1200 Brickell Avenue", 
    city: "Miami", 
    state: "FL", 
    type: "Mixed-Use", 
    price: 62000000, 
    size: "240,000 sqft", 
    owner: "Related Group", 
    risk: "Medium", 
    riskScore: 42, 
    image: img("photo-1493809842364-78817add7ffb"), 
    yearBuilt: 2019, 
    cap: 6.1 
  },
  { 
    id: "P-10243", 
    address: "500 W 33rd Street", 
    city: "New York", 
    state: "NY", 
    type: "Office", 
    price: 145000000, 
    size: "620,000 sqft", 
    owner: "Hudson Yards LLC", 
    risk: "Low", 
    riskScore: 12, 
    image: img("photo-1449824913935-59a10b8d2000"), 
    yearBuilt: 2016, 
    cap: 4.8 
  },
  { 
    id: "P-10244", 
    address: "888 Michigan Ave", 
    city: "Chicago", 
    state: "IL", 
    type: "Retail", 
    price: 28400000, 
    size: "95,000 sqft", 
    owner: "Simon Property Group", 
    risk: "High", 
    riskScore: 71, 
    image: img("photo-1502005229762-cf1b2da7c5d6"), 
    yearBuilt: 1998, 
    cap: 7.2 
  },
  { 
    id: "P-10245", 
    address: "2100 Ross Avenue", 
    city: "Dallas", 
    state: "TX", 
    type: "Office", 
    price: 38900000, 
    size: "210,000 sqft", 
    owner: "Crescent Real Estate", 
    risk: "Medium", 
    riskScore: 38, 
    image: img("photo-1460317442991-0ec209397118"), 
    yearBuilt: 2008, 
    cap: 6.5 
  },
  { 
    id: "P-10246", 
    address: "700 Bellevue Way", 
    city: "Bellevue", 
    state: "WA", 
    type: "Residential", 
    price: 22100000, 
    size: "148 units", 
    owner: "Equity Residential", 
    risk: "Low", 
    riskScore: 22, 
    image: img("photo-1523217582562-09d0def993a6"), 
    yearBuilt: 2021, 
    cap: 5.0 
  },
  { 
    id: "P-10247", 
    address: "3400 Peachtree Rd", 
    city: "Atlanta", 
    state: "GA", 
    type: "Industrial", 
    price: 19500000, 
    size: "320,000 sqft", 
    owner: "Prologis Inc.", 
    risk: "Medium", 
    riskScore: 48, 
    image: img("photo-1554435493-93422e8220c8"), 
    yearBuilt: 2011, 
    cap: 6.8 
  },
  { 
    id: "P-10248", 
    address: "150 California St", 
    city: "San Francisco", 
    state: "CA", 
    type: "Office", 
    price: 91200000, 
    size: "358,000 sqft", 
    owner: "Kilroy Realty", 
    risk: "Low", 
    riskScore: 14, 
    image: img("photo-1497366216548-37526070297c"), 
    yearBuilt: 2013, 
    cap: 5.2 
  },
];

export const activity = [
  { m: "Jan", reports: 42, alerts: 8 },
  { m: "Feb", reports: 58, alerts: 12 },
  { m: "Mar", reports: 71, alerts: 6 },
  { m: "Apr", reports: 65, alerts: 14 },
  { m: "May", reports: 82, alerts: 9 },
  { m: "Jun", reports: 94, alerts: 11 },
  { m: "Jul", reports: 108, alerts: 7 },
  { m: "Aug", reports: 121, alerts: 15 },
  { m: "Sep", reports: 118, alerts: 10 },
  { m: "Oct", reports: 134, alerts: 13 },
  { m: "Nov", reports: 142, alerts: 8 },
  { m: "Dec", reports: 156, alerts: 6 },
];

export const riskDist = [
  { name: "Low", value: 62, fill: "var(--chart-1)" },
  { name: "Medium", value: 28, fill: "var(--chart-3)" },
  { name: "High", value: 10, fill: "var(--chart-4)" },
];

export const performance = [
  { q: "Q1", value: 4.2, benchmark: 3.8 },
  { q: "Q2", value: 5.1, benchmark: 4.1 },
  { q: "Q3", value: 4.8, benchmark: 4.4 },
  { q: "Q4", value: 6.2, benchmark: 4.7 },
];

export const notifications = [
  { id: 1, kind: "report", title: "Due diligence report ready", body: "425 Market Street — full DD complete.", time: "12m ago", unread: true },
  { id: 2, kind: "risk", title: "High risk flag detected", body: "888 Michigan Ave — new lien filed.", time: "1h ago", unread: true },
  { id: 3, kind: "doc", title: "Document updated", body: "Title report v2 uploaded for P-10243.", time: "3h ago", unread: false },
  { id: 4, kind: "sold", title: "Watchlist: property sold", body: "2100 Ross Avenue closed at $38.9M.", time: "yesterday", unread: false },
  { id: 5, kind: "report", title: "Weekly digest", body: "12 new reports across your portfolio.", time: "2d ago", unread: false },
];

export const fmtCurrency = (n) =>
  n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${n.toLocaleString()}`;