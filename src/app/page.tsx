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
            {/* Hero: gradient background with soft glowing blobs behind the text */}
      <section className="relative overflow-hidden bg-gradient-to-b from-panel to-surface">
        <div className="animate-float absolute -left-24 -top-24 h-72 w-72 rounded-full bg-electric/20 blur-3xl" />
        <div
          className="animate-float absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-aqua/20 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
        <div className="relative mx-auto max-w-6xl px-8 py-24 text-center sm:py-32">
          <span className="animate-fade-up inline-block rounded-full border border-electric/30 bg-electric/10 px-4 py-1 text-sm font-medium text-link">
            Free shipping on orders over $150
          </span>
          {/* Delays are inline so each line fades in one after the other */}
          <h1
            className="animate-fade-up mt-6 text-5xl font-extrabold tracking-tight text-ink sm:text-7xl"
            style={{ animationDelay: "100ms" }}
          >
            Tech that{" "}
            <span className="bg-gradient-to-r from-electric to-aqua bg-clip-text text-transparent">
              powers
            </span>{" "}
            your setup
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-lg text-muted"
            style={{ animationDelay: "200ms" }}
          >
            TVs, speakers, and games, all in one place.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: "300ms" }}
          >
            <Link href="/products" className="btn-primary rounded-xl px-8 py-3.5">
              Shop all products
            </Link>
            <a
              href="#categories"
              className="rounded-xl border border-ink/20 px-8 py-3.5 font-semibold text-ink transition hover:border-electric hover:text-link"
            >
              Browse categories
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-ink/10 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-8 py-6 text-sm sm:grid-cols-3">
          {[
            ["Free shipping over $150", "Delivered across Canada and the US"],
            ["Hassle-free returns", "See our returns policy"],
            ["Secure checkout", "Payments powered by Stripe"],
          ].map(([title, sub]) => (
            <div key={title} className="flex items-center justify-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aqua/20 text-link">
                ✓
              </span>
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category tiles: each links to the filtered products page */}
      <section id="categories" className="mx-auto max-w-6xl px-8 py-14">
        <h2 className="text-2xl font-bold text-ink">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
                            className="rounded-2xl border border-ink/10 bg-panel p-8 text-center text-lg font-semibold capitalize text-ink transition duration-300 hover:-translate-y-1 hover:border-electric/50 hover:text-link hover:shadow-xl hover:shadow-electric/10">
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
          {featured.map((p, i) => (
            <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}