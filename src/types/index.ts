export type QuestionType = "boolean" | "scale" | "multi-choice" | "open";

export interface Question {
  id: number;
  section: string;
  question: string;
  type: QuestionType;
  options?: string[];
}

export interface Answer {
  questionId: number;
  value: string | number | boolean;
}

export interface Evidence {
  type: "User" | "Research" | "Inference";
  source: string;
  detail: string;
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
  department: string;
  name: string;
  confidence: "High" | "Medium" | "Low";
  description: string;
  kpis: KPI[];
  phases: Phase[];
  evidence: Evidence[];
  tradeoff: string;
}

export interface AssessmentSession {
  currentQuestion: number;
  answers: Answer[];
  completed: boolean;
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
