import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/product";
import Link from "next/link";

// "async" works here because this page runs on the server
export default async function Home() {
  // Ask Supabase for every row in the products table)
  const { data } = await supabase.from("products").select("*");
  const products = (data ?? []) as Product[]; // "?? []" = empty list if nothing came back

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Matrix Market</h1>
      {/* Simple link for now; we'll design a real homepage later */}
      <Link href="/products" className="mt-4 inline-block underline">
        Shop all products
      </Link>
    </main>
  );
}
