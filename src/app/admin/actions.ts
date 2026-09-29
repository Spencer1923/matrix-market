"use server"; // every function here runs only on the server

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseServer } from "@/lib/supabase-server";

// Runs at the start of every action: stops anyone who isn't the admin
async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  // The !email check matters: it stops a missing email matching a missing ADMIN_EMAIL
  if (!email || email !== process.env.ADMIN_EMAIL) throw new Error("Unauthorized");
}

// Refresh cached pages so changes show up right away
function refresh() {
  revalidatePath("/admin");
  revalidatePath("/products");
}

// Uploads one image to Supabase Storage and returns its public URL (or null if invalid)
async function uploadImage(file: File): Promise<string | null> {
  if (file.size === 0) return null; // no file was chosen

  // Allow only these types, and pick the extension ourselves instead of trusting the filename
  const ext = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string, string>)[file.type];
  if (!ext || file.size > 5 * 1024 * 1024) return null; // wrong type or over 5MB

  // A random name avoids collisions and overwriting other files
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });
  if (error) {
    console.error("Upload failed:", error);
    return null;
  }
  return supabaseAdmin.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export async function addProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim().toLowerCase();
  const price_cents = Math.round(parseFloat(String(formData.get("price"))) * 100);
  const stock = parseInt(String(formData.get("stock")), 10);

  if (!name || !category || !Number.isFinite(price_cents) || price_cents < 0) return;
  if (!Number.isInteger(stock) || stock < 0) return;

  // Upload the photo first (if one was chosen) and keep its URL
  const file = formData.get("image");
  const image_url = file instanceof File ? await uploadImage(file) : null;

  const { error } = await supabaseAdmin.from("products").insert({
    name,
    category,
    price_cents,
    stock,
    description: String(formData.get("description") ?? "").trim() || null,
    image_url,
  });
  if (error) console.error("Add product failed:", error);
  refresh();
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  const id = parseInt(String(formData.get("id")), 10);
  const price_cents = Math.round(parseFloat(String(formData.get("price"))) * 100);
  const stock = parseInt(String(formData.get("stock")), 10);

  if (!Number.isInteger(id) || !Number.isFinite(price_cents) || price_cents < 0) return;
  if (!Number.isInteger(stock) || stock < 0) return;

  // Only replace the image if a new one was chosen; otherwise keep the old one
  const file = formData.get("image");
  const image_url = file instanceof File ? await uploadImage(file) : null;

  const { error } = await supabaseAdmin
    .from("products")
    .update({ price_cents, stock, ...(image_url ? { image_url } : {}) })
    .eq("id", id);
  if (error) console.error("Update product failed:", error);
  refresh();
}

// Switches an order between "new" and "shipped"
export async function setOrderStatus(formData: FormData) {
  await requireAdmin();

  const id = parseInt(String(formData.get("id")), 10);
  const status = String(formData.get("status"));

  // Only accept known values, since the browser could send anything
  if (!Number.isInteger(id) || !["new", "shipped"].includes(status)) return;

  const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id);
  if (error) console.error("Order status failed:", error);
  revalidatePath("/admin/orders");
}