# Lumière Atelier

A mobile-friendly fashion shop built with Next.js, TypeScript, Tailwind CSS,
Supabase, Stripe Checkout, and Resend.

## Included

- Product catalogue with size and colour stock variants
- Persistent guest cart with account-required checkout
- Malaysia delivery and free store pickup
- Card and FPX payments, plus cash for pickup
- Customer order history and status tracking
- Owner dashboard for orders, products, announcements, and delivery settings
- Stripe webhook, Supabase schema with Row Level Security, and email helper

The app runs in demo mode without external credentials. Demo authentication and
orders use browser state and seeded data. Add production credentials to connect
the existing integration modules.

## GitHub Pages demo

The repository includes a GitHub Actions workflow that publishes a static demo.
The demo keeps the storefront, cart, account gate, checkout choices, sample
orders, and owner dashboard. Checkout creates a browser-only sample order, so it
does not take payment or write to a live database.

In the GitHub repository settings, select **GitHub Actions** as the Pages source.
The public demo will then be available at:

`https://ahfung03.github.io/fashion-shop/`

## Run locally

```powershell
npm.cmd run dev
```

Open `http://localhost:3000`. The owner dashboard is at `/dashboard`.

## Production setup

1. Copy `.env.example` to `.env.local` and fill in Supabase, Stripe, and Resend values.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create a public Supabase Storage bucket for product images.
4. Register `/api/webhooks/stripe` as a Stripe webhook endpoint for
   `checkout.session.completed`.
5. Give the shop owner a `profiles.role` value of `owner`.

The current UI uses seeded products until the product queries are switched to
Supabase. Checkout already validates prices and stock from trusted server-side
data rather than accepting totals from the browser.
