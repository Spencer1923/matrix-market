"use client"; // needs the cart, which lives in the browser

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

    // Runs once when the page loads: the payment is done, so empty the cart
  useEffect(() => {
    // Child effects run before the provider's load effect, so removing the saved
    // cart first means the provider finds nothing to restore
    localStorage.removeItem("cart");
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    return (
    <main className="mx-auto max-w-xl px-8 py-20 text-center">
      {/* Check mark in a soft cyan circle */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aqua/20 text-3xl text-electric">
        ✓
      </div>
      <h1 className="mt-6 text-3xl font-bold text-navy">Thank you for your order!</h1>
      <p className="mt-4 text-muted">
        This was a demo order placed with a Stripe test card, so no real payment was taken.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-lg bg-electric px-8 py-3 font-semibold text-white transition hover:bg-navy"
      >
        Continue shopping
      </Link>
    </main>
  );
}