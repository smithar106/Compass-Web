import type { OpportunityMap, Opportunity, InterventionRecommendation, ComparedPath, EvidenceItem, AssumptionItem, ImplementationBlueprint } from "./types";

export type { OpportunityMap, Opportunity, InterventionRecommendation, ComparedPath, EvidenceItem, AssumptionItem, ImplementationBlueprint };
export type * from "./types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function now(): string {
  return new Date().toISOString();
}

function buildOpportunityFromAnswers(answers: Record<string, any>, department: string, rank: number): Opportunity | null {
  const workflow = answers["dept-2"] || "unknown workflow";
  const desiredOutcome = answers["dept-3"] || "";
  const pain = answers["dept-4"] || "";
  const frequency = answers["freq-1"] || "";
  const people = answers["freq-2"] || "";
  const handoffs = answers["freq-3"] || "";
  const tools = answers["tools-1"] || "";
  const data = answers["tools-2"] || "";
  const exceptions = answers["tools-3"] || "";
  const timeSpent = answers["cost-1"] || "";
  const cost = answers["cost-2"] || "";
  const risk = answers["risk-1"] || "";
  const stability = answers["risk-2"] || "";
  const technicalConstraints = answers["constraints-1"] || "";
  const budget = answers["constraints-3"] || "";

  const problemStatement = pain || `Manual ${workflow} process in ${department}`;
  const rootCause = `No automated solution for ${workflow}; process relies on manual effort`;
  const currentImpact = `${timeSpent} per week consumed by manual ${workflow} tasks`;

  const hasHighFrequency = ["Multiple times daily", "Daily"].includes(frequency);
  const hasManyPeople = ["4-10 people", "11-50 people", "50+ people"].includes(people);
  const hasManyHandoffs = ["3-5 handoffs", "6+ handoffs"].includes(handoffs);
  const hasManyExceptions = ["Many exceptions (10-30%)", "Highly variable (30%+)"].includes(exceptions);
  const highTime = ["20-40 hours", "More than 40 hours"].includes(timeSpent);
  const highRisk = ["High — significant revenue or compliance risk", "Critical — legal or safety implications"].includes(risk);
  const hasTechnicalConstraints = technicalConstraints && technicalConstraints.length > 0 && technicalConstraints !== "None" && technicalConstraints !== "No" && technicalConstraints !== "N/A";

  const score =
    (hasHighFrequency ? 20 : 5) +
    (hasManyPeople ? 15 : 5) +
    (hasManyHandoffs ? 15 : 5) +
    (hasManyExceptions ? -5 : 5) +
    (highTime ? 20 : 5) +
    (highRisk ? 15 : 5) +
    (hasTechnicalConstraints ? -5 : 5);

  if (score < 30) return null;

  const opp: Opportunity = {
    rank,
    department: department as any,
    name: `${workflow} optimization`,
    businessProblem: problemStatement,
    rootCause,
    currentImpact,
    confidence: score >= 60 ? "High" : score >= 40 ? "Medium" : "Low",
    description: problemStatement,
    intervention: buildIntervention(department, workflow, pain, desiredOutcome, hasHighFrequency, hasManyExceptions, highRisk),
    evidence: buildEvidence(department, workflow, pain, tools, cost),
    assumptions: buildAssumptions(workflow, tools, data, technicalConstraints),
    comparedPaths: buildComparedPaths(),
    whyAlternativesRejected: "The recommended intervention provides the optimal balance of impact, risk, and time-to-value for this specific workflow.",
    tradeoff: `Requires integration with ${tools || "existing systems"} and team training.`,
    businessImpact: { description: `Estimated significant improvement in ${workflow} efficiency`, impactType: "Efficiency" },
  };

  if (highRisk) {
    opp.risks = [{ risk: "Process change may face resistance", category: "Organizational", likelihood: "Medium", impact: "Medium", mitigation: " phased rollout with stakeholder buy-in" }];
  }

  return opp;
}

function buildIntervention(
  department: string,
  workflow: string,
  pain: string,
  desiredOutcome: string,
  hasHighFrequency: boolean,
  hasManyExceptions: boolean,
  highRisk: boolean
): InterventionRecommendation {
  const useAI = hasHighFrequency && !hasManyExceptions;
  const useDeterministic = !hasManyExceptions && !useAI;
  const useProcessRedesign = hasManyExceptions;
  const useHybrid = hasHighFrequency && hasManyExceptions;
  const type = useHybrid ? "Hybrid" : useAI ? "AI" : useProcessRedesign ? "Process Redesign" : useDeterministic ? "Deterministic Software" : "Human Work";

  return {
    type: type as any,
    title: `${type} ${workflow} solution`,
    description: `${type} solution to automate and optimize ${workflow} in ${department}. ${pain}`,
    businessCase: `Reduces manual effort in ${workflow}, improving team productivity and reducing errors.`,
    expectedImpact: desiredOutcome || "Significant efficiency improvement and cost reduction",
    timeToValue: useAI ? "6-10 weeks" : useHybrid ? "4-8 weeks" : useDeterministic ? "2-4 weeks" : "4-12 weeks",
    implementationEffort: useAI ? "Medium-High" : useHybrid ? "Medium" : "Medium",
    confidence: highRisk ? "Medium" : "High",
    humanOversight: type === "AI" ? "Periodic review" : type === "Hybrid" ? "Human-in-the-loop" : "Full human control",
    evidence: [],
    assumptions: [],
    comparedPaths: [],
    rejectionRationale: "Selected approach balances effectiveness with implementation feasibility.",
  };
}

function buildEvidence(department: string, workflow: string, pain: string, tools: string, cost: string): EvidenceItem[] {
  const items: EvidenceItem[] = [
    { type: "user-provided", source: "Assessment response", detail: pain || `Manual ${workflow} process in ${department}`, confidence: "Confirmed", timestamp: now().split("T")[0] },
  ];
  if (tools) {
    items.push({ type: "user-provided", source: "Assessment response", detail: `Current tools: ${tools}`, confidence: "Confirmed", timestamp: now().split("T")[0] });
  }
  if (cost) {
    items.push({ type: "deterministic-analysis", source: "User-provided cost data", detail: `Estimated cost burden: ${cost}`, confidence: "High" });
  }
  return items;
}

