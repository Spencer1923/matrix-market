import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  // Read the filters from the URL (?category=tvs&q=samsung)
  const { category, q } = await searchParams;

  // Start with all products, then add filters only if they were set
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category); // exact category match
  if (q) query = query.ilike("name", `%${q}%`); // name contains q, ignoring capitals
  const { data } = await query;
  const products = (data ?? []) as Product[];

  // Build the category links from what's actually in the database
  const { data: cats } = await supabase.from("products").select("category");
  const categories = [...new Set((cats ?? []).map((c) => c.category as string))].sort();

    return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <h1 className="text-3xl font-bold text-ink">All Products</h1>

      {/* Search: a plain form that reloads the page with ?q=... */}
      <form className="mt-6 flex gap-2">
        {/* Keep the chosen category when searching */}
        {category && <input type="hidden" name="category" value={category} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products"
          className="w-full max-w-sm rounded-lg border border-ink/20 px-4 py-2 focus:border-electric focus:outline-none"
        />
        <button className="rounded-lg bg-electric px-5 py-2 font-semibold text-white transition hover:bg-accent-hover">
          Search
        </button>
      </form>

      {/* Category pills: the selected one is filled in navy */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            !category ? "bg-electric text-white" : "bg-panel text-ink hover:bg-skyblue/30"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/products?category=${encodeURIComponent(c)}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              category === c ? "bg-electric text-white" : "bg-panel text-ink hover:bg-skyblue/30"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {/* Responsive grid: 1 column on phones, 2 on small screens, 4 on large */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Shown when the filters match nothing */}
      {products.length === 0 && <p className="mt-8 text-muted">No products found.</p>}
    </main>
  );
}