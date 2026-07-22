export type Tier = 1 | 2 | 3 | 4;

export type Recommendation = "build_now" | "validate_next" | "defer" | "do_not_pursue";

export type ConfidenceLevel = "Confirmed" | "High" | "Medium" | "Low" | "Unknown";

export type Department =
  | "Sales"
  | "Marketing"
  | "Customer Success"
  | "Support"
  | "Finance"
  | "Product"
  | "Engineering"
  | "People/HR"
  | "Legal"
  | "Operations";

export type InterventionType =
  | "AI"
  | "Deterministic Software"
  | "Process Redesign"
  | "Human Work"
  | "Hybrid"
  | "No Action";

export type ImpactType = "Revenue" | "Cost" | "Efficiency" | "Quality" | "Compliance" | "Experience";

export type RiskCategory = "Technical" | "Organizational" | "Cultural" | "Resource" | "Compliance";

export type RiskSeverity = "Low" | "Medium" | "High" | "Critical";

export type DependencyType = "System" | "Data" | "People" | "Process" | "Approval";

export type DependencyStatus = "Available" | "Needed" | "Planned" | "Blocked";

export type EvidenceSourceType =
  | "user-provided"
  | "deterministic-analysis"
  | "ai-inference"
  | "hypothesis"
  | "missing";

export interface EvidenceItem {
  type: EvidenceSourceType;
  source: string;
  detail: string;
  url?: string;
  timestamp?: string;
  confidence?: ConfidenceLevel;
}

export interface AssumptionItem {
  assumption: string;
  impact: string;
  confidence: ConfidenceLevel;
}

export interface ComparedPath {
  intervention: InterventionType;
  title: string;
  eligibility: string;
  suitability: string;
  expectedOutcome: string;
  effort: string;
  risk: string;
  timeToValue: string;
  humanOversight: string;
  confidence: ConfidenceLevel;
  rejectionReason?: string;
}

export interface BusinessCase {
  currentCost: string;
  estimatedSavings: string;
  expectedTimeSavings: string;
  risk: string;
  confidence: number;
  dependencies: string[];
  expectedTimeToValue: string;
  isEstimated: boolean;
}

export interface InterventionRecommendation {
  type: InterventionType;
  title: string;
  description: string;
  businessCase: string;
  expectedImpact: string;
  timeToValue: string;
  implementationEffort: string;
  confidence: ConfidenceLevel;
  humanOversight: string;
  evidence: EvidenceItem[];
  assumptions: AssumptionItem[];
  comparedPaths: ComparedPath[];
  rejectionRationale: string;
}

export interface BlueprintSection {
  heading: string;
  content: string;
  details?: string[];
  technical?: string[];
}

export interface ImplementationBlueprint {
  problem: string;
  rootCause: string;
  recommendedIntervention: InterventionRecommendation;
  alternativesConsidered: string;
  whyThisPathWon: string;
  currentWorkflow: string[];
  futureWorkflow: string[];
  requiredSystems: string[];
  requiredApis: string[];
  requiredData: string[];
  humanRoles: string[];
  securityAndPrivacy: string[];
  rolloutPlan: string[];
  successMetrics: string[];
  risksAndAssumptions: string[];
  expectedImpact: string;
  technicalEscalationLevel: string;
  sections: BlueprintSection[];
}

export interface Opportunity {
  rank: number;
  department: Department;
  name: string;
  businessProblem: string;
  rootCause: string;
  currentImpact: string;
  confidence: ConfidenceLevel;
  description: string;
  evidence: EvidenceItem[];
  assumptions: AssumptionItem[];
  comparedPaths: ComparedPath[];
  whyAlternativesRejected: string;
  intervention: InterventionRecommendation;
  blueprint?: ImplementationBlueprint;
  kpis?: { metric: string; current: string; target: string }[];
  phases?: { phase: string; steps: string[]; duration: string; dependencies: string[] }[];
  tradeoff?: string;
  businessImpact?: { description: string; impactType: ImpactType; estimatedImpact?: string };
  risks?: { risk: string; category: RiskCategory; likelihood: RiskSeverity; impact: RiskSeverity; mitigation?: string }[];
  dependencies?: { dependency: string; type: DependencyType; required: boolean; status: DependencyStatus }[];
}

export interface OpportunityMap {
  mapId: string;
  companyName: string;
  generatedAt: string;
  isExample: boolean;
  executiveSummary: {
    headline: string;
    finding: string;
    recommendedFocus: string;
    quickWins: number;
    strategicValue?: string;
    riskFlag?: boolean;
    riskSummary?: string;
  };
  rankings: Opportunity[];
  implementationSequencing: {
    strategy: string;
    strategyRationale: string;
    phases: {
      phase: number;
      name: string;
      description: string;
      opportunities: { rank: number; title: string }[];
      estimatedDuration: string;
      gates?: { gate: string; criteria: string }[];
    }[];
  };
  crossOpportunityDependencies?: {
    fromRank: number;
    toRank: number;
    relationship: string;
    description: string;
    critical: boolean;
  }[];
}
