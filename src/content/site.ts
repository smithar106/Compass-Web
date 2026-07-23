export const site = {
  name: "Compass",
  tagline: "What should your company automate next?",
  description:
    "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination—and generates an Implementation Blueprint for the chosen solution.",

  hero: {
    eyebrow: "The decision layer before implementation",
    headline: "What should your company automate next?",
    subtitle: "Compass investigates how work happens, compares every intervention path, and recommends what is actually worth implementing — with the evidence, expected impact, and blueprint to act.",
    cta: "Assess your operations",
    ctaSecondary: "See Compass in action",
    options: ["AI", "Software", "Process Redesign", "Human Work", "Hybrid", "No automation yet"],
  },

  pain: {
    headline: "AI adoption is expensive when the decision is wrong.",
    subtitle: "Companies are under pressure to adopt AI, but most begin with tools, vendors, and pilots before clearly defining the problem, the expected impact, or the best intervention.",
    cards: [
      {
        headline: "Failed AI pilots",
        pain: "Companies test AI before validating whether the selected problem is suitable for AI, whether the necessary data and processes exist, or whether another intervention would work better. Pilots launch. Business impact never follows.",
        failure: "The technology is selected before the problem and root cause are understood.",
        compassSolves: "Compass establishes the problem, evidence, readiness, and intervention fit before recommending a pilot.",
      },
      {
        headline: "The wrong AI tools",
        pain: "Teams spend weeks attending demos and evaluating products, while every vendor frames the organization's problem around the solution it sells.",
        failure: "Tool selection begins before intervention selection.",
        compassSolves: "Compass recommends the intervention category and requirements before a vendor is considered.",
      },
      {
        headline: "AI spend without measurable ROI",
        pain: "Organizations commit budget without clearly documenting the business baseline, expected impact, implementation costs, adoption requirements, or measurable success criteria.",
        failure: "There is no explicit economic case connecting the problem to the investment.",
        compassSolves: "Compass defines expected impact, assumptions, success metrics, risks, and measurement requirements before implementation.",
      },
      {
        headline: "Months lost before implementation",
        pain: "Teams spend months gathering requirements, comparing vendors, running demos, debating scope, and reconciling conflicting recommendations. The implementation clock starts long before anything is built.",
        failure: "The organization lacks a repeatable decision process.",
        compassSolves: "Compass compresses problem investigation, intervention comparison, and implementation planning into one structured workflow.",
      },
      {
        headline: "AI adoption without organizational readiness",
        pain: "AI is introduced into unclear processes, fragmented ownership structures, poor data environments, or workflows that have never been standardized.",
        failure: "Organizations confuse technical availability with operational readiness.",
        compassSolves: "Compass identifies process, ownership, evidence, data, and change-management dependencies before recommending AI.",
      },
      {
        headline: "Trust lost after a failed implementation",
        pain: "When teams cannot explain why a tool was chosen or why results fell short, leadership becomes more skeptical of future automation and AI investments.",
        failure: "The evidence, assumptions, alternatives, and decision logic were never documented.",
        compassSolves: "Every Compass recommendation remains traceable and explainable.",
      },
    ],
    thesis: "Implementation is becoming abundant. Judgment remains scarce.",
    bridge: "Compass is the decision infrastructure organizations need before they build, buy, automate, or hire.",
  },

  statisticsSection: {
    headline: "AI investment is growing. Value is not keeping pace.",
    subtitle: "Organizations do not need another tool telling them what it can build. They need a repeatable way to decide what is worth building.",
    cta: "Assess your operations",
    sourceLine: "Sources: Gartner, IBM Institute for Business Value, Boston Consulting Group",
  },

  rootCause: {
    headline: "The problem is not implementation. It is judgment.",
    body: "AI has made building, buying, and automating easier. But organizations still make high-cost technology decisions using scattered interviews, vendor demos, spreadsheets, and intuition.",
    thesis: "Implementation is becoming abundant. Judgment remains scarce.",
    bridge: "Compass is the decision infrastructure organizations need before they build, buy, automate, or hire.",
  },

  problem: {
    headline: "Most companies ask the wrong question.",
    wrong: "How can we use AI?",
    better: "What is the best way to solve this problem?",
    body: "Implementation tools are becoming cheaper and easier to use. Choosing the right intervention is what remains difficult. Compass helps you decide before you build.",
  },

  exampleRecommendation: {
    headline: "See Compass in action.",
    problem: "Customer support misses approximately 100 inbound calls each day. Reps are overwhelmed. Callers abandon. Revenue leaks every shift.",
    steps: [
      { label: "Business problem", text: "Customer support misses approximately 100 inbound calls each day during peak hours." },
      { label: "Root-cause hypotheses", text: "Staffing coverage does not match demand. Call routing concentrates traffic in one queue. Shift changes create coverage gaps. Callback workflows are inconsistent. Some call types do not require live-agent handling." },
      { label: "Evidence reviewed", text: "Missed calls cluster around peak periods and shift changes. Routing rules disproportionately direct calls to one queue. Staffing is lowest during part of the highest-demand window. No consistent callback SLA exists. Demand by call type has not been fully measured." },
      { label: "Interventions compared", text: "AI voice agent, deterministic callback and routing software, process redesign, additional or reallocated staffing, hybrid intervention, no action yet." },
      { label: "Recommended", value: "Redesign call routing and staffing coverage before deploying an AI voice agent." },
      { label: "Category", value: "Process redesign + deterministic software" },
      { label: "Confidence", value: "87%" },
      { label: "Expected impact", value: "20-30% reduction in missed calls", detail: "3-4 weeks to implement" },
      { label: "Conditions that could change this", text: "A high share of calls are repetitive and low-risk. Reliable call-intent data becomes available. Staffing changes do not improve missed-call rates. Customer acceptance of automated voice support is validated." },
      { label: "Blueprint summary", text: "Owner: Operations lead. First milestone: Call audit complete within 1 week. Phases: Audit (1 week), routing redesign (1 week), staffing adjustment (1 week), monitoring (ongoing). Success metrics: Missed call rate, average hold time, callback completion rate. Key risks: Staffing availability, routing system limitations." },
    ],
  },

  howItWorks: {
    headline: "From operational problem to implementation blueprint.",
    steps: [
      { number: "01", title: "Assess", description: "Understand how work happens, where it fails, and which outcomes matter." },
      { number: "02", title: "Investigate", description: "Define the problem, test root-cause hypotheses, and identify missing evidence." },
      { number: "03", title: "Compare", description: "Evaluate AI, software, process, human, hybrid, and no-action paths." },
      { number: "04", title: "Recommend", description: "Select the highest-leverage intervention and explain why the alternatives ranked lower." },
      { number: "05", title: "Blueprint", description: "Produce an actionable plan with owners, milestones, assumptions, risks, and measurable outcomes." },
    ],
  },

  trust: {
    headline: "See why, not just what.",
    body: "Compass does not produce a black-box recommendation. It preserves the reasoning required to evaluate, challenge, and improve the decision.",
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
    statement: "Leaders remain in control because the evidence and logic remain visible.",
  },

  differentiation: {
    headline: "Your tools execute. Compass decides.",
    body: "Builders, automation platforms, enterprise AI tools, and implementation firms become valuable once an organization knows what it should build. Compass operates before that decision.",
    executionTools: ["Generate software", "Automate workflows", "Deploy agents", "Search company knowledge", "Implement selected systems"],
    compassRole: ["Defines the actual business problem", "Investigates root causes", "Determines whether intervention is warranted", "Compares intervention paths", "Estimates impact and readiness", "Recommends what should happen next", "Produces the implementation blueprint"],
  },

  designPartners: {
    headline: "Bring Compass a real operational problem.",
    subtitle: "We are working with operations leaders and founders to evaluate real decisions before implementation begins.",
    benefits: [
      "A structured organizational assessment",
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
    headline: "The evidence behind Compass.",
    body: "AI adoption is increasing, but the gains are uneven. The difference is not simply access to AI — it is the organizational capacity to select, integrate, and learn from the right interventions.",
    cta: "Explore the research",
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
    { label: "Research", href: "/research" },
    { label: "About", href: "/about" },
    { label: "Design Partners", href: "/design-partners" },
  ],

  metadata: {
    title: "Compass — What should your company automate next?",
    description:
      "Compass helps operations leaders decide whether the right answer is AI, software, process redesign, human work, or a combination — and generates an Implementation Blueprint for the chosen solution.",
  },
};
