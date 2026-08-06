import { cn } from "@/lib/utils";
import {
  DEMO_STATUS_LABELS,
  DEMO_EVIDENCE_LABELS,
  type DecisionStatus,
  type EvidenceStrength,
} from "@/data/demo-data";

const STATUS_STYLES: Record<DecisionStatus, string> = {
  under_review: "bg-warn-soft text-[#7a3b06]",
  pilot_approved: "bg-brand-blue-light text-[#1e40af]",
  active: "bg-[#F0EBFA] text-[#463a9e]",
  completed: "bg-ok-soft text-[#14532d]",
};

const EVIDENCE_STYLES: Record<EvidenceStrength, string> = {
  strong: "bg-ok-soft text-[#14532d]",
  moderate: "bg-brand-blue-light text-[#1e40af]",
  thin: "bg-warn-soft text-[#7a3b06]",
  insufficient: "bg-risk-soft text-[#7a1f1a]",
};

export function StatusBadge({ status }: { status: DecisionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
        STATUS_STYLES[status]
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {DEMO_STATUS_LABELS[status]}
    </span>
  );
}

export function EvidenceBadge({ strength }: { strength: EvidenceStrength }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
        EVIDENCE_STYLES[strength]
      )}
    >
      {DEMO_EVIDENCE_LABELS[strength]}
    </span>
  );
}

export function StrengthDot({ strength }: { strength: EvidenceStrength }) {
  const dot: Record<EvidenceStrength, string> = {
    strong: "bg-ok",
    moderate: "bg-brand-blue",
    thin: "bg-warn",
    insufficient: "bg-risk",
  };
  return <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", dot[strength])} />;
}
