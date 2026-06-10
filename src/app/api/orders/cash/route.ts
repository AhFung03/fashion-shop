import { products } from "@/data/products";
import { checkoutSchema } from "@/lib/checkout-schema";
import { makeOrderNumber } from "@/lib/commerce";

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid order details." }, { status: 400 });
  }

  const { items, fulfilment, payment } = parsed.data;
  if (fulfilment !== "pickup" || payment !== "cash") {
    return Response.json(
      { error: "Cash orders are available for store pickup only." },
      { status: 400 },
    );
  }

  const unavailable = items.some((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    const variant = product?.variants.find(
      (candidate) => candidate.id === item.variantId,
    );
    return !variant || variant.stock < item.quantity;
  });

  if (unavailable) {
    return Response.json(
      { error: "One or more items are no longer available in that quantity." },
      { status: 409 },
    );
  }

  return Response.json({
    orderNumber: makeOrderNumber(),
    paymentStatus: "cash_due",
    status: "processing",
  });
}
