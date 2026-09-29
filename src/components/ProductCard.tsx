import Link from "next/link";
import type { Product } from "@/types/product";
import Image from "next/image";

// Shows one product. The "product" comes in as a prop from whichever page uses it
export default function ProductCard({ product }: { product: Product }) {
  return (
    // Link makes the whole card clickable (page doesn't exist yet, so it will 404 until Step 6)
    <Link
      href={`/products/${product.id}`}
      className="block rounded-lg border p-4 shadow-sm transition hover:shadow-md"
    >
      {/* Grey box stands in for a photo until we add images */}
            {/* Photo box: "relative" + "fill" makes the image fill this box */}
      <div className="relative h-40 overflow-hidden rounded bg-gray-100">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-2"
          />
        )}
      </div>
      <h2 className="mt-3 font-semibold">{product.name}</h2>
      {/* Prices are stored in cents, so divide by 100 for display */}
      <p className="text-lg">${(product.price_cents / 100).toFixed(2)}</p>
      {/* Show stock status based on the inventory number */}
      <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
        {product.stock > 0 ? "In stock" : "Out of stock"}
      </p>
    </Link>
  );
}