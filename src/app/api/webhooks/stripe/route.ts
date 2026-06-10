import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !secret || !signature) {
    return Response.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Production: update the matching Supabase order in one transaction.
    console.info("Stripe payment completed", session.metadata?.orderNumber);
  }

  return Response.json({ received: true });
}
