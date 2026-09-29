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

  return (
    <main className="mx-auto max-w-3xl p-8">
            <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin</h1>
        <div className="flex gap-4">
          <Link href="/admin/orders" className="underline">
            Orders
          </Link>
          <form action={logout}>
            <button className="underline">Log out</button>
          </form>
        </div>
      </div>

      {/* Add a new product */}
      <h2 className="mt-8 text-xl font-semibold">Add product</h2>
      <form action={addProduct} className="mt-3 grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder="Name" required className="rounded border p-2" />
        <input name="category" placeholder="Category (tvs, speakers, games)" required className="rounded border p-2" />
        <input name="price" type="number" step="0.01" min="0" placeholder="Price (e.g. 499.99)" required className="rounded border p-2" />
        <input name="stock" type="number" min="0" step="1" placeholder="Stock" required className="rounded border p-2" />
        <input name="description" placeholder="Description (optional)" className="rounded border p-2 sm:col-span-2" />
        <input name="image" type="file" accept="image/png,image/jpeg,image/webp" className="rounded border p-2 sm:col-span-2" />
        <button className="rounded bg-black px-4 py-2 text-white sm:col-span-2">Add product</button>
      </form>

      {/* Edit price and stock of existing products */}
      <h2 className="mt-10 text-xl font-semibold">Products</h2>
      <ul className="mt-3 divide-y">
        {products.map((p) => (
          <li key={p.id} className="py-3">
            <form action={updateProduct} className="flex flex-wrap items-center gap-3">
              {/* Hidden field tells the action which product this row is */}
              <input type="hidden" name="id" value={p.id} />
              <span className="min-w-40 flex-1 font-medium">{p.name}</span>
              <label className="text-sm">
                Price $
                <input name="price" type="number" step="0.01" min="0" defaultValue={(p.price_cents / 100).toFixed(2)} className="ml-1 w-24 rounded border p-1" />
              </label>
              <label className="text-sm">
                Stock
                <input name="stock" type="number" min="0" step="1" defaultValue={p.stock} className="ml-1 w-20 rounded border p-1" />
              </label>
              <input name="image" type="file" accept="image/png,image/jpeg,image/webp" className="w-56 text-sm" />
              <button className="rounded border px-3 py-1">Save</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}