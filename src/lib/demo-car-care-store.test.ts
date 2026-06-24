import { describe, expect, it } from "vitest";
import {
  findFitment,
  getMatchingProducts,
  getRequestDisplayPrice,
  seedStore,
} from "@/lib/demo-car-care-store";

describe("car care demo store helpers", () => {
  it("finds the tyre and battery sizes for a selected car", () => {
    const fitment = findFitment(seedStore.fitments, "Perodua", "Myvi 1.5");

    expect(fitment?.tyreSize).toBe("185/55R15");
    expect(fitment?.batterySize).toBe("NS40ZL");
  });

  it("only returns active in-stock products that match the requested size", () => {
    const tyres = getMatchingProducts(seedStore.products, "tyre", "195/55R16");
    const batteries = getMatchingProducts(seedStore.products, "battery", "DIN55");

    expect(tyres).toHaveLength(0);
    expect(batteries.every((battery) => battery.size === "DIN55")).toBe(true);
    expect(batteries.every((battery) => battery.stock > 0)).toBe(true);
  });

  it("uses the admin quote when one exists", () => {
    const quoted = seedStore.requests[0];
    const pending = seedStore.requests[1];

    expect(getRequestDisplayPrice(quoted)).toBe(1192);
    expect(getRequestDisplayPrice(pending)).toBe(265);
  });
});
