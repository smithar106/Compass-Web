export const site = {
  name: "Compass",
  tagline: "Find your AI leverage.",
  description:
    "Compass is an AI opportunity-discovery engine for B2B SaaS companies. We help you identify where AI creates real leverage in your business — before you invest in implementation.",

  hero: {
    headline: "Where does AI actually create leverage?",
    subtitle:
      "Every SaaS company is being told to adopt AI. But the real question isn't 'how' — it's 'where'. Compass is the AI opportunity-discovery engine that identifies where artificial intelligence will create the most leverage in your specific business.",
    cta: "Start your assessment",
  },

  problem: {
    headline: "The current approach is broken.",
    body: "Companies are adopting AI before they identify where it creates leverage. The result: wasted budgets, failed proofs of concept, and team fatigue.",
    approach: [
      {
        label: "The common approach",
        items: ["Pick a trendy AI use case", "Run a proof of concept", "Struggle to measure impact", "Move on to the next tool"],
      },
      {
        label: "The Compass approach",
        items: ["Assess your actual operations", "Discover where AI creates leverage", "Build with clear KPIs", "Measure and scale"],
      },
    ],
  },

  howItWorks: {
    headline: "How it works",
    steps: [
      {
        step: "01",
        title: "Assess",
        description: "A structured 25-minute assessment across 10 departments to map your current operations and identify where AI can reduce friction, automate workflows, and amplify your team.",
      },
      {
        step: "02",
        title: "Discover",
        description: "Your AI Opportunity Map reveals ranked, actionable opportunities with confidence scores, tradeoffs, and implementation blueprints tailored to your specific stack and team structure.",
      },
      {
        step: "03",
        title: "Build",
        description: "Each opportunity includes phased implementation plans with KPIs, dependencies, and approval gates. You'll know exactly what to build, in what order, and how to measure success.",
      },
    ],
  },

  productPreview: {
    headline: "Your AI Opportunity Map",
    subtitle: "See what Compass discovers. Here's a preview based on our benchmark data.",
  },

  integrations: {
    headline: "Analyzes across your entire toolchain",
    subtitle: "Compass connects to your existing tools to map dependencies, data flows, and automation potential across your entire tech stack.",
    badges: [
      { name: "Slack", status: "Coming soon" },
      { name: "Jira", status: "Coming soon" },
      { name: "Salesforce", status: "Coming soon" },
      { name: "HubSpot", status: "Coming soon" },
      { name: "Zendesk", status: "Coming soon" },
      { name: "GitHub", status: "Coming soon" },
    ],
  },

  triageModel: {
    headline: "How Compass distinguishes signal from noise",
    subtitle: "Every opportunity is classified across five evidence tiers, so you know exactly how much confidence to place in each recommendation.",
    tiers: [
      {
        name: "Verified Facts",
        description: "Data extracted directly from your tools and systems. These are objective measurements — API call volumes, ticket counts, cycle times.",
        color: "green",
        badge: "[Verified]",
      },
      {
        name: "Customer Input",
        description: "Insights gathered from stakeholder interviews embedded in the assessment flow. Your team's actual pain points ground every recommendation.",
        color: "green",
        badge: "[User]",
      },
      {
        name: "Public Evidence",
        description: "Industry benchmarks, case studies, and published research that support or challenge each opportunity. Grounded in what works at other companies.",
        color: "green",
        badge: "[Research]",
      },
      {
        name: "Inferred Hypotheses",
        description: "Patterns detected across your assessment responses and tool stack that suggest hidden opportunities or risks your team may not have articulated.",
        color: "yellow",
        badge: "[Inference]",
      },
      {
        name: "Generated Recommendations",
        description: "AI-synthesized proposals combining all four tiers above into ranked, actionable opportunity maps with tradeoff analyses.",
        color: "amber",
        badge: "[Recommendation]",
      },
    ],
  },

  differentiation: {
    headline: "Different from everything else",
    subtitle: "Compass occupies a unique space — we're not a consulting firm, an AI platform, or a DIY analysis.",
    comparisons: [
      {
        aspect: "Focus",
        compass: "Discovery before implementation",
        consulting: "Implementation-led engagements",
        aiPlatform: "Platform-first adoption",
        internal: "Reactive, unstructured exploration",
      },
      {
        aspect: "Output",
        compass: "Ranked opportunities with confidence scores",
        consulting: "Slide decks and recommendations",
        aiPlatform: "Platform-specific templates",
        internal: "Ad-hoc notes and decisions",
      },
      {
        aspect: "Speed",
        compass: "25-minute assessment → results in minutes",
        consulting: "Weeks of interviews and analysis",
        aiPlatform: "Depends on platform familiarity",
        internal: "Months of exploration",
      },
      {
        aspect: "Objectivity",
        compass: "Structured evidence tiers and tradeoffs",
        consulting: "Vendor relationships may bias",
        aiPlatform: "Platform-centric view",
        internal: "Internal politics and assumptions",
      },
      {
        aspect: "Cost",
        compass: "Free assessment, outcome-based pricing",
        consulting: "$50K–$200K+ engagements",
        aiPlatform: "Platform licensing + implementation",
        internal: "Opportunity cost of team time",
      },
    ],
  },

  futurePath: {
    headline: "The Compass Intelligence Platform",
    subtitle: "We're building toward a future where AI understands your organization holistically.",
    items: [
      {
        title: "Organizational Knowledge Graph",
        description: "A living map of your people, processes, tools, and data flows — automatically updated as your business evolves.",
      },
      {
        title: "Adaptive Assessment Engine",
        description: "Each assessment session learns from the last. Questions adapt based on your industry, size, and previous responses for increasingly precise recommendations.",
      },
      {
        title: "Organizational Reasoning",
        description: "Beyond individual opportunities — Compass will model how changes in one department ripple across the organization, surfacing second-order effects and hidden dependencies.",
      },
    ],
  },

  designPartners: {
    headline: "Become a Design Partner",
    subtitle: "We're looking for 10 B2B SaaS companies to help shape Compass. As a design partner, you'll get early access, direct influence on our roadmap, and priority support.",
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
    body: "We've led product, engineering, and go-to-market teams at B2B SaaS companies ranging from Series A to IPO. We've seen firsthand how AI hype leads to wasted investment. Compass exists to make AI adoption deliberate, measurable, and effective.",
  },

  finalCta: {
    headline: "Find your first AI opportunity.",
    subtitle: "25 minutes. 10 departments. One clear path forward.",
    cta: "Start your assessment",
  },

  footer: {
    description: "Compass helps B2B SaaS companies discover where AI creates real leverage in their business.",
    copyright: `© ${new Date().getFullYear()} Compass AI. All rights reserved.`,
    columns: [
      {
        title: "Product",
        links: [
          { label: "Assessment", href: "/assessment" },
          { label: "Design Partners", href: "/design-partners" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Coming soon", href: "#" },
        ],
      },
    ],
  },

  about: {
    mission: "Make AI adoption deliberate, measurable, and effective for every B2B SaaS company.",
    vision: "A world where every company knows exactly where AI creates leverage — before they invest a dollar.",
    problem: "SaaS companies are under immense pressure to adopt AI. Boardrooms demand AI strategies. Competitors launch AI features. VCs ask about your AI roadmap. The result is rushed decisions, failed proofs of concept, and wasted budgets. We built Compass to solve this — starting with the question that matters most: where does AI actually create leverage?",
    team: "We're a small team of product builders, engineers, and operators who have scaled B2B SaaS companies from seed to IPO. We've been in the trenches of AI adoption, and we built Compass because we wished it existed.",
  },

  assessment: {
    intro: {
      headline: "Discover your AI opportunities",
      body: "This 25-minute assessment maps your current operations across 10 departments. Your answers will generate a ranked AI Opportunity Map — showing exactly where AI creates the most leverage for your specific business.",
      estimatedTime: "25 minutes",
      sections: "10 departments",
      questions: "25 questions",
      cta: "Begin assessment",
    },
    complete: {
      headline: "Assessment complete!",
      body: "Your answers are being analyzed. Click below to generate your AI Opportunity Map.",
      cta: "Generate my AI Opportunity Map",
    },
  },

  results: {
    headline: "Your AI Opportunity Map",
    subtitle: "Ranked opportunities based on your assessment. Expand each one for a detailed implementation blueprint.",
    noResults: "No assessment results found. Please complete the assessment first.",
    buildBrief: "Generate build brief",
    comingSoon: "Build brief generation is coming soon. In the meantime, export your opportunity map or share it with your team.",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Assessment", href: "/assessment" },
    { label: "Design Partners", href: "/design-partners" },
    { label: "About", href: "/about" },
  ],

  metadata: {
    title: "Compass — AI Opportunity Discovery for B2B SaaS",
    description:
      "Compass is an AI opportunity-discovery engine for B2B SaaS companies. Identify where AI creates real leverage in your business.",
  },
};
