-- Jules' Blog — Supabase schema
-- Paste this whole file into Supabase Dashboard -> SQL Editor -> New query -> Run.

create extension if not exists pgcrypto;

-- ── Categories ──────────────────────────────────────────────
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_public_read" on public.categories
  for select using (true);

create policy "categories_admin_insert" on public.categories
  for insert to authenticated with check (true);

create policy "categories_admin_update" on public.categories
  for update to authenticated using (true) with check (true);

create policy "categories_admin_delete" on public.categories
  for delete to authenticated using (true);

-- ── Posts ───────────────────────────────────────────────────
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  category_id uuid references public.categories(id) on delete set null,
  excerpt     text,
  body_html   text not null default '',
  featured    boolean not null default false,
  published   boolean not null default true,
  author_id   uuid references auth.users(id) default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Everyone can read published posts; the signed-in admin can also read drafts.
create policy "posts_read" on public.posts
  for select using (published = true or auth.role() = 'authenticated');

create policy "posts_admin_insert" on public.posts
  for insert to authenticated with check (true);

create policy "posts_admin_update" on public.posts
  for update to authenticated using (true) with check (true);

create policy "posts_admin_delete" on public.posts
  for delete to authenticated using (true);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Seed the same default categories the original prototype shipped with.
insert into public.categories (name, slug) values
  ('Strategy', 'strategy'),
  ('Operations', 'operations'),
  ('Data & AI', 'data-ai'),
  ('Ways of working', 'ways-of-working'),
  ('Reading notes', 'reading-notes');
