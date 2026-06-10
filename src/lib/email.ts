import "server-only";

import { Resend } from "resend";

export async function sendOrderStatusEmail(input: {
  to: string;
  orderNumber: string;
  status: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.ORDER_EMAIL_FROM) {
    return { skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: process.env.ORDER_EMAIL_FROM,
    to: input.to,
    subject: `Order ${input.orderNumber}: ${input.status}`,
    html: `<p>Your Lumière Atelier order <strong>${input.orderNumber}</strong> is now <strong>${input.status}</strong>.</p>`,
  });

  return { skipped: false, result };
}
