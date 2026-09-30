import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { setOrderStatus } from "../actions";

// Shapes of the data we read back, so the editor can autocomplete fields
type OrderItem = { id: number; name: string; quantity: number; unit_price_cents: number };
type Order = {
  id: number;
  customer_email: string | null;
  total_cents: number;
  currency: string;
  created_at: string;
  status: string;
  shipping_name: string | null;
  shipping_address: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  order_items: OrderItem[];
};

export default async function OrdersPage() {
  // "*, order_items(*)" fetches each order plus its items in one request
  const { data } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100); // the latest 100 for now
  const orders = (data ?? []) as Order[];

    return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <Link href="/admin" className="text-sm text-electric hover:underline">
        ← Back to admin
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-navy">Orders</h1>

      {orders.length === 0 && <p className="mt-6 text-muted">No orders yet.</p>}

      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="rounded-xl border border-navy/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-navy">Order #{o.id}</p>
              {/* Status pill: cyan when shipped, blue when new */}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  o.status === "shipped" ? "bg-aqua/20 text-electric" : "bg-skyblue/20 text-navy"
                }`}
              >
                {o.status === "shipped" ? "Shipped" : "New"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {new Date(o.created_at).toLocaleString("en-CA")} · {o.customer_email ?? "No email"}
            </p>

            {/* Shipping address (older orders won't have one) */}
            {o.shipping_address && (
              <p className="mt-1 text-sm text-muted">
                Ship to: {o.shipping_name}, {o.shipping_address.line1}
                {o.shipping_address.line2 ? `, ${o.shipping_address.line2}` : ""},{" "}
                {o.shipping_address.city}, {o.shipping_address.state}{" "}
                {o.shipping_address.postal_code}, {o.shipping_address.country}
              </p>
            )}

            <ul className="mt-4 divide-y divide-navy/10 text-sm">
              {o.order_items.map((i) => (
                <li key={i.id} className="flex justify-between py-2">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <span>${((i.unit_price_cents * i.quantity) / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between">
              {/* Button flips the status: new -> shipped, or shipped -> new */}
              <form action={setOrderStatus}>
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value={o.status === "shipped" ? "new" : "shipped"} />
                <button className="rounded-lg border border-electric px-3 py-1 text-sm font-medium text-electric transition hover:bg-electric hover:text-white">
                  {o.status === "shipped" ? "Mark as new" : "Mark as shipped"}
                </button>
              </form>
              {/* total_cents is what Stripe actually charged */}
              <p className="font-bold text-navy">
                Total: ${(o.total_cents / 100).toFixed(2)} {o.currency.toUpperCase()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}