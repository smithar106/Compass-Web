export const site = {
  name: "Compass",
  tagline: "What operational change will drive the greatest impact?",
  description:
    "Compass is an evidence-based decision platform for operations leaders — grounded in thousands of real-world implementations, not consultant experience.",

  hero: {
    headline: "Evidence before implementation.",
    subtitle: "Compass identifies the operational solution most likely to succeed by comparing your organization against thousands of real-world implementations.",
    bullets: [
      "Identify the real problem worth solving",
      "Compare every viable intervention path — AI, software, process, automation, or no change",
      "Estimate business impact before committing budget",
      "Leave with an implementation plan",
    ],
    cta: "Start Your Assessment",
    ctaSecondary: "See Example Results",
    outcomes: [
      { problem: "Missed sales calls", label: "Evidence-based", value: "+$2.4M", detail: "Revenue recovered" },
      { problem: "Wasted employee time", label: "Evidence-based", value: "18,200 hrs", detail: "Equivalent to 9 FTEs" },
      { problem: "Lost customer opportunities", label: "Evidence-based", value: "16,700", detail: "Customer interactions" },
      { problem: "Uncertain investment return", label: "Evidence-based", value: "28\u00D7", detail: "Payback in 6 months" },
    ],
    recommendation: {
      problem: "Sales team misses 100+ inbound calls every day during peak hours.",
      recommendation: "AI-assisted lead qualification with human escalation",
      impact: "+$2.1M",
      confidence: "89%",
      timeline: "6 weeks",
      type: "Hybrid",
    },
  },

  exampleSales: {
    problem: "Sales team misses 100+ inbound calls every day during peak hours.",
    recommendation: "AI-assisted lead qualification with human escalation",
    impact: "+$2.1M",
    confidence: "89%",
    timeline: "6 weeks",
    type: "Hybrid",
    detail: "18,300 recovered calls \u00B7 6 weeks \u00B7 89% evidence strength",
    cta: "See findings",
    confidenceNote: "Evidence strength based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  exampleFinance: {
    problem: "Finance team spends 40 hours per week on manual invoice reconciliation.",
    recommendation: "Automated invoice matching with exception-based review",
    impact: "+$420K",
    confidence: "91%",
    timeline: "4 weeks",
    type: "Software",
    detail: "1,800 hours returned \u00B7 4 weeks \u00B7 91% evidence strength",
    cta: "See findings",
    confidenceNote: "Evidence strength based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  exampleHealthcare: {
    problem: "Insurance claims processing takes 14 days on average to complete.",
    recommendation: "AI-assisted claims triage with deterministic validation",
    impact: "+$3.8M",
    confidence: "86%",
    timeline: "8 weeks",
    type: "AI",
    detail: "2,100 claims processed faster \u00B7 8 weeks \u00B7 86% evidence strength",
    cta: "See findings",
    confidenceNote: "Evidence strength based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  evidence: {
    headline: "Decisions should be grounded in data, not decades.",
    subtitle: "Compass compares AI, software, process redesign, staffing, automation, outsourcing, and governance using comparable implementation outcomes — not consultant experience.",
  },

  designPartners: {
    headline: "Bring Compass a real operational problem.",
    subtitle: "We are working with operations leaders and founders to evaluate real decisions before implementation begins.",
    benefits: [
      "A structured organizational investigation",
      "A comparison of evidence-supported interventions",
      "A prioritized finding and action plan",
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
    subtitle: "Before you evaluate another vendor, compare what comparable implementations show — not what a sales deck claims.",
    cta: "Start Assessment",
  },

  footer: {
    description: "Evidence-based operational decision intelligence.",
    copyright: `\u00A9 ${new Date().getFullYear()} Compass. All rights reserved.`,
    columns: [
      {
        title: "Product",
        links: [
          { label: "Assessment", href: "/assessment" },
          { label: "About", href: "/about" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
      },
    ],
  },

  about: {
    mission: "Compass is the evidence-based decision intelligence platform organizations use before committing to operational change. We compare your operational challenges against comparable real-world implementations to identify the solution with the strongest evidence of success.",
    vision: "A world where every operational decision is informed by comparable real-world evidence instead of opinion.",
    problem: "Organizations face constant pressure to adopt new technologies. Boards demand AI strategies. Vendors promise transformational results. Competitors announce new capabilities. The result is often expensive decisions made with incomplete evidence. Compass helps organizations identify the best operational solution before implementation by grounding every finding in comparable real-world implementations—not vendor claims or generic best practices.",
    team: "We're building the platform we wished existed whenever organizations faced complex operational decisions.",
    futureVision: {
      headline: "Where Compass Is Going",
      body: "Compass will eventually analyze existing tooling environments (Slack, Jira, ticketing systems), support deployment execution, and measure realized outcomes against predictions.",
      items: [
        { title: "Slack / Jira analysis", description: "Analyze existing workflow signals from communication and project management tools" },
        { title: "Deployment support", description: "Guide implementation from plan to production" },
        { title: "Outcome measurement", description: "Track realized outcomes against predictions and assumptions" },
        { title: "Organizational learning", description: "Improve findings across assessments over time" },
      ],
    },
    compass: {
      headline: "Our internal compass",
      subtitle: "Four principles guide how we build.",
      principles: [
        { title: "Evidence", description: "Recommendations begin with comparable operational implementations—not assumptions." },
        { title: "Problems First", description: "Compass starts with the business problem, not the technology." },
        { title: "Transparency", description: "Every finding includes supporting evidence, assumptions, and alternatives." },
        { title: "Continuous Learning", description: "As the evidence graph grows, Compass becomes increasingly capable of identifying comparable implementations." },
      ],
    },
  },

  assessment: {
    intro: {
      headline: "Operational Assessment",
      body: "Answer a few questions about your workflow, constraints, and objectives. Compass compares your situation against thousands of real implementations to identify the most evidence-backed path forward.",
      estimatedTime: "3–5 minutes",
      sections: "10 departments",
      questions: "Targeted questions about your operations",
      cta: "Begin Assessment",
    },
    sections: {
      "General": "We'll start by understanding the department, workflow, and desired outcome — focused on the business problem, not the technology.",
      "Workload": "Understanding the frequency, scale, and complexity of the work helps us determine whether intervention is worthwhile.",
      "Systems": "Your existing tools and data determine what's possible. We'll map the current technical landscape.",
      "Impact": "We'll assess the cost of the current workflow — in time, money, and missed opportunity.",
      "Risk": "Understanding risk, stability, and prior attempts helps us recommend the right level of intervention.",
      "Constraints": "Technical constraints, budget, and timeline define what's feasible. We'll factor these into every finding.",
    },
    complete: {
      headline: "Assessment complete.",
      body: "Your responses have been analyzed against thousands of comparable implementations. Your findings are ready below.",
      cta: "View Recommendations",
    },
  },

  results: {
    headline: "Recommendations",
    subtitle: "Ranked by evidence quality, not opinion. Every finding is grounded in comparable implementations with displayed evidence strength, assumptions, and alternatives.",
    noResults: "No results found. Please complete the operational assessment first.",
    buildBlueprint: "View Implementation Plan",
    comparePaths: "Compare intervention paths",
  },

  interventionComparison: {
    headline: "Compare intervention paths",
    noSelection: "Select an opportunity to compare intervention paths.",
    dimensions: ["Eligibility", "Suitability", "Expected outcome", "Effort", "Risk", "Time to value", "Human oversight", "Evidence strength"],
  },

  blueprint: {
    headline: "Implementation Plan",
    sections: [
      "Problem",
      "Root cause",
      "Evidence-supported intervention",
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
    whatCouldChange: "What could change this finding",
    whyChose: "Why Compass chose this",
    whyRejected: "Why Compass rejected alternatives",
  },

  nav: [
    { label: "Assessment", href: "/assessment" },
    { label: "About", href: "/about" },
  ],

  contact: {
    email: "smithar106@gmail.com",
  },

  metadata: {
    title: "Compass — Evidence-Based Operational Decision Intelligence",
    description:
      "Compass is an evidence-based decision platform for operations leaders — grounded in thousands of real-world implementations, not consultant experience.",
  },
};
