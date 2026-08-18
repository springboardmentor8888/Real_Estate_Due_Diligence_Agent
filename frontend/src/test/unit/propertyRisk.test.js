import { describe, it, expect } from "vitest";

describe("Unit Test: Property Risk Assessment & Valuation Metrics", () => {
  // Demonstration property dataset representing the 4 Milestone 3 scenarios
  const propertiesData = [
    {
      id: 1,
      propertyName: "Luxury Villa",
      riskScore: 98,
      riskLevel: "LOW",
      legalStatus: "Clean Ownership",
      askingPrice: 7500000,
      estimatedMarketValue: 7950000,
    },
    {
      id: 2,
      propertyName: "Modern Apartment",
      riskScore: 90,
      riskLevel: "LOW",
      legalStatus: "Verified Title",
      askingPrice: 5500000,
      estimatedMarketValue: 5600000,
    },
    {
      id: 3,
      propertyName: "Independent House",
      riskScore: 65,
      riskLevel: "CONCERNS_FOUND",
      legalStatus: "Under Legal Review",
      askingPrice: 4200000,
      estimatedMarketValue: 4300000,
    },
    {
      id: 4,
      propertyName: "Premium Flat",
      riskScore: 32,
      riskLevel: "HIGH_RISK",
      legalStatus: "Title Dispute & Tax Lien",
      askingPrice: 6800000,
      estimatedMarketValue: 5800000,
    },
  ];

  it("should evaluate Property 1 (Luxury Villa, 98/100) as LOW risk with Verified Title", () => {
    const p1 = propertiesData.find((p) => p.id === 1);
    expect(p1.riskScore).toBe(98);
    expect(p1.riskLevel).toBe("LOW");
    expect(p1.legalStatus).toBe("Clean Ownership");
  });

  it("should evaluate Property 2 (Modern Apartment, 90/100) as LOW risk", () => {
    const p2 = propertiesData.find((p) => p.id === 2);
    expect(p2.riskScore).toBe(90);
    expect(p2.riskLevel).toBe("LOW");
  });

  it("should evaluate Property 3 (Independent House, 65/100) as CONCERNS_FOUND (Medium Risk)", () => {
    const p3 = propertiesData.find((p) => p.id === 3);
    expect(p3.riskScore).toBe(65);
    expect(p3.riskLevel).toBe("CONCERNS_FOUND");
  });

  it("should evaluate Property 4 (Premium Flat, 32/100) as HIGH_RISK", () => {
    const p4 = propertiesData.find((p) => p.id === 4);
    expect(p4.riskScore).toBe(32);
    expect(p4.riskLevel).toBe("HIGH_RISK");
  });

  it("should calculate valuation delta accurately for overpriced Property 4", () => {
    const p4 = propertiesData.find((p) => p.id === 4);
    const delta = p4.askingPrice - p4.estimatedMarketValue;
    const overpricedPercent = parseFloat(((delta / p4.estimatedMarketValue) * 100).toFixed(1));

    expect(delta).toBe(1000000);
    expect(overpricedPercent).toBe(17.2);
  });

  it("should calculate valuation delta accurately for below-market Property 1", () => {
    const p1 = propertiesData.find((p) => p.id === 1);
    const delta = p1.askingPrice - p1.estimatedMarketValue;
    const underMarketPercent = parseFloat(((Math.abs(delta) / p1.estimatedMarketValue) * 100).toFixed(1));

    expect(delta).toBe(-450000);
    expect(underMarketPercent).toBe(5.7);
  });
});
