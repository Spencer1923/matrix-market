import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  // Stripe's signature check needs the raw text body, not parsed JSON
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  // Verify the message really came from Stripe
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // We only care about completed checkouts
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Only reduce stock if the money was actually collected
    if (session.payment_status === "paid") {
      // Read back the items we saved in metadata during checkout
      const items = JSON.parse(session.metadata?.items ?? "[]") as {
        id: number;
        quantity: number;
      }[];

      // 1. Save the order. The unique session id means a repeat event fails here
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          stripe_session_id: session.id,
          customer_email: session.customer_details?.email ?? null,
          total_cents: session.amount_total ?? 0,
          currency: session.currency ?? "cad",
          // Newer Stripe versions keep the address under collected_information
          shipping_name:
            session.collected_information?.shipping_details?.name ?? null,
          shipping_address:
            session.collected_information?.shipping_details?.address ?? null,
          shipping_cents: session.total_details?.amount_shipping ?? 0,
          tax_cents: session.total_details?.amount_tax ?? 0,
        })
        .select("id")
        .single();

      if (orderError) {
        // 23505 = duplicate, meaning we already handled this payment, so stop quietly
        if (orderError.code === "23505") {
          return NextResponse.json({ received: true });
        }
        // Any other error: return 500 so Stripe retries later
        console.error("Order save failed:", orderError);
        return NextResponse.json(
          { error: "Order save failed" },
          { status: 500 },
        );
      }

      // 2. Look up names and prices to store with the order
      const { data: products } = await supabaseAdmin
        .from("products")
        .select("id, name, price_cents")
        .in(
          "id",
          items.map((i) => i.id),
        );

      const rows = items.flatMap((item) => {
        const p = products?.find((x) => x.id === item.id);
        return p
          ? [
              {
                order_id: order.id,
                product_id: p.id,
                name: p.name,
                quantity: item.quantity,
                unit_price_cents: p.price_cents,
              },
            ]
          : [];
      });

      const { error: itemsError } = await supabaseAdmin
        .from("order_items")
        .insert(rows);
      if (itemsError) console.error("Order items failed:", itemsError);

      // 3. Lower stock for each item using the function from Step 12
      for (const item of items) {
        const { error } = await supabaseAdmin.rpc("decrement_stock", {
          p_id: item.id,
          p_qty: item.quantity,
        });
        if (error) console.error("Stock update failed:", item.id, error);
      }
    }
  }
  // Tell Stripe we received it (otherwise it keeps retrying)
  return NextResponse.json({ received: true });
}
