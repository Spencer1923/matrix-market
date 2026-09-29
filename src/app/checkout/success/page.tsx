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
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-3xl font-bold">Thank you for your order!</h1>
      <p className="mt-4 text-gray-600">
        Your payment was successful. A receipt will be sent to your email.
      </p>
      <Link href="/products" className="mt-6 inline-block underline">
        Continue shopping
      </Link>
    </main>
  );
}