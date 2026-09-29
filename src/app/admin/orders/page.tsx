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
    <main className="mx-auto max-w-3xl p-8">
      <Link href="/admin" className="text-sm underline">
        ← Back to admin
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Orders</h1>

      {orders.length === 0 && <p className="mt-6 text-gray-600">No orders yet.</p>}

      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="rounded border p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">Order #{o.id}</p>
              <p className="text-sm text-gray-600">
                {new Date(o.created_at).toLocaleString("en-CA")}
              </p>
            </div>
            <p className="text-sm text-gray-600">{o.customer_email ?? "No email"}</p>
            {/* Shipping address (orders made before this step won't have one) */}
            {o.shipping_address && (
              <p className="mt-1 text-sm text-gray-600">
                Ship to: {o.shipping_name}, {o.shipping_address.line1}
                {o.shipping_address.line2 ? `, ${o.shipping_address.line2}` : ""},{" "}
                {o.shipping_address.city}, {o.shipping_address.state}{" "}
                {o.shipping_address.postal_code}, {o.shipping_address.country}
              </p>
            )}

            <ul className="mt-3 text-sm">
              {o.order_items.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <span>${((i.unit_price_cents * i.quantity) / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            {/* total_cents is what Stripe actually charged */}
                       <div className="mt-3 flex items-center justify-between">
              {/* Button flips the status: new -> shipped, or shipped -> new */}
              <form action={setOrderStatus} className="flex items-center gap-3">
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value={o.status === "shipped" ? "new" : "shipped"} />
                <span className={o.status === "shipped" ? "text-green-600" : "text-orange-600"}>
                  {o.status === "shipped" ? "Shipped" : "New"}
                </span>
                <button className="rounded border px-3 py-1 text-sm">
                  {o.status === "shipped" ? "Mark as new" : "Mark as shipped"}
                </button>
              </form>
              {/* total_cents is what Stripe actually charged */}
              <p className="font-bold">
                Total: ${(o.total_cents / 100).toFixed(2)} {o.currency.toUpperCase()}
              </p>
            </div>
              Total: ${(o.total_cents / 100).toFixed(2)} {o.currency.toUpperCase()}            
          </li>
        ))}
      </ul>
    </main>
  );
}