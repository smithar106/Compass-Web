export const site = {
  name: "Compass",
  tagline: "What should your company automate next?",
  description:
    "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination—and generates an Implementation Plan for the chosen solution.",

  hero: {
    headline: "Determine the right direction\nbefore implementation.",
    subtitle: "Compass analyzes operational problems and recommends the intervention with the greatest expected business impact. AI, software, process redesign, human-in-the-loop, staffing \u2014 Compass determines which path to take before resources are committed.",
    bullets: [
      "Identify the operational problem worth solving",
      "Compare every possible intervention path",
      "Estimate expected impact before committing budget",
      "Generate an implementation plan before building",
    ],
    cta: "Assess your operations",
    ctaSecondary: "See an example",
    decisionMistakes: [
      {
        label: "Started with a solution",
        pain: "Technology was chosen before the problem was understood.",
        compassSolves: "Compass starts with the problem.",
      },
      {
        label: "Wrong intervention",
        pain: "The best path was never considered.",
        compassSolves: "Compass compares every implementation path.",
      },
      {
        label: "Undefined success",
        pain: "Resources committed before outcomes were defined.",
        compassSolves: "Compass defines measurable outcomes first.",
      },
      {
        label: "Premature implementation",
        pain: "Direction was set before evidence was gathered.",
        compassSolves: "Compass determines direction before resources are committed.",
      },
    ],
  },

  trustedBy: {
    label: "Built on evidence from",
    sources: ["Ramp", "IBM", "BCG", "McKinsey", "Gartner"],
  },

  example: {
    headline: "Compass in action.",
    problem: "Customer support misses 100 calls per day.",
    steps: [
      { label: "Root causes", text: "Staffing gaps during peak hours. Routing concentrates traffic in one queue. Shift changes create coverage holes." },
      { label: "Evidence", text: "Missed calls cluster around shift changes. Routing data shows disproportionate load on one team." },
      { label: "Interventions compared", text: "AI voice agent, callback software, process redesign, additional staffing, hybrid, no action." },
      { label: "Recommendation", value: "Process redesign plus deterministic routing improvements." },
      { label: "Blueprint", text: "Owner: Operations lead. Phases: audit, routing redesign, staffing adjustment, monitoring. Duration: 3-4 weeks." },
    ],
    confidence: "87%",
    cta: "View full analysis",
  },

  evidence: {
    headline: "Why companies struggle with AI adoption.",
    cards: [
      { meaning: "Most AI failures begin before the right direction is chosen.", value: "52%", source: "Gartner", connection: "Compass determines the intervention path before resources are committed.", color: "emerald" },
      { meaning: "Only one in four AI initiatives delivers the expected return.", value: "25%", source: "IBM", connection: "Compass defines success before investment.", color: "blue" },
      { meaning: "Seventy percent of implementation challenges are organizational.", value: "70%", source: "BCG", connection: "Compass evaluates readiness before recommending technology.", color: "amber" },
      { meaning: "Implementation begins before direction is set, extending timelines.", value: "8 mo.", source: "Gartner", connection: "Compass determines direction before the implementation clock starts.", color: "violet" },
    ],
    cta: "Start your assessment",
  },

  designPartners: {
    headline: "Bring Compass a real operational problem.",
    subtitle: "We are working with operations leaders and founders to evaluate real decisions before implementation begins.",
    benefits: [
      "A structured organizational assessment",
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
    ctaSecondary: "Assess your operations",
  },

  finalCta: {
    headline: "Build the right solution first.",
    subtitle: "Before you evaluate another AI vendor, determine whether AI is actually the right intervention.",
    cta: "Assess your operations",
  },

  footer: {
    description: "Compass is the decision layer before implementation. Organizations use it to decide what to build, buy, automate, or leave alone.",
    copyright: `© ${new Date().getFullYear()} Compass. All rights reserved.`,
    columns: [
      {
        title: "Product",
        links: [
          { label: "Assessment", href: "/assessment" },
          { label: "Example", href: "/assessment/results?example=true" },
          { label: "Research", href: "/research" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Perspectives", href: "/perspectives" },
          { label: "About", href: "/about" },
          { label: "Design Partners", href: "/design-partners" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
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
        { title: "Organizational learning", description: "Improve recommendations across assessments over time" },
      ],
    },
    compass: {
      headline: "Our internal compass",
      subtitle: "Four principles guide how we build.",
      directions: [
        { name: "North", label: "Direction", description: "We start with the business problem, not the technology. Every recommendation traces back to operational reality." },
        { name: "East", label: "Capability", description: "We reveal what's possible across AI, software, process, and human work — then recommend the best path." },
        { name: "South", label: "Visibility", description: "We show our reasoning. Evidence, assumptions, alternatives, and confidence are always visible." },
        { name: "West", label: "Learning", description: "Every assessment improves the next. Over time, Compass learns what works across organizations." },
      ],
    },
  },

  assessment: {
    intro: {
      headline: "Organizational Discovery",
      body: "We'll ask about your departments, how work happens, where it fails, and what outcome matters. We are not designing a solution — we are understanding where intervention creates leverage.",
      estimatedTime: "25 minutes",
      sections: "10 departments",
      questions: "Targeted questions about your operations",
      cta: "Begin organizational discovery",
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
      headline: "Organizational discovery complete.",
      body: "We've analyzed your responses across all departments. Generate your Opportunity Map to see ranked recommendations with evidence, business cases, and implementation options.",
      cta: "Generate my Opportunity Map",
    },
  },

  results: {
    headline: "Opportunity Map",
    subtitle: "Ranked business problems with competing intervention paths. Every recommendation includes evidence, assumptions, and compared alternatives.",
    noResults: "No assessment results found. Please complete the organizational discovery first.",
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
    { label: "Research", href: "/research" },
    { label: "Perspectives", href: "/perspectives" },
    { label: "About", href: "/about" },
    { label: "Design Partners", href: "/design-partners" },
  ],

  metadata: {
    title: "Compass — What should your company automate next?",
    description:
      "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination — and generates an Implementation Plan for the chosen solution.",
  },
};
