export const site = {
  name: "Compass",
  tagline: "What should your company automate next?",
  description:
    "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination—and generates an Implementation Blueprint for the chosen solution.",

  hero: {
    headline: "What should your company automate next?",
    subtitle: "Compass analyzes how your business operates, compares AI, software, process redesign, and human work, then recommends the highest-impact intervention and generates an implementation blueprint.",
    cta: "Assess your operations",
    ctaSecondary: "See an example",
    options: ["AI", "Software", "Process Redesign", "Human Work", "Hybrid", "No automation yet"],
  },

  problem: {
    headline: "Most companies ask the wrong question.",
    wrong: "How can we use AI?",
    better: "What is the best way to solve this problem?",
    body: "Implementation tools are becoming cheaper and easier to use. Choosing the right intervention is what remains difficult. Compass helps you decide before you build.",
  },

  exampleRecommendation: {
    headline: "See Compass in action.",
    problem: "Customer support misses 100 calls per day during peak hours. Reps are overwhelmed, callers abandon, and revenue leaks every shift.",
    steps: [
      { label: "Business problem", text: "Customer support misses 100 calls/day. Reps are overwhelmed during peak hours. Callers abandon after 4 minutes on hold." },
      { label: "Root causes", text: "Missed calls cluster around shift changes. Routing rules send too many calls to the same queue. Staffing coverage is lowest during peak demand." },
      { label: "Evidence reviewed", text: "Call logs show 40% of missed calls are from accounts with over $10K ARR. Average handle time is 8 minutes for routine billing questions." },
      { label: "Interventions compared", text: "AI voice agent, callback automation, additional staffing, process redesign, hybrid AI-human routing, no change." },
      { label: "Recommended", value: "Improve call routing and staffing coverage before deploying AI." },
      { label: "Confidence", value: "87%" },
      { label: "Expected impact", value: "20\u201330% reduction in missed calls", detail: "3\u20134 weeks to implement" },
    ],
  },

  howItWorks: {
    headline: "From operational problem to implementation blueprint.",
    steps: [
      { number: "01", title: "Assess", description: "Understand how work happens and where it fails." },
      { number: "02", title: "Discover", description: "Identify business problems, root causes, and missing evidence." },
      { number: "03", title: "Compare", description: "Evaluate AI, software, process, human, hybrid, and no-action paths." },
      { number: "04", title: "Recommend", description: "Select the highest-impact intervention and explain why." },
      { number: "05", title: "Blueprint", description: "Produce an actionable plan with owners, milestones, metrics, risks, and assumptions." },
    ],
  },

  trust: {
    headline: "See why, not just what.",
    body: "Every recommendation includes the evidence, confidence, and reasoning behind it. You keep full visibility into what was considered and why the final path was chosen.",
    features: [
      { label: "Evidence" },
      { label: "Confidence" },
      { label: "Assumptions" },
      { label: "Alternatives considered" },
      { label: "Expected impact" },
      { label: "Risks" },
      { label: "Success metrics" },
      { label: "Conditions that could change this recommendation" },
    ],
  },

  differentiation: {
    headline: "Your tools execute. Compass decides.",
    body: "Tools like AI builders, workflow automation platforms, and implementation firms help execute a chosen solution. Compass operates before implementation — helping you determine which solution is actually worth pursuing.",
    executionTools: ["Build workflows", "Generate software", "Automate tasks", "Deploy AI systems"],
    compassRole: ["Define the real problem", "Investigate root causes", "Compare intervention paths", "Recommend what to do next", "Generate the blueprint"],
  },

  designPartners: {
    headline: "Help shape the decision layer for modern operations.",
    subtitle: "Compass is working with a limited group of operations leaders and founders to test real organizational problems. Get early access and direct influence on the product roadmap.",
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
    cta: "Become a design partner",
    ctaSecondary: "Assess your operations",
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
