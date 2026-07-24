export interface ResearchPaper {
  source: string;
  title: string;
  date: string;
  keyFinding: string;
  compassInterpretation: string;
  url: string;
  methodology?: string;
  featuredStatistic?: string;
}

export interface ResearchStatistic {
  value: string;
  label: string;
  detail: string;
  source: string;
}

export const researchPapers: ResearchPaper[] = [
  {
    source: "Ramp Economics Lab and Revelio Labs",
    title: "A New Look at AI's Impact on Jobs: Firm-Level AI Spending and Workforce Adjustment",
    date: "June 30, 2026",
    keyFinding: "High-intensity AI adopters grew total headcount by approximately 10.2% over the first 24 months after adoption, while low-intensity adopters saw no statistically significant change. Entry-level headcount increased approximately 12.0% among high-intensity adopters.",
    compassInterpretation: "Purchasing AI is not enough. Meaningful gains appear alongside sustained investment, organizational learning, workflow integration, and complementary operational changes. The paper identifies a product gap outside technical firms: organizations need tools that help non-technical users evaluate use cases, redesign workflows, and make durable adoption decisions.",
    url: "https://www.ramp.com/economics",
    methodology: "The study is observational. AI adopters were already larger, more technical, and faster-growing than non-adopters, so the preferred analysis compares earlier adopters with similar firms that adopted later.",
    featuredStatistic: "High-intensity adopters grew headcount ~10.2% over 24 months",
  },
  {
    source: "Gartner",
    title: "AI Project Failure and Time-to-Production Research",
    date: "2024",
    keyFinding: "On average, only 48% of AI projects progress from experimentation into production. Moving from an AI prototype to production takes an average of eight months.",
    compassInterpretation: "Companies begin building before validating the problem, readiness, and intervention fit.",
    url: "https://www.gartner.com",
    featuredStatistic: "52% never reach production",
  },
  {
    source: "IBM Institute for Business Value",
    title: "CEO Decision-Making in the Age of AI",
    date: "2025",
    keyFinding: "Only 25% of AI initiatives have delivered expected ROI, and only 16% have scaled enterprise-wide. 64% of CEOs said fear of falling behind causes investment in technologies before the organization clearly understands the value they will provide.",
    compassInterpretation: "Organizations are frequently investing before connecting the selected tool to an explicit problem, baseline, expected impact, and measurement plan.",
    url: "https://www.ibm.com/ibv",
    featuredStatistic: "25% deliver expected ROI",
  },
  {
    source: "Boston Consulting Group",
    title: "AI Implementation Challenges Survey",
    date: "2024",
    keyFinding: "Roughly 70% of AI implementation challenges stem from people and process, compared with 20% from technology and only 10% from AI algorithms. 74% of companies struggle to achieve and scale value from AI.",
    compassInterpretation: "Companies often spend most of their attention on models and vendors even though the dominant barriers are organizational.",
    url: "https://www.bcg.com",
    featuredStatistic: "70% are people and process problems",
  },
  {
    source: "McKinsey Global Institute",
    title: "The State of AI in 2025",
    date: "2025",
    keyFinding: "88% of respondents said their organizations regularly used AI in at least one function, but nearly two-thirds had not begun scaling AI across the enterprise. Only 39% reported any enterprise-level EBIT impact attributable to AI. AI high performers were nearly three times more likely to fundamentally redesign workflows.",
    compassInterpretation: "Access to AI is no longer the central problem. Selecting the right use cases and redesigning the surrounding workflows are.",
    url: "https://www.mckinsey.com/mgi",
    featuredStatistic: "88% use AI, 39% report EBIT impact",
  },
];

export const researchStatistics: ResearchStatistic[] = [
  { value: "52%", label: "Failed AI pilots", detail: "More than half of AI projects never reach production.", source: "Gartner" },
  { value: "8 mo.", label: "Slow implementation", detail: "The average AI prototype takes eight months to reach production.", source: "Gartner" },
  { value: "25%", label: "Missed ROI", detail: "Only one in four AI initiatives delivers the expected return.", source: "IBM" },
  { value: "70%", label: "Organizational failures", detail: "People and process, not technology, cause most AI implementation problems.", source: "BCG" },
];
