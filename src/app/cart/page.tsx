"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// Display only: the server (/api/checkout) makes the real shipping decision
const FREE_SHIPPING_CENTS = 15000;

export default function CartPage() {
  const { items, setQuantity, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false); // disables the button while redirecting

  // Add up price x quantity for every item (still in cents)
  const totalCents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
  const remaining = FREE_SHIPPING_CENTS - totalCents;

  // Sends the cart to our API, then redirects to Stripe's payment page
  async function handleCheckout() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Only ids and quantities, the server looks up prices itself
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error ?? "Something went wrong");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-8 py-20 text-center">
        <h1 className="text-3xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-3 text-muted">Looks like you have not added anything yet.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-electric px-8 py-3 font-semibold text-white transition hover:bg-accent-hover"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <h1 className="text-3xl font-bold text-ink">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Item list takes 2 of 3 columns on large screens */}
        <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 lg:col-span-2">
          {items.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-40 flex-1">
                <Link href={`/products/${i.id}`} className="font-semibold text-ink hover:text-link">
                  {i.name}
                </Link>
                <p className="text-sm text-muted">${(i.price_cents / 100).toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(i.id, i.quantity - 1)}
                  className="h-8 w-8 rounded-full border border-ink/20 text-ink transition hover:border-electric hover:text-link"
                >
                  -
                </button>
                <span className="w-6 text-center font-medium">{i.quantity}</span>
                {/* Disabled once you hit the available stock */}
                <button
                  onClick={() => setQuantity(i.id, i.quantity + 1)}
                  disabled={i.quantity >= i.stock}
                  className="h-8 w-8 rounded-full border border-ink/20 text-ink transition hover:border-electric hover:text-link disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <div className="w-24 text-right">
                <p className="font-bold text-ink">
                  ${((i.price_cents * i.quantity) / 100).toFixed(2)}
                </p>
                <button onClick={() => removeItem(i.id)} className="text-sm text-muted hover:text-link hover:underline">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Order summary card */}
        <aside className="h-fit rounded-xl bg-panel p-6">
          <h2 className="text-lg font-bold text-ink">Order summary</h2>
          <div className="mt-4 flex justify-between text-ink">
            <span>Subtotal</span>
            <span className="font-bold">${(totalCents / 100).toFixed(2)}</span>
          </div>
          <p className="mt-2 text-sm text-muted">Shipping and tax are calculated at checkout.</p>

          {/* Free shipping progress message */}
          <p className="mt-4 text-sm font-medium text-link">
            {remaining > 0
              ? `Add $${(remaining / 100).toFixed(2)} more for free shipping`
              : "You've unlocked free shipping!"}
          </p>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-electric px-6 py-3 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? "Redirecting..." : "Checkout"}
          </button>
          <button onClick={clearCart} className="mt-3 w-full text-sm text-muted hover:underline">
            Clear cart
          </button>
        </aside>
      </div>
    </main>
  );
}