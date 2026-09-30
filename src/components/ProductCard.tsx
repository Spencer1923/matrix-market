import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

// Shows one product. The "product" comes in as a prop from whichever page uses it
export default function ProductCard({ product }: { product: Product }) {
  return (
    // "group" lets the image react when the whole card is hovered
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-ink/10 bg-surface transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Photo area: light gray background, image zooms slightly on hover */}
      <div className="relative h-48 bg-panel">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-4 transition group-hover:scale-105"
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
          <p className="text-lg font-bold text-ink">
            ${(product.price_cents / 100).toFixed(2)}
          </p>
          <span className={product.stock > 0 ? "text-sm text-link" : "text-sm text-muted"}>
            {product.stock > 0 ? "In stock" : "Sold out"}
          </span>
        </div>
      </div>
    </Link>
  );
}