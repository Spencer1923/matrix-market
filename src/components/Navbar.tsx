"use client"; // uses the cart, which lives in the browser

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { items } = useCart();

  // Total number of units in the cart
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

    // Underline that grows from the left on hover
  const underline =
    "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-electric after:transition-all after:duration-300 hover:after:w-full";

    return (
    <nav className="flex items-center justify-between border-b border-ink/10 bg-surface px-8 py-2">
      <Link href="/" aria-label="Matrix Market home">
        {/* h-32 sets the height; w-auto keeps your logo's proportions */}
        <Image src="/logo.svg" alt="Matrix Market" width={1024} height={931} priority className="h-32 w-auto" />
      </Link>
      <div className="flex items-center gap-6 text-ink">
        <Link href="/products" className={`hover:text-link ${underline}`}>
          Products
        </Link>
        <Link href="/cart" className="flex items-center gap-2 hover:text-link">
          Cart
          {/* Blue pill showing the item count */}
          <span className="rounded-full bg-electric px-2 py-0.5 text-xs font-semibold text-white">
            {count}
          </span>
        </Link>
        {/* Outside the Cart link, so clicking it only switches the theme */}
        <ThemeToggle />
      </div>
    </nav>
  );
}