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
    <main className="p-8">
      <h1 className="text-3xl font-bold">All Products</h1>

      {/* Search: a plain form that reloads the page with ?q=... (no JavaScript needed) */}
      <form className="mt-4 flex gap-2">
        {/* Keep the chosen category when searching */}
        {category && <input type="hidden" name="category" value={category} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products"
          className="w-full max-w-sm rounded border p-2"
        />
        <button className="rounded bg-black px-4 py-2 text-white">Search</button>
      </form>

      {/* Category links: the current one is bold */}
      <div className="mt-4 flex flex-wrap gap-4">
        <Link href="/products" className={!category ? "font-bold underline" : "hover:underline"}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/products?category=${encodeURIComponent(c)}`}
            className={category === c ? "font-bold underline" : "hover:underline"}
          >
            {c}
          </Link>
        ))}
      </div>

      {/* Responsive grid: 1 column on phones, 2 on small screens, 4 on large */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Shown when the filters match nothing */}
      {products.length === 0 && <p className="mt-6 text-gray-600">No products found.</p>}
    </main>
  );
}