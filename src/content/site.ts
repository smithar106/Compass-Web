export const site = {
  name: "Compass",
  tagline: "Find the right solution before you implement it.",
  description:
    "Compass is the operational decision intelligence platform organizations use before committing to implementation.",

  hero: {
    eyebrow: "Operational Decision Intelligence",
    headline: "Find the right solution before you implement it.",
    subtitle: "Organizations are under pressure to deploy AI, automate workflows, and transform operations. Compass helps leaders determine which intervention is most likely to succeed before they commit people, capital, and engineering resources.",
    cta: "Start an Investigation",
    ctaSecondary: "See How Compass Works",
    supportingLine: "Evidence from comparable real-world implementations\u2014not vendor claims or assumptions.",
  },

  problem: {
    label: "The Problem",
    headline: "Organizations do not fail because they cannot implement. They fail because they implement the wrong solution.",
    body: "Critical operational decisions are often driven by consultants, vendor recommendations, internal opinion, or the latest technology trend. The result is months of engineering work, expensive implementations, low adoption, poor ROI, and organizational disruption.",
    painPoints: [
      { title: "Wrong intervention selected", description: "Teams commit to AI or software before fully understanding the workflow. Implementation begins before the underlying decision is validated." },
      { title: "Alternatives never compared", description: "Process redesign, staffing, policy changes, or simpler software may perform better, but they are rarely evaluated." },
      { title: "Evidence is fragmented", description: "Relevant lessons are buried across case studies and institutional knowledge. Leaders lack structured comparisons with similar real-world implementations." },
      { title: "Vendor incentives distort decisions", description: "Most providers are rewarded for selling or implementing a particular solution rather than identifying the right one." },
    ],
  },

  solution: {
    label: "The Solution",
    headline: "One investigation. Multiple paths. A stronger decision.",
    body: "Compass transforms operational context and implementation evidence into an executive decision brief. It evaluates multiple intervention paths and identifies the option with the strongest evidence, best operational fit, and lowest avoidable implementation risk.",
    steps: [
      { step: "Define", desc: "Capture the workflow, objectives, constraints, environment, and current performance." },
      { step: "Compare", desc: "Evaluate AI, software, automation, process redesign, staffing, outsourcing, and no intervention." },
      { step: "Match", desc: "Retrieve relevant real-world examples, outcomes, risks, and lessons learned." },
      { step: "Decide", desc: "Review the recommended path, alternatives, expected impact, and next steps." },
    ],
  },

  outcomes: {
    headline: "Make implementation decisions with evidence, not momentum.",
    items: [
      { title: "Reduce implementation risk", desc: "Avoid committing resources to the wrong intervention before you build." },
      { title: "Compare alternatives objectively", desc: "Evaluate every viable path\u2014not just the one a vendor is selling." },
      { title: "Avoid unnecessary AI projects", desc: "AI is not always the answer. Compass identifies when it is\u2014and when it isn\u2019t." },
      { title: "Improve time to decision", desc: "Move from uncertainty to a clear recommendation in minutes, not weeks." },
      { title: "Strengthen executive alignment", desc: "Get leadership buy-in with evidence-backed recommendations, not opinions." },
      { title: "Commit capital with confidence", desc: "Know what to implement, why, and what results comparable organizations achieved." },
    ],
  },

  differentiation: {
    headline: "Most platforms help you implement a solution. Compass helps you decide which solution deserves to be implemented.",
    columns: [
      {
        name: "Traditional Consulting",
        items: [
          "Project-based engagement",
          "Labor-intensive analysis",
          "Often slow to deliver",
          "Recommendations shaped by team experience",
          "Scales through people",
        ],
      },
      {
        name: "AI Implementation Platforms",
        items: [
          "Assume AI is the answer",
          "Optimize deployment execution",
          "Focus on build and rollout",
          "Often tied to a specific vendor or technology",
          "Incentivized to recommend their own solution",
        ],
      },
      {
        name: "Compass",
        items: [
          "Starts with the operational problem",
          "Compares multiple intervention types",
          "Grounds recommendations in comparable implementations",
          "Produces an executive decision brief",
          "Scales through structured evidence",
        ],
        highlighted: true,
      },
    ],
  },

  evidence: {
    headline: "Built on evidence from real implementations.",
    subtitle: "Compass structures implementation evidence around the problem, operating context, intervention, deployment model, outcomes, metrics, risks, and lessons learned. This evidence graph allows recommendations to improve as the database grows.",
  },

  exampleSales: {
    problem: "Sales team misses 100+ inbound calls every day during peak hours.",
    recommendation: "AI-assisted lead qualification with human escalation",
    impact: "+$2.1M",
    confidence: "93%",
    timeline: "6 weeks",
    type: "Hybrid",
    detail: "18,300 recovered calls \u00B7 6 weeks \u00B7 93% evidence strength",
    cta: "See findings",
    confidenceNote: "Evidence strength based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  exampleFinance: {
    problem: "Finance team spends 40 hours per week on manual invoice reconciliation.",
    recommendation: "Automated invoice matching with exception-based review",
    impact: "+$420K",
    confidence: "85%",
    timeline: "4 weeks",
    type: "Software",
    detail: "1,800 hours returned \u00B7 4 weeks \u00B7 85% evidence strength",
    cta: "See findings",
    confidenceNote: "Evidence strength based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  exampleHealthcare: {
    problem: "Insurance claims processing takes 14 days on average to complete.",
    recommendation: "AI-assisted claims triage with deterministic validation",
    impact: "+$3.8M",
    confidence: "81%",
    timeline: "8 weeks",
    type: "AI",
    detail: "2,100 claims processed faster \u00B7 8 weeks \u00B7 81% evidence strength",
    cta: "See findings",
    confidenceNote: "Evidence strength based on comparable implementations, industry benchmarks, and your organization's inputs.",
  },

  designPartners: {
    headline: "Bring Compass a real operational problem.",
    subtitle: "We are working with operations leaders and founders to evaluate real decisions before implementation begins.",
    benefits: [
      "A structured operational investigation",
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
    subtitle: "Before you evaluate another vendor, compare what comparable implementations show \u2014 not what a sales deck claims.",
    cta: "Start an Investigation",
  },

  footer: {
    description: "Operational decision intelligence.",
    copyright: `\u00A9 ${new Date().getFullYear()} Compass. All rights reserved.`,
    columns: [
      {
        title: "Product",
        links: [
          { label: "Assessment", href: "/assessment?demo=true" },
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
    headline: "The operational decision intelligence platform.",
    body: "Every organization is being told to use AI. We believe the more important question is whether AI is the right solution in the first place.\n\nCompass helps organizations determine the best operational intervention before implementation begins. It compares AI, software, workflow automation, process redesign, staffing, outsourcing, shared services, and other approaches using evidence from comparable real-world implementations.\n\nToday, these decisions are often driven by consultants, vendor recommendations, internal opinion, or the latest technology trend. Compass replaces guesswork with structured evidence and produces an executive decision brief explaining the recommended path, alternatives, expected outcomes, implementation considerations, and next steps.\n\nOur mission is simple: help organizations make better implementation decisions before they commit people, capital, and engineering resources.",
    vision: "We are building the evidence layer for operational decision-making.",
    team: "We're building the platform we wished existed whenever organizations faced complex operational decisions.",
    principles: {
      headline: "Our internal compass",
      subtitle: "Four principles guide how we build.",
      items: [
        { title: "Evidence", description: "Recommendations begin with comparable operational implementations\u2014not assumptions." },
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
      estimatedTime: "3\u20135 minutes",
      sections: "10 departments",
      questions: "Targeted questions about your operations",
      cta: "Begin Assessment",
    },
    sections: {
      "General": "We'll start by understanding the department, workflow, and desired outcome \u2014 focused on the business problem, not the technology.",
      "Workload": "Understanding the frequency, scale, and complexity of the work helps us determine whether intervention is worthwhile.",
      "Systems": "Your existing tools and data determine what's possible. We'll map the current technical landscape.",
      "Impact": "We'll assess the cost of the current workflow \u2014 in time, money, and missed opportunity.",
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
    { label: "Assessment", href: "/assessment?demo=true" },
    { label: "About", href: "/about" },
  ],

  contact: {
    email: "smithar106@gmail.com",
  },

  metadata: {
    title: "Compass \u2014 Operational Decision Intelligence",
    description:
      "Compass is the operational decision intelligence platform organizations use before committing to implementation.",
  },
};
