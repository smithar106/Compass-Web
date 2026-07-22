-- 20240721000003_assessments.sql
-- Assessment sessions and answers
-- Design: Anonymous sessions use a client-generated token. Authenticated users attach later.
-- Answers are stored as jsonb to support boolean, scale, multi-choice, and open types.

create table if not exists public.assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  anonymous_token text,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed','expired')),
  adaptive_version text,
  total_questions_presented integer,
  questions_skipped integer default 0,
  completion_time_minutes integer,
  metadata jsonb default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_assessment_sessions_org on public.assessment_sessions(organization_id);
create index idx_assessment_sessions_user on public.assessment_sessions(user_id);
create index idx_assessment_sessions_token on public.assessment_sessions(anonymous_token);
create index idx_assessment_sessions_status on public.assessment_sessions(status);
create index idx_assessment_sessions_started on public.assessment_sessions(started_at);
create index idx_assessment_sessions_created on public.assessment_sessions(created_at);

create trigger trg_assessment_sessions_updated_at
  before update on public.assessment_sessions
  for each row execute function compass_set_updated_at();

comment on table public.assessment_sessions is 'Assessment sessions. Started anonymously (anonymous_token), claimed later by authenticated user.';
comment on column public.assessment_sessions.anonymous_token is 'Client-generated UUID for anonymous session identification. Stored in browser localStorage.';
comment on column public.assessment_sessions.metadata is 'Session metadata per assessment.schema.json: adaptiveVersion, userAgent, researchSnapshotId.';
comment on column public.assessment_sessions.total_questions_presented is 'How many questions were actually shown (varies due to adaptive branching).';

create table if not exists public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.assessment_sessions(id) on delete cascade,
  question_id text not null,
  answer jsonb,
  confidence text check (confidence in ('Confirmed','High','Medium','Low','Unknown')),
  notes text,
  time_spent_seconds integer check (time_spent_seconds >= 0),
  was_skipped boolean not null default false,
  skip_reason text,
  branch_source text,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_assessment_answers_session on public.assessment_answers(session_id);
create index idx_assessment_answers_question on public.assessment_answers(question_id);
create index idx_assessment_answers_created on public.assessment_answers(created_at);

comment on table public.assessment_answers is 'Individual responses within an assessment session. Preserves branch context for adaptive analysis.';
comment on column public.assessment_answers.answer is 'Flexible JSON: boolean for yes/no, integer for scale, string for multi-choice, text for open.';
comment on column public.assessment_answers.question_id is 'References question ID from assessment/questions.json. Application-level contract, not a FK.';
comment on column public.assessment_answers.branch_source is 'If reached via adaptive branching, the questionId that triggered this question.';

-- RLS on assessment_sessions
alter table public.assessment_sessions enable row level security;

create policy "Users can view own sessions"
  on public.assessment_sessions for select
  using (user_id = auth.uid() or anonymous_token = coalesce(current_setting('request.jwt.claims', true)::json->>'anonymous_token', ''));

create policy "Anyone can create sessions"
  on public.assessment_sessions for insert
  with check (true);

create policy "Users can update own sessions"
  on public.assessment_sessions for update
  using (user_id = auth.uid() or anonymous_token is not null);

create policy "Org members can view org sessions"
  on public.assessment_sessions for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = assessment_sessions.organization_id
      and user_id = auth.uid()
    )
  );

create policy "Service role can manage all sessions"
  on public.assessment_sessions for all
  using (auth.jwt()->>'role' = 'service_role');

-- RLS on assessment_answers
alter table public.assessment_answers enable row level security;

create policy "Users can view own answers"
  on public.assessment_answers for select
  using (
    exists (
      select 1 from public.assessment_sessions
      where id = assessment_answers.session_id
      and (user_id = auth.uid() or anonymous_token = coalesce(current_setting('request.jwt.claims', true)::json->>'anonymous_token', ''))
    )
  );

create policy "Anyone can add answers to sessions"
  on public.assessment_answers for insert
  with check (true);

create policy "Service role can manage all answers"
  on public.assessment_answers for all
  using (auth.jwt()->>'role' = 'service_role');
