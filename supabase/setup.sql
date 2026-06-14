-- ============================================
-- Shop Fast Apparel — Full Database Schema
-- Paste this into Supabase SQL Editor and click Run
-- ============================================

-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "Users see own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins see all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
-- Site owner bypass
create policy "Site owner manages roles" on public.user_roles
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'info@shopfastapparel.com')
  with check (auth.jwt() ->> 'email' = 'info@shopfastapparel.com');

-- Blog posts
create type public.blog_status as enum ('draft', 'published', 'rejected');

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null,
  city text,
  read_minutes int not null default 5,
  published_at timestamptz not null default now(),
  author text not null default 'Fast Apparel Team',
  cover_gradient text not null default 'from-cyan-brand to-magenta-brand',
  cover_emoji text not null default '✨',
  keywords text[] not null default '{}',
  body text not null,
  status public.blog_status not null default 'draft',
  cover_image_url text,
  cover_image_credit text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Anyone reads published" on public.blog_posts
  for select to anon, authenticated using (status = 'published');
create policy "Admins read all" on public.blog_posts
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins insert" on public.blog_posts
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update" on public.blog_posts
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete" on public.blog_posts
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
-- Site owner bypass
create policy "Site owner manages blog posts" on public.blog_posts
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'info@shopfastapparel.com')
  with check (auth.jwt() ->> 'email' = 'info@shopfastapparel.com');

-- Auto-update timestamps
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ============================================
-- STORAGE CONFIGURATION
-- ============================================

insert into storage.buckets (id, name, public) 
values ('quote_artwork', 'quote_artwork', false)
on conflict (id) do nothing;

-- Enable RLS on objects
alter table storage.objects enable row level security;

-- Policy: Anyone can upload artwork (to allow non-logged-in customers to submit quotes)
create policy "Anyone can upload quote artwork" on storage.objects
  for insert to public
  with check (bucket_id = 'quote_artwork');

-- Policy: Only admins can view/download artwork
create policy "Admins can view quote artwork" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'quote_artwork' 
    and (public.has_role(auth.uid(), 'admin') or auth.jwt() ->> 'email' = 'info@shopfastapparel.com')
  );
