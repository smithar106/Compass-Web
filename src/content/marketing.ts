// Public marketing and site content. Imported by client components.
// Keep app-internal content (assessment, blueprint, etc.) out of this module
// so it does not ship in public client bundles.

export const name = "Compass";

export const tagline = "Implementation is becoming abundant. Judgment remains scarce.";

export const description = "Compass helps organizations determine the right operational intervention before committing people, capital, and implementation effort \u2014 with evidence-backed executive recommendations.";

export const nav = [
  { label: "Product", href: "/product" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Evidence", href: "/evidence" },
  { label: "About", href: "/about" },
];

export const headerCta = {
  label: "Start Assessment",
  href: "/assessment",
};

export const marketing = {
    home: {
      hero: {
        eyebrow: "Decision intelligence for operations",
        headline: "Implementation is becoming abundant. Judgment remains scarce.",
        supporting:
          "Compass helps organizations determine the right operational intervention before committing people, capital, and implementation effort.",
        ctaPrimary: "Start Assessment",
        ctaPrimaryHref: "/assessment",
        ctaSecondary: "View Demo",
        ctaSecondaryHref: "/demo",
        trustLine: "Grounded in thousands of real-world enterprise implementations.",
      },
      problem: {
        eyebrow: "The problem",
        headline: "Implementation begins before the comparison.",
        supporting:
          "Organizations often commit people and capital to an intervention before comparing the available paths \u2014 so the wrong option gets built, bought, or staffed.",
        optionsLabel: "Compass compares every viable path",
        options: [
          "AI implementation",
          "Workflow automation",
          "Process redesign",
          "Software",
          "Staffing",
          "Hybrid approaches",
          "No action",
        ],
        closing: "Only after the comparison does the right intervention become clear.",
      },
      howItWorks: {
        eyebrow: "How Compass works",
        headline: "From business problem to better future decisions.",
        supporting:
          "A disciplined lifecycle: define the problem, make the call with evidence, implement with a plan, and measure what happened \u2014 so the next decision is better.",
        steps: [
          { number: "01", name: "Business Problem", detail: "You describe the operational problem \u2014 manual invoice processing, slow onboarding, costly support." },
          { number: "02", name: "Assessment", detail: "Compass investigates the workflow, context, and constraints behind the decision you\u2019re really making." },
          { number: "03", name: "Executive Recommendation", detail: "A one-page brief: the recommended path, expected outcomes, evidence, and strategy." },
          { number: "04", name: "Approval", detail: "Leadership reviews and approves the recommendation before people or capital are committed." },
          { number: "05", name: "Implementation", detail: "A phased plan with success criteria defined before work begins." },
          { number: "06", name: "Measured Outcomes", detail: "Actual timeline, cost, and results are captured against the baseline." },
          { number: "07", name: "Better Future Decisions", detail: "Every completed implementation sharpens the evidence behind the next recommendation." },
        ],
      },
      intelligence: {
        eyebrow: "Implementation intelligence",
        headline: "Every recommendation is grounded in real implementations.",
        supporting:
          "Compass recommendations are supported by a continuously growing library of real implementation evidence \u2014 what organizations did, in what context, and what actually happened.",
        features: [
          { name: "Real implementation evidence", detail: "Recommendations are built on documented implementations with measured outcomes \u2014 not opinion." },
          { name: "Continuously growing", detail: "The evidence library grows with every implementation, so recommendations keep improving." },
          { name: "Matched to your context", detail: "Evidence is compared against your industry, process, and operating constraints." },
          { name: "Executive-ready", detail: "One-page decision briefs written for the people who approve the budget." },
        ],
      },
      brief: {
        eyebrow: "The executive recommendation",
        headline: "A one-page recommendation you can act on.",
        supporting:
          "Every assessment produces an executive-ready recommendation covering the decision, expected outcomes, supporting evidence, strategy and objectives, and an implementation plan.",
      },
      compounding: {
        eyebrow: "Compounding value",
        headline: "Every operational decision makes the next one better.",
        supporting:
          "Compass preserves the decision, the implementation, the outcomes, and the lessons \u2014 so every future recommendation starts from what your organization has already learned.",
        points: [
          { title: "Decisions are preserved", detail: "The reasoning, alternatives, and assumptions behind each call are kept and revisited." },
          { title: "Outcomes are measured", detail: "What actually happened is captured against what was projected." },
          { title: "Lessons are kept", detail: "What worked \u2014 and what didn\u2019t \u2014 feeds every future recommendation." },
        ],
      },
      cta: {
        eyebrow: "Start with the right decision",
        headline: "Make the right decision before implementation begins.",
        supporting:
          "Run a Compass assessment on your highest-stakes operational problem. It takes minutes \u2014 and it could save you millions.",
        ctaPrimary: "Start Assessment",
        ctaPrimaryHref: "/assessment",
        ctaSecondary: "View Demo",
        ctaSecondaryHref: "/demo",
      },
    },

    catalog: {
      label: "Organizations like yours",
      number: "04",
      headline: "Organizations like yours.",
      subtitle:
        "Similar problems, real choices, documented outcomes: the decision, the evidence, the outcome, the partner, and what they learned.",
      searchPlaceholder: "Search similar decisions\u2026",
      noResults: "No matching decisions. Describe your own problem to get one.",
    },

  examples: [
    {
      id: "invoice",
      ownership: { owner: "VP of Finance Operations", decided: "Feb 2026", review: "90 days after go-live", success: "Processing cost down 40% by day 90" },
      problem: "Manual invoice processing",
      intervention: "Automated invoice matching with exception-based review",
      category: "Hybrid",
      ranking: "Highest confidence",
      confidence: { label: "High", score: 0.87 },
      evidence: { tier: "Gold", comparables: 44, validated: 9, sources: ["Government audit", "Academic evaluation", "Public-company disclosure"] },
      effort: "Medium",
      impact: { headline: "Reduce invoice processing cost", range: "40\u201360% lower processing cost", basis: "Observed across 44 comparable implementations" },
      roi: { range: "$310K / year", payback: "7 months" },
      partner: "Workflow automation specialist",
      learning: "Quarterly \u00b7 3 / 6 / 12-month reviews",
      alternatives: [
        { name: "AI-only extraction", verdict: "Rejected", reason: "Comparable evidence is thinner; uncontrolled hallucination risk on exceptions." },
        { name: "Manual process redesign", verdict: "Viable alternative", reason: "Lower impact; acceptable if automation budget is unavailable." },
        { name: "No action", verdict: "Rejected", reason: "Processing cost and error rate remain unchanged." },
      ],
    },
    {
      id: "support-routing",
      ownership: { owner: "Head of Support Operations", decided: "Jan 2026", review: "60 days after go-live", success: "Resolution time under 8 minutes by day 60" },
      problem: "Customer support routing",
      intervention: "Hybrid triage with deterministic routing",
      category: "Hybrid",
      ranking: "Highest ROI",
      confidence: { label: "High", score: 0.84 },
      evidence: { tier: "Gold", comparables: 38, validated: 7, sources: ["Government audit", "Customer documentation"] },
      effort: "Medium",
      impact: { headline: "Reduce resolution time 25\u201340%", range: "25\u201340% faster resolution", basis: "Observed across 38 comparable implementations" },
      roi: { range: "$480K / year", payback: "5 months" },
      partner: "CX automation partner",
      learning: "Monthly \u00b7 3 / 6 / 12-month reviews",
      alternatives: [
        { name: "AI agent", verdict: "Rejected", reason: "Comparable evidence is limited; cost and drift risk exceed benefit." },
        { name: "Process redesign only", verdict: "Viable alternative", reason: "Lower impact, lower risk. Acceptable if resources are constrained." },
        { name: "No action", verdict: "Rejected", reason: "Resolution time and support cost remain high." },
      ],
    },
    {
      id: "onboarding",
      ownership: { owner: "VP of Customer Experience", decided: "Mar 2026", review: "45 days after go-live", success: "Onboarding 30% faster by day 45" },
      problem: "Slow customer onboarding",
      intervention: "Process redesign + template automation",
      category: "Process",
      ranking: "Fastest to implement",
      confidence: { label: "Moderate", score: 0.76 },
      evidence: { tier: "Silver", comparables: 21, validated: 4, sources: ["Customer documentation", "Vendor implementation record"] },
      effort: "Low",
      impact: { headline: "Shorten onboarding by 30%", range: "30% shorter onboarding", basis: "Observed across 21 comparable implementations" },
      roi: { range: "$120K / year", payback: "3 months" },
      partner: "Internal operations team",
      learning: "Monthly \u00b7 3 / 6 / 12-month reviews",
      alternatives: [
        { name: "Full onboarding platform", verdict: "Rejected", reason: "Over-built for the current volume; slower to value." },
        { name: "AI concierge", verdict: "Deferred", reason: "Process is not yet standardized enough to automate safely." },
        { name: "No action", verdict: "Rejected", reason: "Onboarding time directly delays revenue." },
      ],
    },
    {
      id: "knowledge",
      ownership: { owner: "Head of Business Operations", decided: "Feb 2026", review: "Quarterly", success: "Repeat questions down 20% by first quarter" },
      problem: "Knowledge trapped in spreadsheets",
      intervention: "Structured knowledge base + governed search",
      category: "Software",
      ranking: "Highest evidence",
      confidence: { label: "High", score: 0.79 },
      evidence: { tier: "Gold", comparables: 52, validated: 11, sources: ["Academic evaluation", "Public-company disclosure", "Government audit"] },
      effort: "Medium",
      impact: { headline: "Cut repeat questions 20\u201330%", range: "20\u201330% fewer repeat questions", basis: "Observed across 52 comparable implementations" },
      roi: { range: "$260K / year", payback: "6 months" },
      partner: "Knowledge platform partner",
      learning: "Quarterly \u00b7 3 / 6 / 12-month reviews",
      alternatives: [
        { name: "AI chatbot on raw files", verdict: "Rejected", reason: "Unstructured sources produce unreliable answers." },
        { name: "Process redesign only", verdict: "Viable alternative", reason: "Helps, but does not make knowledge reusable at scale." },
        { name: "No action", verdict: "Rejected", reason: "Tribal knowledge keeps leaving with employees." },
      ],
    },
    {
      id: "escalation",
      ownership: { owner: "COO", decided: "Feb 2026", review: "90 days after go-live", success: "Resolution time down 25% by day 90" },
      problem: "Customer escalation triage",
      intervention: "Hybrid workflow redesign + deterministic routing",
      category: "Hybrid",
      ranking: "Most common",
      confidence: { label: "High", score: 0.81 },
      evidence: { tier: "Gold", comparables: 38, validated: 7, sources: ["Government audit", "Academic evaluation"] },
      effort: "Medium",
      impact: { headline: "Reduce resolution time 25\u201340%", range: "25\u201340% faster resolution", basis: "Observed across 38 comparable implementations" },
      roi: { range: "$230K / year", payback: "6 months" },
      partner: "Operations automation partner",
      learning: "Monthly \u00b7 3 / 6 / 12-month reviews",
      alternatives: [
        { name: "AI agent", verdict: "Rejected", reason: "Comparable evidence is limited; cost and drift risk exceed benefit." },
        { name: "Process redesign only", verdict: "Viable alternative", reason: "Lower impact, lower risk. Acceptable if resources are constrained." },
        { name: "No action", verdict: "Rejected", reason: "Outcome gap and cost of inaction remain unchanged." },
      ],
    },
    {
      id: "returns",
      ownership: { owner: "Operations Manager", decided: "Apr 2026", review: "60 days after go-live", success: "Exception handling 35% faster by day 60" },
      problem: "Returns and exceptions processing",
      intervention: "Deterministic rules with human review",
      category: "Software",
      confidence: { label: "Moderate", score: 0.72 },
      evidence: { tier: "Silver", comparables: 19, validated: 3, sources: ["Customer documentation"] },
      effort: "Low",
      impact: { headline: "Process exceptions 35% faster", range: "35% faster exception handling", basis: "Observed across 19 comparable implementations" },
      roi: { range: "$95K / year", payback: "4 months" },
      partner: "Internal ops team",
      learning: "Quarterly \u00b7 3 / 6 / 12-month reviews",
      alternatives: [
        { name: "AI agent", verdict: "Rejected", reason: "Rules are sufficient; AI adds cost without accuracy gain." },
        { name: "No action", verdict: "Rejected", reason: "Exception backlog keeps growing." },
      ],
    },
    {
      id: "quotes",
      ownership: { owner: "VP of Sales Operations", decided: "Mar 2026", review: "45 days after go-live", success: "Quote time halved by day 45" },
      problem: "Quote-to-order handoffs",
      intervention: "Handoff standardization + CRM workflow",
      category: "Process",
      confidence: { label: "Moderate", score: 0.74 },
      evidence: { tier: "Silver", comparables: 23, validated: 5, sources: ["Public-company disclosure", "Customer documentation"] },
      effort: "Low-Medium",
      impact: { headline: "Quote twice as fast", range: "2x faster quoting", basis: "Observed across 23 comparable implementations" },
      roi: { range: "$150K / year", payback: "3 months" },
      partner: "Business systems partner",
      learning: "Quarterly \u00b7 3 / 6 / 12-month reviews",
      alternatives: [
        { name: "CRM replacement", verdict: "Rejected", reason: "Underlying handoff is the problem, not the tool." },
        { name: "No action", verdict: "Rejected", reason: "Deal velocity is capped by the handoff." },
      ],
    },
    {
      id: "contracts",
      ownership: { owner: "General Counsel", decided: "May 2026", review: "Monthly", success: "Review backlog cleared 40% faster by first quarter" },
      problem: "Contract review backlog",
      intervention: "AI-assisted clause extraction with review queues",
      category: "AI",
      confidence: { label: "Moderate", score: 0.69 },
      evidence: { tier: "Bronze", comparables: 14, validated: 2, sources: ["Academic evaluation", "Vendor implementation record"] },
      effort: "High",
      impact: { headline: "Review 40% faster, same quality", range: "40% faster review", basis: "Observed across 14 comparable implementations" },
      roi: { range: "$410K / year", payback: "9 months" },
      partner: "Legal automation partner",
      learning: "Monthly \u00b7 3 / 6 / 12-month reviews",
      alternatives: [
        { name: "Deterministic software", verdict: "Viable alternative", reason: "Handles templates but not unstructured clauses." },
        { name: "Human work only", verdict: "Deferred", reason: "Backlog requires more than staffing to clear." },
      ],
    },
  ],

  lifecycle: {
    label: "The Compass lifecycle",
    number: "08",
    headline: "A continuous loop from decision to measurable outcome.",
    subtitle:
      "Compass moves organizations through four connected stages. The output of one stage becomes the input of the next\u2014and the Improve stage feeds verified results back into every future decision.",
    stages: [
      {
        id: "decide",
        index: "01",
        name: "Decide",
        question: "What should we do?",
        output: "Decision Record",
        status: "Available now",
        capabilityLead: "Define the problem, then compare every viable intervention against structured evidence.",
        capabilities: [
          "Define the operational problem",
          "Diagnose likely root causes",
          "Search structured implementation evidence",
          "Compare all viable intervention paths",
          "Rank decisions deterministically",
          "Explain why alternatives lost",
          "Define success metrics and assumptions",
        ],
      },
      {
        id: "implement",
        index: "02",
        name: "Implement",
        question: "How should we execute?",
        output: "Decision Blueprint and execution path",
        status: "Available now",
        capabilityLead: "Turn the decision into a plan your team or a trusted partner can execute\u2014without Compass doing the implementation itself.",
        capabilities: [
          "Generate an Implementation Blueprint",
          "Define systems, data, ownership, dependencies, and risks",
          "Choose internal implementation or a trusted partner",
          "Preserve the independence of the original decision",
          "Establish milestones and validation criteria before work begins",
        ],
      },
      {
        id: "monitor",
        index: "03",
        name: "Monitor",
        question: "Is the implementation working?",
        output: "Decision Review and Outcome Dashboard",
        status: "In development",
        capabilityLead: "Watch whether the intervention is actually producing the agreed outcome\u2014not just whether the work shipped.",
        capabilities: [
          "Track agreed success metrics",
          "Monitor milestones, adoption, risks, and blockers",
          "Compare actual progress with the original decision",
          "Preserve decisions, assumptions, and changes",
          "Surface when the intervention is drifting from the intended outcome",
        ],
      },
      {
        id: "improve",
        index: "04",
        name: "Improve",
        question: "What did we learn?",
        output: "Decision Learning and next decision",
        status: "Coming next",
        capabilityLead: "Turn the result into the next, better decision\u2014and into organizational memory that outlasts any individual.",
        capabilities: [
          "Conduct structured reviews after 3, 6, 9, and 12 months",
          "Compare projected and actual outcomes",
          "Identify which assumptions were correct or wrong",
          "Recommend adjustments",
          "Feed verified results back into organizational memory",
          "Improve future decisions",
        ],
      },
    ],
    note: "The current Decide and Implement experience is live. Monitoring and continuous learning are the natural next stages of the platform.",
  },

  anatomy: {
    label: "Decision anatomy",
    number: "09",
    headline: "A decision you can interrogate.",
    subtitle:
      "Every Compass decision is built to answer eight questions\u2014clear enough for a COO, with the technical detail available on demand for engineering and implementation teams.",
    reportNote: "Illustrative decision",
    reportProblem: "Manual customer escalation triage",
    questions: [
      {
        id: "problem",
        question: "Why is this the right problem?",
        answer:
          "Escalation triage is high-frequency, measurable, and sits directly between the customer and the outcome. Resolution time and escalation volume correlate with retention, so improving them has a defensible financial effect.",
        technical:
          "Baseline: 4,200 escalations per month, 14-minute median first-response, 43% handled by senior staff. Outcome gap quantified from ticket metadata and handle-time distribution before any intervention is selected.",
      },
      {
        id: "intervention",
        question: "Why is this the right intervention?",
        answer:
          "A hybrid of workflow redesign and deterministic routing produces the best combination of impact, reliability, and cost. Pure AI automation was compared and rejected: comparable evidence is thinner and the failure mode is less controllable.",
        technical:
          "Six intervention paths scored on evidence strength, expected impact, effort, readiness, and confidence. Hybrid ranked first deterministically\u2014the scoring inputs and version are reproducible on demand.",
      },
      {
        id: "priority",
        question: "Why should it be prioritized now?",
        answer:
          "Volume is growing, the cost of the current process is already visible, and the intervention does not depend on unavailable prerequisites. Delaying preserves the gap at an increasing cost.",
        technical:
          "Sequencing analysis compared this initiative against four competing opportunities on effort, dependency readiness, and expected value; this ranked first.",
      },
      {
        id: "evidence",
        question: "What evidence supports it?",
        answer:
          "38 comparable implementations, 7 with independently validated outcomes. Each comparable record preserves its source, and the strongest evidence is cited directly in the decision.",
        technical:
          "Evidence tier distribution: 9 gold, 17 silver, 12 bronze. Sources include a government audit, two academic evaluations, three public-company disclosures, and customer documentation.",
      },
      {
        id: "assumptions",
        question: "Which assumptions could change it?",
        answer:
          "The decision rests on a handful of stated assumptions\u2014escalation volume, agent availability, exception complexity. Each one is visible, and Compass says what would change the decision if it is wrong.",
        technical:
          "Assumptions carry a direction and effect size. If exception rate exceeds 18%, the decision shifts toward more human review; if volume drops 30%, deferral becomes viable.",
      },
      {
        id: "success",
        question: "What does success look like?",
        answer:
          "Success metrics are defined before work begins: resolution time reduced by 25\u201340%, first-response under 8 minutes, and no increase in re-escalation. You know what to measure before you start.",
        technical:
          "Metric definitions include measurement source, frequency, baseline, target, and validation criteria. Reporting cadence is agreed before implementation, not after.",
      },
      {
        id: "escalation",
      ownership: { owner: "COO", decided: "Feb 2026", review: "90 days after go-live", success: "Resolution time down 25% by day 90" },
        question: "When is technical escalation required?",
        answer:
          "A clear escalation boundary is set in advance\u2014for engineering help, vendor involvement, or stopping the intervention. Operations teams do not have to improvise when something drifts.",
        technical:
          "Escalation thresholds: exception rate >18%, integration latency >2s, or milestone slippage >2 weeks trigger defined review actions with named owners.",
      },
      {
        id: "implementation",
        question: "How should it be implemented?",
        answer:
          "The decision carries an Implementation Blueprint: phases, owners, dependencies, and validation criteria. Compass does not implement\u2014your team or a partner you select executes the plan.",
        technical:
          "Blueprint includes required systems, data contracts, human roles, security and privacy controls, rollout plan, and a validation gate before scale.",
      },
    ],
  },

    differentiation: {
      label: "Why Compass gets better",
      number: "05",
      headline: "Every decision makes the next one better.",
      subtitle:
        "One project. One decision. Then the knowledge leaves. Compass turns every decision into organizational knowledge\u2014so judgment compounds inside your organization.",
      moatLine: "The moat is memory, not models.",
      decisionSteps: [
        { text: "Decision #17", tone: "start" },
        { text: "Implemented", tone: "step" },
        { text: "Measured", tone: "step" },
        { text: "Learned", tone: "step" },
        { text: "Decision #18", tone: "start" },
        { text: "Implemented", tone: "step" },
        { text: "Measured", tone: "step" },
        { text: "Decision #19", tone: "start" },
        { text: "Better decision", tone: "end" },
      ],
      columns: [
        {
          name: "Consultants",
          note: "One project at a time",
          highlighted: false,
          items: [
            "One project. One recommendation.",
            "Knowledge concentrated in individuals",
            "Knowledge leaves when the engagement ends",
            "Recommendations delivered as documents",
          ],
        },
        {
          name: "Generic AI",
          note: "Broad knowledge, difficult to verify",
          highlighted: false,
          items: [
            "Can invent confidence",
            "Weak organizational context",
            "No systematic comparison of alternatives",
            "No institutional memory",
          ],
        },
        {
          name: "Compass",
          note: "Institutional judgment",
          highlighted: true,
          items: [
            "Every decision becomes organizational knowledge",
            "Every implementation improves the next decision",
            "Institutional judgment compounds",
            "The moat is memory, not models",
          ],
        },
      ],
    },

  operations: {
    label: "Built for consequential decisions",
    number: "10",
    headline: "For the people who own the outcome.",
    subtitle:
      "Made for operations leaders who are accountable for the results of major investments\u2014and who need to defend the choice after it is made.",
    audiences: [
      "Chief Operating Officer",
      "VP of Operations",
      "Head of Business Operations",
      "Transformation leader",
      "AI or automation program owner",
    ],
    scenarios: [
      {
        title: "Choosing the next workflow to automate",
        body: "Which process earns the investment\u2014and which intervention does it actually need?",
      },
      {
        title: "Deciding whether AI belongs in a process",
        body: "AI is one option, not the default. See the evidence for and against it before committing.",
      },
      {
        title: "Comparing build, buy, redesign, and human-led approaches",
        body: "Every viable path, scored on the same evidence and the same criteria.",
      },
      {
        title: "Prioritizing competing improvement initiatives",
        body: "Compare expected impact, effort, risk, and readiness across the whole portfolio.",
      },
      {
        title: "Recovering an implementation that is not meeting expectations",
        body: "Re-open the decision, check the assumptions, and correct the path before more capital is spent.",
      },
      {
        title: "Reviewing whether an intervention delivered its promised outcome",
        body: "Measure what actually happened against what was projected\u2014and keep the lesson.",
      },
    ],
  },

  trust: {
    label: "Why it's trustworthy",
    number: "11",
    headline: "Confidence is a design constraint, not marketing.",
    subtitle:
      "These principles are checkable in the product, not promises on a page.",
    principles: [
      { title: "Every material claim is traceable", body: "Each claim points to a source you can open and read." },
      { title: "Every alternative is compared", body: "The rejected paths are shown with the reasons they lost." },
      { title: "Every assumption is visible", body: "Assumptions are listed with what would change if they are wrong." },
      { title: "Insufficient evidence leads to deferred judgment", body: "Compass says \u201cnot enough evidence\u201d rather than inventing an answer." },
      { title: "Partners cannot pay to influence decisions", body: "A partner becomes relevant only after the customer selects the intervention." },
      { title: "AI is not automatically preferred", body: "AI is evaluated like any other intervention\u2014and often loses." },
    ],
  },

  founder: {
    label: "Built by an operator who kept seeing the same mistake",
    number: "06",
    headline: "Implementation is becoming abundant. Judgment remains scarce.",
    name: "Arthur Smith",
    role: "Founder, Compass",
      bio: "Compass was founded by Arthur Smith after years of building operational and AI systems at Lime. He repeatedly saw teams move into implementation before rigorously determining whether they were solving the right problem or choosing the right intervention.",
      body2:
        "As software became easier to build, the real bottleneck became clear: judgment.",
      founderLine:
        "I wasn\u2019t trying to build another AI company. I was trying to solve a problem I kept seeing inside enterprise operations.",
    proofPointsLabel: "What that work produced",
    proofPoints: [
      "Production systems supporting operations across 200+ markets",
      "Reporting cycles reduced by 88%",
      "Multiple production AI applications shipped",
    ],
  },

  finalCta: {
    eyebrow: "Make operational decisions with confidence",
    headline: "Before you implement anything, make sure it is the right thing.",
    subtitle:
      "Bring Compass an operational problem. Get an evidence-backed decision, a clear implementation path, and a framework for measuring what happens next.",
    ctaPrimary: "Start Assessment",
    ctaSecondary: "Talk to Us",
  },
};

export const about = {
  headline: "Make operational decisions with confidence.",
  thesis: "Every organization is being told to use AI. We believe the more important question is whether AI is the right solution in the first place.",
  body: [
    "Compass helps organizations determine the best operational intervention before implementation begins. It compares AI, software, workflow automation, process redesign, staffing, outsourcing, shared services, and other approaches using evidence from real-world implementations.",
    "Today, these decisions are often driven by consultants, vendor recommendations, internal opinion, or the latest technology trend. Compass replaces guesswork with structured evidence and produces an executive decision brief explaining the recommended path, alternatives, expected outcomes, implementation considerations, and next steps.",
    "Our mission is simple: give organizations confidence in the decisions they make before they commit people, capital, and engineering resources\u2014and keep the learning so the next decision is better.",
  ],
  vision: "We are building the evidence layer for operational decision-making.",
  team: "We're building the platform we wished existed whenever organizations faced complex operational decisions.",
  principles: {
    headline: "Our internal compass",
    subtitle: "Four principles guide how we build.",
    items: [
      { title: "Evidence", description: "Decisions begin with comparable operational implementations\u2014not assumptions." },
      { title: "Problems First", description: "Compass starts with the business problem, not the technology." },
      { title: "Transparency", description: "Every finding includes supporting evidence, assumptions, and alternatives." },
      { title: "Continuous Learning", description: "As the evidence base grows, Compass becomes increasingly capable of identifying comparable implementations." },
    ],
  },
};

export const footer = {
  description: "Make operational decisions with confidence.",
  copyright: `\u00A9 ${new Date().getFullYear()} Compass. All rights reserved.`,
  columns: [
    {
      title: "Product",
      links: [
        { label: "Product", href: "/product" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Evidence", href: "/evidence" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Get Started",
      links: [
        { label: "Start Assessment", href: "/assessment" },
        { label: "Design Partners", href: "/design-partners" },
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
};

export const metadata = {
  title: "Compass \u2014 Implementation Is Abundant. Judgment Is Scarce.",
  description:
    "Compass helps organizations determine the right operational intervention before committing people, capital, and implementation effort \u2014 with evidence-backed executive recommendations.",
};
