"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, setQuantity, removeItem, clearCart } = useCart();

  // Sends the cart to our API, then redirects to Stripe's payment page
  async function handleCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Only ids and quantities, the server looks up prices itself
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error ?? "Something went wrong");
  }

  // Add up price x quantity for every item (still in cents)
  const totalCents = items.reduce(
    (sum, i) => sum + i.price_cents * i.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link href="/products" className="mt-4 inline-block underline">
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">Your cart</h1>

      <ul className="mt-6 divide-y">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between py-4">
            <div>
              <p className="font-semibold">{i.name}</p>
              <p className="text-sm text-gray-600">
                ${(i.price_cents / 100).toFixed(2)} each
              </p>
              <p className="text-sm text-gray-600">
                Shipping and tax are calculated at checkout.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(i.id, i.quantity - 1)}
                className="rounded border px-2"
              >
                -
              </button>
              <span>{i.quantity}</span>
              {/* Disabled once you hit the available stock */}
              <button
                onClick={() => setQuantity(i.id, i.quantity + 1)}
                disabled={i.quantity >= i.stock}
                className="rounded border px-2 disabled:opacity-40"
              >
                +
              </button>
              <button
                onClick={() => removeItem(i.id)}
                className="ml-4 text-sm underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xl font-bold">
        Total: ${(totalCents / 100).toFixed(2)}
      </p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleCheckout}
          className="rounded bg-black px-6 py-3 text-white"
        >
          Checkout
        </button>
        <button onClick={clearCart} className="underline">
          Clear cart
        </button>
      </div>
    </main>
  );
}