function buildAssumptions(workflow: string, tools: string, data: string, constraints: string): AssumptionItem[] {
  const items: AssumptionItem[] = [
    { assumption: `Team has capacity to adopt new ${workflow} workflow`, impact: "High", confidence: "Medium" },
  ];
  if (tools && tools !== "None") {
    items.push({ assumption: `Existing tools (${tools}) can integrate with new solution`, impact: "Medium", confidence: "Medium" });
  }
  if (data && data !== "None") {
    items.push({ assumption: `Required data (${data}) is accessible and clean`, impact: "Medium", confidence: "High" });
  }
  return items;
}

function buildComparedPaths(): ComparedPath[] {
  return [
    { intervention: "AI", title: "Pure AI automation", eligibility: "Medium", suitability: "Medium", expectedOutcome: "80-90% automation", effort: "Medium-High", risk: "Medium", timeToValue: "6-10 weeks", humanOversight: "Periodic review", confidence: "Medium", rejectionReason: "May be over-engineered for this use case" },
    { intervention: "Deterministic Software", title: "Rule-based solution", eligibility: "High", suitability: "Medium", expectedOutcome: "60-70% automation", effort: "Low-Medium", risk: "Low", timeToValue: "2-4 weeks", humanOversight: "Exception handling", confidence: "High", rejectionReason: "Cannot handle complex edge cases" },
    { intervention: "Process Redesign", title: "Process re-engineering", eligibility: "Medium", suitability: "Medium", expectedOutcome: "30-50% efficiency", effort: "Medium", risk: "Low-Medium", timeToValue: "4-12 weeks", humanOversight: "Full human control", confidence: "Medium", rejectionReason: "Does not add automation" },
    { intervention: "Human Work", title: "Keep current process", eligibility: "Low", suitability: "Low", expectedOutcome: "Status quo", effort: "None", risk: "Low", timeToValue: "Immediate", humanOversight: "Full human ownership", confidence: "High", rejectionReason: "Does not improve productivity" },
    { intervention: "Hybrid", title: "AI-assisted with human review", eligibility: "High", suitability: "High", expectedOutcome: "50-70% efficiency, quality maintained", effort: "Medium", risk: "Low-Medium", timeToValue: "4-8 weeks", humanOversight: "Human-in-the-loop", confidence: "High" },
    { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Current ROI does not justify deferral" },
  ];
}

interface AssessmentAnswer {
  question_id: string;
  answer: any;
  confidence?: string;
  was_skipped?: boolean;
}

async function fetchAnswers(sessionId: string, supabase: any): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from("assessment_answers")
    .select("question_id, answer, confidence, was_skipped")
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(`Failed to fetch assessment answers: ${error.message}`);
  }

  const answers: Record<string, any> = {};
  for (const row of data || []) {
    if (!row.was_skipped && row.answer !== null) {
      const val = typeof row.answer === "object" && row.answer !== null && "value" in row.answer
        ? (row.answer as any).value
        : row.answer;
      answers[row.question_id] = val;
    }
  }
  return answers;
}

function determineDepartments(answers: Record<string, any>): string[] {
  const deptAnswer = answers["dept-1"];
  if (Array.isArray(deptAnswer)) return deptAnswer;
  if (typeof deptAnswer === "string") return deptAnswer.split(",").map((d: string) => d.trim());
  return ["Operations"];
}

function buildExecutiveSummary(opportunities: Opportunity[]): OpportunityMap["executiveSummary"] {
  const quickWins = opportunities.filter((o) => o.confidence === "High").length;
  const topDept = opportunities[0]?.department || "Operations";
  const topName = opportunities[0]?.name || "workflow optimization";

  return {
    headline: `${opportunities.length} opportunities identified across ${new Set(opportunities.map((o) => o.department)).size} department(s)`,
    finding: `The highest-impact opportunity is in ${topDept}, where ${opportunities[0]?.businessProblem || "manual processes need improvement"}.`,
    recommendedFocus: `${opportunities[0]?.intervention?.title || "Hybrid solution"} as the first intervention.`,
    quickWins,
  };
}

function buildImplementationSequencing(opportunities: Opportunity[]): OpportunityMap["implementationSequencing"] {
  const highConf = opportunities.filter((o) => o.confidence === "High");
  const midConf = opportunities.filter((o) => o.confidence === "Medium");
  const lowConf = opportunities.filter((o) => o.confidence === "Low");

  return {
    strategy: "Start with high-confidence, high-impact interventions that demonstrate value before tackling more complex initiatives.",
    strategyRationale: "High-confidence opportunities provide quick wins with measurable ROI.",
    phases: [
      {
        phase: 1,
        name: "Foundation",
        description: "High-impact, quick-win interventions",
        opportunities: highConf.map((o) => ({ rank: o.rank, title: o.name })),
        estimatedDuration: "6-8 weeks",
      },
      ...(midConf.length > 0
        ? [
            {
              phase: 2,
              name: "Scaling",
              description: "Expand intervention to additional areas",
              opportunities: midConf.map((o) => ({ rank: o.rank, title: o.name })),
              estimatedDuration: "4-8 weeks",
              gates: [{ gate: "Phase 1 ROI review", criteria: ">=80% of projected impact achieved" }],
            },
          ]
        : []),
      ...(lowConf.length > 0
        ? [
            {
              phase: 3,
              name: "Optimization",
              description: "Infrastructure and process improvements",
              opportunities: lowConf.map((o) => ({ rank: o.rank, title: o.name })),
              estimatedDuration: "8-12 weeks",
            },
          ]
        : []),
    ],
  };
}

export async function runAssessment(
  params: { sessionId: string; userId: string },
  supabase: any
): Promise<OpportunityMap> {
  const { sessionId, userId } = params;

  if (!supabase || !supabase.from) {
    return sampleOpportunityMap;
  }

  try {
    const answers = await fetchAnswers(sessionId, supabase);

    const departments = determineDepartments(answers);
    const opportunities: Opportunity[] = [];

    for (let i = 0; i < departments.length; i++) {
      const opp = buildOpportunityFromAnswers(answers, departments[i], i + 1);
      if (opp) {
        opportunities.push(opp);
      }
    }

    if (opportunities.length === 0) {
      const genericOpp = buildOpportunityFromAnswers(
        answers,
        departments[0] || "Operations",
        1
      );
      if (genericOpp) {
        opportunities.push(genericOpp);
      }
    }

    const map: OpportunityMap = {
      mapId: generateId(),
      companyName: "Your Organization",
      generatedAt: now(),
      isExample: false,
      executiveSummary: buildExecutiveSummary(opportunities),
      rankings: opportunities,
      implementationSequencing: buildImplementationSequencing(opportunities),
    };

    return map;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("Failed to fetch")) {
      return sampleOpportunityMap;
    }
    throw err;
  }
}

