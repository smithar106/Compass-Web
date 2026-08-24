/**
 * Compass Decision prototype — decision library.
 *
 * Ten complete prototype decisions, one per problem in the problem library.
 * Every decision is deterministic and driven by this data; nothing here is
 * generated at runtime and nothing pretends to be live analysis.
 *
 * Provenance tags: REAL_EVIDENCE (traces to supported existing fixtures),
 * ILLUSTRATIVE (prototype values clearly labeled), PRODUCT_LOGIC (rules).
 */

import type { PrototypeDecision } from "@/types/prototype";

export const DECISION_LIBRARY: PrototypeDecision[] = [
  {
    id: "slow-customer-onboarding",
    problem: "Slow customer onboarding",
    category: "Onboarding",
    description: "New customers take too long to reach full value.",
    recommendation: "Automated intake + exception-based onboarding workflow",
    strategy: "Automate the standard onboarding path and keep experienced people on the exceptions.",
    techStack: [
      { role: "Workflow orchestration", tool: "n8n" },
      { role: "Onboarding intake", tool: "Typeform or Jotform" },
      { role: "System of record", tool: "Salesforce or CRM" },
      { role: "Notifications", tool: "Slack" },
      { role: "Analytics", tool: "Metabase" },
    ],
    decisionStatus: "defensible",
    evidenceStrength: "strong",
    implementationEffort: "Medium",
    timeline: "Weeks 1–12",
    expectedImpact: "30% shorter onboarding time",
    whyThis: [
      "The bottleneck is manual intake and re-keying, not the onboarding team itself.",
      "Exception-based workflow automates the standard path while keeping humans on the edge cases.",
      "The same approach delivers the fastest time-to-value when automation is layered on a clean process.",
      "Low data dependency: most onboarding inputs already exist in CRM and intake forms.",
    ],
    impactMetrics: [
      { label: "Time-to-value", value: "30% faster", detail: "New customers reach full value sooner.", tag: "ILLUSTRATIVE" },
      { label: "Manual effort", value: "~40% fewer manual steps", detail: "Intake, data entry, and status chases are automated.", tag: "ILLUSTRATIVE" },
      { label: "Error / rework", value: "Fewer handoff errors", detail: "Standardized intake reduces missing information.", tag: "ILLUSTRATIVE" },
      { label: "Consistency", value: "One repeatable path", detail: "Every customer follows the same validated flow.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "A mid-size SaaS company cut onboarding time 30% within 90 days by automating intake and running an exception queue." },
      { statement: "A financial-services firm reduced handoff errors roughly 40% in its first quarter by standardizing the onboarding checklist." },
      { statement: "A professional-services firm automated intake with senior review on exceptions and removed about 40% of manual steps." },
    ],
    evidencePatterns: [
      "Standardized intake templates with validation",
      "Exception queue staffed by senior specialists",
      "Status visibility to customer and internal owner",
    ],
    alternatives: [
      { name: "Full onboarding platform", whyRankedLower: "Over-built for current volume; slower to value and higher cost.", verdict: "Rejected" },
      { name: "AI concierge", whyRankedLower: "The process is not yet standardized enough to automate safely.", verdict: "Deferred" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Map the current onboarding path, count manual steps, and set a baseline time-to-value.", timeline: "Weeks 1–2", dependencies: ["Current process map", "Baseline metrics"] },
      { phase: "Pilot", summary: "Automate intake for one customer segment; keep exceptions human-reviewed.", timeline: "Weeks 3–6", dependencies: ["CRM / intake access", "Exception queue owner"] },
      { phase: "Deploy", summary: "Roll out to all segments with the validated intake template.", timeline: "Weeks 7–10", dependencies: ["Pilot results", "Training for intake team"] },
      { phase: "Measure", summary: "Track time-to-value and exception rate against the baseline.", timeline: "Weeks 11–12", dependencies: ["Dashboards", "Agreed success criteria"] },
    ],
    risks: [
      { title: "Exception queue becomes a bottleneck", detail: "If exceptions are not the minority, the queue stalls.", mitigation: "Pilot on one segment first; size the queue to exception volume." },
      { title: "Automation over-corrects a bad process", detail: "Automating a messy flow can harden the mess.", mitigation: "Validate the process map before automating it." },
    ],
    measurement: {
      baseline: "Current average time-to-value for new customers",
      primaryKpi: "Average time-to-value",
      secondaryKpis: ["Manual steps per onboarding", "Exception rate", "Customer satisfaction at day 30"],
      validationPoints: [
        { at: "Day 30", check: "Time-to-value trend vs baseline; exception rate below 30%." },
        { at: "Day 60", check: "Time-to-value improvement ≥ 20%; no new bottlenecks." },
        { at: "Day 90", check: "≥ 30% improvement sustained; decision to scale or adjust." },
      ],
    },
    whatWouldChangeThis: [
      "If exception volume is materially higher than expected, a process-redesign-first path may be the better starting point.",
      "If onboarding data is scattered across systems with no reliable source, a data-consolidation step must precede automation.",
      "If the primary objective shifts from speed to quality assurance, a review-heavy workflow becomes competitive.",
    ],
    assumptions: [
      "Intake inputs already exist in a system Compass can reach.",
      "The team has capacity to run a small pilot in the first weeks.",
      "Onboarding volume is stable enough to measure a meaningful baseline.",
    ],
    decisionSummary:
      "New customers take too long to reach full value because onboarding is manual and person-dependent. The strategy is to automate the standard intake path and reserve people for the exceptions — the approach with the strongest record of results. Mid-size companies that automated intake cut onboarding time around 30% within 90 days. A full platform is over-built for current volume, and an AI concierge is premature until the process is standardized. The chosen path delivers the fastest time-to-value at low risk.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "manual-invoice-processing",
    problem: "Too much manual invoice processing",
    category: "Finance",
    description: "Finance capacity is consumed by manual invoice handling.",
    recommendation: "Automated invoice matching with exception-based review",
    strategy: "Automate the reliable match path and keep humans on the ambiguous exceptions.",
    techStack: [
      { role: "Document extraction", tool: "Google Document AI" },
      { role: "Matching rules", tool: "n8n" },
      { role: "ERP / system of record", tool: "SAP or NetSuite" },
      { role: "Approvals", tool: "DocuSign" },
      { role: "Audit trail", tool: "Postgres + Grafana" },
    ],
    decisionStatus: "defensible",
    evidenceStrength: "strong",
    implementationEffort: "Medium",
    timeline: "Weeks 1–16",
    expectedImpact: "40–60% lower processing cost",
    whyThis: [
      "Most invoices follow the same match-to-order-to-receipt pattern that automation handles reliably.",
      "Exception-based review keeps humans on ambiguous matches and supplier edge cases.",
      "Automation of high-volume AP consistently delivers 40–60% cost reduction in practice.",
      "Deterministic matching is transparent, auditable, and low-risk versus free-text extraction.",
    ],
    impactMetrics: [
      { label: "Cycle time", value: "60–75% faster", detail: "Invoice to payment cycle shortens dramatically.", tag: "ILLUSTRATIVE" },
      { label: "Cost", value: "40–60% lower", detail: "Per-invoice processing cost falls on high volume.", tag: "ILLUSTRATIVE" },
      { label: "Manual hours", value: "Mostly eliminated", detail: "Matching and data entry automated.", tag: "ILLUSTRATIVE" },
      { label: "Error / rework", value: "Fewer exceptions", detail: "Standardized matching reduces duplicate payments.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "A mid-market manufacturer cut invoice processing cost by roughly half within a quarter by automating invoice matching." },
      { statement: "A financial-services firm reduced its invoice-to-payment cycle by about 70% using three-way matching with an exception queue." },
      { statement: "A distribution company materially reduced duplicate-payment errors by automating matching with a full audit trail." },
    ],
    evidencePatterns: [
      "Two-way or three-way matching on purchase orders",
      "Exception work queue for mismatch review",
      "Audit trail on every automated decision",
    ],
    alternatives: [
      { name: "AI-only extraction", whyRankedLower: "Uncontrolled hallucination risk on exceptions; the evidence is thinner.", verdict: "Rejected" },
      { name: "Manual process redesign", whyRankedLower: "Lower impact; acceptable only if automation budget is unavailable.", verdict: "Viable alternative" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Measure invoice volume, matching rate, and current cost per invoice.", timeline: "Weeks 1–3", dependencies: ["Volume baseline", "Supplier and PO data quality"] },
      { phase: "Pilot", summary: "Automate matching for the highest-volume vendors with human exception review.", timeline: "Weeks 4–8", dependencies: ["ERP / AP access", "Exception queue owner"] },
      { phase: "Deploy", summary: "Expand to the full vendor base; tune matching rules.", timeline: "Weeks 9–13", dependencies: ["Pilot accuracy", "Approvals workflow"] },
      { phase: "Measure", summary: "Track cost, cycle time, and exception rate against baseline.", timeline: "Weeks 14–16", dependencies: ["Dashboards", "Agreed success criteria"] },
    ],
    risks: [
      { title: "Supplier data quality blocks matching", detail: "Incomplete PO or receipt data reduces the match rate.", mitigation: "Validate data quality before scaling; keep exceptions human-reviewed." },
      { title: "Exception volume overwhelms AP", detail: "A low match rate just moves the workload.", mitigation: "Pilot first; only scale when match rate clears the bar." },
    ],
    measurement: {
      baseline: "Current cost and cycle time per invoice",
      primaryKpi: "Processing cost per invoice",
      secondaryKpis: ["Automated match rate", "Exception resolution time", "Duplicate payment rate"],
      validationPoints: [
        { at: "Day 30", check: "Match rate and exception volume on the pilot segment." },
        { at: "Day 60", check: "Cost per invoice vs baseline; exception backlog stable." },
        { at: "Day 90", check: "40–60% cost reduction on track; decision to scale." },
      ],
    },
    whatWouldChangeThis: [
      "If invoice volume is low, automation may not pay back; a lighter process-reform path becomes competitive.",
      "If suppliers are deeply inconsistent, AI-assisted extraction may need to precede deterministic matching.",
      "If the objective is strictly audit readiness over cost, a compliance-first configuration is preferable.",
    ],
    assumptions: [
      "Invoice volume is high enough to justify automation.",
      "Purchase order and receipt data is available for matching.",
      "AP team can run a controlled pilot in the first weeks.",
    ],
    decisionSummary:
      "Finance capacity is consumed by manual invoice handling. The strategy is to automate the reliable matching path and keep AP staff on the exceptions, which has the strongest record of results. Mid-market companies that automated matching cut processing cost roughly 40–60%. AI-only extraction carries uncontrolled exception risk, and a manual redesign leaves the cost largely in place. The chosen path delivers the strongest cost reduction with a transparent, auditable audit trail.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "misrouted-support",
    problem: "Support requests routed incorrectly",
    category: "Support",
    description: "Tickets are misrouted, delaying resolution and frustrating customers.",
    recommendation: "Deterministic triage with hybrid escalation routing",
    strategy: "Route every ticket to the right owner on the first hop; escalate complexity to specialists.",
    techStack: [
      { role: "Routing rules", tool: "n8n" },
      { role: "Ticketing", tool: "Zendesk or Jira" },
      { role: "Contact center", tool: "Twilio" },
      { role: "Escalation queue", tool: "Salesforce Service Cloud" },
    ],
    decisionStatus: "defensible",
    evidenceStrength: "strong",
    implementationEffort: "Medium",
    timeline: "Weeks 1–14",
    expectedImpact: "25–40% faster resolution",
    whyThis: [
      "Misrouting is a routing-logic problem, not a headcount problem.",
      "Deterministic rules are transparent, auditable, and fixable when wrong.",
      "Hybrid escalation keeps complex cases with senior specialists.",
      "Routing fixes alone deliver 25–40% resolution-time gains in practice.",
    ],
    impactMetrics: [
      { label: "Resolution time", value: "25–40% faster", detail: "Tickets reach the right owner on the first hop.", tag: "ILLUSTRATIVE" },
      { label: "Manual hours", value: "Less triage", detail: "Agents stop re-routing tickets by hand.", tag: "ILLUSTRATIVE" },
      { label: "Error / rework", value: "Fewer handoffs", detail: "First-contact routing improves.", tag: "ILLUSTRATIVE" },
      { label: "Customer experience", value: "Fewer repeats", detail: "Customers are not asked to restate the issue.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "An enterprise software vendor cut resolution time about 30% in its first quarter by introducing rule-based triage." },
      { statement: "A consumer-services company reduced misrouting and lifted customer satisfaction with hybrid routing and specialist escalation." },
      { statement: "A mid-size B2B firm improved first-contact resolution by roughly 35% with deterministic routing and an agent feedback loop." },
    ],
    evidencePatterns: [
      "Rule-based routing keyed to product, channel, and intent",
      "Escalation matrix for ambiguous or high-value tickets",
      "Feedback loop from agents when routing is wrong",
    ],
    alternatives: [
      { name: "Full AI agent", whyRankedLower: "Cost and drift risk exceed the benefit.", verdict: "Rejected" },
      { name: "Process redesign only", whyRankedLower: "Lower impact and risk; acceptable if resources are constrained.", verdict: "Viable alternative" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Audit ticket types, owners, and current misrouting rate.", timeline: "Weeks 1–2", dependencies: ["Ticket data", "Owner map"] },
      { phase: "Pilot", summary: "Deploy routing rules for the highest-volume ticket types.", timeline: "Weeks 3–6", dependencies: ["Routing rules", "Feedback channel"] },
      { phase: "Deploy", summary: "Expand to all ticket types with escalation handling.", timeline: "Weeks 7–11", dependencies: ["Pilot accuracy", "Training"] },
      { phase: "Measure", summary: "Track first-contact resolution and routing accuracy.", timeline: "Weeks 12–14", dependencies: ["Dashboards", "Agreed criteria"] },
    ],
    risks: [
      { title: "Rules drift from reality", detail: "New products or channels break assumptions.", mitigation: "Build an agent feedback loop into the flow." },
      { title: "Escalation matrix gaps", detail: "Ambiguous tickets stall without a path.", mitigation: "Design a default escalation owner up front." },
    ],
    measurement: {
      baseline: "Current misrouting rate and time-to-owner",
      primaryKpi: "First-contact resolution rate",
      secondaryKpis: ["Time to first owner", "Misrouting rate", "Escalation satisfaction"],
      validationPoints: [
        { at: "Day 30", check: "Misrouting rate on the pilot ticket types." },
        { at: "Day 60", check: "First-contact resolution improving; no new gaps." },
        { at: "Day 90", check: "25–40% resolution-time gain; decision to scale." },
      ],
    },
    whatWouldChangeThis: [
      "If ticket volume is very high and highly repetitive, an AI-assist layer becomes more attractive.",
      "If the routing failure is really an ownership or coverage problem, the fix is organizational, not technical.",
      "If the objective is deflection over speed, self-service handling is the better choice than pure routing.",
    ],
    assumptions: [
      "Ticket data is available and structured enough to route on.",
      "Owners are defined for each ticket type.",
      "Agents will participate in a routing feedback loop.",
    ],
    decisionSummary:
      "Support requests are misrouted, delaying resolution and frustrating customers. The strategy is to route every ticket to the right owner on the first hop with deterministic rules and escalate genuinely complex cases to specialists. Companies that fixed routing alone cut resolution time around 25–40%. A full AI agent is premature — comparable evidence is thin and the cost and drift risk outweigh the benefit. The chosen path is the highest-impact, lowest-risk fix available.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "trapped-knowledge",
    problem: "Knowledge trapped across documents",
    category: "Knowledge",
    description: "Answers live in spreadsheets and documents no one can search.",
    recommendation: "Structured knowledge base + governed search",
    strategy: "Stand up one governed source of truth and make it the first place people look.",
    techStack: [
      { role: "Knowledge base", tool: "Notion" },
      { role: "Governed search", tool: "Algolia" },
      { role: "Content owners", tool: "Confluence" },
      { role: "Analytics", tool: "Metabase" },
    ],
    decisionStatus: "defensible",
    evidenceStrength: "strong",
    implementationEffort: "Medium",
    timeline: "Weeks 1–12",
    expectedImpact: "20–30% fewer repeat questions",
    whyThis: [
      "The knowledge exists; the problem is structure and retrieval.",
      "A governed source of truth beats AI answers over messy files.",
      "Structured knowledge delivery typically cuts repeat questions by 20–30%.",
      "Deterministic structure makes answers verifiable and auditable.",
    ],
    impactMetrics: [
      { label: "Repeat questions", value: "20–30% fewer", detail: "Answers are findable without asking someone.", tag: "ILLUSTRATIVE" },
      { label: "Search time", value: "Much faster", detail: "Employees stop hunting across tools.", tag: "ILLUSTRATIVE" },
      { label: "Manual hours", value: "Less interruption", detail: "Fewer context-switching questions.", tag: "ILLUSTRATIVE" },
      { label: "Consistency", value: "One source of truth", detail: "Conflicting answers are reconciled.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "An enterprise services firm cut repeat questions by roughly 25% in a quarter by standing up a curated knowledge base." },
      { statement: "A mid-size technology company sharply reduced time-to-answer with governed search over trusted sources." },
      { statement: "A professional-services firm reconciled conflicting answers and raised trust by assigning owners and a review cadence." },
    ],
    evidencePatterns: [
      "Curated knowledge base with owners and review dates",
      "Governed search surfacing the canonical answer",
      "Fallback to human experts for gaps",
    ],
    alternatives: [
      { name: "AI chatbot over raw files", whyRankedLower: "Unstructured sources produce unreliable answers.", verdict: "Rejected" },
      { name: "Process redesign only", whyRankedLower: "Helps, but does not make knowledge reusable at scale.", verdict: "Viable alternative" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Inventory knowledge sources and the most-asked questions.", timeline: "Weeks 1–2", dependencies: ["Source inventory", "FAQ data"] },
      { phase: "Pilot", summary: "Stand up the knowledge base for one team with the highest repeat-question load.", timeline: "Weeks 3–6", dependencies: ["Content owners", "Knowledge platform"] },
      { phase: "Deploy", summary: "Expand coverage and connect governed search across tools.", timeline: "Weeks 7–10", dependencies: ["Pilot feedback", "Owner training"] },
      { phase: "Measure", summary: "Track repeat questions and search success against baseline.", timeline: "Weeks 11–12", dependencies: ["Dashboards", "Agreed criteria"] },
    ],
    risks: [
      { title: "Knowledge goes stale", detail: "Unowned content decays and becomes untrusted.", mitigation: "Assign owners and review cadence per topic." },
      { title: "Adoption stalls", detail: "Teams keep asking instead of searching.", mitigation: "Surface the canonical answer where people already work." },
    ],
    measurement: {
      baseline: "Current repeat-question volume and time-to-answer",
      primaryKpi: "Repeat question rate",
      secondaryKpis: ["Search success rate", "Time-to-answer", "Content freshness"],
      validationPoints: [
        { at: "Day 30", check: "Pilot team search adoption and freshness." },
        { at: "Day 60", check: "Repeat questions down; content coverage expanding." },
        { at: "Day 90", check: "20–30% reduction; decision to expand scope." },
      ],
    },
    whatWouldChangeThis: [
      "If the primary problem is that answers change rapidly, a lightweight living-doc approach may beat a formal base.",
      "If most questions require judgment rather than retrieval, expert routing is the higher-value fix.",
      "If the knowledge is already well-structured but undiscoverable, search-only is sufficient.",
    ],
    assumptions: [
      "The knowledge exists somewhere in the organization today.",
      "Teams are willing to consult a single source of truth.",
      "Content owners can maintain freshness.",
    ],
    decisionSummary:
      "Answers live in spreadsheets and documents that no one can search, so employees re-ask and re-derive the same things. The strategy is to stand up one governed source of truth and make it the default place to look. Companies that structured knowledge and governed search cut repeat questions roughly 20–30%. A chatbot over raw files produces unreliable, low-trust answers, and process redesign alone leaves no reusable asset. The chosen path builds durable organizational memory at low risk.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "sales-handoff-rework",
    problem: "Sales-to-implementation rework",
    category: "Handoffs",
    description: "Handoffs between sales and delivery require too much rework.",
    recommendation: "Handoff standardization + CRM workflow",
    strategy: "Fix the handoff, not the tools — enforce one standard before delivery takes over.",
    techStack: [
      { role: "CRM workflow", tool: "Salesforce or HubSpot" },
      { role: "Handoff checklist", tool: "Notion" },
      { role: "Stage gate", tool: "Zapier or n8n" },
      { role: "Owner handshake", tool: "Slack" },
    ],
    decisionStatus: "directionally_supported",
    evidenceStrength: "moderate",
    implementationEffort: "Low–Medium",
    timeline: "Weeks 1–10",
    expectedImpact: "2x faster kickoff, less rework",
    whyThis: [
      "The rework is caused by unstructured handoffs, not missing software.",
      "A standardized handoff checklist removes the most common failure: lost detail.",
      "CRM workflow enforces the standard without adding new tools.",
      "The gains are fast because the fix is process-led, not tool-led.",
    ],
    impactMetrics: [
      { label: "Kickoff time", value: "~50% faster", detail: "From deal close to implementation kickoff.", tag: "ILLUSTRATIVE" },
      { label: "Rework", value: "Less re-scoping", detail: "Fewer dropped details and re-negotiated terms.", tag: "ILLUSTRATIVE" },
      { label: "Manual hours", value: "Less chasing", detail: "Status is visible instead of chased.", tag: "ILLUSTRATIVE" },
      { label: "Predictability", value: "Clearer ownership", detail: "Every handoff has an owner and a checklist.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "A professional-services firm halved its sales-to-implementation kickoff time within a quarter using a standard handoff checklist." },
      { statement: "A mid-size B2B company cut rework incidents materially by enforcing a CRM stage gate on the handoff." },
      { statement: "An enterprise technology vendor sharply reduced deal-detail loss with a clear ownership handshake and status visibility." },
    ],
    evidencePatterns: [
      "Standard handoff checklist with required fields",
      "Owner handshake between sales and delivery",
      "CRM stage gate blocking the handoff until complete",
    ],
    alternatives: [
      { name: "CRM replacement", whyRankedLower: "The underlying handoff is the problem, not the tool.", verdict: "Rejected" },
      { name: "More implementation headcount", whyRankedLower: "Treats the symptom; rework persists.", verdict: "Rejected" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Document the current handoff and its common failure points.", timeline: "Weeks 1–2", dependencies: ["Handoff process map", "Rework examples"] },
      { phase: "Pilot", summary: "Run the checklist on new deals in one sales region.", timeline: "Weeks 3–5", dependencies: ["Checklist design", "Sales + delivery owners"] },
      { phase: "Deploy", summary: "Enforce the standard across all regions via the CRM stage gate.", timeline: "Weeks 6–8", dependencies: ["Pilot results", "CRM workflow"] },
      { phase: "Measure", summary: "Track kickoff time and rework rate against baseline.", timeline: "Weeks 9–10", dependencies: ["Dashboards", "Agreed criteria"] },
    ],
    risks: [
      { title: "Sales sees it as friction", detail: "A checklist can feel like red tape at close.", mitigation: "Frame it as protecting the deal; keep it short." },
      { title: "Standard is bypassed", detail: "Urgent deals skip the gate.", mitigation: "Make the gate visible in the CRM and non-optional." },
    ],
    measurement: {
      baseline: "Current kickoff time and rework rate",
      primaryKpi: "Time from close to implementation kickoff",
      secondaryKpis: ["Rework incidents per handoff", "Deal detail loss", "Internal handoff satisfaction"],
      validationPoints: [
        { at: "Day 30", check: "Checklist adoption and kickoff time on the pilot region." },
        { at: "Day 60", check: "Rework trending down; gate compliance high." },
        { at: "Day 90", check: "Kickoff ~50% faster; decision to scale." },
      ],
    },
    whatWouldChangeThis: [
      "If the rework is driven by scope ambiguity rather than lost detail, a formal scoping step must be added.",
      "If handoffs fail because delivery capacity is mis-sold, the fix is sales forecasting, not workflow.",
      "If the organization is small enough that every handoff is personal, a light-touch process is sufficient.",
    ],
    assumptions: [
      "A CRM is available to enforce the workflow.",
      "Sales and delivery leadership endorse the standard.",
      "The handoff failures are process failures, not scope failures.",
    ],
    decisionSummary:
      "Sales-to-implementation handoffs lose detail and require rework because the handoff itself is unstructured. The strategy is to fix the handoff, not the tools — enforce one standard with a checklist and a CRM stage gate. Comparable organizations halved kickoff time within a quarter. Replacing the CRM would not fix the underlying process, and adding headcount only treats the symptom. The chosen path is fast, low-cost, and durable.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "repetitive-reporting",
    problem: "Too much repetitive reporting",
    category: "Reporting",
    description: "Employees spend hours assembling the same reports by hand.",
    recommendation: "Self-serve reporting automation with governed templates",
    strategy: "Automate the repeated queries once, with one governed definition of each metric.",
    techStack: [
      { role: "Reporting engine", tool: "Metabase or Looker" },
      { role: "Metric definitions", tool: "dbt" },
      { role: "Scheduling", tool: "n8n" },
      { role: "Data warehouse", tool: "BigQuery" },
    ],
    decisionStatus: "defensible",
    evidenceStrength: "moderate",
    implementationEffort: "Medium",
    timeline: "Weeks 1–12",
    expectedImpact: "~40% of reporting hours returned",
    whyThis: [
      "Most reports are the same query over shifting data — ideal for automation.",
      "Governed templates preserve a single definition of each metric.",
      "Self-serve reporting removes the analyst bottleneck entirely.",
      "The approach returns large numbers of hours at low implementation risk.",
    ],
    impactMetrics: [
      { label: "Manual hours", value: "~40% returned", detail: "Time back to analysts and business teams.", tag: "ILLUSTRATIVE" },
      { label: "Cycle time", value: "Near real-time", detail: "Reports refresh without being rebuilt.", tag: "ILLUSTRATIVE" },
      { label: "Consistency", value: "One metric definition", detail: "No more spreadsheet drift between teams.", tag: "ILLUSTRATIVE" },
      { label: "Error / rework", value: "Fewer versions", detail: "A single governed source replaces email chains.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "A mid-size financial-services firm returned about 40% of its reporting hours within a quarter using governed templates and auto-refresh." },
      { statement: "An enterprise operations team largely eliminated its analyst request queue by opening self-serve access on governed templates." },
      { statement: "A manufacturer resolved spreadsheet drift between teams by appointing metric owners with single definitions." },
    ],
    evidencePatterns: [
      "Template library with metric owners",
      "Automated refresh from source systems",
      "Self-serve access so business teams stop requesting",
    ],
    alternatives: [
      { name: "Manual efficiency push", whyRankedLower: "Lower impact; keeps the analyst bottleneck.", verdict: "Rejected" },
      { name: "Full BI platform migration", whyRankedLower: "Higher cost and slower; automation of existing tools may suffice.", verdict: "Deferred" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Inventory the most-repeated reports and the hours they consume.", timeline: "Weeks 1–2", dependencies: ["Report inventory", "Hour baseline"] },
      { phase: "Pilot", summary: "Automate the top 3 reports for one department.", timeline: "Weeks 3–6", dependencies: ["Data access", "Template design"] },
      { phase: "Deploy", summary: "Expand templates across teams; open self-serve access.", timeline: "Weeks 7–10", dependencies: ["Pilot feedback", "Training"] },
      { phase: "Measure", summary: "Track hours returned and self-serve adoption.", timeline: "Weeks 11–12", dependencies: ["Dashboards", "Agreed criteria"] },
    ],
    risks: [
      { title: "Metric definitions differ by team", detail: "Automating the wrong number hardens a conflict.", mitigation: "Agree a metric owner before automating each report." },
      { title: "Self-serve creates confusion", detail: "Business users see multiple versions.", mitigation: "Governed templates as the single source of truth." },
    ],
    measurement: {
      baseline: "Current hours spent on repeated reports",
      primaryKpi: "Reporting hours returned",
      secondaryKpis: ["Self-serve adoption", "Report refresh lag", "Metric conflict incidents"],
      validationPoints: [
        { at: "Day 30", check: "Top-report automation live; definitions agreed." },
        { at: "Day 60", check: "Hours returned on track; adoption climbing." },
        { at: "Day 90", check: "~40% hours returned; decision to expand." },
      ],
    },
    whatWouldChangeThis: [
      "If reports rely on unstructured data or manual judgment, automation is only possible after data structuring.",
      "If the real problem is that no one trusts the numbers, the fix is data governance before automation.",
      "If the reporting load is tiny, the cost of automation may not pay back.",
    ],
    assumptions: [
      "Source data is accessible for automated refresh.",
      "Teams can agree on metric definitions.",
      "The reporting load is large enough to justify automation.",
    ],
    decisionSummary:
      "Employees spend hours rebuilding the same reports, and each rebuild risks a different number. The strategy is to automate the repeated queries once, with one governed definition of each metric and self-serve access. Comparable organizations returned roughly 40% of reporting hours within a quarter. A manual efficiency push keeps the analyst bottleneck, and a full BI migration is heavier than needed. The chosen path returns the most hours at the lowest risk.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "late-escalations",
    problem: "Escalations identified too late",
    category: "Customer Risk",
    description: "At-risk customers are spotted only after revenue is already at risk.",
    recommendation: "Predictive escalation scoring with early-warning routing",
    strategy: "Watch the signals you already have and engage at-risk accounts before renewal risk builds.",
    techStack: [
      { role: "Risk scoring", tool: "Python + BigQuery" },
      { role: "Watchlist routing", tool: "n8n" },
      { role: "CS platform", tool: "Gainsight or ChurnZero" },
      { role: "Engagement", tool: "Outreach" },
    ],
    decisionStatus: "directionally_supported",
    evidenceStrength: "moderate",
    implementationEffort: "Medium",
    timeline: "Weeks 1–14",
    expectedImpact: "Earlier warning, faster response",
    whyThis: [
      "The signals already exist in usage, tickets, and contacts; they are just not watched.",
      "A scoring model surfaces at-risk customers before revenue is at stake.",
      "Early-warning routing puts the right owner on the account sooner.",
      "Early intervention is repeatedly shown to reduce churn in practice.",
    ],
    impactMetrics: [
      { label: "Warning lead time", value: "Weeks earlier", detail: "Risk is surfaced before renewal conversations.", tag: "ILLUSTRATIVE" },
      { label: "Response time", value: "Faster", detail: "The right owner engages while there is still leverage.", tag: "ILLUSTRATIVE" },
      { label: "Churn", value: "Lower", detail: "Early intervention protects at-risk accounts.", tag: "ILLUSTRATIVE" },
      { label: "Visibility", value: "One risk view", detail: "Leaders see account risk without asking.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "A SaaS subscription company cut churn meaningfully in its first year by scoring risk from usage and ticket signals." },
      { statement: "A financial-services firm responded faster and recovered more at-risk accounts with an early-warning watchlist for account owners." },
      { statement: "A mid-size B2B vendor stabilized at-risk accounts before renewal using a scored watchlist and a customer-success playbook." },
    ],
    evidencePatterns: [
      "Risk score from usage, ticket, and contact signals",
      "Watchlist routed to account owner",
      "Playbook for early-warning engagement",
    ],
    alternatives: [
      { name: "Manual account reviews", whyRankedLower: "Too slow and inconsistent to catch risk early.", verdict: "Rejected" },
      { name: "Full customer-health platform", whyRankedLower: "Heavier than needed to begin scoring; start with existing data.", verdict: "Deferred" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Identify the signals that correlate with churn in your data.", timeline: "Weeks 1–3", dependencies: ["Usage and ticket data", "Churn history"] },
      { phase: "Pilot", summary: "Score a segment of accounts and route the top-risk watchlist.", timeline: "Weeks 4–7", dependencies: ["Scoring model", "Account owner map"] },
      { phase: "Deploy", summary: "Expand scoring to the full base; tune thresholds with CS feedback.", timeline: "Weeks 8–12", dependencies: ["Pilot accuracy", "CS playbook"] },
      { phase: "Measure", summary: "Track warning lead time and intervention outcomes.", timeline: "Weeks 13–14", dependencies: ["Dashboards", "Agreed criteria"] },
    ],
    risks: [
      { title: "Scoring produces false alarms", detail: "Too many watchlists dilute attention.", mitigation: "Tune thresholds with CS feedback during the pilot." },
      { title: "Signals are poor predictors", detail: "Weak correlation means weak early warning.", mitigation: "Validate signal correlation before scaling." },
    ],
    measurement: {
      baseline: "Current detection lag and response time",
      primaryKpi: "Warning lead time before renewal risk",
      secondaryKpis: ["Watchlist accuracy", "Intervention response time", "At-risk account recovery"],
      validationPoints: [
        { at: "Day 30", check: "Scoring live on the pilot segment; watchlist accuracy." },
        { at: "Day 60", check: "Warning lead time improving; false alarms falling." },
        { at: "Day 90", check: "Sustained early warning; decision to scale." },
      ],
    },
    whatWouldChangeThis: [
      "If churn signals are weak or data is incomplete, a manual review cadence may be the honest first step.",
      "If the problem is response capacity rather than detection, the fix is resourcing, not scoring.",
      "If the customer base is small and well-known, lightweight account reviews may suffice.",
    ],
    assumptions: [
      "Usage, ticket, and contact data is available for scoring.",
      "Account owners can act on early warnings.",
      "There is a churn history to calibrate the score against.",
    ],
    decisionSummary:
      "At-risk customers are spotted only after revenue is already in danger, because the signals are there but unmonitored. The strategy is to watch the usage, ticket, and contact signals the organization already has and route early warnings to account owners. Comparable companies reduced churn by acting weeks earlier. Manual reviews are too slow and inconsistent, and a full customer-health platform is heavier than needed to begin. The chosen path starts with existing data and scales as accuracy improves.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "manual-forecasting",
    problem: "Forecasting requires too much manual work",
    category: "Planning",
    description: "Forecasts are assembled by hand in spreadsheets and go stale quickly.",
    recommendation: "Structured forecasting pipeline with automated rollup",
    strategy: "Automate the assembly so the forecast stays current and assumptions stay explicit.",
    techStack: [
      { role: "Forecast pipeline", tool: "dbt + BigQuery" },
      { role: "Rollup automation", tool: "n8n" },
      { role: "Planning inputs", tool: "Anaplan or Excel + Datawrapper" },
      { role: "Versioning", tool: "Git" },
    ],
    decisionStatus: "directionally_supported",
    evidenceStrength: "moderate",
    implementationEffort: "Medium",
    timeline: "Weeks 1–12",
    expectedImpact: "Faster cycles, less manual assembly",
    whyThis: [
      "The forecast is assembled, not analyzed — the bottleneck is rollup, not judgment.",
      "An automated pipeline keeps the forecast current instead of stale.",
      "Structured inputs make assumptions explicit and auditable.",
      "Structured pipelines produce faster, more reliable cycles with far less manual effort.",
    ],
    impactMetrics: [
      { label: "Cycle time", value: "Much faster", detail: "Forecast refreshes instead of being rebuilt.", tag: "ILLUSTRATIVE" },
      { label: "Manual hours", value: "Significantly less", detail: "Rollup and consolidation are automated.", tag: "ILLUSTRATIVE" },
      { label: "Accuracy", value: "More consistent", detail: "Assumptions are explicit and versioned.", tag: "ILLUSTRATIVE" },
      { label: "Scenario planning", value: "Easier", detail: "What-if scenarios reuse the pipeline.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "A mid-size services company cut its forecast cycle from weeks to days with structured inputs and automated rollup." },
      { statement: "An enterprise planning team sharply reduced manual assembly by using versioned, owner-attributed assumptions." },
      { statement: "A manufacturer kept its forecast current and removed month-end crunch by automating consolidation across divisions." },
    ],
    evidencePatterns: [
      "Structured input templates per owner",
      "Automated rollup from source plans",
      "Versioned assumptions with owner attribution",
    ],
    alternatives: [
      { name: "Forecast software purchase", whyRankedLower: "Over-built if the core problem is manual assembly.", verdict: "Deferred" },
      { name: "More planning headcount", whyRankedLower: "Keeps the manual bottleneck.", verdict: "Rejected" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Map the current forecast assembly and its manual steps.", timeline: "Weeks 1–2", dependencies: ["Process map", "Input inventory"] },
      { phase: "Pilot", summary: "Automate rollup for one division with structured inputs.", timeline: "Weeks 3–6", dependencies: ["Input templates", "Data sources"] },
      { phase: "Deploy", summary: "Expand to all divisions; standardize the planning cadence.", timeline: "Weeks 7–10", dependencies: ["Pilot results", "Owner training"] },
      { phase: "Measure", summary: "Track cycle time and manual hours against baseline.", timeline: "Weeks 11–12", dependencies: ["Dashboards", "Agreed criteria"] },
    ],
    risks: [
      { title: "Garbage-in garbage-out", detail: "Structured inputs are only as good as owners' assumptions.", mitigation: "Require explicit, versioned assumptions per input." },
      { title: "Owners resist structure", detail: "Standardized inputs feel like overhead.", mitigation: "Show that structure removes their late-night rollups." },
    ],
    measurement: {
      baseline: "Current forecast cycle time and manual effort",
      primaryKpi: "Forecast cycle time",
      secondaryKpis: ["Manual assembly hours", "Forecast error vs actual", "Assumption coverage"],
      validationPoints: [
        { at: "Day 30", check: "Pilot division rollup automated; inputs structured." },
        { at: "Day 60", check: "Cycle time down; accuracy at least stable." },
        { at: "Day 90", check: "Sustained improvement; decision to expand." },
      ],
    },
    whatWouldChangeThis: [
      "If forecasts fail because inputs are wrong rather than slow, the fix is data quality before automation.",
      "If the business is too volatile for structured forecasts, a rolling scenario approach is preferable.",
      "If forecasting is already centralized, automation may be unnecessary.",
    ],
    assumptions: [
      "Forecast inputs can be standardized.",
      "Owners will provide structured, versioned inputs.",
      "The current forecast is material enough to justify the change.",
    ],
    decisionSummary:
      "Forecasts are rebuilt by hand in spreadsheets and go stale quickly, so the assembly itself is the bottleneck. The strategy is to automate the rollup and make assumptions explicit and versioned. Comparable organizations cut their forecast cycle from weeks to days. Buying forecast software is over-built if assembly is the real problem, and more headcount keeps the manual bottleneck. The chosen path removes the busywork and keeps judgment where it belongs.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "hard-to-find-information",
    problem: "Teams can't find accurate information",
    category: "Knowledge",
    description: "Employees waste time searching for internal information that exists.",
    recommendation: "Governed enterprise search over trusted sources",
    strategy: "Make the trusted sources searchable so the answer people believe is the answer they find.",
    techStack: [
      { role: "Enterprise search", tool: "Algolia" },
      { role: "Indexed sources", tool: "Confluence + Drive" },
      { role: "Permissions", tool: "SSO + role-based access" },
      { role: "Feedback loop", tool: "Slack" },
    ],
    decisionStatus: "directionally_supported",
    evidenceStrength: "moderate",
    implementationEffort: "Low–Medium",
    timeline: "Weeks 1–8",
    expectedImpact: "Faster answers from trusted sources",
    whyThis: [
      "The information exists — the failure is retrieval and trust.",
      "Searching only trusted sources removes the 'is this right?' doubt.",
      "A governed index is low-effort to stand up on existing systems.",
      "Search fixes reach time-to-value quickly because they use what already exists.",
    ],
    impactMetrics: [
      { label: "Search time", value: "Much faster", detail: "Answers surface from trusted sources first.", tag: "ILLUSTRATIVE" },
      { label: "Interruptions", value: "Fewer", detail: "Employees stop pinging colleagues for answers.", tag: "ILLUSTRATIVE" },
      { label: "Accuracy", value: "Higher trust", detail: "Results come from governed sources.", tag: "ILLUSTRATIVE" },
      { label: "Consistency", value: "One answer", detail: "Conflicting versions are reconciled.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "An enterprise software company cut time-to-answer sharply within weeks by indexing its owned sources." },
      { statement: "A mid-size services firm saw employees trust results and ask fewer colleagues once trusted content ranked first." },
      { statement: "A professional-services firm improved answer consistency and reduced duplicate asks with a curated index and a feedback loop." },
    ],
    evidencePatterns: [
      "Index over curated, owned sources",
      "Result ranking that favors governed content",
      "Feedback loop to improve coverage",
    ],
    alternatives: [
      { name: "AI chatbot over everything", whyRankedLower: "Widens the trust problem; answers cannot be traced.", verdict: "Rejected" },
      { name: "More documentation effort", whyRankedLower: "Slower; search over what exists helps immediately.", verdict: "Deferred" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Identify the highest-trust sources and the top unanswered questions.", timeline: "Weeks 1–2", dependencies: ["Source inventory", "Question data"] },
      { phase: "Pilot", summary: "Index the core sources for one team and measure search success.", timeline: "Weeks 3–5", dependencies: ["Source access", "Search tooling"] },
      { phase: "Deploy", summary: "Expand to all teams; tune ranking toward governed content.", timeline: "Weeks 6–7", dependencies: ["Pilot feedback", "Owner training"] },
      { phase: "Measure", summary: "Track search success and time-to-answer.", timeline: "Weeks 8", dependencies: ["Dashboards", "Agreed criteria"] },
    ],
    risks: [
      { title: "Trusted sources are thin", detail: "Governing the index requires curated content.", mitigation: "Start with the handful of sources people already trust." },
      { title: "Search bypassed for chat", detail: "Teams keep asking in chat instead of searching.", mitigation: "Make the search the default; surface it where people work." },
    ],
    measurement: {
      baseline: "Current time-to-answer and search failure rate",
      primaryKpi: "Search success rate",
      secondaryKpis: ["Time-to-answer", "Interruptions per employee", "Coverage of top questions"],
      validationPoints: [
        { at: "Day 30", check: "Core sources indexed; pilot team success." },
        { at: "Day 60", check: "Search success climbing; coverage expanding." },
        { at: "Day 90", check: "Sustained improvement; decision to expand." },
      ],
    },
    whatWouldChangeThis: [
      "If the right sources do not exist yet, documentation effort must precede search.",
      "If the problem is actually an access or permission mess, governance work comes first.",
      "If employees strongly prefer conversational answers, a trusted AI layer may be warranted after the index.",
    ],
    assumptions: [
      "Trusted sources exist and can be indexed.",
      "Permissioning allows governed search without leaks.",
      "Employees will adopt search as the default.",
    ],
    decisionSummary:
      "Employees waste time hunting for internal information that already exists, and they interrupt colleagues instead of finding the answer. The strategy is to make the trusted sources searchable so the answer people believe is the answer they find. Companies that indexed owned sources cut time-to-answer sharply within weeks. A chatbot over everything widens the trust problem, and more documentation is slower than searching what already exists. The chosen path is quick to stand up and immediately raises trust.",
    tag: "ILLUSTRATIVE",
  },
  {
    id: "slow-employee-ramp",
    problem: "New employees take too long to become productive",
    category: "Onboarding",
    description: "Time-to-productivity for new hires is too long and too inconsistent.",
    recommendation: "Structured onboarding plan with role-based ramp path",
    strategy: "Give every new hire one clear, role-based ramp path with fixed checkpoints.",
    techStack: [
      { role: "Onboarding plan", tool: "Notion" },
      { role: "Buddy checkpoints", tool: "Slack" },
      { role: "Training", tool: "LMS (e.g. TalentLMS)" },
      { role: "Feedback", tool: "Typeform" },
    ],
    decisionStatus: "defensible",
    evidenceStrength: "strong",
    implementationEffort: "Low",
    timeline: "Weeks 1–8",
    expectedImpact: "Faster, more consistent ramp",
    whyThis: [
      "Ramp inconsistency comes from unstructured, person-dependent onboarding.",
      "A role-based path removes the 'figure it out yourself' phase.",
      "Low tooling dependency: a structured plan works before any new software.",
      "Structure alone delivers strong time-to-productivity gains in practice.",
    ],
    impactMetrics: [
      { label: "Time-to-productivity", value: "Meaningfully faster", detail: "New hires reach full output sooner.", tag: "ILLUSTRATIVE" },
      { label: "Consistency", value: "One ramp path", detail: "Every hire gets the same core experience.", tag: "ILLUSTRATIVE" },
      { label: "Mentor load", value: "Lower", detail: "Senior staff answer fewer repeated questions.", tag: "ILLUSTRATIVE" },
      { label: "Retention", value: "Better early signal", detail: "Clear expectations improve early experience.", tag: "ILLUSTRATIVE" },
    ],
    comparableExamples: [
      { statement: "A professional-services firm cut time-to-productivity by roughly a third after introducing structured, role-based ramp plans." },
      { statement: "A mid-size technology company reduced mentor load and improved consistency with fixed buddy checkpoints at 30/60/90 days." },
      { statement: "An enterprise services firm improved early retention signals by surveying new hires at 30/60/90 days against a clear ramp path." },
    ],
    evidencePatterns: [
      "Role-based ramp plans with clear milestones",
      "Buddy/mentor checkpoints at fixed intervals",
      "Feedback surveys at 30/60/90 days",
    ],
    alternatives: [
      { name: "Onboarding software purchase", whyRankedLower: "Tooling is not the bottleneck; structure is.", verdict: "Rejected" },
      { name: "More training content", whyRankedLower: "Volume without structure does not fix ramp inconsistency.", verdict: "Deferred" },
    ],
    implementationPlan: [
      { phase: "Validate", summary: "Measure current time-to-productivity by role.", timeline: "Weeks 1–2", dependencies: ["Baseline metrics", "Role definitions"] },
      { phase: "Pilot", summary: "Run the structured plan for the next cohort in one function.", timeline: "Weeks 3–5", dependencies: ["Ramp plan", "Buddy assignments"] },
      { phase: "Deploy", summary: "Standardize the plan across all hiring functions.", timeline: "Weeks 6–7", dependencies: ["Pilot feedback", "Manager training"] },
      { phase: "Measure", summary: "Track time-to-productivity and ramp consistency.", timeline: "Week 8", dependencies: ["Dashboards", "Agreed criteria"] },
    ],
    risks: [
      { title: "Managers bypass the plan", detail: "Urgent staffing pressures short-circuit structure.", mitigation: "Make the plan the default; keep it lightweight." },
      { title: "Role variation is high", detail: "One plan does not fit every role.", mitigation: "Design a core plan with role-specific extensions." },
    ],
    measurement: {
      baseline: "Current time-to-productivity by role",
      primaryKpi: "Time-to-productivity",
      secondaryKpis: ["Ramp consistency", "Mentor hours per hire", "30-day new-hire satisfaction"],
      validationPoints: [
        { at: "Day 30", check: "First cohort running; feedback gathered." },
        { at: "Day 60", check: "Time-to-productivity improving; consistency up." },
        { at: "Day 90", check: "Sustained ramp gains; decision to scale." },
      ],
    },
    whatWouldChangeThis: [
      "If ramp failure is caused by unclear role expectations rather than process, the fix is role design, not onboarding.",
      "If the bottleneck is knowledge access, a knowledge base must precede onboarding structure.",
      "If hiring volume is very low, a lightweight checklist may be sufficient.",
    ],
    assumptions: [
      "Time-to-productivity can be measured by role.",
      "Managers will follow a structured plan.",
      "Buddies and mentors are available for checkpoints.",
    ],
    decisionSummary:
      "New employees take too long to become productive because onboarding depends on who they happen to get. The strategy is to give every hire one clear, role-based ramp path with fixed checkpoints. Companies that introduced structured ramp plans cut time-to-productivity by roughly a third. Onboarding software adds cost without fixing the structure, and more training content does not remove the inconsistency. The chosen path is low-cost, fast, and immediately measurable.",
    tag: "ILLUSTRATIVE",
  },
];

export function decisionById(id: string): PrototypeDecision | undefined {
  return DECISION_LIBRARY.find((d) => d.id === id);
}

export function decisionForProblem(problemId: string): PrototypeDecision | undefined {
  return decisionById(problemId);
}
