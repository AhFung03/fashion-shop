import { z } from "zod";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1),
  fulfilment: z.enum(["delivery", "pickup"]),
  payment: z.enum(["card", "fpx", "cash"]),
  customerEmail: z.email(),
});
