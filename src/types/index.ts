export type QuestionType = "boolean" | "scale" | "multi-choice" | "open";

export type ConfidenceLevel = "Confirmed" | "High" | "Medium" | "Low" | "Unknown";

export type EvidenceClass = "User" | "Research" | "Inference";

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

export interface EvidenceItem {
  type: EvidenceClass;
  source: string;
  detail: string;
  url?: string;
  timestamp?: string;
  confidence?: ConfidenceLevel;
}

export interface Question {
  id: number;
  section: Department;
  question: string;
  type: QuestionType;
  options?: string[];
}

export interface Answer {
  questionId: number;
  value: string | number | boolean;
  confidence?: ConfidenceLevel;
  notes?: string;
}

export interface KPI {
  metric: string;
  current: string;
  target: string;
}

export interface Phase {
  phase: string;
  steps: string[];
  duration: string;
  dependencies: string[];
}

export interface Opportunity {
  rank: number;
  department: Department;
  name: string;
  confidence: ConfidenceLevel;
  description: string;
  kpis: KPI[];
  phases: Phase[];
  evidence: EvidenceItem[];
  tradeoff: string;
  businessImpact?: {
    description: string;
    impactType: ImpactType;
    estimatedImpact?: string;
  };
  risks?: {
    risk: string;
    category: RiskCategory;
    likelihood: RiskSeverity;
    impact: RiskSeverity;
    mitigation?: string;
  }[];
  dependencies?: {
    dependency: string;
    type: DependencyType;
    required: boolean;
    status: DependencyStatus;
  }[];
}

export interface OpportunityMap {
  mapId: string;
  companyName: string;
  generatedAt: string;
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
  aiMaturity?: {
    level: AIMaturityLevel;
    knownAiTools?: string[];
  };
  techMaturity?: {
    level: TechMaturityLevel;
  };
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
