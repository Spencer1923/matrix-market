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
    <main className="mx-auto max-w-5xl px-8 py-10">
      <Link href="/products" className="text-sm text-electric hover:underline">
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Big photo panel */}
        <div className="relative h-80 overflow-hidden rounded-xl bg-cool md:h-[28rem]">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-6"
            />
          )}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-electric">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-navy">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-navy">
            ${(product.price_cents / 100).toFixed(2)}
          </p>
          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          {/* Stock message: warns when only a few are left */}
          <p className={`mt-6 text-sm font-medium ${product.stock > 0 ? "text-electric" : "text-muted"}`}>
            {product.stock === 0
              ? "Out of stock"
              : product.stock <= 5
                ? `Only ${product.stock} left`
                : "In stock"}
          </p>

          <AddToCartButton product={product} />
          <p className="mt-4 text-sm text-muted">Free shipping on orders over $150.</p>
        </div>
      </div>
    </main>
  );
}