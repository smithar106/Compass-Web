-- 20240721000008_reasoning_traces.sql
-- Reasoning traces - the debug/audit system for Compass
-- Design: Every recommendation stores its full reasoning chain. Enables audit, debugging, and explanation synthesis.
-- Shape per reasoning-trace.schema.json. Service-role-only writes.

create table if not exists public.reasoning_traces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_map_id uuid references public.opportunity_maps(id) on delete set null,
  pipeline jsonb not null default '[]'::jsonb,
  decisions jsonb not null default '[]'::jsonb,
  confidence_breakdown jsonb,
  opportunity_traces jsonb default '[]'::jsonb,
  performance jsonb,
  audit_log jsonb default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index idx_reasoning_traces_org on public.reasoning_traces(organization_id);
create index idx_reasoning_traces_map on public.reasoning_traces(opportunity_map_id);
create index idx_reasoning_traces_generated on public.reasoning_traces(generated_at);
create index idx_reasoning_traces_created on public.reasoning_traces(created_at);

comment on table public.reasoning_traces is 'Complete reasoning traces for every opportunity map. Enables audit, debugging, and synthesis.';
comment on column public.reasoning_traces.pipeline is 'Pipeline stage execution trace: each stage with inputs, outputs, duration, errors, reasoning.';
comment on column public.reasoning_traces.decisions is 'All decisions: inclusion, exclusion, ranking, confidence, branching with rationale and alternatives.';
comment on column public.reasoning_traces.confidence_breakdown is 'Multi-dimensional confidence: sourceAuthority, dataFreshness, directness, consistency, specificity.';
comment on column public.reasoning_traces.opportunity_traces is 'Per-opportunity reasoning chains with key evidence and alternatives considered.';
comment on column public.reasoning_traces.performance is 'Performance metrics: duration, model calls, tokens, estimated cost, cache hit rate.';

-- RLS on reasoning_traces
alter table public.reasoning_traces enable row level security;

create policy "Members can view org reasoning traces"
  on public.reasoning_traces for select
  using (
    exists (select 1 from public.organization_members where organization_id = reasoning_traces.organization_id and user_id = auth.uid())
  );

create policy "Service role can manage reasoning traces"
  on public.reasoning_traces for all
  using (auth.jwt()->>'role' = 'service_role');
