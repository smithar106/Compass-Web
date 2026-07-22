-- 20240721000002_organizations.sql
-- Organizations and membership
-- Design: Organizations are created during account setup or assessment completion.
-- Memberships use a simple RBAC model: admin, member, viewer.

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  website_url text,
  industry text,
  size_range text,
  revenue_stage text check (revenue_stage in ('Seed','Series A','Series B','Series C','Growth','Mature','Unknown')),
  business_model text check (business_model in ('SaaS','Usage-based','Hybrid','Marketplace','Other')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index idx_organizations_slug on public.organizations(slug);
create index idx_organizations_industry on public.organizations(industry);
create index idx_organizations_created_at on public.organizations(created_at);

create trigger trg_organizations_updated_at
  before update on public.organizations
  for each row execute function compass_set_updated_at();

comment on table public.organizations is 'Companies assessed by Compass. Created during assessment or account setup.';
comment on column public.organizations.slug is 'URL-friendly unique identifier. Used in API routes and display.';
comment on column public.organizations.metadata is 'Flexible JSON for extended profile data. Shape defined by company.schema.json.';

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  unique(organization_id, user_id)
);

create index idx_org_members_org on public.organization_members(organization_id);
create index idx_org_members_user on public.organization_members(user_id);
create index idx_org_members_role on public.organization_members(role);

comment on table public.organization_members is 'Maps users to organizations. One user may belong to multiple orgs.';
comment on column public.organization_members.role is 'Access level: admin (full), member (standard), viewer (read-only).';

-- RLS on organizations
alter table public.organizations enable row level security;

create policy "Members can view their organizations"
  on public.organizations for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = organizations.id
      and user_id = auth.uid()
    )
  );

create policy "Admins can update their organizations"
  on public.organizations for update
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = organizations.id
      and user_id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Service role can manage all organizations"
  on public.organizations for all
  using (auth.jwt()->>'role' = 'service_role');

-- RLS on organization_members
alter table public.organization_members enable row level security;

create policy "Members can view their own memberships"
  on public.organization_members for select
  using (user_id = auth.uid());

create policy "Admins can manage members in their org"
  on public.organization_members for all
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_members.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
  );

create policy "Service role can manage all memberships"
  on public.organization_members for all
  using (auth.jwt()->>'role' = 'service_role');
