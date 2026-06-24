# CarCare Demo

A demo car care booking app built with Next.js, TypeScript, Tailwind CSS, and browser storage.

## Included

- Customer car brand and car type selection
- Tyre size and battery size fitment lookup
- Tyre and battery stock filtered by matching size
- Booking request flow with estimated price
- Admin dashboard for customer requests, final quotes, availability, and status
- Admin stock manager for tyre and battery price, size, quantity, and active state
- Admin fitment manager for car type to tyre and battery size mapping
- Demo customer and admin sign-in

## Run locally

```powershell
npm.cmd run dev
```

Open `http://localhost:3000`.

The admin dashboard is at `http://localhost:3000/dashboard`. Use the demo admin button if you are not signed in.

## Checks

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

## Data mode

This version uses browser localStorage as the demo database. Admin changes persist in the same browser until the demo data is reset or browser storage is cleared. Supabase files are still in the repository for a future real SQL database version, but this flow does not depend on Supabase.
