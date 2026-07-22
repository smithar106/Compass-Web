-- 20240721000007_graph.sql
-- Knowledge graph nodes and edges
-- Design: The graph is the organizational memory. Nodes represent entities, edges represent relationships.
-- Every assessment response enriches the graph. Every recommendation queries it.

create table if not exists public.graph_nodes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  type text not null check (type in ('department','system','workflow','person','kpi','document','approval','meeting','decision','knowledge','process','capability','constraint')),
  name text not null,
  label text,
  description text,
  properties jsonb default '{}'::jsonb,
  confidence text check (confidence in ('Confirmed','High','Medium','Low','Unknown')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_graph_nodes_org on public.graph_nodes(organization_id);
create index idx_graph_nodes_type on public.graph_nodes(type);
create index idx_graph_nodes_name on public.graph_nodes(name);
create index idx_graph_nodes_created on public.graph_nodes(created_at);

create trigger trg_graph_nodes_updated_at
  before update on public.graph_nodes
  for each row execute function compass_set_updated_at();

comment on table public.graph_nodes is 'Nodes in the organizational knowledge graph. Types defined by Compass ontology.';
comment on column public.graph_nodes.type is 'Node category: department, system, workflow, person, kpi, document, approval, meeting, decision, knowledge, process, capability, constraint.';
comment on column public.graph_nodes.properties is 'Type-specific properties. Department: departmentType, headcount. System: systemCategory, vendor. Person: role, seniority.';

create table if not exists public.graph_edges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_node_id uuid not null references public.graph_nodes(id) on delete cascade,
  target_node_id uuid not null references public.graph_nodes(id) on delete cascade,
  relationship text not null check (relationship in ('owns','depends_on','produces','blocks','approves','consumes','reports_to','uses','participates_in','creates','modifies','reviews','delegates_to','reports_on','influences','contributes_to','requires','belongs_to','precedes')),
  direction text not null default 'directed' check (direction in ('directed','bidirectional')),
  weight numeric check (weight >= 0 and weight <= 1),
  description text,
  confidence text check (confidence in ('Confirmed','High','Medium','Low','Unknown')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_graph_edges_org on public.graph_edges(organization_id);
create index idx_graph_edges_source on public.graph_edges(source_node_id);
create index idx_graph_edges_target on public.graph_edges(target_node_id);
create index idx_graph_edges_relationship on public.graph_edges(relationship);
create index idx_graph_edges_created on public.graph_edges(created_at);

create trigger trg_graph_edges_updated_at
  before update on public.graph_edges
  for each row execute function compass_set_updated_at();

comment on table public.graph_edges is 'Edges connecting knowledge graph nodes with semantic relationships.';
comment on column public.graph_edges.relationship is 'Semantic relationship type: owns, depends_on, produces, blocks, approves, consumes, reports_to, etc.';
comment on column public.graph_edges.weight is 'Relationship strength 0-1. Used for path weighting and inference confidence.';

-- RLS on graph_nodes
alter table public.graph_nodes enable row level security;

create policy "Members can view org graph nodes"
  on public.graph_nodes for select
  to authenticated
  using (
    exists (select 1 from public.organization_members where organization_id = graph_nodes.organization_id and user_id = (select auth.uid()))
  );

create policy "Service role can manage graph nodes"
  on public.graph_nodes for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- RLS on graph_edges
alter table public.graph_edges enable row level security;

create policy "Members can view org graph edges"
  on public.graph_edges for select
  to authenticated
  using (
    exists (select 1 from public.organization_members where organization_id = graph_edges.organization_id and user_id = (select auth.uid()))
  );

create policy "Service role can manage graph edges"
  on public.graph_edges for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');
