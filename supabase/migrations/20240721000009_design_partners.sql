-- 20240721000009_design_partners.sql
-- Design partner applications
-- Design: The only table permitting anonymous INSERT. No auth required to apply.
-- Status tracked internally: pending -> reviewed -> accepted/declined.

create table if not exists public.design_partner_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company_name text not null,
  company_size text,
  role text,
  linkedin_url text,
  current_ai_initiatives text,
  biggest_challenge text not null,
  status text not null default 'pending' check (status in ('pending','reviewed','accepted','declined')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_design_partner_apps_status on public.design_partner_applications(status);
create index idx_design_partner_apps_email on public.design_partner_applications(email);
create index idx_design_partner_apps_created on public.design_partner_applications(created_at);

create trigger trg_design_partner_applications_updated_at
  before update on public.design_partner_applications
  for each row execute function compass_set_updated_at();

comment on table public.design_partner_applications is 'Design partner program applications. Only table permitting anonymous INSERT.';
comment on column public.design_partner_applications.status is 'Application workflow: pending (awaiting review), reviewed, accepted, declined.';

-- RLS on design_partner_applications
alter table public.design_partner_applications enable row level security;

create policy "Anyone can apply for design partner program"
  on public.design_partner_applications for insert
  with check (true);

create policy "Admins can view applications"
  on public.design_partner_applications for select
  using (
    exists (
      select 1 from public.organization_members
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Admins can update applications"
  on public.design_partner_applications for update
  using (
    exists (
      select 1 from public.organization_members
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Service role can manage all applications"
  on public.design_partner_applications for all
  using (auth.jwt()->>'role' = 'service_role');