export function generateBlueprint(opportunity: any): ImplementationBlueprint {
  const dept = opportunity?.department || "Operations";
  const name = opportunity?.name || "workflow";
  const problem = opportunity?.businessProblem || "Manual process inefficiency";
  const intervention = opportunity?.intervention || {};

  return {
    problem,
    rootCause: opportunity?.rootCause || "No automated solution exists",
    recommendedIntervention: {
      type: intervention.type || "Hybrid",
      title: intervention.title || `${name} solution`,
      description: intervention.description || `Implementation blueprint for ${name}`,
      businessCase: intervention.businessCase || "Efficiency improvement and cost reduction",
      expectedImpact: intervention.expectedImpact || "Significant operational improvement",
      timeToValue: intervention.timeToValue || "6-8 weeks",
      implementationEffort: intervention.implementationEffort || "Medium",
      confidence: intervention.confidence || "Medium",
      humanOversight: intervention.humanOversight || "Human-in-the-loop",
      evidence: intervention.evidence || [],
      assumptions: intervention.assumptions || [],
      comparedPaths: intervention.comparedPaths || [],
      rejectionRationale: intervention.rejectionRationale || "Recommended approach provides optimal balance",
    },
    alternativesConsidered: "AI automation, Rule-based software, Process redesign, Manual process, Hybrid approach, No action",
    whyThisPathWon: "Provides the optimal balance of implementation feasibility, risk, and expected impact.",
    currentWorkflow: ["Manual data entry", "Email-based communication", "Spreadsheet tracking"],
    futureWorkflow: ["Automated data capture", "System-integrated communication", "Real-time dashboard"],
    requiredSystems: ["CRM or workflow management system", "Integration middleware", "Reporting dashboard"],
    requiredApis: ["REST API for system integration", "Webhook endpoints for event-driven workflows"],
    requiredData: ["Historical workflow data", "Current process metrics", "User feedback data"],
    humanRoles: ["Process owner for oversight", "System administrator for maintenance", "End users for execution"],
    securityAndPrivacy: ["Role-based access control", "Data encryption in transit and at rest", "Audit logging"],
    rolloutPlan: ["Phase 1: Assessment and design (2 weeks)", "Phase 2: Development and integration (4 weeks)", "Phase 3: Testing and validation (2 weeks)", "Phase 4: Rollout and training (2 weeks)", "Phase 5: Monitoring and optimization (ongoing)"],
    successMetrics: ["Processing time reduction", "Error rate reduction", "User satisfaction score", "ROI achieved"],
    risksAndAssumptions: ["Team adoption may face resistance", "Integration complexity may be underestimated", "Data quality may require cleanup"],
    expectedImpact: intervention.expectedImpact || "30-50% efficiency improvement in the targeted workflow",
    technicalEscalationLevel: "Department lead with IT support",
    sections: [
      { heading: "Current State Analysis", content: `Analysis of current ${name} process in ${dept}.` },
      { heading: "Solution Architecture", content: `Technical architecture for implementing ${intervention.type || "automation"} solution.` },
      { heading: "Implementation Plan", content: "Phased rollout approach with clear milestones." },
      { heading: "Risk Assessment", content: "Identified risks and mitigation strategies." },
      { heading: "Success Criteria", content: "Measurable KPIs to validate intervention success." },
    ],
  };
}

export function compareInterventions(opportunity: any): InterventionRecommendation & { alternatives: ComparedPath[] } {
  const intervention = opportunity?.intervention || {};

  return {
    type: intervention.type || "Hybrid",
    title: intervention.title || "Recommended intervention",
    description: intervention.description || "Analysis of intervention options for this opportunity",
    businessCase: intervention.businessCase || "Business case for intervention",
    expectedImpact: intervention.expectedImpact || "Expected impact description",
    timeToValue: intervention.timeToValue || "6-8 weeks",
    implementationEffort: intervention.implementationEffort || "Medium",
    confidence: intervention.confidence || "Medium",
    humanOversight: intervention.humanOversight || "Human-in-the-loop",
    evidence: intervention.evidence || [],
    assumptions: intervention.assumptions || [],
    comparedPaths: intervention.comparedPaths || [],
    rejectionRationale: intervention.rejectionRationale || "",
    alternatives: (intervention.comparedPaths || []).filter((p: ComparedPath) => p.rejectionReason),
  };
}

