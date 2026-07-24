export const site = {
  name: "Compass",
  tagline: "What should your company automate next?",
  description:
    "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination—and generates an Implementation Plan for the chosen solution.",

  hero: {
    headline: "Compass helps you determine the best solution before you build it.",
    subtitle: "Compass investigates your operational problem, compares every viable intervention, and recommends the solution with the greatest expected business impact.",
    bullets: [
      "Identify the real problem worth solving",
      "Compare every viable intervention path",
      "Estimate business impact before committing budget",
      "Leave with an implementation plan",
    ],
    cta: "Start investigation",
    ctaSecondary: "View example",
    outcomes: [
      { problem: "Missed sales calls", label: "Best Path", value: "+$2.4M", detail: "Revenue recovered" },
      { problem: "Wasted employee time", label: "Best Path", value: "18,200 hrs", detail: "Equivalent to 9 FTEs" },
      { problem: "Lost customer opportunities", label: "Best Path", value: "16,700", detail: "Customer interactions" },
      { problem: "Uncertain investment return", label: "Best Path", value: "28\u00D7", detail: "Payback in 6 months" },
    ],
    recommendation: {
      problem: "Sales misses 100 inbound calls every day.",
      recommendation: "Hybrid AI-assisted qualification",
      impact: "+$2.1M",
      confidence: "89%",
      timeline: "6 weeks",
      type: "Hybrid",
    },
  },

  exampleSales: {
    problem: "Sales misses 100 inbound calls every day.",
    recommendation: "Hybrid AI-assisted qualification",
    impact: "+$2.1M",
    confidence: "89%",
    timeline: "6 weeks",
    type: "Hybrid",
    detail: "18,300 recovered calls \u00B7 6 weeks \u00B7 89% confidence",
    cta: "See full recommendation",
    confidenceNote: "Confidence based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  exampleFinance: {
    problem: "Finance team spends 40 hours per week on manual invoice reconciliation.",
    recommendation: "Automated invoice matching with exception-based review",
    impact: "+$420K",
    confidence: "91%",
    timeline: "4 weeks",
    type: "Software",
    detail: "1,800 hours returned \u00B7 4 weeks \u00B7 91% confidence",
    cta: "See full recommendation",
    confidenceNote: "Confidence based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  exampleHealthcare: {
    problem: "Insurance claims processing takes 14 days on average.",
    recommendation: "AI-assisted claims triage with deterministic validation",
    impact: "+$3.8M",
    confidence: "86%",
    timeline: "8 weeks",
    type: "AI",
    detail: "2,100 claims processed faster \u00B7 8 weeks \u00B7 86% confidence",
    cta: "See full recommendation",
    confidenceNote: "Confidence based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  evidence: {
    headline: "Every recommendation is backed by evidence.",
    subtitle: "We compare AI, software, process redesign, staffing, automation, outsourcing, and governance using implementation outcomes, industry research, and organizational evidence.",
  },

  designPartners: {
    headline: "Bring Compass a real operational problem.",
    subtitle: "We are working with operations leaders and founders to evaluate real decisions before implementation begins.",
    benefits: [
      "A structured organizational investigation",
      "An Opportunity Map with compared interventions",
      "A prioritized recommendation and implementation plan",
      "Direct influence on the product roadmap",
    ],
    form: {
      headline: "Apply to become a design partner",
      fields: {
        name: "Full name",
        email: "Work email",
        companyName: "Company name",
        companySize: "Company size",
        role: "Your role",
        linkedinUrl: "LinkedIn URL",
        currentAiInitiatives: "Current AI initiatives",
        biggestChallenge: "Biggest operational challenge",
      },
      submit: "Submit application",
      success: "Thanks for applying! We'll be in touch within 2 business days.",
      error: "Something went wrong. Please try again.",
    },
    cta: "Become a design partner",
    ctaSecondary: "Start an investigation",
  },

  finalCta: {
    headline: "Investigate before you build.",
    subtitle: "Before you evaluate another AI vendor, determine whether AI is actually the right intervention.",
    cta: "Start investigation",
  },

  footer: {
    description: "Founded by operators and product leaders who have scaled enterprise software.",
    copyright: `© ${new Date().getFullYear()} Compass. All rights reserved.`,
    columns: [
      {
        title: "Product",
        links: [
          { label: "Investigation", href: "/assessment" },
          { label: "Example", href: "/assessment/results?example=true" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Design Partners", href: "/design-partners" },
          { label: "Privacy", href: "/privacy" },
        ],
      },
    ],
  },

  about: {
    mission: "Make automation adoption deliberate, measurable, and effective for every organization.",
    vision: "A world where every company knows the right answer to 'what should we automate next?' before they invest a dollar.",
    problem: "Companies are under immense pressure to adopt the latest technology. Boardrooms demand strategies. Competitors launch features. The result is rushed decisions, failed proofs of concept, and wasted budgets. Compass solves this by operating before implementation — determining whether the right answer is AI, software, process redesign, human work, or a combination.",
    team: "We're a small team of product builders, engineers, and operators who have scaled B2B SaaS companies from seed to IPO. We built Compass because we wished it existed.",
    futureVision: {
      headline: "Future vision",
      body: "Compass will eventually analyze existing tooling environments (Slack, Jira, ticketing systems), support deployment execution, and measure realized outcomes against predictions.",
      items: [
        { title: "Slack / Jira analysis", description: "Analyze existing workflow signals from communication and project management tools" },
        { title: "Deployment support", description: "Guide implementation from plan to production" },
        { title: "Outcome measurement", description: "Track realized outcomes against predictions and assumptions" },
        { title: "Organizational learning", description: "Improve recommendations across investigations over time" },
      ],
    },
    compass: {
      headline: "Our internal compass",
      subtitle: "Four principles guide how we build.",
      directions: [
        { name: "North", label: "Direction", description: "We start with the business problem, not the technology. Every recommendation traces back to operational reality." },
        { name: "East", label: "Capability", description: "We reveal what's possible across AI, software, process, and human work — then recommend the best path." },
        { name: "South", label: "Visibility", description: "We show our reasoning. Evidence, assumptions, alternatives, and confidence are always visible." },
        { name: "West", label: "Learning", description: "Every investigation improves the next. Over time, Compass learns what works across organizations." },
      ],
    },
  },

  assessment: {
    intro: {
      headline: "Operational Investigation",
      body: "We'll ask about your departments, how work happens, where it fails, and what outcome matters. We are not designing a solution — we are investigating where intervention creates leverage.",
      estimatedTime: "3-5 minutes",
      sections: "10 departments",
      questions: "Targeted questions about your operations",
      cta: "Start investigation",
    },
    sections: {
      "General": "We'll start by understanding the department, workflow, and desired outcome — focused on the business problem, not the technology.",
      "Workload": "Understanding the frequency, scale, and complexity of the work helps us determine whether intervention is worthwhile.",
      "Systems": "Your existing tools and data determine what's possible. We'll map the current technical landscape.",
      "Impact": "We'll assess the cost of the current workflow — in time, money, and missed opportunity.",
      "Risk": "Understanding risk, stability, and prior attempts helps us recommend the right level of intervention.",
      "Constraints": "Technical constraints, budget, and timeline define what's feasible. We'll factor these into every recommendation.",
    },
    complete: {
      headline: "Your investigation is complete.",
      body: "We've analyzed your responses across all departments. View your Opportunity Map to see ranked recommendations with evidence, business cases, and implementation options.",
      cta: "View recommendations",
    },
  },

  results: {
    headline: "Opportunity Map",
    subtitle: "Ranked business problems with competing intervention paths. Every recommendation includes evidence, assumptions, and compared alternatives.",
    noResults: "No investigation results found. Please complete the operational investigation first.",
    buildBlueprint: "View Implementation Plan",
    comparePaths: "Compare intervention paths",
  },

  interventionComparison: {
    headline: "Compare intervention paths",
    noSelection: "Select an opportunity to compare intervention paths.",
    dimensions: ["Eligibility", "Suitability", "Expected outcome", "Effort", "Risk", "Time to value", "Human oversight", "Confidence"],
  },

  blueprint: {
    headline: "Implementation Plan",
    sections: [
      "Problem",
      "Root cause",
      "Recommended intervention",
      "Alternatives considered",
      "Why this path won",
      "Current workflow",
      "Future workflow",
      "Required systems",
      "Required APIs",
      "Required data",
      "Human roles",
      "Security and privacy",
      "Rollout plan",
      "Success metrics",
      "Risks and assumptions",
      "Expected impact",
      "Technical escalation level",
    ],
  },

  evidenceLabels: {
    headline: "Evidence and assumptions",
    labels: {
      "user-provided": "User-provided evidence",
      "deterministic-analysis": "Deterministic analysis",
      "ai-inference": "AI inference",
      "hypothesis": "Hypothesis",
      "missing": "Missing information",
    },
    whatCouldChange: "What could change this recommendation",
    whyChose: "Why Compass chose this",
    whyRejected: "Why Compass rejected alternatives",
  },

  nav: [
    { label: "Product", href: "/" },
    { label: "Example", href: "/assessment/results?example=true" },
    { label: "About", href: "/about" },
    { label: "Design Partners", href: "/design-partners" },
  ],

  metadata: {
    title: "Compass — What should your company automate next?",
    description:
      "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination — and generates an Implementation Plan for the chosen solution.",
  },
};
