import { products } from "@/data/products";
import { checkoutSchema } from "@/lib/checkout-schema";
import {
  DEFAULT_DELIVERY_FEE,
  getAllowedPaymentMethods,
  makeOrderNumber,
} from "@/lib/commerce";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid checkout details." }, { status: 400 });
  }

  const { items, fulfilment, payment, customerEmail } = parsed.data;
  if (!getAllowedPaymentMethods(fulfilment).includes(payment) || payment === "cash") {
    return Response.json(
      { error: "This payment method is not available for the selected fulfilment option." },
      { status: 400 },
    );
  }

  const lineItems = [];
  for (const item of items) {
    const product = products.find((candidate) => candidate.id === item.productId);
    const variant = product?.variants.find(
      (candidate) => candidate.id === item.variantId,
    );
    if (!product || !variant || variant.stock < item.quantity) {
      return Response.json(
        { error: "One or more items are no longer available in that quantity." },
        { status: 409 },
      );
    }
    lineItems.push({
      price_data: {
        currency: "myr",
        product_data: {
          name: product.name,
          description: `${variant.color} / ${variant.size}`,
        },
        unit_amount: product.price * 100,
      },
      quantity: item.quantity,
    });
  }

  if (fulfilment === "delivery") {
    lineItems.push({
      price_data: {
        currency: "myr",
        product_data: { name: "Malaysia delivery", description: "Flat-rate delivery" },
        unit_amount: DEFAULT_DELIVERY_FEE * 100,
      },
      quantity: 1,
    });
  }

  const orderNumber = makeOrderNumber();
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!stripe) {
    return Response.json({
      orderNumber,
      demo: true,
      message: "Stripe is not configured. A demo order was created.",
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    payment_method_types: payment === "fpx" ? ["fpx"] : ["card"],
    line_items: lineItems,
    success_url: `${appUrl}/order-success?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout`,
    metadata: {
      orderNumber,
      fulfilment,
      payment,
    },
  });

  return Response.json({ orderNumber, checkoutUrl: session.url });
}
