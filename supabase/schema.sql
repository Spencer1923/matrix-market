-- Matrix Market database setup. Run once in the Supabase SQL Editor.

-- Products
create table products (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price_cents integer not null,
  category text not null,
  image_url text,
  stock integer not null default 0,
  created_at timestamptz default now()
);

-- Orders (one per completed payment) and their line items
create table orders (
  id bigint generated always as identity primary key,
  stripe_session_id text unique not null, -- blocks duplicate webhook processing
  customer_email text,
  total_cents integer not null,
  currency text not null,
  shipping_name text,
  shipping_address jsonb,
  shipping_cents integer not null default 0,
  tax_cents integer not null default 0,
  status text not null default 'new' check (status in ('new', 'shipped')),
  created_at timestamptz default now()
);

create table order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references orders(id) on delete cascade,
  product_id bigint references products(id),
  name text not null,
  quantity integer not null,
  unit_price_cents integer not null
);

-- Row Level Security on every table
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- The public can only read products
create policy "Public can read products" on products for select using (true);
grant select on public.products to anon;

-- The server role (secret key) can do what the app needs
grant select, insert, update on public.products to service_role;
grant select, insert, update on orders to service_role;
grant select, insert on order_items to service_role;

-- Lowers stock only if enough remains (so stock never goes negative)
create or replace function decrement_stock(p_id bigint, p_qty integer)
returns void
language plpgsql
as $$
begin
  update products
  set stock = stock - p_qty
  where id = p_id and stock >= p_qty;
end;
$$;

-- Only the server may call it
revoke execute on function decrement_stock(bigint, integer) from public, anon, authenticated;
grant execute on function decrement_stock(bigint, integer) to service_role;

-- Public bucket for product photos (uploads happen server-side only)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Optional sample data
insert into products (name, description, price_cents, category, stock) values
  ('55" 4K Smart TV', 'Crisp 4K display with built-in streaming apps.', 59999, 'tvs', 12),
  ('Bluetooth Speaker', 'Portable, waterproof, 12-hour battery.', 7999, 'speakers', 40),
  ('Soundbar with Subwoofer', 'Wireless bass for movie nights.', 24999, 'speakers', 15),
  ('Racing Game (PS5)', 'Open-world racing with online multiplayer.', 6999, 'games', 30);