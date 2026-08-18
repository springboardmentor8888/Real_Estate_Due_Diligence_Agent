import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Integration Test: Property Navigation & Search Flow", () => {
  const mockProperties = [
    { propertyId: 1, propertyName: "Luxury Villa", city: "Chennai", state: "Tamil Nadu", propertyType: "Villa", price: 7500000 },
    { propertyId: 2, propertyName: "Modern Apartment", city: "Bangalore", state: "Karnataka", propertyType: "Apartment", price: 5500000 },
    { propertyId: 3, propertyName: "Independent House", city: "Coimbatore", state: "Tamil Nadu", propertyType: "House", price: 4200000 },
    { propertyId: 4, propertyName: "Premium Flat", city: "Hyderabad", state: "Telangana", propertyType: "Flat", price: 6800000 },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should retrieve full property listing", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockProperties)),
      json: () => Promise.resolve(mockProperties),
    });

    const { propertyApi } = await import("../../services/api.js");
    const properties = await propertyApi.getAll();

    expect(properties).toHaveLength(4);
    expect(properties[0].propertyName).toBe("Luxury Villa");
    expect(properties[3].propertyName).toBe("Premium Flat");
  });

  it("should filter properties by city search", async () => {
    const singleProperty = [mockProperties[1]];
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(singleProperty)),
      json: () => Promise.resolve(singleProperty),
    });

    const { propertyApi } = await import("../../services/api.js");
    const result = await propertyApi.searchByCity("Bangalore");

    expect(result).toHaveLength(1);
    expect(result[0].propertyName).toBe("Modern Apartment");
    expect(result[0].city).toBe("Bangalore");
  });

  it("should fetch property details for selected property ID", async () => {
    const targetProperty = mockProperties[0];
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(targetProperty)),
      json: () => Promise.resolve(targetProperty),
    });

    const { propertyApi } = await import("../../services/api.js");
    const property = await propertyApi.getById(1);

    expect(property).toBeDefined();
    expect(property.propertyId).toBe(1);
    expect(property.propertyName).toBe("Luxury Villa");
    expect(property.price).toBe(7500000);
  });
});
