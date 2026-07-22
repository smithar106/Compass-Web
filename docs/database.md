# Compass Database

## Architecture

Compass uses **Supabase** (managed Postgres) for persistence. The schema is organized into nine migration files, each creating a logical group of related tables.

## Design Principles

1. **Evidence-first**: Every fact, inference, and observation stores its source, confidence, and evidence class. Nothing exists without provenance.
2. **Supabase Anonymous Auth**: All users authenticate via Supabase Auth. Anonymous users call `supabase.auth.signInAnonymously()` before creating assessment sessions. Permanent users authenticate normally. Both use `auth.uid()` for ownership — no custom tokens or client headers.
3. **Service-role-only writes**: Research, reasoning, opportunity generation, and blueprint generation are server-side only. Client-side code reads through RLS policies.
4. **JSON schemas as contracts**: All `jsonb` columns have corresponding JSON Schema files in `Major-Compass/schemas/`. The database stores data; the schemas define its shape.
5. **RLS by organization membership**: All organization-scoped tables use the same RLS pattern — authenticated users access data only for orgs where they are members.

## Table Overview

### `profiles`
Extends `auth.users` with application-level profile data. Created automatically via trigger on `auth.users` insert.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | References `auth.users(id)` |
| email | text | User email |
| full_name | text | Display name |
| role | text | `user`, `admin`, or `service` |

### `organizations`
Companies assessed by Compass.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| name | text | Company name |
| slug | text UNIQUE | URL-friendly identifier |
| metadata | jsonb | Extended profile per `company.schema.json` |

### `organization_members`
Maps users to organizations. One user can belong to multiple orgs with different roles.

| Column | Type | Description |
|--------|------|-------------|
| role | text | `admin`, `member`, or `viewer` |

### `assessment_sessions`
Assessment sessions owned by a Supabase auth user (anonymous or permanent).

| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid FK | References `auth.users(id)`. Non-null. Anonymous or permanent. |
| status | text | `in_progress`, `completed`, `abandoned` |
| metadata | jsonb | Per `assessment.schema.json` |

### `assessment_answers`
Individual question responses.

| Column | Type | Description |
|--------|------|-------------|
| question_id | text | References question ID from `assessment/questions.json` |
| answer | jsonb | Flexible: boolean, integer, string, or text |
| branch_source | text | Adaptive branching source question |

### `company_research_runs`
Research sessions gathering public intelligence.

| Column | Type | Description |
|--------|------|-------------|
| status | text | `pending`, `in_progress`, `completed`, `failed`, `partial` |
| findings | jsonb | Array of evidence items per `evidence.schema.json` |
| signals | jsonb | Extracted signal families |

### `company_evidence`
Universal evidence store. Every fact in Compass lives here.

| Column | Type | Description |
|--------|------|-------------|
| category | text | Domain: `company`, `technology`, `workflow`, etc. |
| evidence_class | text | `User`, `Research`, or `Inference` |
| value | jsonb | The fact or inference |
| confidence | text | `Confirmed`, `High`, `Medium`, `Low`, `Unknown` |

### `opportunity_maps`
Complete AI Opportunity Maps — the primary output of Compass.

| Column | Type | Description |
|--------|------|-------------|
| executive_summary | jsonb | Per `opportunity-map.schema.json` |
| implementation_sequencing | jsonb | Phased rollout plan |

### `opportunities`
Individual ranked opportunities.

| Column | Type | Description |
|--------|------|-------------|
| rank | integer | Position in the map |
| business_impact | jsonb | Per `opportunity.schema.json` |
| reasoning | jsonb | Step-by-step reasoning chain |

### `implementation_blueprints`
How to implement each opportunity.

| Column | Type | Description |
|--------|------|-------------|
| future_workflow | jsonb | AI-augmented workflow per `blueprint.schema.json` |
| rollout | jsonb | Phases, gates, dependencies |

### `graph_nodes` / `graph_edges`
Organizational knowledge graph. Nodes are entities; edges are semantic relationships.

### `reasoning_traces`
Full audit trail for every opportunity map. Enables debugging and explanation synthesis.

### `design_partner_applications`
The only table permitting anonymous INSERT. No authentication required to apply.

## Row Level Security

All application tables have RLS enabled. Policies follow consistent patterns:

- **SELECT**: Authenticated users can read data for organizations where they are members.
- **INSERT/UPDATE/DELETE**: Restricted to organization admins or service role.
- **Anonymous access**: No custom token mechanism. All users (including anonymous) authenticate via Supabase Auth and use `auth.uid()`. The `design_partner_applications` table permits INSERT from any role (including unauthenticated).
- **Session ownership**: Assessment sessions are owned by `auth.uid()` directly. The `user_id` column references `auth.users(id)` and is non-null.
- **Answer ownership**: Assessment answers inherit ownership through the parent session's `user_id`. RLS policies use an `EXISTS` subquery against `assessment_sessions` to verify ownership.
- **All policies include `to authenticated`**: Except `design_partner_applications` INSERT (any role) and service-role policies (bypass RLS).
- **Service role**: Uses `auth.jwt()->>'role' = 'service_role'` for documentation/defense-in-depth. RLS is bypassed entirely for service-role requests.

## Applying Migrations

```bash
# Via Supabase CLI (recommended)
supabase link --project-ref <your-project-ref>
supabase db push

# Or manually via psql
psql "$DATABASE_URL" -f supabase/migrations/20240721000001_core.sql
psql "$DATABASE_URL" -f supabase/migrations/20240721000002_organizations.sql
# ... repeat for each migration in order

# Seed data
psql "$DATABASE_URL" -f supabase/seed.sql
```

## Generating TypeScript Types

```bash
# Using Supabase CLI (recommended)
supabase gen types typescript --local > src/lib/database.types.ts

# Or from remote project
supabase gen types typescript --project-ref <your-project-ref> > src/lib/database.types.ts
```

This generates `src/lib/database.types.ts` with TypeScript definitions matching your Postgres schema. Import `Database` type for typed Supabase client.

## Environment Variables

See `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key (safe for client)
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only (never in client)
