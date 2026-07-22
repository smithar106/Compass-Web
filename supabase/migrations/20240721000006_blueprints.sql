-- 20240721000006_blueprints.sql
-- Implementation blueprints
-- Design: Service-role-only writes. Authenticated users read via org membership.

create table if not exists public.implementation_blueprints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  name text not null,
  department text not null check (department in ('Sales','Marketing','Customer Success','Support','Finance','Product','Engineering','People/HR','Legal','Operations')),
  description text not null,
  current_workflow jsonb,
  future_workflow jsonb not null,
  ai_components jsonb default '[]'::jsonb,
  automation_breakdown jsonb,
  rollout jsonb not null,
  kpis jsonb default '[]'::jsonb,
  implementation_difficulty text check (implementation_difficulty in ('Low','Medium','High','Very High')),
  estimated_timeline jsonb,
  risks jsonb default '[]'::jsonb,
  security_considerations jsonb default '[]'::jsonb,
  compliance_notes jsonb default '[]'::jsonb,
  evaluation_criteria jsonb,
  evidence jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blueprints_org on public.implementation_blueprints(organization_id);
create index if not exists idx_blueprints_opportunity on public.implementation_blueprints(opportunity_id);
create index if not exists idx_blueprints_department on public.implementation_blueprints(department);
create index if not exists idx_blueprints_created on public.implementation_blueprints(created_at);

create trigger trg_implementation_blueprints_updated_at
  before update on public.implementation_blueprints
  for each row execute function compass_set_updated_at();

comment on table public.implementation_blueprints is 'Implementation blueprints mapping current workflows to AI-augmented future workflows. Shape per blueprint.schema.json.';
comment on column public.implementation_blueprints.future_workflow is 'Target workflow steps with AI, deterministic, and human components. See blueprint.schema.json for full structure.';
comment on column public.implementation_blueprints.rollout is 'Implementation phases with gates, dependencies, and recommended strategy.';
comment on column public.implementation_blueprints.evaluation_criteria is 'Success metrics, evaluation frequency, minimum pass thresholds, review cadence.';

alter table public.implementation_blueprints enable row level security;

create policy "Members can view org blueprints"
  on public.implementation_blueprints for select
  to authenticated
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = implementation_blueprints.organization_id
        and organization_members.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all blueprints"
  on public.implementation_blueprints for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');
