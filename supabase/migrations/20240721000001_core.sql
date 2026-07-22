-- 20240721000001_core.sql
-- Core infrastructure: extensions, trigger functions, and profiles
-- Design: Profiles extend auth.users via trigger. Every table gets automatic updated_at.

-- Extensions
create extension if not exists "pgcrypto";

-- Automatic updated_at trigger function (shared by all tables)
create or replace function compass_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Profiles table (extends auth.users)
-- One profile per auth user, created automatically on signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin', 'service')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_email on public.profiles(email);
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_created_at on public.profiles(created_at);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function compass_set_updated_at();

comment on table public.profiles is 'Extended user profiles linked to auth.users. Created via trigger on auth.users insert.';
comment on column public.profiles.id is 'References auth.users(id). One profile per auth user.';
comment on column public.profiles.role is 'User role: user (standard), admin (org admin), service (server-side operations).';

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS on profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Service role can manage all profiles"
  on public.profiles for all
  using (auth.jwt()->>'role' = 'service_role');
