# Matrix Market

A full-stack e-commerce store for tech products TVs, speakers, games etc... built with Next.js, Supabase, and Stripe.

> **Portfolio demo.** Stripe runs in test mode and no real products are sold. To try checkout, use card `4242 4242 4242 4242` with any future expiry date and any CVC.

**Live demo:** https://the-matrix-market.netlify.app/cart

## Features

**Storefront**
- Product catalog with category filters and search
- Product pages with images, live stock, and low-stock warnings
- Persistent cart with quantity controls and stock limits
- Light and dark themes with a saved preference

**Checkout and orders**
- Stripe Checkout with shipping address collection
- Flat-rate shipping with a free-shipping threshold
- Automatic sales tax with Stripe Tax
- Webhook that saves each order and reduces inventory

**Admin dashboard**
- Email and password login (Supabase Auth), restricted to one admin account
- Add products, edit price and stock, and upload photos
- Orders list with shipping details and a shipped/new status

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Database, auth, files | Supabase (PostgreSQL, Auth, Storage) |
| Payments | Stripe Checkout, Stripe Tax, webhooks |
| Hosting | Netlify |

## Design decisions

- **Prices are never trusted from the browser.** The cart sends only product IDs and quantities. The server looks up real prices and stock in the database before creating the Stripe session.
- **Orders come from the webhook, not the success page.** The Stripe webhook verifies its signature, saves the order, and lowers stock. A unique constraint on the Stripe session ID stops a repeated event from being processed twice.
- **Database permissions are locked down.** Row Level Security is on for every table, and the public key can only read products. Writes go through server-only code using a separate secret key.
- **Admin actions re-check identity.** Each server action confirms the caller is the admin instead of relying on the page being hidden.
- **Stock changes happen in the database.** A SQL function only subtracts stock when enough remains, so stock can't go negative.

## Getting started

```bash
git clone https://github.com/Spencer1923/matrix-market
cd matrix-market
npm install
cp .env.example .env.local   # then fill in the values
```

**Environment variables**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` |  Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key (read-only access via RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Supabase key, server only |
| `STRIPE_SECRET_KEY` | Stripe test secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the Stripe webhook |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |
| `ADMIN_EMAIL` | Email of the one account allowed into `/admin` |

**Supabase setup**
1. Create a project and run `supabase/schema.sql` in the SQL Editor.
2. Under **Authentication**, create your admin user and turn off public sign-ups.

**Stripe setup**
1. Use test mode, and add a tax registration under **Tax** if you want tax calculated.
2. Forward webhooks to your local server:

```bash
stripe listen --events checkout.session.completed --forward-to localhost:3000/api/webhooks/stripe
```

Copy the signing secret it prints into `STRIPE_WEBHOOK_SECRET`, then start the app:

```bash
npm run dev
```

## Project structure

```
src/
  app/
    api/checkout/          creates the Stripe Checkout session
    api/webhooks/stripe/   handles payment events (orders and stock)
    products/              catalog and product pages
    cart/  checkout/       cart and thank-you page
    admin/                 protected dashboard and orders
    login/                 admin login
  components/              navbar, footer, product card, cart button, theme toggle
  context/                 cart state
  lib/                     Supabase and Stripe clients
supabase/schema.sql        database setup
```

## Possible improvements

- Order confirmation and shipping emails
- Reserve stock at checkout to fully prevent overselling
- Product archiving and editing of names and descriptions
- Automated tests for the checkout and webhook logic