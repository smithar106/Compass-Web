-- 20240721000005_opportunities.sql
-- Opportunity maps and individual opportunities
-- Design: Service-role-only writes. Authenticated users read via org membership.

create table if not exists public.opportunity_maps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  assessment_session_id uuid references public.assessment_sessions(id) on delete set null,
  company_name text not null,
  executive_summary jsonb not null,
  implementation_sequencing jsonb not null,
  cross_opportunity_dependencies jsonb default '[]'::jsonb,
  evidence_summary jsonb,
  metadata jsonb default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_opportunity_maps_org on public.opportunity_maps(organization_id);
create index if not exists idx_opportunity_maps_session on public.opportunity_maps(assessment_session_id);
create index if not exists idx_opportunity_maps_generated on public.opportunity_maps(generated_at);
create index if not exists idx_opportunity_maps_created on public.opportunity_maps(created_at);

create trigger trg_opportunity_maps_updated_at
  before update on public.opportunity_maps
  for each row execute function compass_set_updated_at();

comment on table public.opportunity_maps is 'Complete AI Opportunity Map - the primary output of Compass. Contains ranked opportunities, executive summary, and sequencing. Shape per opportunity-map.schema.json.';
comment on column public.opportunity_maps.executive_summary is 'Executive summary object: headline, finding, recommendedFocus, quickWins, strategicValue. See opportunity-map.schema.json.';
comment on column public.opportunity_maps.implementation_sequencing is 'Recommended implementation phases, strategy, and rationale.';

alter table public.opportunity_maps enable row level security;

create policy "Members can view org opportunity maps"
  on public.opportunity_maps for select
  to authenticated
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = opportunity_maps.organization_id
        and organization_members.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all opportunity maps"
  on public.opportunity_maps for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  opportunity_map_id uuid not null references public.opportunity_maps(id) on delete cascade,
  rank integer not null check (rank >= 1),
  title text not null,
  department text not null check (department in ('Sales','Marketing','Customer Success','Support','Finance','Product','Engineering','People/HR','Legal','Operations')),
  problem text not null,
  hypothesis text,
  business_impact jsonb not null,
  implementation_difficulty text not null check (implementation_difficulty in ('Low','Medium','High','Very High')),
  time_to_value text,
  confidence text not null check (confidence in ('Confirmed','High','Medium','Low','Unknown')),
  risks jsonb default '[]'::jsonb,
  dependencies jsonb default '[]'::jsonb,
  reasoning jsonb default '[]'::jsonb,
  evidence jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_opportunities_map on public.opportunities(opportunity_map_id);
create index if not exists idx_opportunities_rank on public.opportunities(opportunity_map_id, rank);
create index if not exists idx_opportunities_department on public.opportunities(department);
create index if not exists idx_opportunities_confidence on public.opportunities(confidence);
create index if not exists idx_opportunities_created on public.opportunities(created_at);

comment on table public.opportunities is 'Individual AI opportunity within an opportunity map. Each represents a specific recommendation with full reasoning and evidence. Shape per opportunity.schema.json.';
comment on column public.opportunities.business_impact is 'Business impact assessment: description, impactType, estimatedImpact, confidence.';
comment on column public.opportunities.reasoning is 'Step-by-step reasoning chain for how Compass reached this recommendation.';
comment on column public.opportunities.evidence is 'Evidence items supporting this opportunity. Each item per evidenceItem from evidence.schema.json.';

alter table public.opportunities enable row level security;

create policy "Members can view opportunities in their org maps"
  on public.opportunities for select
  to authenticated
  using (
    exists (
      select 1 from public.opportunity_maps
      join public.organization_members
        on organization_members.organization_id = opportunity_maps.organization_id
        and organization_members.user_id = (select auth.uid())
      where opportunity_maps.id = opportunities.opportunity_map_id
    )
  );

create policy "Service role can manage all opportunities"
  on public.opportunities for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');
