export const site = {
  name: "Compass",
  tagline: "What should your company automate next?",
  description:
    "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination—and generates an Implementation Blueprint for the chosen solution.",

  hero: {
    eyebrow: "The decision layer before implementation",
    headline: "AI is no longer optional.\nNeither are good decisions.",
    subtitle: "Every company is under pressure to adopt AI. Compass gives operations leaders confidence that they are investing in the right problem, the right intervention, and a measurable outcome before implementation begins.",
    cta: "Assess your operations",
    ctaSecondary: "See an example",
    options: ["AI", "Software", "Process Redesign", "Human Work", "Hybrid", "No automation yet"],
    closing: "Move before competitors do \u2014 without rushing into the wrong solution.",
  },

  twoRisks: {
    headline: "Every AI decision carries two risks.",
    left: {
      title: "Move too slowly",
      body: "Competitors gain efficiency, improve customer experiences, and learn faster while your organization remains uncertain about where to begin.",
    },
    right: {
      title: "Move too quickly",
      body: "You commit budget, months of implementation work, and organizational credibility to a solution before proving it solves the right problem.",
    },
    bridge: "Compass helps you move with confidence.",
  },

  painCards: {
    headline: "Where AI investments go wrong.",
    subtitle: "Most failures begin before implementation.",
    cards: [
      {
        label: "Failed AI pilot",
        pain: "Months of work produce no measurable business impact.",
        compassSolves: "Compass validates the problem, expected value, and readiness before recommending a pilot.",
      },
      {
        label: "Wrong tool",
        pain: "The vendor defines the problem around the product it sells.",
        compassSolves: "Compass compares AI, software, process, human, hybrid, and no-action paths before vendor selection.",
      },
      {
        label: "Unclear ROI",
        pain: "Budget is approved before success, baseline performance, and expected impact are defined.",
        compassSolves: "Compass defines measurable outcomes, assumptions, and success metrics before implementation.",
      },
      {
        label: "Months lost",
        pain: "Teams cycle through demos, meetings, and conflicting recommendations without a clear decision.",
        compassSolves: "Compass produces an evidence-backed recommendation and implementation blueprint first.",
      },
    ],
  },

  productQuestion: {
    headline: "What should your company automate next?",
    subtitle: "Compass investigates the problem, compares every intervention path, and recommends what is actually worth implementing.",
    cta: "See Compass in action",
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
    headline: "The evidence behind Compass.",
    cards: [
      { value: "52%", label: "AI projects never reach production.", source: "Gartner", takeaway: "Compass validates the problem and compares paths before an organization commits." },
      { value: "25%", label: "AI initiatives deliver expected ROI.", source: "IBM", takeaway: "Compass defines measurable outcomes before investment." },
      { value: "70%", label: "Implementation challenges are organizational.", source: "BCG", takeaway: "Compass evaluates organizational readiness before recommending technology." },
      { value: "10%", label: "High-intensity AI adopters grow faster.", source: "Ramp Economics Lab", takeaway: "Compass helps organizations become high-intensity adopters through better decisions." },
    ],
    cta: "Explore the research",
  },

  designPartners: {
    headline: "Bring Compass a real operational problem.",
    subtitle: "We are working with operations leaders and founders to evaluate real decisions before implementation begins.",
    benefits: [
      "A structured organizational assessment",
      "An Opportunity Map with compared interventions",
      "A prioritized recommendation and implementation blueprint",
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
        { title: "Deployment support", description: "Guide implementation from Blueprint to production" },
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
    buildBlueprint: "View Implementation Blueprint",
    comparePaths: "Compare intervention paths",
  },

  interventionComparison: {
    headline: "Compare intervention paths",
    noSelection: "Select an opportunity to compare intervention paths.",
    dimensions: ["Eligibility", "Suitability", "Expected outcome", "Effort", "Risk", "Time to value", "Human oversight", "Confidence"],
  },

  blueprint: {
    headline: "Implementation Blueprint",
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
      "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination — and generates an Implementation Blueprint for the chosen solution.",
  },
};
