-- 20240721000004_research.sql
-- Company research runs and evidence store
-- Design: Service-role-only writes for research. Authenticated users read via org membership.

create table if not exists public.company_research_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','failed','partial')),
  research_config jsonb not null default '{}'::jsonb,
  findings jsonb default '[]'::jsonb,
  signals jsonb default '[]'::jsonb,
  coverage jsonb,
  metadata jsonb default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_research_runs_org on public.company_research_runs(organization_id);
create index if not exists idx_research_runs_status on public.company_research_runs(status);
create index if not exists idx_research_runs_started on public.company_research_runs(started_at);
create index if not exists idx_research_runs_created on public.company_research_runs(created_at);

create trigger trg_company_research_runs_updated_at
  before update on public.company_research_runs
  for each row execute function compass_set_updated_at();

comment on table public.company_research_runs is 'Research runs gathering public intelligence about an organization before assessment. Output per research.schema.json.';
comment on column public.company_research_runs.research_config is 'Configuration for what to research: sources, depth, signals to extract.';
comment on column public.company_research_runs.findings is 'Array of evidence items found during research. Each item follows evidenceItem from evidence.schema.json.';
comment on column public.company_research_runs.signals is 'Extracted signal families from research: growth, operational, technical, financial, etc.';

alter table public.company_research_runs enable row level security;

create policy "Members can view org research runs"
  on public.company_research_runs for select
  to authenticated
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = company_research_runs.organization_id
        and organization_members.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all research runs"
  on public.company_research_runs for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

create table if not exists public.company_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  research_run_id uuid references public.company_research_runs(id) on delete set null,
  category text not null check (category in ('company','technology','workflow','assessment','research','opportunity','deployment','benchmark')),
  key text not null,
  value jsonb,
  confidence text check (confidence in ('Confirmed','High','Medium','Low','Unknown')),
  evidence_class text not null check (evidence_class in ('User','Research','Inference')),
  source_type text check (source_type in ('website','careers_page','help_center','documentation','pricing_page','news_article','sec_filing','crunchbase','linkedin','customer_statement','api_docs','social_media','job_posting','product_hunt','unknown')),
  source_url text,
  reasoning text,
  observed_at timestamptz not null default now(),
  verified_at timestamptz,
  verified_by text,
  expires_at timestamptz,
  tags jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_company_evidence_org on public.company_evidence(organization_id);
create index if not exists idx_company_evidence_run on public.company_evidence(research_run_id);
create index if not exists idx_company_evidence_category on public.company_evidence(category);
create index if not exists idx_company_evidence_key on public.company_evidence(key);
create index if not exists idx_company_evidence_class on public.company_evidence(evidence_class);
create index if not exists idx_company_evidence_observed on public.company_evidence(observed_at);
create index if not exists idx_company_evidence_created on public.company_evidence(created_at);

comment on table public.company_evidence is 'Universal evidence store. Every fact, inference, and observation in Compass is stored here with its source and confidence. This is the system of record for all evidence.';
comment on column public.company_evidence.category is 'Domain this evidence belongs to. Matches evidence.schema.json category.';
comment on column public.company_evidence.evidence_class is 'How this evidence was obtained: User (customer-provided), Research (publicly observed), Inference (reasoned by Compass).';
comment on column public.company_evidence.value is 'The fact or inference value. Shape depends on category+key. Could be a string, number, object, or array.';

alter table public.company_evidence enable row level security;

create policy "Members can view org evidence"
  on public.company_evidence for select
  to authenticated
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = company_evidence.organization_id
        and organization_members.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all evidence"
  on public.company_evidence for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');
