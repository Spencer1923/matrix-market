import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/product";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";

// Next.js passes the URL's [id] in via "params" (a Promise in recent versions, so we await it)
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // .eq("id", id) = only the row where id matches; .single() = expect exactly one
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  // No row found (e.g. /products/999) shows Next.js's built-in 404 page
  if (!data) notFound();
  const product = data as Product;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link href="/products" className="text-sm underline">
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {/* Grey placeholder until we add real images */}
                <div className="relative h-64 overflow-hidden rounded bg-gray-100">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-contain p-2"
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl">
            ${(product.price_cents / 100).toFixed(2)}
          </p>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <p className={product.stock > 0 ? "mt-4 text-green-600" : "mt-4 text-red-600"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {/* Does nothing yet; we'll wire it up when we build the cart */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}