-- Create tables for the Compass recommendation engine persistence layer

-- Stores each investigation submission
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stores the normalized input profile for each investigation
CREATE TABLE IF NOT EXISTS investigation_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    business_function TEXT NOT NULL DEFAULT '',
    workflow TEXT NOT NULL DEFAULT '',
    problem_statement TEXT NOT NULL DEFAULT '',
    industry TEXT NOT NULL DEFAULT '',
    company_size TEXT NOT NULL DEFAULT '',
    workflow_frequency TEXT NOT NULL DEFAULT '',
    people_involved TEXT NOT NULL DEFAULT '',
    handoffs TEXT NOT NULL DEFAULT '',
    current_tools JSONB NOT NULL DEFAULT '[]',
    exception_rate TEXT NOT NULL DEFAULT '',
    budget_range TEXT NOT NULL DEFAULT '',
    implementation_timeline TEXT NOT NULL DEFAULT '',
    business_risk TEXT NOT NULL DEFAULT '',
    process_stability TEXT NOT NULL DEFAULT '',
    previous_attempts TEXT NOT NULL DEFAULT '',
    desired_outcome TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stores each recommendation run
CREATE TABLE IF NOT EXISTS recommendation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    recommendation_run_id TEXT NOT NULL UNIQUE,
    engine_version TEXT NOT NULL DEFAULT '',
    dataset_version TEXT NOT NULL DEFAULT '',
    total_comparables_found INTEGER NOT NULL DEFAULT 0,
    overall_confidence_score REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stores the 3 recommendation options per run
CREATE TABLE IF NOT EXISTS recommendation_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_run_id UUID NOT NULL REFERENCES recommendation_runs(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 3),
    is_compass_choice BOOLEAN NOT NULL DEFAULT false,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    intervention_category TEXT NOT NULL DEFAULT '',
    fit_score REAL NOT NULL DEFAULT 0,
    confidence_score REAL NOT NULL DEFAULT 0,
    confidence_label TEXT NOT NULL DEFAULT 'limited',
    confidence_explanation TEXT NOT NULL DEFAULT '',
    evidence_overall_tier TEXT NOT NULL DEFAULT 'bronze',
    evidence_total_comparables INTEGER NOT NULL DEFAULT 0,
    evidence_gold_count INTEGER NOT NULL DEFAULT 0,
    evidence_silver_count INTEGER NOT NULL DEFAULT 0,
    evidence_bronze_count INTEGER NOT NULL DEFAULT 0,
    evidence_failed_count INTEGER NOT NULL DEFAULT 0,
    evidence_average_score REAL NOT NULL DEFAULT 0,
    impact_label TEXT NOT NULL DEFAULT '',
    impact_low REAL,
    impact_high REAL,
    impact_unit TEXT NOT NULL DEFAULT '',
    impact_methodology TEXT NOT NULL DEFAULT '',
    impact_sufficient BOOLEAN NOT NULL DEFAULT false,
    timeline_low_weeks REAL,
    timeline_high_weeks REAL,
    why_it_ranked JSONB NOT NULL DEFAULT '[]',
    alternatives_considered JSONB NOT NULL DEFAULT '[]',
    assumptions JSONB NOT NULL DEFAULT '[]',
    risks JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stores evidence links for each recommendation
CREATE TABLE IF NOT EXISTS recommendation_evidence_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_option_id UUID NOT NULL REFERENCES recommendation_options(id) ON DELETE CASCADE,
    organization TEXT NOT NULL DEFAULT '',
    industry TEXT NOT NULL DEFAULT '',
    workflow TEXT NOT NULL DEFAULT '',
    intervention TEXT NOT NULL DEFAULT '',
    outcome TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'unknown',
    similarity_score REAL NOT NULL DEFAULT 0,
    evidence_score REAL NOT NULL DEFAULT 0,
    evidence_tier TEXT NOT NULL DEFAULT 'bronze',
    supporting_passage TEXT NOT NULL DEFAULT '',
    source_title TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    is_negative BOOLEAN NOT NULL DEFAULT false,
    failure_reasons JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_investigation_profiles_investigation ON investigation_profiles(investigation_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_runs_investigation ON recommendation_runs(investigation_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_runs_run_id ON recommendation_runs(recommendation_run_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_options_run ON recommendation_options(recommendation_run_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_evidence_option ON recommendation_evidence_links(recommendation_option_id);
