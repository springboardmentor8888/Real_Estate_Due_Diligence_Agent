export const propertySummaryMock = {
  id: "PROP-10294",
  address: "123 Silicon Boulevard, Tech Park, CA 94043",
  propertyType: "Commercial Office",
  marketValue: "$12,500,000",
  landArea: "45,000 sq ft",
  yearBuilt: "2018",
  lastUpdated: "2026-07-15",
  imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
  riskLevel: "Low",
  status: "Active"
};

export const ownershipMock = {
  currentOwner: {
    name: "Apex Holdings LLC",
    type: "Corporate",
    purchaseDate: "2021-04-12",
    status: "Verified",
    verificationId: "VER-882190"
  },
  previousOwners: [
    {
      id: 1,
      name: "Global Tech Realty",
      type: "Corporate",
      purchaseDate: "2018-01-20",
      saleDate: "2021-04-11",
      transferValue: "$11,200,000"
    },
    {
      id: 2,
      name: "City Developers Inc.",
      type: "Corporate",
      purchaseDate: "2016-05-10",
      saleDate: "2018-01-19",
      transferValue: "$8,500,000"
    }
  ]
};

export const taxHistoryMock = [
  { year: 2025, taxAmount: "$125,000", paidStatus: "Paid", dueAmount: "$0", paymentDate: "2026-01-15", receiptNumber: "TX-25-8812" },
  { year: 2024, taxAmount: "$120,500", paidStatus: "Paid", dueAmount: "$0", paymentDate: "2025-01-12", receiptNumber: "TX-24-9901" },
  { year: 2023, taxAmount: "$118,000", paidStatus: "Paid", dueAmount: "$0", paymentDate: "2024-01-20", receiptNumber: "TX-23-4412" },
  { year: 2022, taxAmount: "$115,200", paidStatus: "Paid", dueAmount: "$0", paymentDate: "2023-01-18", receiptNumber: "TX-22-1102" }
];

export const zoningMock = {
  zoneType: "Commercial (C-3)",
  landUse: "Office & Retail",
  buildingHeightLimit: "120 ft",
  fsi: "3.5",
  restrictions: ["No heavy manufacturing", "Max 30% retail space"],
  approvedUsage: ["Corporate Headquarters", "Software Development Center", "Retail Outlets"],
  governmentStatus: "Compliant"
};

export const floodZoneMock = {
  riskLevel: "Minimal Risk",
  floodZoneCode: "Zone X",
  insuranceRequirement: "Not Required",
  historicalEvents: [
    { date: "2019-12-05", event: "Minor street flooding, no property damage." },
    { date: "2014-02-18", event: "Heavy rain alert, water level rose 2 inches." }
  ],
  lastAssessment: "2025-11-20"
};

export const environmentalMock = {
  airQuality: "Good (AQI 42)",
  waterQuality: "Passes Safety Standards",
  soilStatus: "Contamination Free",
  hazardousWaste: "None found within 2 miles",
  nearbyIndustries: ["Light Tech Assembly (0.8 mi)", "Data Center (1.2 mi)"],
  protectedAreas: "None within 5 miles",
  pollutionIndex: "Very Low"
};

export const permitTimelineMock = [
  { id: "PRM-991", type: "Solar Panel Installation", issueDate: "2023-08-15", status: "Approved", authority: "City Planning Dept", permitNumber: "BLD-2023-455" },
  { id: "PRM-882", type: "Interior Renovation", issueDate: "2021-06-10", status: "Completed", authority: "City Planning Dept", permitNumber: "BLD-2021-992" },
  { id: "PRM-773", type: "Initial Construction", issueDate: "2017-09-05", status: "Completed", authority: "City Planning Dept", permitNumber: "BLD-2017-102" }
];
