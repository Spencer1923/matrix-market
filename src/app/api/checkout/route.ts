import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/product";

// Runs on the server when the browser POSTs to /api/checkout
export async function POST(req: Request) {
  // We only trust id and quantity from the browser, never prices
  const { items } = (await req.json()) as {
    items: { id: number; quantity: number }[];
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Fetch the real products from the database
  const { data } = await supabase
    .from("products")
    .select("*")
    .in(
      "id",
      items.map((i) => i.id),
    );
  const products = (data ?? []) as Product[];

  // Build Stripe's list of things being bought
  let subtotal = 0; // running total of the cart, in cents
  const line_items = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.id);

    // Reject unknown products, bad quantities, or more than we have in stock
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
    }
    if (item.quantity > product.stock) {
      return NextResponse.json(
        { error: `Only ${product.stock} of ${product.name} in stock` },
        { status: 400 },
      );
    }
    subtotal += product.price_cents * item.quantity;

    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: "cad",
        unit_amount: product.price_cents,
        // Prices are shown before tax, and tax is added on top at checkout
        tax_behavior: "exclusive",
        // General physical goods; lets Stripe Tax pick the right rate
        product_data: { name: product.name, tax_code: "txcd_99999999" },
      },
    });
  }

  // Free shipping at $150 or more, otherwise a flat $9.99 (cents)
  const shippingCents = subtotal >= 15000 ? 0 : 999;

  // Ask Stripe for a hosted payment page
  const session = await stripe.checkout.sessions.create({
    mode: "payment", // one-time payment (not a subscription)
    line_items,
    // Stripe shows an address form; only these countries can be selected
    shipping_address_collection: { allowed_countries: ["CA", "US"] },
        // One shipping option; the price is decided here on the server
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: shippingCents, currency: "cad" },
          display_name: shippingCents === 0 ? "Free shipping" : "Standard shipping",
          tax_behavior: "exclusive",
          tax_code: "txcd_92010001", // Stripe's "shipping" category
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
    // Stripe calculates tax from the shipping address
    automatic_tax: { enabled: true },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    // Saved on the payment so we know what was bought (used for inventory later)
    metadata: { items: JSON.stringify(items) },
  });

  // Send the payment page's URL back to the browser
  return NextResponse.json({ url: session.url });
}
