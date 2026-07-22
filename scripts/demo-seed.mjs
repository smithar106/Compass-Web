#!/usr/bin/env node

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  console.error("Ensure your .env.local is loaded or pass them inline.");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";
const DEMO_SESSION_ID = "demo-session-001";

const { data: existingSession, error: lookupError } = await supabase
  .from("assessment_sessions")
  .select("id")
  .eq("id", DEMO_SESSION_ID)
  .maybeSingle();

if (lookupError) {
  console.error("Failed to check for existing session:", lookupError.message);
  process.exit(1);
}

if (existingSession) {
  console.log("Demo session already exists. Run 'npm run demo:reset' first to reset.\n");
  process.exit(0);
}

const { error: sessionError } = await supabase.from("assessment_sessions").insert({
  id: DEMO_SESSION_ID,
  user_id: DEMO_USER_ID,
  status: "completed",
  assessment_version: "2.0.0",
  total_questions_presented: 25,
  questions_skipped: 2,
  completion_time_minutes: 8,
  metadata: {
    demo: true,
    pipeline_result: {
      mapId: "demo-map-001",
      companyName: "Demo Company",
      generatedAt: new Date().toISOString(),
      isExample: false,
      executiveSummary: {
        headline: "3 opportunities identified across 2 departments",
        finding: "The highest-impact opportunity is in Sales, where manual lead qualification is causing productivity loss.",
        recommendedFocus: "Hybrid AI-assisted lead qualification as the first intervention.",
        quickWins: 1,
      },
      rankings: [
        {
          rank: 1,
          department: "Sales",
          name: "Lead qualification and routing",
          businessProblem: "Sales team lacks consistent lead qualification process.",
          rootCause: "No structured qualification process; leads arrive through multiple channels.",
          currentImpact: "40% productivity loss, 24h+ lead response time.",
          confidence: "High",
          description: "Sales team lacks consistent qualification process.",
          intervention: {
            type: "Hybrid",
            title: "AI-assisted lead qualification with human review",
            description: "AI scores and routes leads; human AEs handle final qualification.",
            businessCase: "Frees 60% of AE time currently spent on manual triage.",
            expectedImpact: "3x lead response speed, 30% more selling time.",
            timeToValue: "4-6 weeks",
            implementationEffort: "Medium",
            confidence: "High",
            humanOversight: "Human-in-the-loop for final qualification decisions",
            evidence: [],
            assumptions: [],
            comparedPaths: [],
            rejectionRationale: "Hybrid offers best balance of automation and accuracy.",
          },
          evidence: [],
          assumptions: [],
          comparedPaths: [],
          whyAlternativesRejected: "Pure AI risks false positives.",
        },
        {
          rank: 2,
          department: "Customer Success",
          name: "Customer health scoring",
          businessProblem: "CS team cannot identify at-risk accounts before they churn.",
          rootCause: "No automated health scoring; health signals are scattered.",
          currentImpact: "30+ day detection time.",
          confidence: "High",
          description: "CS team lacks automated health scoring.",
          intervention: {
            type: "Deterministic Software",
            title: "Rule-based customer health scoring system",
            description: "Deterministic scoring system that aggregates usage data and support tickets.",
            businessCase: "Reduces churn through earlier intervention.",
            expectedImpact: "15-20% churn reduction.",
            timeToValue: "2-4 weeks",
            implementationEffort: "Low-Medium",
            confidence: "High",
            humanOversight: "CS team reviews alerts and executes outreach",
            evidence: [],
            assumptions: [],
            comparedPaths: [],
            rejectionRationale: "Deterministic rules are sufficient and more transparent.",
          },
          evidence: [],
          assumptions: [],
          comparedPaths: [],
          whyAlternativesRejected: "AI scoring is unnecessary for this use case.",
        },
        {
          rank: 3,
          department: "Marketing",
          name: "Email campaign personalization",
          businessProblem: "Email campaigns are basic mail merges with low engagement.",
          rootCause: "No audience segmentation or dynamic content.",
          currentImpact: "2.1% conversion rate.",
          confidence: "Medium",
          description: "Email campaigns are basic mail merges.",
          intervention: {
            type: "Process Redesign",
            title: "Segmented campaign workflow redesign",
            description: "Re-engineer email workflows to use audience segmentation.",
            businessCase: "Improves conversion without AI investment.",
            expectedImpact: "2-3x conversion improvement.",
            timeToValue: "4-8 weeks",
            implementationEffort: "Medium",
            confidence: "Medium",
            humanOversight: "Marketing team manages segments and content",
            evidence: [],
            assumptions: [],
            comparedPaths: [],
            rejectionRationale: "Process redesign achieves significant gains without AI complexity.",
          },
          evidence: [],
          assumptions: [],
          comparedPaths: [],
          whyAlternativesRejected: "AI personalization is premature.",
        },
      ],
      implementationSequencing: {
        strategy: "Start with high-confidence interventions.",
        strategyRationale: "Quick wins with measurable ROI.",
        phases: [
          {
            phase: 1,
            name: "Foundation",
            description: "High-impact, quick-win interventions",
            opportunities: [
              { rank: 1, title: "Lead qualification and routing" },
              { rank: 2, title: "Customer health scoring" },
            ],
            estimatedDuration: "6-8 weeks",
          },
          {
            phase: 2,
            name: "Scaling",
            description: "Expand intervention to additional areas",
            opportunities: [{ rank: 3, title: "Email campaign personalization" }],
            estimatedDuration: "4-6 weeks",
          },
        ],
      },
    },
  },
  started_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

if (sessionError) {
  console.error("Failed to seed demo session:", sessionError.message);
  process.exit(1);
}

const demoAnswers = [
  { question_id: "dept-1", answer: ["Sales", "Marketing", "Customer Success"] },
  { question_id: "dept-2", answer: { value: "lead qualification" } },
  { question_id: "dept-3", answer: { value: "faster lead response" } },
  { question_id: "dept-4", answer: { value: "manual triage taking too long" } },
  { question_id: "freq-1", answer: "Daily" },
  { question_id: "freq-2", answer: "4-10 people" },
  { question_id: "freq-3", answer: "3-5 handoffs" },
  { question_id: "tools-1", answer: "Salesforce, HubSpot" },
  { question_id: "tools-2", answer: "None" },
  { question_id: "tools-3", answer: "Some exceptions" },
  { question_id: "cost-1", answer: "20-40 hours" },
  { question_id: "cost-2", answer: "High" },
  { question_id: "risk-1", answer: "Medium" },
  { question_id: "risk-2", answer: "Stable" },
  { question_id: "constraints-1", answer: "None" },
  { question_id: "constraints-3", answer: "Available" },
];

for (const a of demoAnswers) {
  const { error: answerError } = await supabase.from("assessment_answers").insert({
    session_id: DEMO_SESSION_ID,
    question_id: a.question_id,
    answer: a.answer,
    was_skipped: false,
  });
  if (answerError) {
    console.error(`Failed to insert answer for ${a.question_id}:`, answerError.message);
  }
}

console.log("Demo data seeded successfully.");
console.log(`  Session ID: ${DEMO_SESSION_ID}`);
console.log(`  Answers seeded: ${demoAnswers.length}`);
console.log("\nTo view results, start the app and visit /assessment?demo=true\n");
