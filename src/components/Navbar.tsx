"use client"; // uses the cart, which lives in the browser

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { items } = useCart();

  // Total number of units in the cart (3 of one item + 1 of another = 4)
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="flex items-center justify-between border-b px-8 py-4">
      <Link href="/" className="text-xl font-bold">
        Matrix Market
      </Link>
      <div className="flex gap-6">
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <Link href="/cart" className="hover:underline">
          Cart ({count})
        </Link>
      </div>
    </nav>
  );
}