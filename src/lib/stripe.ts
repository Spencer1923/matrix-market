import Stripe from "stripe";

// One shared Stripe client for server code only (API routes).
// Never import this into a file that starts with "use client".
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);