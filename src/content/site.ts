export const site = {
  name: "Compass",
  tagline: "What should your company automate next?",
  description:
    "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination—and generates an Implementation Blueprint for the chosen solution.",

  hero: {
    headline: "What should your company automate next?",
    subtitle: "Compass analyzes operational problems, compares every possible intervention, and recommends the one worth implementing.",
    cta: "Assess your operations",
    ctaSecondary: "See an example map",
    options: ["AI", "Software", "Process Redesign", "Human Work", "Hybrid", "No automation yet"],
  },

  problem: {
    headline: "You have tools. You need confidence.",
    body: "Companies have many AI tools but lack confidence about where to use them. Vendors start with their solution, not your problem. Building the wrong system wastes money and organizational trust. Compass begins with the business problem.",
    items: [
      "Companies have many AI tools but lack confidence where to use them",
      "Vendors start with their solution, not your problem",
      "Building the wrong system wastes money and trust",
      "Compass begins with the business problem",
    ],
  },

  insight: {
    headline: "Implementation is becoming cheaper. Judgment is becoming more valuable.",
    body: "As building software becomes cheaper and easier, the scarce resource shifts from implementation to judgment. Compass operates before implementation to help leaders decide what is worth building.",
  },

  productLoop: {
    headline: "From assessment to blueprint.",
    subtitle: "Every recommendation is backed by evidence, assumptions, and measurable outcomes.",
    steps: [
      "Assessment",
      "Opportunity Map",
      "Compare Intervention Paths",
      "Prioritize One Intervention",
      "Implementation Blueprint",
    ],
  },

  existingTools: {
    headline: "Your tools execute. Compass decides.",
    body: "Builders, automation platforms, and enterprise-search tools help execute a chosen solution. They are powerful once you know what to build. Compass determines what should be built — and whether anything should be built at all. Compass operates before implementation.",
  },

  trust: {
    headline: "See why, not just what.",
    body: "Compass shows leaders why a recommendation was made, which assumptions it depends on, and what success should look like before implementation begins.",
    features: [
      { label: "Supporting evidence" },
      { label: "Assumptions" },
      { label: "Alternative paths compared" },
      { label: "Expected impact" },
      { label: "Success metrics" },
      { label: "Escalation requirements" },
    ],
  },

  exampleMap: {
    headline: "See Compass in action",
    subtitle: "Customer service misses 100 calls per day. Here is how Compass analyzes the problem, compares interventions, and recommends the best path forward.",
    problem: "Customer service misses 100 calls per day during peak hours. Reps are overwhelmed, callers abandon after 4 minutes, and revenue leaks every shift.",
    steps: [
      { label: "Root cause", text: "No intelligent call routing. All calls go to a shared queue. High-value callers wait alongside routine inquiries." },
      { label: "Evidence", text: "Call logs show 40% of missed calls are from accounts with >$10K ARR. Average handle time is 8 minutes for simple billing questions." },
      { label: "Interventions compared", text: "AI call triage, IVR redesign, hybrid human + AI routing, add more reps, no change" },
      { label: "Recommended", text: "Hybrid: AI screens and routes calls by urgency and account value. Human agents handle complex issues." },
      { label: "Confidence", text: "High — 75% of calls are routine and can be deflected or routed automatically." },
      { label: "Blueprint", text: "6-week rollout: AI routing model (2 weeks), IVR integration (2 weeks), agent training and go-live (2 weeks)." },
    ],
  },

  designPartners: {
    headline: "Become a Design Partner",
    subtitle: "We're accepting 10 design partners beginning in August. As a design partner, you'll get early access, direct influence on our roadmap, and priority support.",
    benefits: [
      "Free access to Compass during the design partner program",
      "Monthly strategy calls with our founding team",
      "Direct influence on product features and roadmap",
      "Priority access to new features and integrations",
      "Public recognition as a launch partner (optional)",
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
  },

  founder: {
    headline: "Built by operators who have been where you are.",
    body: "We've led product, engineering, and go-to-market teams at B2B SaaS companies ranging from Series A to IPO. We've seen how rushing to automation can waste resources. Compass exists to make adoption deliberate, measurable, and effective.",
  },

  finalCta: {
    headline: "Building the wrong solution wastes more than budget.",
    subtitle: "Start with the business problem. Let Compass determine the right intervention.",
    cta: "Assess your operations",
  },

  footer: {
    description: "Compass helps operations leaders decide what to automate next — and whether the answer is AI, software, process redesign, or human work.",
    copyright: `© ${new Date().getFullYear()} Compass. All rights reserved.`,
    columns: [
      {
        title: "Product",
        links: [
          { label: "Example Map", href: "/assessment/results?example=true" },
          { label: "Assessment", href: "/assessment" },
          { label: "About", href: "/about" },
        ],
      },
      {
        title: "Company",
        links: [
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

  evidence: {
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
      "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination — and generates an Implementation Blueprint for the chosen solution.",
  },
};
