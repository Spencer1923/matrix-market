"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      disabled={product.stock === 0}
      // Only store what the cart needs, not the whole product
      onClick={() =>
        addItem({
          id: product.id,
          name: product.name,
          price_cents: product.price_cents,
          stock: product.stock,
        })
      }
      className="mt-6 rounded bg-black px-6 py-3 text-white disabled:opacity-40"
    >
      Add to cart
    </button>
  );
}
