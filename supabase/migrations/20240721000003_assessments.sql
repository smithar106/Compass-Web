-- 20240721000003_assessments.sql
-- Assessment sessions and answers
-- Design: Every session is owned by a Supabase auth user (anonymous or permanent).
-- Anonymous users authenticate via supabase.auth.signInAnonymously() before creating sessions.
-- Permanent users authenticate normally. Both use the same auth.uid() for ownership.
-- Answers inherit ownership through the parent session. No custom tokens or localStorage.

create table if not exists public.assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  assessment_version text not null default '1.0.0',
  total_questions_presented integer,
  questions_skipped integer default 0,
  completion_time_minutes integer,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_assessment_sessions_user on public.assessment_sessions(user_id);
create index idx_assessment_sessions_org on public.assessment_sessions(organization_id);
create index idx_assessment_sessions_status on public.assessment_sessions(status);
create index idx_assessment_sessions_started on public.assessment_sessions(started_at);
create index idx_assessment_sessions_created on public.assessment_sessions(created_at);

create trigger trg_assessment_sessions_updated_at
  before update on public.assessment_sessions
  for each row execute function compass_set_updated_at();

comment on table public.assessment_sessions is 'Assessment sessions owned by a Supabase auth user (anonymous or permanent). All sessions have a non-null user_id FK to auth.users.';
comment on column public.assessment_sessions.user_id is 'Supabase auth user ID. May be anonymous (signInAnonymously) or permanent. Cascade delete removes sessions when user is deleted.';
comment on column public.assessment_sessions.metadata is 'Session metadata per assessment.schema.json: adaptiveVersion, userAgent, researchSnapshotId.';

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

comment on table public.assessment_answers is 'Individual responses within an assessment session. Ownership inherited through parent session.';
comment on column public.assessment_answers.answer is 'Flexible JSON: boolean for yes/no, integer for scale, string for multi-choice, text for open.';
comment on column public.assessment_answers.question_id is 'References question ID from assessment/questions.json. Application-level contract, not a FK.';
comment on column public.assessment_answers.branch_source is 'If reached via adaptive branching, the questionId that triggered this question.';

-- RLS on assessment_sessions
-- All policies require authenticated (applies to both anonymous and permanent auth users).
-- Service role bypasses RLS entirely (no explicit policy needed, but included for documentation).
alter table public.assessment_sessions enable row level security;

create policy "Users create own assessment sessions"
  on public.assessment_sessions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users read own assessment sessions"
  on public.assessment_sessions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users update own assessment sessions"
  on public.assessment_sessions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete own assessment sessions"
  on public.assessment_sessions for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Service role can manage all sessions"
  on public.assessment_sessions for all
  to authenticated
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- RLS on assessment_answers
-- Ownership validated through parent assessment_sessions.user_id.
alter table public.assessment_answers enable row level security;

create policy "Users read answers for own sessions"
  on public.assessment_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = assessment_answers.session_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "Users insert answers for own sessions"
  on public.assessment_answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = assessment_answers.session_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "Users update answers for own sessions"
  on public.assessment_answers for update
  to authenticated
  using (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = assessment_answers.session_id
        and s.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = assessment_answers.session_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "Users delete answers for own sessions"
  on public.assessment_answers for delete
  to authenticated
  using (
    exists (
      select 1 from public.assessment_sessions s
      where s.id = assessment_answers.session_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "Service role can manage all answers"
  on public.assessment_answers for all
  to authenticated
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');
