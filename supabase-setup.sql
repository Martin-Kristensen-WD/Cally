-- Run this in Supabase Dashboard > SQL Editor

-- 1. Create recipes table
create table public.recipes (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  description        text,
  category           text not null,
  ingredients        jsonb not null default '[]',
  directions         text[] not null default '{}',
  estimated_calories integer,
  image_url          text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- 2. Auto-update updated_at on row updates
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.recipes
  for each row execute procedure public.handle_updated_at();

-- 3. Enable Row Level Security
alter table public.recipes enable row level security;

-- 4. RLS Policies
-- Public: anyone can read recipes
create policy "Public read access"
  on public.recipes for select
  using (true);

-- Admin: only authenticated users can write
create policy "Admin insert"
  on public.recipes for insert
  to authenticated
  with check (true);

create policy "Admin update"
  on public.recipes for update
  to authenticated
  using (true);

create policy "Admin delete"
  on public.recipes for delete
  to authenticated
  using (true);

-- ──────────────────────────────────────────────────────────────
-- Week plans
-- ──────────────────────────────────────────────────────────────

create table public.week_plans (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  week_number  integer,
  year         integer,
  meals        jsonb not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger set_updated_at_week_plans
  before update on public.week_plans
  for each row execute procedure public.handle_updated_at();

alter table public.week_plans enable row level security;

create policy "Public read week_plans"
  on public.week_plans for select using (true);

create policy "Admin insert week_plans"
  on public.week_plans for insert to authenticated with check (true);

create policy "Admin update week_plans"
  on public.week_plans for update to authenticated using (true);

create policy "Admin delete week_plans"
  on public.week_plans for delete to authenticated using (true);

-- 5. Storage bucket (run in Dashboard > Storage instead, but kept here for reference)
-- Create a bucket named "recipe-images" with public access enabled.
-- Then add these storage policies:
--
-- Allow public to read:  bucket_id = 'recipe-images'
-- Allow authenticated to upload: bucket_id = 'recipe-images' AND auth.role() = 'authenticated'
-- Allow authenticated to delete: bucket_id = 'recipe-images' AND auth.role() = 'authenticated'
