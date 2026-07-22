-- 20240721000010_assessment_auth_refactor.sql
-- ALTER TABLE migration: replace custom anonymous_token with Supabase Anonymous Auth.
-- This is a data-preserving refactor of the originally-applied 03_assessments.sql.
-- The original file defined a schema with anonymous_token, nullable user_id -> profiles(id),
-- and RLS policies relying on current_setting('request.jwt.claims').
--
-- The NEW 03_assessments.sql was written but never applied (migration history tracks
-- filenames, not contents). This migration transforms the live schema in place.
--
-- Only ALTER TABLE, DROP, CREATE POLICY, and data-migration UPDATE statements.
-- No CREATE TABLE, no DROP TABLE, no data loss for owned sessions.

-- ============================================================================
-- STEP 1: Drop all old RLS policies on assessment_sessions
-- Policy names from the original 03_assessments.sql that was applied.
-- ============================================================================
drop policy if exists "Users can view own sessions" on public.assessment_sessions;
drop policy if exists "Anyone can create sessions" on public.assessment_sessions;
drop policy if exists "Users can update own sessions" on public.assessment_sessions;
drop policy if exists "Org members can view org sessions" on public.assessment_sessions;
drop policy if exists "Service role can manage all sessions" on public.assessment_sessions;

-- ============================================================================
-- STEP 2: Drop all old RLS policies on assessment_answers
-- ============================================================================
drop policy if exists "Users can view own answers" on public.assessment_answers;
drop policy if exists "Anyone can add answers to sessions" on public.assessment_answers;
drop policy if exists "Service role can manage all answers" on public.assessment_answers;

-- ============================================================================
-- STEP 3: Remove orphaned anonymous sessions before making user_id NOT NULL
-- Sessions with NULL user_id cannot be owned by anyone after migration because
-- the anonymous_token mechanism is being removed entirely.
-- Their answers are cascaded by the FK.
-- ============================================================================
delete from public.assessment_answers
where session_id in (
  select id from public.assessment_sessions where user_id is null
);

delete from public.assessment_sessions where user_id is null;

-- ============================================================================
-- STEP 4: Migrate status values to new enum set
-- not_started -> in_progress (it was started but never finished)
-- expired -> abandoned (timeout is a form of abandonment)
-- completed stays as completed
-- in_progress stays as in_progress
-- ============================================================================
update public.assessment_sessions
  set status = 'in_progress'
  where status = 'not_started';

update public.assessment_sessions
  set status = 'abandoned'
  where status = 'expired';

-- ============================================================================
-- STEP 5: Drop old CHECK constraint on status, add new one
-- ============================================================================
alter table public.assessment_sessions
  drop constraint if exists assessment_sessions_status_check;

alter table public.assessment_sessions
  add constraint assessment_sessions_status_check
  check (status in ('in_progress', 'completed', 'abandoned'));

alter table public.assessment_sessions
  alter column status set default 'in_progress';

-- ============================================================================
-- STEP 6: Migrate user_id: change FK target from profiles -> auth.users, make NOT NULL
-- The auto-generated FK name from CREATE TABLE is assessment_sessions_user_id_fkey.
-- ============================================================================
alter table public.assessment_sessions
  drop constraint if exists assessment_sessions_user_id_fkey;

-- Clean any remaining NULLs before NOT NULL
delete from public.assessment_sessions where user_id is null;

alter table public.assessment_sessions
  alter column user_id set not null;

alter table public.assessment_sessions
  add constraint assessment_sessions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- ============================================================================
-- STEP 7: Drop anonymous_token column
-- ============================================================================
alter table public.assessment_sessions
  drop column if exists anonymous_token;

-- ============================================================================
-- STEP 8: Add assessment_version column (did not exist in original schema)
-- ============================================================================
alter table public.assessment_sessions
  add column if not exists assessment_version text not null default '1.0.0';

