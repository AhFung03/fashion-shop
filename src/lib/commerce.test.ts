import {
  getAllowedPaymentMethods,
  getCartSubtotal,
  getOrderTotal,
} from "@/lib/commerce";
import { products } from "@/data/products";
import { describe, expect, it } from "vitest";

describe("commerce calculations", () => {
  it("calculates the cart from trusted product prices", () => {
    expect(
      getCartSubtotal(
        [
          { productId: "p1", variantId: "amara-0-xs", quantity: 2 },
          { productId: "p2", variantId: "sora-0-xs", quantity: 1 },
        ],
        products,
      ),
    ).toBe(607);
  });

  it("charges delivery but keeps pickup free", () => {
    expect(getOrderTotal(200, "delivery", 12)).toBe(212);
    expect(getOrderTotal(200, "pickup", 12)).toBe(200);
  });

  it("allows cash for pickup only", () => {
    expect(getAllowedPaymentMethods("pickup")).toContain("cash");
    expect(getAllowedPaymentMethods("delivery")).not.toContain("cash");
  });
});
