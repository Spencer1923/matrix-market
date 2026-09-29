// Describes the shape of one product row, so your editor autocompletes fields
export type Product = {
  id: number;
  name: string;
  description: string | null; // "| null" because the column is optional
  price_cents: number;
  category: string;
  image_url: string | null;
  stock: number;
};