-- ============================================================================
-- STEP 9: Make metadata NOT NULL (was nullable with default in original)
-- ============================================================================
update public.assessment_sessions
  set metadata = '{}'::jsonb
  where metadata is null;

alter table public.assessment_sessions
  alter column metadata set not null;

alter table public.assessment_sessions
  alter column metadata set default '{}'::jsonb;

-- ============================================================================
-- STEP 10: Drop obsolete indexes
-- idx_assessment_sessions_token indexed anonymous_token which no longer exists.
-- ============================================================================
drop index if exists idx_assessment_sessions_token;

-- ============================================================================
-- STEP 11: Verify trigger exists (created by original migration with same name)
-- If the trigger was already named trg_assessment_sessions_updated_at and calls
-- compass_set_updated_at(), it works as-is. No ALTER needed.
-- If it doesn't exist, create it.
-- ============================================================================
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_assessment_sessions_updated_at'
    and tgrelid = 'public.assessment_sessions'::regclass
  ) then
    create trigger trg_assessment_sessions_updated_at
      before update on public.assessment_sessions
      for each row execute function compass_set_updated_at();
  end if;
end;
$$;

-- ============================================================================
-- STEP 12: Create new RLS policies for assessment_sessions
-- ============================================================================
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
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- STEP 13: Create new RLS policies for assessment_answers
-- Ownership validated through parent assessment_sessions.user_id.
-- ============================================================================
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
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- STEP 14: Update table and column comments to reflect new design
-- ============================================================================
comment on table public.assessment_sessions is 'Assessment sessions owned by a Supabase auth user (anonymous or permanent). All sessions have a non-null user_id FK to auth.users.';
comment on column public.assessment_sessions.user_id is 'Supabase auth user ID. May be anonymous (signInAnonymously) or permanent. Cascade delete removes sessions when user is deleted.';
comment on column public.assessment_sessions.metadata is 'Session metadata per assessment.schema.json: adaptiveVersion, userAgent, researchSnapshotId.';
comment on column public.assessment_sessions.assessment_version is 'Schema version of the assessment presented to the user.';
comment on table public.assessment_answers is 'Individual responses within an assessment session. Ownership inherited through parent session.';
comment on column public.assessment_answers.branch_source is 'If reached via adaptive branching, the questionId that triggered this question.';
comment on column public.assessment_answers.question_id is 'References question ID from assessment/questions.json. Application-level contract, not a FK.';

-- ============================================================================
-- STEP 15: Verify final state
-- Log table structure and row counts for audit.
-- ============================================================================
do $$
declare
  col_count integer;
  policy_count integer;
  orphan_count integer;
  fk_count integer;
begin
  -- Count columns in assessment_sessions (should be 14, not 16: no anonymous_token, no adaptive_version separately tracked)
  select count(*) into col_count
  from information_schema.columns
  where table_schema = 'public' and table_name = 'assessment_sessions';

  -- Count RLS policies on both tables
  select count(*) into policy_count
  from pg_policies
  where schemaname = 'public'
    and tablename in ('assessment_sessions', 'assessment_answers');

  -- Verify no orphaned sessions remain
  select count(*) into orphan_count
  from public.assessment_sessions
  where user_id is null;

  -- Verify FK exists
  select count(*) into fk_count
  from information_schema.table_constraints tc
  join information_schema.constraint_column_usage ccu on tc.constraint_name = ccu.constraint_name
  where tc.table_schema = 'public'
    and tc.table_name = 'assessment_sessions'
    and tc.constraint_type = 'FOREIGN KEY'
    and ccu.table_name = 'auth.users';

  raise notice 'ASSESSMENT_AUTH_REFACTOR VERIFICATION:
  - Columns in assessment_sessions: %
  - RLS policies on sessions + answers: %
  - Orphaned sessions (null user_id): % (should be 0)
  - FK to auth.users exists: %',
    col_count, policy_count, orphan_count,
    case when fk_count > 0 then 'YES' else 'NO - MISSING!' end;
end;
$$;
