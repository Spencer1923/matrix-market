import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { addProduct, updateProduct } from "./actions";
import type { Product } from "@/types/product";
import Link from "next/link";

export default async function AdminPage() {
  async function logout() {
    "use server";
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
    redirect("/login");
  }

  // Server-side fetch using the admin client
  const { data } = await supabaseAdmin.from("products").select("*").order("id");
  const products = (data ?? []) as Product[];

  // Shared look for every text input on this page
  const input =
    "rounded-lg border border-navy/20 px-3 py-2 focus:border-electric focus:outline-none";

    return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy">Admin</h1>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/admin/orders" className="font-medium text-electric hover:underline">
            Orders
          </Link>
          <form action={logout}>
            <button className="text-muted hover:underline">Log out</button>
          </form>
        </div>
      </div>

      {/* Add a new product */}
      <section className="mt-8 rounded-xl bg-cool p-6">
        <h2 className="text-lg font-bold text-navy">Add product</h2>
        <form action={addProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="name" placeholder="Name" required className={input} />
          <input name="category" placeholder="Category (tvs, speakers, games)" required className={input} />
          <input name="price" type="number" step="0.01" min="0" placeholder="Price (e.g. 499.99)" required className={input} />
          <input name="stock" type="number" min="0" step="1" placeholder="Stock" required className={input} />
          <input name="description" placeholder="Description (optional)" className={`${input} sm:col-span-2`} />
          <input name="image" type="file" accept="image/png,image/jpeg,image/webp" className={`${input} bg-white sm:col-span-2`} />
          <button className="rounded-lg bg-electric px-4 py-2 font-semibold text-white transition hover:bg-navy sm:col-span-2">
            Add product
          </button>
        </form>
      </section>

      {/* Edit price, stock, and photo of existing products */}
      <h2 className="mt-10 text-lg font-bold text-navy">Products</h2>
      <ul className="mt-3 divide-y divide-navy/10 rounded-xl border border-navy/10">
        {products.map((p) => (
          <li key={p.id} className="p-4">
            <form action={updateProduct} className="flex flex-wrap items-center gap-3">
              {/* Hidden field tells the action which product this row is */}
              <input type="hidden" name="id" value={p.id} />
              <div className="min-w-40 flex-1">
                <p className="font-medium text-navy">{p.name}</p>
                <p className="text-xs uppercase tracking-wide text-muted">{p.category}</p>
              </div>
              <label className="text-sm text-muted">
                Price $
                <input name="price" type="number" step="0.01" min="0" defaultValue={(p.price_cents / 100).toFixed(2)} className={`${input} ml-1 w-24 py-1`} />
              </label>
              <label className="text-sm text-muted">
                Stock
                <input name="stock" type="number" min="0" step="1" defaultValue={p.stock} className={`${input} ml-1 w-20 py-1`} />
              </label>
              <input name="image" type="file" accept="image/png,image/jpeg,image/webp" className="w-56 text-sm text-muted" />
              <button className="rounded-lg border border-electric px-4 py-1.5 text-sm font-medium text-electric transition hover:bg-electric hover:text-white">
                Save
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
