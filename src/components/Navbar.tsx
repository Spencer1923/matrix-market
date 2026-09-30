"use client"; // uses the cart, which lives in the browser

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { items } = useCart();

  // Total number of units in the cart
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
        <nav className="flex items-center justify-between border-b border-navy/10 bg-white px-8 py-2">
      <Link href="/" aria-label="Matrix Market home">
        {/* h-8 sets the height; w-auto keeps your logo's proportions */}
        <Image src="/logo.svg" alt="Matrix Market" width={1024} height={931} priority className="h-32 w-auto" />
      </Link>
      <div className="flex items-center gap-6 text-navy">
        <Link href="/products" className="hover:text-electric">
          Products
        </Link>
        <Link href="/cart" className="flex items-center gap-2 hover:text-electric">
          Cart
          {/* Blue pill showing the item count */}
          <span className="rounded-full bg-electric px-2 py-0.5 text-xs font-semibold text-white">
            {count}
          </span>
        </Link>
      </div>
    </nav>
  );
}