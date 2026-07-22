-- seed.sql
-- Seed data for Compass development and demo
-- Creates one fictional organization with a sample assessment, opportunity map, and graph.
-- Run after migrations: psql -f seed.sql

-- Enable required extensions
create extension if not exists "pgcrypto";

-- Insert fictional organization
insert into public.organizations (id, name, slug, website_url, industry, size_range, revenue_stage, business_model, metadata)
values (
  'a0000000-0000-0000-0000-000000000001',
  'Acme SaaS Corp',
  'acme-saas-corp',
  'https://acme-saas.example.com',
  'B2B SaaS',
  '201-500',
  'Series B',
  'SaaS',
  '{
    "identity": {
      "industry": "B2B SaaS",
      "subIndustry": "Enterprise Workflow Automation",
      "businessModel": "SaaS",
      "customerSegments": ["Mid-Market", "Enterprise"],
      "yearFounded": 2019
    },
    "size": {
      "headcountEstimate": 340,
      "revenueStage": "Series B",
      "growthStage": "Scaling"
    },
    "aiMaturity": {
      "level": "Experimental",
      "knownAiTools": ["ChatGPT Enterprise", "GitHub Copilot"]
    },
    "techMaturity": {
      "level": "Modern"
    }
  }'::jsonb
) on conflict (id) do nothing;

-- Create a default admin member (requires a real auth user to link)
-- This is a placeholder — replace user_id with an actual auth.users id after signup.
-- insert into public.organization_members (organization_id, user_id, role)
-- values ('a0000000-0000-0000-0000-000000000001', '<REPLACE_WITH_USER_ID>', 'admin');

-- Sample assessment session (requires a real auth user)
-- Replace REPLACE_WITH_USER_ID with an actual auth.users id after signup.
-- For Supabase Anonymous Auth: create a session first via the app, then update this seed.
insert into public.assessment_sessions (id, user_id, organization_id, status, assessment_version, total_questions_presented, completion_time_minutes, metadata)
values (
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000001',
  'completed',
  '1.0.0',
  25,
  18,
  '{
    "adaptiveVersion": "1.0.0",
    "userAgent": "Mozilla/5.0 Demo Browser"
  }'::jsonb
) on conflict (id) do nothing;

-- Sample assessment answers (all 25 questions)
insert into public.assessment_answers (session_id, question_id, answer, confidence, was_skipped, branch_source) values
  ('b0000000-0000-0000-0000-000000000001', '1', 'false'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '2', '2'::jsonb, 'Medium', false, null),
  ('b0000000-0000-0000-0000-000000000001', '3', '"Salesforce integrated with Outreach and LinkedIn Sales Navigator"'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '4', 'false'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '5', '2'::jsonb, 'Medium', false, null),
  ('b0000000-0000-0000-0000-000000000001', '6', '"Last-touch"'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '7', 'false'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '8', '2'::jsonb, 'Medium', false, null),
  ('b0000000-0000-0000-0000-000000000001', '9', '"Gainsight"'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '10', '"0-10%"'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '11', 'true'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '12', '"4.5 hours"'::jsonb, 'Medium', false, null),
  ('b0000000-0000-0000-0000-000000000001', '13', 'false'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '14', '"4-7 days"'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '15', 'true'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '16', '"RICE scoring and executive council votes"'::jsonb, 'Medium', false, null),
  ('b0000000-0000-0000-0000-000000000001', '17', 'true'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '18', '3'::jsonb, 'Medium', false, null),
  ('b0000000-0000-0000-0000-000000000001', '19', '"2-4 hours"'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '20', 'true'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '21', '"Annual reviews in Lattice with manager-submitted feedback"'::jsonb, 'Medium', false, null),
  ('b0000000-0000-0000-0000-000000000001', '22', 'false'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '23', '"Manual spreadsheet tracking for SOC 2 and GDPR"'::jsonb, 'Medium', false, null),
  ('b0000000-0000-0000-0000-000000000001', '24', 'false'::jsonb, 'High', false, null),
  ('b0000000-0000-0000-0000-000000000001', '25', '"Reduce sales cycle length by 20%"'::jsonb, 'High', false, null);

-- Sample opportunity map
insert into public.opportunity_maps (id, organization_id, assessment_session_id, company_name, executive_summary, implementation_sequencing, cross_opportunity_dependencies, evidence_summary)
values (
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Acme SaaS Corp',
  '{
    "headline": "Acme should prioritize sales qualification automation and proactive customer health monitoring.",
    "finding": "The sales and customer success teams operate reactively, creating upstream revenue risk and downstream churn exposure.",
    "recommendedFocus": "Start with automated sales qualification to compress the sales cycle, then layer proactive health scoring to protect existing revenue.",
    "quickWins": 2,
    "strategicValue": "Building these two capabilities creates a closed-loop revenue intelligence system.",
    "riskFlag": false
  }'::jsonb,
  '{
    "strategy": "Quick Wins First",
    "strategyRationale": "Two high-confidence, lower-difficulty opportunities exist in Sales and CS. Starting there builds organizational momentum and data foundation for later work.",
    "phases": [
      {
        "phase": 1,
        "name": "Revenue Foundation",
        "description": "Deploy sales qualification and routing automation alongside proactive customer health scoring.",
        "opportunities": [{"rank": 1, "title": "Automated Sales Qualification & Routing"}, {"rank": 2, "title": "Proactive Customer Health Scoring"}],
        "estimatedDuration": "8-10 weeks",
        "gates": [
          {"gate": "Phase 1 Review", "criteria": "Both systems operational, baseline metrics captured, user adoption >60%"}
        ]
      },
      {
        "phase": 2,
        "name": "Support Optimization",
        "description": "Deploy self-service support resolution leveraging the customer knowledge gained in Phase 1.",
        "opportunities": [{"rank": 3, "title": "Self-Service Support Resolution"}],
        "estimatedDuration": "6-8 weeks",
        "gates": [
          {"gate": "Phase 2 Review", "criteria": "Deflection rate >30%, CSAT maintained or improved"}
        ]
      }
    ]
  }'::jsonb,
  '[{"fromRank": 1, "toRank": 2, "relationship": "Enhances", "description": "Sales qualification data informs health scoring models.", "critical": false}]'::jsonb,
  '{"verifiedCount": 8, "researchCount": 12, "inferenceCount": 5, "totalEvidenceItems": 25, "overallConfidence": "High"}'::jsonb
) on conflict (id) do nothing;

