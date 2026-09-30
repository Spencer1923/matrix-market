import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

export default async function Home() {
  // The 4 newest products for the featured row
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);
  const featured = (data ?? []) as Product[];

  // Category tiles, built from whatever categories exist in the database
  const { data: cats } = await supabase.from("products").select("category");
  const categories = [...new Set((cats ?? []).map((c) => c.category as string))].sort();

  return (
    <main>
      {/* Hero: big headline and a call-to-action button */}
      <section className="bg-panel">
        <div className="mx-auto max-w-6xl px-8 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-bold text-ink sm:text-6xl">
            Tech that <span className="text-link">powers</span> your setup
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            TVs, speakers, and games, all in one place.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-electric px-8 py-3 font-semibold text-white transition hover:bg-accent-hover"
          >
            Shop all products
          </Link>
        </div>
      </section>

      {/* Category tiles: each links to the filtered products page */}
      <section className="mx-auto max-w-6xl px-8 py-14">
        <h2 className="text-2xl font-bold text-ink">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="rounded-xl border border-ink/10 bg-panel p-8 text-center text-lg font-semibold capitalize text-ink transition hover:border-electric hover:bg-surface hover:text-link"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-8 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-ink">New arrivals</h2>
          <Link href="/products" className="text-link hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}