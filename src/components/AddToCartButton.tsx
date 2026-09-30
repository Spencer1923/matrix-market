"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false); // briefly true after a click, for feedback

  return (
    <button
      disabled={product.stock === 0}
      onClick={() => {
        // Only store what the cart needs, not the whole product
        addItem({
          id: product.id,
          name: product.name,
          price_cents: product.price_cents,
          stock: product.stock,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500); // back to normal after 1.5 seconds
      }}
      className="mt-6 w-full rounded-lg bg-electric px-6 py-3 font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60"
    >
      {product.stock === 0 ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
    </button>
  );
}