-- Sample opportunities
insert into public.opportunities (opportunity_map_id, rank, title, department, problem, business_impact, implementation_difficulty, confidence, risks, dependencies, reasoning, evidence)
values
(
  'c0000000-0000-0000-0000-000000000001',
  1,
  'Automated Sales Qualification & Routing',
  'Sales',
  'Sales team lacks standardized qualification framework, leading to inconsistent lead handling and long AE ramp times.',
  '{"description": "AI-powered qualification and routing reduces time-to-qualification by ~40% and increases conversion rates.", "impactType": "Revenue", "estimatedImpact": "15-20% pipeline uplift"}',
  'Medium',
  'High',
  '[{"risk": "Requires CRM integration and process buy-in from sales leadership", "category": "Organizational", "likelihood": "Medium", "impact": "High", "mitigation": "Executive sponsorship from VP Sales"}]'::jsonb,
  '[{"dependency": "CRM API access", "type": "System", "required": true, "status": "Available"}, {"dependency": "Sales leadership alignment on qualification criteria", "type": "People", "required": true, "status": "Needed"}]'::jsonb,
  '[{"step": "Signal extraction", "explanation": "Assessment revealed no documented qualification process and heavy manual data entry.", "confidence": 0.85}]'::jsonb,
  '[{"type": "User", "source": "Sales Director interview", "detail": "AEs spend 35% of week on manual data entry", "confidence": "High"}]'::jsonb,
  now()
),
(
  'c0000000-0000-0000-0000-000000000001',
  2,
  'Proactive Customer Health Scoring',
  'Customer Success',
  'CS team manages accounts reactively, spending most time on already-at-risk accounts.',
  '{"description": "Proactive health scoring surfaces at-risk accounts early, reducing churn by 25-30%.", "impactType": "Revenue", "estimatedImpact": "22-30% churn reduction"}',
  'Medium',
  'High',
  '[{"risk": "Requires clean product usage data", "category": "Technical", "likelihood": "Low", "impact": "Medium", "mitigation": "Usage data audit in Phase 0"}]'::jsonb,
  '[{"dependency": "Product analytics data pipeline", "type": "System", "required": true, "status": "Available"}]'::jsonb,
  '[{"step": "Pattern matching", "explanation": "80/20 reactive/proactive split indicates health scoring gap. Industry benchmarks show 22% avg churn reduction.", "confidence": 0.82}]'::jsonb,
  '[{"type": "Research", "source": "Gainsight benchmarks", "detail": "Automated health scoring reduces churn 22% on average", "confidence": "High"}]'::jsonb,
  now()
);

-- Sample graph nodes (minimal knowledge graph)
insert into public.graph_nodes (id, organization_id, type, name, properties)
values
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'department', 'Sales', '{"departmentType": "Sales", "headcount": 45}'::jsonb),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'department', 'Customer Success', '{"departmentType": "Customer Success", "headcount": 18}'::jsonb),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'system', 'Salesforce', '{"systemCategory": "CRM", "vendor": "Salesforce", "adoptionLevel": "high"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'system', 'Gainsight', '{"systemCategory": "CS Platform", "vendor": "Gainsight", "adoptionLevel": "medium"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'kpi', 'Time to Qualify Lead', '{"currentValue": "4.2 hours", "targetValue": "< 30 minutes"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'kpi', 'Monthly Churn Rate', '{"currentValue": "3.2%", "targetValue": "< 1.5%"}'::jsonb)
on conflict (id) do nothing;

-- Sample graph edges
insert into public.graph_edges (organization_id, source_node_id, target_node_id, relationship, weight)
values
  ('a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'uses', 1.0),
  ('a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'uses', 0.8),
  ('a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005', 'reports_on', 1.0),
  ('a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000006', 'reports_on', 1.0)
on conflict (id) do nothing;

-- Verify seed data
do $$
declare
  org_count integer;
  session_count integer;
  answer_count integer;
  map_count integer;
  opp_count integer;
  node_count integer;
  edge_count integer;
begin
  select count(*) into org_count from public.organizations;
  select count(*) into session_count from public.assessment_sessions;
  select count(*) into answer_count from public.assessment_answers;
  select count(*) into map_count from public.opportunity_maps;
  select count(*) into opp_count from public.opportunities;
  select count(*) into node_count from public.graph_nodes;
  select count(*) into edge_count from public.graph_edges;

  raise notice 'Seed verification: orgs=%, sessions=%, answers=%, maps=%, opportunities=%, nodes=%, edges=%',
    org_count, session_count, answer_count, map_count, opp_count, node_count, edge_count;
end;
$$;
