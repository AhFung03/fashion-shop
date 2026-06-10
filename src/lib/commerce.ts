import type {
  CartItem,
  FulfilmentMethod,
  PaymentMethod,
  Product,
} from "@/types/shop";

export const DEFAULT_DELIVERY_FEE = 12;

export function formatMYR(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getCartSubtotal(items: CartItem[], products: Product[]) {
  return items.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  }, 0);
}

export function getOrderTotal(
  subtotal: number,
  fulfilment: FulfilmentMethod,
  deliveryFee = DEFAULT_DELIVERY_FEE,
) {
  return subtotal + (fulfilment === "delivery" ? deliveryFee : 0);
}

export function getAllowedPaymentMethods(
  fulfilment: FulfilmentMethod,
): PaymentMethod[] {
  return fulfilment === "pickup"
    ? ["card", "fpx", "cash"]
    : ["card", "fpx"];
}

export function makeOrderNumber(sequence = Date.now()) {
  return `LA-${String(sequence).slice(-5)}`;
}
