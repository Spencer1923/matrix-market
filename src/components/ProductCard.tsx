import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

// Shows one product. The "product" comes in as a prop from whichever page uses it
export default function ProductCard({ product }: { product: Product }) {
  return (
    // "group" lets the image react when the whole card is hovered
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-surface transition duration-300 hover:-translate-y-1.5 hover:border-electric/40 hover:shadow-xl hover:shadow-electric/10"
    >
      {/* Photo area with a soft gradient; the image zooms on hover */}
      <div className="relative h-52 bg-gradient-to-b from-panel to-surface">
        {/* Badges in the corner */}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-electric px-3 py-1 text-xs font-semibold text-white shadow-md">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-white shadow-md">
            Sold out
          </span>
        )}
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-5 transition duration-500 group-hover:scale-110"
          />
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-link">
          {product.category}
        </p>
        <h2 className="mt-1 font-semibold text-ink">{product.name}</h2>
        <div className="mt-3 flex items-center justify-between">
          {/* Prices are stored in cents, so divide by 100 for display */}
          <p className="text-xl font-bold text-ink">
            ${(product.price_cents / 100).toFixed(2)}
          </p>
          <span className="text-sm font-medium text-link opacity-0 transition group-hover:opacity-100">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}