export const sampleOpportunityMap: OpportunityMap = {
  mapId: "sample-001",
  companyName: "Acme SaaS Corp",
  generatedAt: "2026-06-15T10:30:00Z",
  isExample: true,
  executiveSummary: {
    headline: "5 opportunities identified across 4 departments",
    finding: "Acme has significant intervention potential in Sales, Marketing, and Customer Success operations. The highest-impact opportunity is in sales lead qualification, where manual processes are causing an estimated 40% productivity loss.",
    recommendedFocus: "Hybrid AI-assisted lead qualification as the first intervention, followed by deterministic customer health scoring.",
    quickWins: 2,
    strategicValue: "Medium-term strategic value with compounding benefits as intervention maturity increases.",
    riskFlag: false,
  },
  rankings: [
    {
      rank: 1,
      department: "Sales",
      name: "Lead qualification and routing",
      businessProblem: "Sales team lacks consistent lead qualification, causing AEs to spend 60% of time on manual triage instead of selling.",
      rootCause: "No structured qualification process; leads arrive through multiple channels without standardized scoring.",
      currentImpact: "40% productivity loss, 24h+ lead response time, inconsistent follow-up.",
      confidence: "High",
      description: "Sales team lacks consistent qualification process. AEs spend 60% of time on manual data entry and lead triage.",
      intervention: {
        type: "Hybrid",
        title: "AI-assisted lead qualification with human review",
        description: "AI scores and routes leads; human AEs handle final qualification calls and relationship building.",
        businessCase: "Frees 60% of AE time currently spent on manual triage. Estimated $500K-$1.2M ARR uplift.",
        expectedImpact: "3x lead response speed, 30% more selling time, 25% conversion improvement.",
        timeToValue: "4-6 weeks",
        implementationEffort: "Medium",
        confidence: "High",
        humanOversight: "Human-in-the-loop for final qualification decisions",
        evidence: [
          { type: "user-provided", source: "Assessment response", detail: "No consistent sales qualification process", confidence: "Confirmed", timestamp: "2026-06-15" },
          { type: "user-provided", source: "Assessment response", detail: "AEs spend 60% of time on manual data entry", confidence: "Confirmed", timestamp: "2026-06-15" },
          { type: "deterministic-analysis", source: "Industry benchmark", detail: "Top-performing teams respond to leads within 5 minutes", confidence: "High" },
          { type: "ai-inference", source: "Pattern matching across 50+ orgs", detail: "Companies with structured qualification see 35% higher conversion", confidence: "Medium" },
        ],
        assumptions: [
          { assumption: "CRM contains sufficient historical data for scoring model", impact: "Medium", confidence: "High" },
          { assumption: "Sales team will adopt the new workflow", impact: "High", confidence: "Medium" },
          { assumption: "Lead volume justifies automation investment", impact: "Low", confidence: "Confirmed" },
        ],
        comparedPaths: [
          { intervention: "AI", title: "Pure AI automation", eligibility: "High", suitability: "High", expectedOutcome: "80-90% automation", effort: "Medium-High", risk: "Medium", timeToValue: "4-8 weeks", humanOversight: "Periodic review", confidence: "High", rejectionReason: "Risks false positives on complex enterprise leads" },
          { intervention: "Deterministic Software", title: "Rule-based routing", eligibility: "Medium", suitability: "Medium", expectedOutcome: "60-70% automation", effort: "Low-Medium", risk: "Low", timeToValue: "2-4 weeks", humanOversight: "Exception handling", confidence: "High", rejectionReason: "Cannot adapt to varying qualification criteria" },
          { intervention: "Process Redesign", title: "Re-engineer qualification", eligibility: "Medium", suitability: "Medium", expectedOutcome: "30-50% efficiency", effort: "Medium", risk: "Low-Medium", timeToValue: "4-12 weeks", humanOversight: "Full human control", confidence: "Medium", rejectionReason: "Does not address scaling need" },
          { intervention: "Human Work", title: "Keep current process", eligibility: "Low", suitability: "Low", expectedOutcome: "Status quo", effort: "None", risk: "Low", timeToValue: "Immediate", humanOversight: "Full human ownership", confidence: "High", rejectionReason: "Does not improve productivity" },
          { intervention: "Hybrid", title: "AI-assisted with human review", eligibility: "High", suitability: "High", expectedOutcome: "50-70% efficiency, quality maintained", effort: "Medium", risk: "Low-Medium", timeToValue: "4-6 weeks", humanOversight: "Human-in-the-loop", confidence: "High" },
          { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Current ROI does not justify deferral" },
        ],
        rejectionRationale: "Pure AI was rejected due to risk of false positives on enterprise leads. Pure software rejected due to complexity of qualification criteria. Hybrid offers best balance of automation and accuracy.",
      },
      evidence: [
        { type: "user-provided", source: "Assessment response", detail: "No consistent sales qualification process", confidence: "Confirmed", timestamp: "2026-06-15" },
        { type: "user-provided", source: "Assessment response", detail: "AEs spend 60% of time on manual data entry", confidence: "Confirmed", timestamp: "2026-06-15" },
        { type: "deterministic-analysis", source: "Industry benchmark", detail: "Top-performing teams respond within 5 minutes", confidence: "High" },
        { type: "ai-inference", source: "Pattern matching", detail: "Structured qualification correlates with 35% higher conversion", confidence: "Medium" },
      ],
      assumptions: [
        { assumption: "CRM contains sufficient historical data", impact: "Medium", confidence: "High" },
        { assumption: "Sales team will adopt new workflow", impact: "High", confidence: "Medium" },
        { assumption: "Lead volume justifies investment", impact: "Low", confidence: "Confirmed" },
      ],
      comparedPaths: [
        { intervention: "AI", title: "Pure AI automation", eligibility: "High", suitability: "High", expectedOutcome: "80-90% automation", effort: "Medium-High", risk: "Medium", timeToValue: "4-8 weeks", humanOversight: "Periodic review", confidence: "High", rejectionReason: "Risks false positives on complex enterprise leads" },
        { intervention: "Deterministic Software", title: "Rule-based routing", eligibility: "Medium", suitability: "Medium", expectedOutcome: "60-70% automation", effort: "Low-Medium", risk: "Low", timeToValue: "2-4 weeks", humanOversight: "Exception handling", confidence: "High", rejectionReason: "Cannot adapt to varying qualification criteria" },
        { intervention: "Process Redesign", title: "Re-engineer qualification", eligibility: "Medium", suitability: "Medium", expectedOutcome: "30-50% efficiency", effort: "Medium", risk: "Low-Medium", timeToValue: "4-12 weeks", humanOversight: "Full human control", confidence: "Medium", rejectionReason: "Does not address scaling need" },
        { intervention: "Human Work", title: "Keep current process", eligibility: "Low", suitability: "Low", expectedOutcome: "Status quo", effort: "None", risk: "Low", timeToValue: "Immediate", humanOversight: "Full human ownership", confidence: "High", rejectionReason: "Does not improve productivity" },
        { intervention: "Hybrid", title: "AI-assisted with human review", eligibility: "High", suitability: "High", expectedOutcome: "50-70% efficiency, quality maintained", effort: "Medium", risk: "Low-Medium", timeToValue: "4-6 weeks", humanOversight: "Human-in-the-loop", confidence: "High" },
        { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Current ROI does not justify deferral" },
      ],
      whyAlternativesRejected: "Pure AI risks false positives on complex enterprise leads. Pure software cannot adapt to varying qualification criteria. Human-only work does not scale.",
      tradeoff: "Requires CRM integration and initial scoring model training.",
      businessImpact: { description: "Estimated 30% increase in AE productivity and 25% improvement in lead conversion.", impactType: "Revenue", estimatedImpact: "$500K\u2013$1.2M ARR uplift" },
      risks: [{ risk: "Model accuracy may be low initially", category: "Technical", likelihood: "Medium", impact: "Medium", mitigation: "Start with hybrid approach: model + human review" }],
      dependencies: [{ dependency: "CRM API access", type: "System", required: true, status: "Available" }],
    },
    {
      rank: 2,
      department: "Customer Success",
      name: "Customer health scoring",
      businessProblem: "CS team cannot identify at-risk accounts before they churn.",
      rootCause: "No automated health scoring; health signals are scattered across tools.",
      currentImpact: "30+ day detection time, 80% of at-risk accounts identified too late.",
      confidence: "High",
      description: "Customer Success team lacks automated health scoring, making it difficult to identify at-risk accounts before they churn.",
      intervention: {
        type: "Deterministic Software",
        title: "Rule-based customer health scoring system",
        description: "Deterministic scoring system that aggregates usage data, support tickets, and NPS signals to flag at-risk accounts.",
        businessCase: "Reduces churn through earlier intervention. Preserves $300K-$600K ARR annually.",
        expectedImpact: "15-20% churn reduction, 4x faster at-risk detection",
        timeToValue: "2-4 weeks",
        implementationEffort: "Low-Medium",
        confidence: "High",
        humanOversight: "CS team reviews alerts and executes outreach",
        evidence: [
          { type: "user-provided", source: "Assessment response", detail: "No automated health scoring system", confidence: "Confirmed", timestamp: "2026-06-15" },
          { type: "user-provided", source: "Assessment response", detail: "Proactive outreach only 20% of accounts", confidence: "Confirmed", timestamp: "2026-06-15" },
          { type: "deterministic-analysis", source: "Usage data analysis", detail: "Usage drop >30% predicts churn with 80% accuracy", confidence: "High" },
        ],
        assumptions: [
          { assumption: "Product usage data is available via API", impact: "High", confidence: "High" },
          { assumption: "CS team has capacity to act on alerts", impact: "Medium", confidence: "Medium" },
        ],
        comparedPaths: [
          { intervention: "AI", title: "AI health scoring", eligibility: "Medium", suitability: "Medium", expectedOutcome: "80-90% accuracy", effort: "High", risk: "Medium", timeToValue: "8-12 weeks", humanOversight: "Periodic review", confidence: "Medium", rejectionReason: "Over-engineered for this use case" },
          { intervention: "Deterministic Software", title: "Rule-based scoring", eligibility: "High", suitability: "High", expectedOutcome: "70-80% accuracy, transparent", effort: "Low-Medium", risk: "Low", timeToValue: "2-4 weeks", humanOversight: "CS team reviews alerts", confidence: "High" },
          { intervention: "Process Redesign", title: "Manual health review process", eligibility: "Medium", suitability: "Low", expectedOutcome: "10-20% improvement", effort: "Low", risk: "Low", timeToValue: "1-2 weeks", humanOversight: "Full human control", confidence: "Medium", rejectionReason: "Does not add automation" },
          { intervention: "Human Work", title: "Keep current process", eligibility: "Low", suitability: "Low", expectedOutcome: "Status quo", effort: "None", risk: "Low", timeToValue: "Immediate", humanOversight: "Full human ownership", confidence: "High", rejectionReason: "Most at-risk accounts missed" },
          { intervention: "Hybrid", title: "AI-assisted health scoring", eligibility: "High", suitability: "Medium", expectedOutcome: "85-90% accuracy", effort: "Medium-High", risk: "Medium", timeToValue: "6-10 weeks", humanOversight: "Human-in-the-loop", confidence: "Medium", rejectionReason: "Adds unnecessary complexity" },
          { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Churn risk too high to defer" },
        ],
        rejectionRationale: "AI scoring was rejected \u2014 deterministic rules are sufficient and more transparent for this use case. Process redesign alone would not add automation. Hybrid adds unnecessary complexity.",
      },
      evidence: [
        { type: "user-provided", source: "Assessment response", detail: "No automated health scoring system", confidence: "Confirmed", timestamp: "2026-06-15" },
        { type: "user-provided", source: "Assessment response", detail: "Proactive outreach only 20% of accounts", confidence: "Confirmed", timestamp: "2026-06-15" },
        { type: "deterministic-analysis", source: "Usage data analysis", detail: "Usage drop >30% predicts churn with 80% accuracy", confidence: "High" },
      ],
      assumptions: [
        { assumption: "Product usage data is available via API", impact: "High", confidence: "High" },
        { assumption: "CS team has capacity to act on alerts", impact: "Medium", confidence: "Medium" },
      ],
      comparedPaths: [
        { intervention: "AI", title: "AI health scoring", eligibility: "Medium", suitability: "Medium", expectedOutcome: "80-90% accuracy", effort: "High", risk: "Medium", timeToValue: "8-12 weeks", humanOversight: "Periodic review", confidence: "Medium", rejectionReason: "Over-engineered for this use case" },
        { intervention: "Deterministic Software", title: "Rule-based scoring", eligibility: "High", suitability: "High", expectedOutcome: "70-80% accuracy, transparent", effort: "Low-Medium", risk: "Low", timeToValue: "2-4 weeks", humanOversight: "CS team reviews alerts", confidence: "High" },
        { intervention: "Process Redesign", title: "Manual health review process", eligibility: "Medium", suitability: "Low", expectedOutcome: "10-20% improvement", effort: "Low", risk: "Low", timeToValue: "1-2 weeks", humanOversight: "Full human control", confidence: "Medium", rejectionReason: "Does not add automation" },
        { intervention: "Human Work", title: "Keep current process", eligibility: "Low", suitability: "Low", expectedOutcome: "Status quo", effort: "None", risk: "Low", timeToValue: "Immediate", humanOversight: "Full human ownership", confidence: "High", rejectionReason: "Most at-risk accounts missed" },
        { intervention: "Hybrid", title: "AI-assisted health scoring", eligibility: "High", suitability: "Medium", expectedOutcome: "85-90% accuracy", effort: "Medium-High", risk: "Medium", timeToValue: "6-10 weeks", humanOversight: "Human-in-the-loop", confidence: "Medium", rejectionReason: "Adds unnecessary complexity" },
        { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Churn risk too high to defer" },
      ],
      whyAlternativesRejected: "AI scoring is unnecessary for this use case. Process redesign alone adds no automation. Hybrid adds complexity without benefit.",
      tradeoff: "Requires product usage data integration.",
      businessImpact: { description: "Expected 15-20% reduction in churn rate through earlier intervention.", impactType: "Revenue", estimatedImpact: "$300K\u2013$600K ARR preserved" },
    },
    {
      rank: 3,
      department: "Marketing",
      name: "Email campaign personalization",
      businessProblem: "Email campaigns are basic mail merges with low engagement.",
      rootCause: "No audience segmentation or dynamic content capabilities in current ESP setup.",
      currentImpact: "2.1% conversion rate vs. 5%+ industry benchmark.",
      confidence: "Medium",
      description: "Email campaigns are basic mail merges with limited personalization, resulting in lower engagement.",
      intervention: {
        type: "Process Redesign",
        title: "Segmented campaign workflow redesign",
        description: "Re-engineer email workflows to use audience segmentation, behavioral triggers, and A/B testing.",
        businessCase: "Improves conversion without AI investment. Moderate effort, proven methodology.",
        expectedImpact: "2-3x conversion improvement through segmentation and testing",
        timeToValue: "4-8 weeks",
        implementationEffort: "Medium",
        confidence: "Medium",
        humanOversight: "Marketing team manages segments and content",
        evidence: [
          { type: "user-provided", source: "Assessment response", detail: "Email campaigns are basic mail merge", confidence: "Confirmed", timestamp: "2026-06-15" },
          { type: "deterministic-analysis", source: "Campaign analytics", detail: "Current conversion rate is 2.1% across all segments", confidence: "High" },
          { type: "ai-inference", source: "Industry benchmark comparison", detail: "Personalized campaigns see 2-3x higher conversion", confidence: "Medium" },
        ],
        assumptions: [
          { assumption: "ESP supports segmentation and dynamic content", impact: "High", confidence: "Medium" },
          { assumption: "Sufficient audience data exists for meaningful segments", impact: "Medium", confidence: "High" },
        ],
        comparedPaths: [
          { intervention: "AI", title: "AI personalization engine", eligibility: "Medium", suitability: "Medium", expectedOutcome: "3-5x conversion", effort: "High", risk: "Medium-High", timeToValue: "8-16 weeks", humanOversight: "Periodic review", confidence: "Low", rejectionReason: "Premature \u2014 process gains available without AI" },
          { intervention: "Deterministic Software", title: "ESP upgrade with rules", eligibility: "High", suitability: "Medium", expectedOutcome: "1.5-2x conversion", effort: "Medium", risk: "Low", timeToValue: "4-8 weeks", humanOversight: "Marketing team manages", confidence: "Medium", rejectionReason: "Software alone insufficient without workflow change" },
          { intervention: "Process Redesign", title: "Segmented workflow redesign", eligibility: "High", suitability: "High", expectedOutcome: "2-3x conversion", effort: "Medium", risk: "Low-Medium", timeToValue: "4-8 weeks", humanOversight: "Full human control", confidence: "Medium" },
          { intervention: "Human Work", title: "Manual segmentation", eligibility: "Medium", suitability: "Low", expectedOutcome: "1.2-1.5x conversion", effort: "Low", risk: "Low", timeToValue: "1-2 weeks", humanOversight: "Full human ownership", confidence: "Medium", rejectionReason: "Does not scale" },
          { intervention: "Hybrid", title: "AI-assisted campaign creation", eligibility: "Medium", suitability: "Medium", expectedOutcome: "3-4x conversion", effort: "Medium-High", risk: "Medium", timeToValue: "8-12 weeks", humanOversight: "Human-in-the-loop", confidence: "Medium", rejectionReason: "Premature \u2014 process gains available first" },
          { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Clear improvement opportunity exists" },
        ],
        rejectionRationale: "AI personalization was rejected \u2014 process redesign achieves significant gains without AI complexity. Software alone insufficient without workflow change.",
      },
      evidence: [
        { type: "user-provided", source: "Assessment response", detail: "Email campaigns are basic mail merge", confidence: "Confirmed", timestamp: "2026-06-15" },
        { type: "deterministic-analysis", source: "Campaign analytics", detail: "Current conversion rate is 2.1%", confidence: "High" },
        { type: "ai-inference", source: "Industry benchmark", detail: "Personalized campaigns see 2-3x higher conversion", confidence: "Medium" },
      ],
      assumptions: [
        { assumption: "ESP supports segmentation and dynamic content", impact: "High", confidence: "Medium" },
        { assumption: "Sufficient audience data exists for meaningful segments", impact: "Medium", confidence: "High" },
      ],
      comparedPaths: [
        { intervention: "AI", title: "AI personalization engine", eligibility: "Medium", suitability: "Medium", expectedOutcome: "3-5x conversion", effort: "High", risk: "Medium-High", timeToValue: "8-16 weeks", humanOversight: "Periodic review", confidence: "Low", rejectionReason: "Premature" },
        { intervention: "Deterministic Software", title: "ESP upgrade with rules", eligibility: "High", suitability: "Medium", expectedOutcome: "1.5-2x conversion", effort: "Medium", risk: "Low", timeToValue: "4-8 weeks", humanOversight: "Marketing manages", confidence: "Medium", rejectionReason: "Software alone insufficient" },
        { intervention: "Process Redesign", title: "Segmented workflow redesign", eligibility: "High", suitability: "High", expectedOutcome: "2-3x conversion", effort: "Medium", risk: "Low-Medium", timeToValue: "4-8 weeks", humanOversight: "Full human control", confidence: "Medium" },
        { intervention: "Human Work", title: "Manual segmentation", eligibility: "Medium", suitability: "Low", expectedOutcome: "1.2-1.5x conversion", effort: "Low", risk: "Low", timeToValue: "1-2 weeks", humanOversight: "Full human ownership", confidence: "Medium", rejectionReason: "Does not scale" },
        { intervention: "Hybrid", title: "AI-assisted campaign creation", eligibility: "Medium", suitability: "Medium", expectedOutcome: "3-4x conversion", effort: "Medium-High", risk: "Medium", timeToValue: "8-12 weeks", humanOversight: "Human-in-the-loop", confidence: "Medium", rejectionReason: "Premature" },
        { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Clear improvement opportunity exists" },
      ],
      whyAlternativesRejected: "AI personalization is premature \u2014 process redesign delivers most of the benefit with zero AI complexity.",
      tradeoff: "Requires ESP with segmentation capabilities.",
      businessImpact: { description: "Potential 2-3x improvement in email conversion rates.", impactType: "Revenue" },
    },
    {
      rank: 4,
      department: "Engineering",
      name: "CI/CD pipeline automation",
      businessProblem: "Engineering team lacks automated CI/CD, causing slow and unreliable deployments.",
      rootCause: "No investment in DevOps infrastructure; manual build and deploy process.",
      currentImpact: "Weekly deployments, 2-day cycle time, frequent manual errors.",
      confidence: "Medium",
      description: "Engineering team lacks automated CI/CD pipelines, causing slow deployment cycles.",
      intervention: {
        type: "AI",
        title: "AI-assisted CI/CD pipeline optimization",
        description: "AI-powered pipeline that analyzes build patterns, predicts failures, and optimizes test selection.",
        businessCase: "5x faster deployments, reduced manual overhead, higher code quality.",
        expectedImpact: "5x deployment frequency, <1 hour cycle time, 50% fewer build failures.",
        timeToValue: "6-10 weeks",
        implementationEffort: "Medium-High",
        confidence: "Medium",
        humanOversight: "Engineers review AI-suggested optimizations and approve deployments",
        evidence: [
          { type: "user-provided", source: "Assessment response", detail: "No CI/CD pipelines exist", confidence: "Confirmed", timestamp: "2026-06-15" },
          { type: "hypothesis", source: "Engineering best practices", detail: "AI-optimized pipelines reduce build failures by 40-60%", confidence: "Medium" },
          { type: "missing", source: "No pipeline telemetry available", detail: "Cannot measure current build failure rate precisely", confidence: "Unknown" },
        ],
        assumptions: [
          { assumption: "Engineering team has capacity to set up CI/CD foundation", impact: "High", confidence: "Medium" },
          { assumption: "Build patterns are consistent enough for AI to optimize", impact: "Medium", confidence: "Low" },
          { assumption: "Team will adopt AI-suggested optimizations", impact: "Medium", confidence: "Medium" },
        ],
        comparedPaths: [
          { intervention: "AI", title: "AI-assisted pipeline optimization", eligibility: "Medium", suitability: "High", expectedOutcome: "5x speed, predictive failure detection", effort: "Medium-High", risk: "Medium", timeToValue: "6-10 weeks", humanOversight: "Engineers review and approve", confidence: "Medium" },
          { intervention: "Deterministic Software", title: "Standard CI/CD setup", eligibility: "High", suitability: "Medium", expectedOutcome: "3x speed, consistent builds", effort: "Medium", risk: "Low", timeToValue: "4-6 weeks", humanOversight: "Engineers manage", confidence: "High", rejectionReason: "Cannot predict or prevent failures" },
          { intervention: "Process Redesign", title: "Manual process improvement", eligibility: "Medium", suitability: "Low", expectedOutcome: "1.5-2x speed", effort: "Low", risk: "Low", timeToValue: "2-4 weeks", humanOversight: "Full human control", confidence: "Medium", rejectionReason: "Cannot achieve order-of-magnitude improvement" },
          { intervention: "Human Work", title: "Keep current process", eligibility: "Low", suitability: "Low", expectedOutcome: "Status quo", effort: "None", risk: "Low", timeToValue: "Immediate", humanOversight: "Full human ownership", confidence: "High", rejectionReason: "Not acceptable \u2014 bottleneck is growing" },
          { intervention: "Hybrid", title: "CI/CD + AI recommendations", eligibility: "High", suitability: "Medium", expectedOutcome: "4x speed, AI-suggested improvements", effort: "Medium-High", risk: "Low-Medium", timeToValue: "6-10 weeks", humanOversight: "Human-in-the-loop", confidence: "Medium", rejectionReason: "More complex than needed" },
          { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Bottleneck is actively slowing product delivery" },
        ],
        rejectionRationale: "Process redesign insufficient \u2014 manual processes are the bottleneck. Deterministic software cannot handle complex build optimization. AI is the right tool for pattern-based optimization.",
      },
      evidence: [
        { type: "user-provided", source: "Assessment response", detail: "No CI/CD pipelines exist", confidence: "Confirmed", timestamp: "2026-06-15" },
        { type: "hypothesis", source: "Engineering best practices", detail: "AI-optimized pipelines reduce build failures by 40-60%", confidence: "Medium" },
        { type: "missing", source: "No pipeline telemetry", detail: "Cannot measure current build failure rate", confidence: "Unknown" },
      ],
      assumptions: [
        { assumption: "Engineering team has capacity to set up CI/CD foundation", impact: "High", confidence: "Medium" },
        { assumption: "Build patterns are consistent enough for AI to optimize", impact: "Medium", confidence: "Low" },
      ],
      comparedPaths: [
        { intervention: "AI", title: "AI-assisted pipeline optimization", eligibility: "Medium", suitability: "High", expectedOutcome: "5x speed, predictive failure detection", effort: "Medium-High", risk: "Medium", timeToValue: "6-10 weeks", humanOversight: "Engineers review and approve", confidence: "Medium" },
        { intervention: "Deterministic Software", title: "Standard CI/CD setup", eligibility: "High", suitability: "Medium", expectedOutcome: "3x speed, consistent builds", effort: "Medium", risk: "Low", timeToValue: "4-6 weeks", humanOversight: "Engineers manage", confidence: "High", rejectionReason: "Cannot predict or prevent failures" },
        { intervention: "Process Redesign", title: "Manual process improvement", eligibility: "Medium", suitability: "Low", expectedOutcome: "1.5-2x speed", effort: "Low", risk: "Low", timeToValue: "2-4 weeks", humanOversight: "Full human control", confidence: "Medium", rejectionReason: "Cannot achieve order-of-magnitude improvement" },
        { intervention: "Human Work", title: "Keep current process", eligibility: "Low", suitability: "Low", expectedOutcome: "Status quo", effort: "None", risk: "Low", timeToValue: "Immediate", humanOversight: "Full human ownership", confidence: "High", rejectionReason: "Not acceptable" },
        { intervention: "Hybrid", title: "CI/CD + AI recommendations", eligibility: "High", suitability: "Medium", expectedOutcome: "4x speed, AI-suggested improvements", effort: "Medium-High", risk: "Low-Medium", timeToValue: "6-10 weeks", humanOversight: "Human-in-the-loop", confidence: "Medium", rejectionReason: "More complex than needed" },
        { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Bottleneck is actively slowing product delivery" },
      ],
      whyAlternativesRejected: "Process redesign alone cannot achieve the speed gains needed. Deterministic CI/CD helps but cannot predict or prevent failures.",
      tradeoff: "Requires significant upfront engineering investment.",
      businessImpact: { description: "Estimated 5x improvement in deployment frequency and reliability.", impactType: "Efficiency" },
    },
    {
      rank: 5,
      department: "Operations",
      name: "Cross-functional process documentation",
      businessProblem: "No centralized process documentation causes coordination issues across departments.",
      rootCause: "Process knowledge is tribal; no documentation standard or ownership.",
      currentImpact: "Slow onboarding, repeated mistakes, cross-functional friction.",
      confidence: "Low",
      description: "Operations lacks centralized process documentation, causing coordination issues across departments.",
      intervention: {
        type: "Human Work",
        title: "Process documentation initiative",
        description: "Structured human-led initiative to document key processes, establish ownership, and create a single source of truth.",
        businessCase: "Reduces onboarding time, eliminates repeated mistakes, improves cross-functional coordination.",
        expectedImpact: "Improved coordination, reduced onboarding time, fewer repeated errors.",
        timeToValue: "8-12 weeks",
        implementationEffort: "Medium (organizational)",
        confidence: "Low",
        humanOversight: "Full human ownership \u2014 Operations team leads documentation",
        evidence: [
          { type: "user-provided", source: "Assessment response", detail: "No centralized process documentation", confidence: "Confirmed", timestamp: "2026-06-15" },
          { type: "deterministic-analysis", source: "Org audit", detail: "Knowledge is tribal \u2014 no single source of truth exists", confidence: "High" },
        ],
        assumptions: [
          { assumption: "Department heads will allocate time for documentation", impact: "High", confidence: "Medium" },
          { assumption: "Documentation will be maintained after creation", impact: "Medium", confidence: "Low" },
        ],
        comparedPaths: [
          { intervention: "AI", title: "AI process extraction", eligibility: "Low", suitability: "Low", expectedOutcome: "Unreliable \u2014 AI cannot observe tribal knowledge", effort: "High", risk: "High", timeToValue: "N/A", humanOversight: "Full review needed", confidence: "Low", rejectionReason: "AI cannot document knowledge it cannot observe" },
          { intervention: "Deterministic Software", title: "Documentation tooling", eligibility: "High", suitability: "Medium", expectedOutcome: "Better organization, same content", effort: "Low", risk: "Low", timeToValue: "1-2 weeks", humanOversight: "Team populates content", confidence: "Medium", rejectionReason: "Tool alone cannot create content" },
          { intervention: "Process Redesign", title: "Re-engineer processes first", eligibility: "Medium", suitability: "Low", expectedOutcome: "Better processes, still undocumented", effort: "High", risk: "Medium", timeToValue: "12-20 weeks", humanOversight: "Full human control", confidence: "Low", rejectionReason: "Cannot redesign undocumented processes" },
          { intervention: "Human Work", title: "Structured documentation initiative", eligibility: "High", suitability: "High", expectedOutcome: "Complete process map, clear ownership", effort: "Medium", risk: "Low", timeToValue: "8-12 weeks", humanOversight: "Full human ownership", confidence: "Low" },
          { intervention: "Hybrid", title: "AI-assisted documentation", eligibility: "Low", suitability: "Medium", expectedOutcome: "Partially automated, needs heavy review", effort: "Medium-High", risk: "Medium", timeToValue: "8-12 weeks", humanOversight: "Heavy human review", confidence: "Low", rejectionReason: "AI quality insufficient for this task" },
          { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Current ROI does not justify intervention" },
        ],
        rejectionRationale: "AI cannot document tribal knowledge it cannot observe. Software cannot replace human process understanding. Human work is the only viable starting point.",
      },
      evidence: [
        { type: "user-provided", source: "Assessment response", detail: "No centralized process documentation", confidence: "Confirmed", timestamp: "2026-06-15" },
        { type: "deterministic-analysis", source: "Org audit", detail: "Knowledge is tribal \u2014 no single source of truth", confidence: "High" },
      ],
      assumptions: [
        { assumption: "Department heads will allocate time for documentation", impact: "High", confidence: "Medium" },
        { assumption: "Documentation will be maintained after creation", impact: "Medium", confidence: "Low" },
      ],
      comparedPaths: [
        { intervention: "AI", title: "AI process extraction", eligibility: "Low", suitability: "Low", expectedOutcome: "Unreliable", effort: "High", risk: "High", timeToValue: "N/A", humanOversight: "Full review needed", confidence: "Low", rejectionReason: "AI cannot observe tribal knowledge" },
        { intervention: "Deterministic Software", title: "Documentation tooling", eligibility: "High", suitability: "Medium", expectedOutcome: "Better organization", effort: "Low", risk: "Low", timeToValue: "1-2 weeks", humanOversight: "Team populates content", confidence: "Medium", rejectionReason: "Tool alone cannot create content" },
        { intervention: "Process Redesign", title: "Re-engineer first", eligibility: "Medium", suitability: "Low", expectedOutcome: "Better processes, undocumented", effort: "High", risk: "Medium", timeToValue: "12-20 weeks", humanOversight: "Full human control", confidence: "Low", rejectionReason: "Cannot redesign undocumented process" },
        { intervention: "Human Work", title: "Documentation initiative", eligibility: "High", suitability: "High", expectedOutcome: "Complete process map", effort: "Medium", risk: "Low", timeToValue: "8-12 weeks", humanOversight: "Full human ownership", confidence: "Low" },
        { intervention: "Hybrid", title: "AI-assisted documentation", eligibility: "Low", suitability: "Medium", expectedOutcome: "Partially automated", effort: "Medium-High", risk: "Medium", timeToValue: "8-12 weeks", humanOversight: "Heavy human review", confidence: "Low", rejectionReason: "AI quality insufficient" },
        { intervention: "No Action", title: "No intervention now", eligibility: "N/A", suitability: "N/A", expectedOutcome: "Status quo", effort: "None", risk: "None", timeToValue: "N/A", humanOversight: "N/A", confidence: "High", rejectionReason: "Problem is manageable for now" },
      ],
      whyAlternativesRejected: "AI cannot document knowledge it cannot observe. Software cannot replace human process understanding. Process redesign is premature without first documenting current state.",
      tradeoff: "Primarily a process and culture change. Lowest technical complexity.",
      businessImpact: { description: "Improved cross-functional coordination and reduced onboarding time.", impactType: "Efficiency" },
    },
  ],
  implementationSequencing: {
    strategy: "Start with high-confidence, high-impact interventions that demonstrate value before tackling more complex initiatives.",
    strategyRationale: "Lead qualification and customer health scoring provide quick wins with measurable ROI.",
    phases: [
      {
        phase: 1,
        name: "Foundation",
        description: "High-impact, quick-win interventions",
        opportunities: [{ rank: 1, title: "Lead qualification and routing" }, { rank: 2, title: "Customer health scoring" }],
        estimatedDuration: "6-8 weeks",
      },
      {
        phase: 2,
        name: "Scaling",
        description: "Expand intervention to additional departments",
        opportunities: [{ rank: 3, title: "Email campaign personalization" }],
        estimatedDuration: "4-6 weeks",
        gates: [{ gate: "Phase 1 ROI review", criteria: ">=80% of projected impact achieved" }],
      },
      {
        phase: 3,
        name: "Optimization",
        description: "Infrastructure and process improvements",
        opportunities: [{ rank: 4, title: "CI/CD pipeline automation" }, { rank: 5, title: "Process documentation" }],
        estimatedDuration: "8-10 weeks",
        gates: [{ gate: "Engineering readiness", criteria: "Team capacity allocated" }],
      },
    ],
  },
  crossOpportunityDependencies: [
    { fromRank: 1, toRank: 3, relationship: "Data sharing", description: "Lead data can inform marketing campaigns", critical: false },
  ],
};
