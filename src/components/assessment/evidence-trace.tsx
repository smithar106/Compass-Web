"use client";

import type { EvidenceRecord } from "@/types/pipeline";
import { cn } from "@/lib/utils";

interface EvidenceTraceProps {
  evidence: EvidenceRecord[];
  evidenceIds?: string[];
}

const evidenceBadgeColors: Record<string, string> = {
  User: "bg-blue-100 text-blue-800",
  Research: "bg-mist text-forest",
  Inference: "bg-amber-100 text-amber-800",
  Deterministic: "bg-purple-100 text-purple-800",
};

export function EvidenceTrace({ evidence, evidenceIds }: EvidenceTraceProps) {
  const items = evidenceIds
    ? evidence.filter((e) => evidenceIds.includes(e.id))
    : evidence;

  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">
        Evidence
      </h4>
      <div className="space-y-2">
        {items.map((ev) => (
          <div key={ev.id} className="flex items-start gap-3 text-sm bg-white border border-border rounded-lg p-3">
            <span
              className={cn(
                "flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium mt-0.5",
                evidenceBadgeColors[ev.evidenceClass] || "bg-gray-100 text-gray-800"
              )}
            >
              [{ev.evidenceClass === "Deterministic" ? "Derived" : ev.evidenceClass}]
            </span>
            <div className="min-w-0">
              <p className="text-ink text-sm">{ev.content}</p>
              <p className="text-xs text-stone mt-0.5">
                {ev.sourceLabel}
                {ev.confidence && <span className="ml-2">Confidence: {(ev.confidence * 100).toFixed(0)}%</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
