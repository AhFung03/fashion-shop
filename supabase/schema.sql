create extension if not exists "pgcrypto";

create type public.app_role as enum ('customer', 'owner');
create type public.order_status as enum (
  'pending_payment', 'paid', 'processing', 'ready_for_pickup',
  'shipped', 'completed', 'cancelled'
);
create type public.payment_status as enum (
  'pending', 'paid', 'failed', 'cash_due', 'refunded'
);
create type public.fulfilment_method as enum ('delivery', 'pickup');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  color text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  unique(product_id, size, color)
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(message) <= 180),
  active boolean not null default true,
  published_at timestamptz not null default now()
);

create table public.shop_settings (
  id boolean primary key default true check (id),
  delivery_fee_cents integer not null default 1200 check (delivery_fee_cents >= 0),
  pickup_address text not null default '',
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.profiles(id),
  customer_email text not null,
  status public.order_status not null default 'pending_payment',
  payment_status public.payment_status not null default 'pending',
  fulfilment public.fulfilment_method not null,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  delivery_fee_cents integer not null default 0 check (delivery_fee_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  delivery_address jsonb,
  stripe_session_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name text not null,
  variant_label text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0)
);

create table public.stock_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id),
  quantity integer not null check (quantity > 0),
  expires_at timestamptz not null,
  released_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.announcements enable row level security;
alter table public.shop_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.stock_reservations enable row level security;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

create policy "public reads active products" on public.products
for select using (active or public.is_owner());
create policy "public reads product images" on public.product_images
for select using (true);
create policy "public reads variants" on public.product_variants
for select using (true);
create policy "public reads active announcements" on public.announcements
for select using (active or public.is_owner());
create policy "public reads shop settings" on public.shop_settings
for select using (true);
create policy "customers read own profile" on public.profiles
for select using (id = auth.uid() or public.is_owner());
create policy "customers update own profile" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());
create policy "customers read own orders" on public.orders
for select using (customer_id = auth.uid() or public.is_owner());
create policy "customers read own order items" on public.order_items
for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and (orders.customer_id = auth.uid() or public.is_owner())
  )
);

create policy "owner manages products" on public.products
for all using (public.is_owner()) with check (public.is_owner());
create policy "owner manages images" on public.product_images
for all using (public.is_owner()) with check (public.is_owner());
create policy "owner manages variants" on public.product_variants
for all using (public.is_owner()) with check (public.is_owner());
create policy "owner manages announcements" on public.announcements
for all using (public.is_owner()) with check (public.is_owner());
create policy "owner manages settings" on public.shop_settings
for all using (public.is_owner()) with check (public.is_owner());
create policy "owner manages orders" on public.orders
for all using (public.is_owner()) with check (public.is_owner());
create policy "owner manages order items" on public.order_items
for all using (public.is_owner()) with check (public.is_owner());
create policy "owner manages reservations" on public.stock_reservations
for all using (public.is_owner()) with check (public.is_owner());
