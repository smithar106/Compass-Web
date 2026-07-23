export type QuestionType = "boolean" | "scale" | "multi-choice" | "open";

export type ConfidenceLevel = "Confirmed" | "High" | "Medium" | "Low" | "Unknown";

export type EvidenceClass = "User" | "Research" | "Inference";

export type EvidenceSourceType =
  | "user-provided"
  | "deterministic-analysis"
  | "external-research"
  | "ai-inference"
  | "hypothesis"
  | "missing";

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

export type BusinessModel = "SaaS" | "Usage-based" | "Hybrid" | "Marketplace" | "Other";

export type CustomerSegment = "SMB" | "Mid-Market" | "Enterprise";

export type RevenueStage = "Seed" | "Series A" | "Series B" | "Series C" | "Growth" | "Mature" | "Unknown";

export type GrowthStage = "Early" | "Scaling" | "Established" | "Mature" | "Unknown";

export type AIMaturityLevel = "None" | "Experimental" | "Adopting" | "Embedded" | "Leading";

export type TechMaturityLevel = "Legacy" | "Transitioning" | "Modern" | "Advanced";

export type OrgComplexity = "Flat" | "Hierarchical" | "Matrix";

export type ApprovalStyle = "Centralized" | "Decentralized" | "Consensus-driven" | "Founder-led" | "Unknown";

export type ImplementationDifficulty = "Low" | "Medium" | "High" | "Very High";

export type ImpactType = "Revenue" | "Cost" | "Efficiency" | "Quality" | "Compliance" | "Experience";

export type RiskCategory = "Technical" | "Organizational" | "Cultural" | "Resource" | "Compliance";

export type RiskSeverity = "Low" | "Medium" | "High" | "Critical";

export type DependencyType = "System" | "Data" | "People" | "Process" | "Approval";

export type DependencyStatus = "Available" | "Needed" | "Planned" | "Blocked";

export interface AssessmentQuestion {
  id: string;
  section: string;
  question: string;
  type: QuestionType;
  options?: string[];
  category?: string;
  chip?: boolean;
}

export interface Answer {
  questionId: string | number;
  value: string | number | boolean;
  confidence?: ConfidenceLevel;
  notes?: string;
}

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
  estimatedCost?: string;
  dataReadiness?: string;
  processReadiness?: string;
  disqualifiers?: string;
  summary?: string;
  reasonsRejected?: string[];
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
  ownership?: string;
  securityAndPrivacy: string[];
  rolloutPlan: string[];
  validationPlan?: string[];
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
  workflow?: string;
  requiredOwner?: string;
  successDescription?: string;
  technicalHelpRequired?: string;
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

export interface AssessmentSession {
  currentQuestion: number;
  answers: Answer[];
  completed: boolean;
  startedAt?: string;
  userId?: string;
  sessionId?: string;
}

export interface AssessmentSessionDB {
  id: string;
  user_id: string;
  organization_id: string | null;
  status: "in_progress" | "completed" | "abandoned";
  assessment_version: string;
  total_questions_presented: number | null;
  questions_skipped: number;
  completion_time_minutes: number | null;
  metadata: Record<string, unknown>;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  companyId: string;
  companyName: string;
  websiteUrl: string;
  identity: {
    industry: string;
    subIndustry?: string;
    businessModel: BusinessModel;
    customerSegments: CustomerSegment[];
    yearFounded?: number;
  };
  size: {
    headcountEstimate: number;
    headcountConfidence?: ConfidenceLevel;
    revenueStage: RevenueStage;
    growthStage?: GrowthStage;
  };
  aiMaturity?: { level: AIMaturityLevel; knownAiTools?: string[] };
  techMaturity?: { level: TechMaturityLevel };
  organizationalStructure?: {
    departments: { name: Department; estimatedSize?: number }[];
    orgComplexity?: OrgComplexity;
  };
}

export interface DesignPartnerFormData {
  name: string;
  email: string;
  companyName: string;
  companySize: string;
  role: string;
  linkedinUrl: string;
  currentAiInitiatives: string;
  biggestChallenge: string;
  honeypot?: string;
}

export interface DemoState {
  active: boolean;
  seeded: boolean;
  sessionId?: string;
}

export interface PipelineProgress {
  status: "idle" | "running" | "completed" | "failed";
  step?: string;
  progress?: number;
  error?: string;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}
