export type Tier = 1 | 2 | 3 | 4;
export type Recommendation = "build_now" | "validate_next" | "defer" | "do_not_pursue";

export interface DimensionResult {
  score: number;
  maxScore: number;
  label: "pass" | "conditional" | "fail";
  details: string[];
}

export interface OpportunityConfidence {
  level: "Confirmed" | "High" | "Medium" | "Low";
  score: number;
  dimensions: {
    sourceAuthority: number;
    dataFreshness: number;
    directness: number;
    consistency: number;
    specificity: number;
  };
  reasoning: string[];
}

export interface EvidenceRecord {
  id: string;
  type: string;
  evidenceClass: string;
  sourceUri?: string;
  sourceLabel: string;
  content: string;
  observedAt?: string;
  confidence: number;
  freshness?: number;
  reliability?: number;
  metadata?: Record<string, unknown>;
}

export interface OpportunityCandidate {
  id: string;
  blueprintId?: string;
  title: string;
  problemStatement: string;
  targetWorkflow: string;
  department: string;
  businessObjective: string;
  proposedSystemType: string;
  detectedSignals: string[];
  requiredCapabilities: string[];
  dependencies: string[];
  risks: string[];
  evidenceIds: string[];
  candidateSource: "blueprint" | "composite" | "custom";
}

export interface RankedOpportunity {
  candidate: OpportunityCandidate;
  tier: Tier;
  sequence: number;
  recommendation: Recommendation;
  feasibility: DimensionResult;
  businessLeverage: DimensionResult;
  implementationReadiness: DimensionResult;
  strategicAlignment: DimensionResult;
  confidence: OpportunityConfidence;
  evidenceIds: string[];
  dependencies: string[];
  disqualifiers: string[];
  reasoningTraceId: string;
}

export interface PipelineMap {
  mapId: string;
  companyName: string;
  assessmentSessionId: string;
  generatedAt: string;
  pipelineVersion: string;
  executiveSummary: {
    headline: string;
    finding: string;
    recommendedFocus: string;
    quickWins: number;
    strategicValue?: string;
  };
  opportunities: RankedOpportunity[];
  implementationSequencing: {
    strategy: string;
    strategyRationale: string;
    phases: {
      phase: number;
      name: string;
      description: string;
      opportunityIds: string[];
      estimatedDuration: string;
    }[];
  };
  evidence: EvidenceRecord[];
  generationMetadata: Record<string, unknown>;
}

export interface EnrichedOpportunity extends RankedOpportunity {
  estimatedHoursLost?: number;
  estimatedBusinessImpact?: string;
  expectedTimeToValue?: string;
  implementationComplexity?: string;
  primaryKpi?: string;
  recommendedSystemType?: string;
  currentWorkflow?: string;
  implementationBlueprint?: string;
  estimatedSavings?: string;
  currentCost?: string;
  risk?: string;
  businessOwner?: string;
  status?: "not_started" | "evaluating" | "implementing" | "completed" | "measured";
}

export interface EnrichedOpportunityMap extends Omit<PipelineMap, "opportunities"> {
  opportunities: EnrichedOpportunity[];
  whyNot?: EnrichedOpportunity[];
  organizationalIntelligence?: OrganizationalProfile;
}

export interface OrganizationalProfile {
  decisionVelocity: { score: number; label: string; description: string };
  knowledgeFragmentation: { score: number; label: string; description: string };
  workflowStandardization: { score: number; label: string; description: string };
  aiReadiness: { score: number; label: string; description: string };
  automationMaturity: { score: number; label: string; description: string };
  documentationQuality: { score: number; label: string; description: string };
  crossFunctionalCoordination: { score: number; label: string; description: string };
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

export interface ImplementationOption {
  label: string;
  description: string;
}
