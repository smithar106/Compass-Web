import type { Opportunity } from "@/types";

export const mockResults: { companyName: string; opportunities: Opportunity[] } = {
  companyName: "Acme SaaS Corp",
  opportunities: [
    {
      rank: 1,
      department: "Sales",
      name: "Automated Sales Qualification & Routing",
      confidence: "High",
      description:
        "Your sales team lacks a standardized qualification framework, leading to inconsistent lead handling and long ramp times for new AEs. Implementing an AI-powered qualification and routing system can standardize intake, reduce manual triage, and ensure the right leads reach the right reps.",
      tradeoff:
        "Requires CRM integration and upfront process definition, but reduces time-to-qualification by an estimated 40%.",
      kpis: [
        { metric: "Time to qualify lead", current: "4.2 hours", target: "< 30 minutes" },
        { metric: "Lead conversion rate", current: "22%", target: "35%" },
        { metric: "AE time on data entry", current: "35%", target: "< 10%" },
      ],
      phases: [
        {
          phase: "Discovery & Definition",
          steps: ["Audit current qualification criteria", "Define scoring parameters with sales leadership", "Map lead routing rules"],
          duration: "2 weeks",
          dependencies: ["Sales leadership availability"],
        },
        {
          phase: "Integration",
          steps: ["Connect CRM to AI orchestration layer", "Configure routing rules", "Set up qualification prompts"],
          duration: "3 weeks",
          dependencies: ["CRM API access", "Engineering support"],
        },
        {
          phase: "Deployment",
          steps: ["Pilot with 2 AEs", "Collect feedback and iterate", "Full rollout"],
          duration: "2 weeks",
          dependencies: ["Pilot group sign-off"],
        },
      ],
      evidence: [
        { type: "User", source: "Sales Director interview", detail: "AEs spend 35% of their week on manual data entry between CRM, outreach, and scheduling tools." },
        { type: "Research", source: "Industry benchmarks", detail: "Top-quartile sales teams use automated qualification and see 2.3x higher conversion rates." },
        { type: "Inference", source: "Tool stack analysis", detail: "Your current CRM has unused lead scoring modules. With AI augmentation, these can be activated without a platform migration." },
      ],
    },
    {
      rank: 2,
      department: "Customer Success",
      name: "Proactive Customer Health Scoring",
      confidence: "High",
      description:
        "Your customer success team manages accounts reactively, spending most of their time on accounts that are already at risk. A proactive health scoring system will surface at-risk accounts early, automate outreach triggers, and help prioritize CS resources where they have the most impact.",
      tradeoff:
        "Requires clean usage data from your product analytics, but can reduce churn by 25-30% in the first year.",
      kpis: [
        { metric: "At-risk accounts identified proactively", current: "15%", target: "85%" },
        { metric: "Monthly churn rate", current: "3.2%", target: "< 1.5%" },
        { metric: "CS time on reactive vs proactive", current: "80/20", target: "40/60" },
      ],
      phases: [
        {
          phase: "Data Integration",
          steps: ["Connect product analytics and billing data", "Define health score signals", "Build baseline model"],
          duration: "3 weeks",
          dependencies: ["Product analytics access"],
        },
        {
          phase: "Model Training",
          steps: ["Train churn prediction model on historical data", "Validate against known churn events", "Tune thresholds"],
          duration: "2 weeks",
          dependencies: ["Historical data availability"],
        },
        {
          phase: "Operationalization",
          steps: ["Build CS alert dashboard", "Configure automated outreach triggers", "Train CS team on new workflows"],
          duration: "2 weeks",
          dependencies: ["Dashboard tool access"],
        },
      ],
      evidence: [
        { type: "User", source: "CS team retrospective", detail: "80% of CS time is spent firefighting accounts that have already expressed dissatisfaction." },
        { type: "Research", source: "Gainsight benchmarks", detail: "Companies with automated health scoring reduce churn by an average of 22% within 6 months." },
        { type: "Inference", source: "Usage pattern analysis", detail: "Three accounts with declining login frequency were never flagged before they churned last quarter. A health score would have triggered intervention 45 days earlier." },
      ],
    },
    {
      rank: 3,
      department: "Support",
      name: "Self-Service Support Resolution",
      confidence: "Medium",
      description:
        "Your support team handles a high volume of repetitive Tier-1 tickets that could be resolved through AI-powered self-service. Implementing a knowledge-base-aware chatbot and automated triage can deflect common issues, reduce response times, and free your team for complex cases.",
      tradeoff:
        "Requires a well-structured knowledge base. If your KB is outdated, you'll need to invest in content cleanup first.",
      kpis: [
        { metric: "Tickets resolved without human intervention", current: "8%", target: "40%" },
        { metric: "Average first response time", current: "4.5 hours", target: "< 5 minutes (automated)" },
        { metric: "CSAT score", current: "87%", target: "92%" },
      ],
      phases: [
        {
          phase: "Knowledge Base Audit",
          steps: ["Audit existing KB for coverage and accuracy", "Identify top 20 ticket categories", "Create/update KB articles for gaps"],
          duration: "3 weeks",
          dependencies: ["Subject matter expert time"],
        },
        {
          phase: "Bot Configuration",
          steps: ["Set up AI chatbot with KB integration", "Configure intent recognition for top categories", "Build escalation logic"],
          duration: "2 weeks",
          dependencies: ["KB audit completion"],
        },
        {
          phase: "Deployment & Iteration",
          steps: ["Soft launch to 10% of traffic", "Monitor deflection rate and CSAT", "Full rollout"],
          duration: "2 weeks",
          dependencies: ["Soft launch metrics review"],
        },
      ],
      evidence: [
        { type: "User", source: "Support ticket analysis", detail: "62% of tickets fall into 5 categories: password reset, billing inquiry, feature request, bug report, onboarding help." },
        { type: "Research", source: "Intercom benchmark report", detail: "Companies using AI-powered support deflection resolve 33% of tickets without human touch." },
        { type: "Inference", source: "Support team capacity model", detail: "Current team handles 1,200 tickets/month. At 40% deflection, you'd save roughly 480 hours of agent time per month." },
      ],
    },
    {
      rank: 4,
      department: "Legal",
      name: "Automated Contract Review Pipeline",
      confidence: "Medium",
      description:
        "Your legal team manually reviews contracts, NDAs, and vendor agreements, creating a bottleneck for deal velocity. An AI-powered contract review system can extract key clauses, flag risky terms, and auto-populate standard contract fields.",
      tradeoff:
        "Requires a library of historical contracts for model training. May take 4-6 weeks to reach acceptable accuracy.",
      kpis: [
        { metric: "Contract review turnaround", current: "5.2 days", target: "< 24 hours" },
        { metric: "Contract value flagged", current: "N/A", target: "100% of high-risk terms" },
        { metric: "Legal team capacity freed", current: "0%", target: "40%" },
      ],
      phases: [
        {
          phase: "Contract Library Curation",
          steps: ["Collect and anonymize historical contracts", "Tag clauses, risk terms, and approval patterns", "Define risk thresholds"],
          duration: "3 weeks",
          dependencies: ["Legal team participation"],
        },
        {
          phase: "Model Training & Validation",
          steps: ["Train clause extraction model", "Validate against manually reviewed contracts", "Iterate on edge cases"],
          duration: "3 weeks",
          dependencies: ["Anonymized contract corpus"],
        },
        {
          phase: "Integration",
          steps: ["Connect to contract lifecycle platform", "Build review dashboard", "Deploy with human-in-the-loop review"],
          duration: "2 weeks",
          dependencies: ["CLM platform access"],
        },
      ],
      evidence: [
        { type: "User", source: "General Counsel interview", detail: "Every contract goes through 3 rounds of manual review. Standard NDAs take 2 days; complex agreements take 2+ weeks." },
        { type: "Research", source: "Ironclad case studies", detail: "Automated contract review reduces review time by 60-80% for standard agreements." },
        { type: "Inference", source: "Deal velocity analysis", detail: "6 deals were delayed last quarter waiting for legal review, representing an estimated $240K in delayed revenue." },
      ],
    },
    {
      rank: 5,
      department: "Engineering",
      name: "Engineering Documentation Intelligence",
      confidence: "Low",
      description:
        "Your engineering team lacks structured documentation practices, leading to knowledge silos and onboarding friction. An AI-powered documentation assistant can auto-generate code docs, surface relevant context during PR reviews, and maintain a searchable knowledge base.",
      tradeoff:
        "Requires cultural buy-in from engineering. Auto-generated docs need human review to avoid inaccuracies.",
      kpis: [
        { metric: "New hire ramp time", current: "8 weeks", target: "4 weeks" },
        { metric: "PR review cycle time", current: "3.2 days", target: "< 1 day" },
        { metric: "Documentation coverage", current: "25%", target: "85%" },
      ],
      phases: [
        {
          phase: "Infrastructure Setup",
          steps: ["Select documentation platform", "Set up automated doc generation pipeline", "Define documentation standards"],
          duration: "2 weeks",
          dependencies: ["Engineering tooling decisions"],
        },
        {
          phase: "Model Integration",
          steps: ["Integrate AI doc generation into CI/CD", "Configure PR context assistant", "Build knowledge base indexing"],
          duration: "3 weeks",
          dependencies: ["Doc platform selection"],
        },
        {
          phase: "Adoption",
          steps: ["Pilot with one team", "Collect feedback on accuracy", "Org-wide rollout with training"],
          duration: "4 weeks",
          dependencies: ["Pilot team results"],
        },
      ],
      evidence: [
        { type: "User", source: "Engineering onboarding survey", detail: "New engineers report spending 40% of their first month searching for context across Slack, Notion, and stale wiki pages." },
        { type: "Research", source: "SWE benchmarks", detail: "Teams with comprehensive auto-generated documentation ship 32% faster and have 45% fewer onboarding escalations." },
        { type: "Inference", source: "PR review analysis", detail: "30% of PR review comments are questions about context or intent that could be auto-resolved with inline documentation." },
      ],
    },
  ],
};
