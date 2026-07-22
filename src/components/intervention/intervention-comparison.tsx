"use client";

import { useState } from "react";
import type { ComparedPath, InterventionType } from "@/types";

interface InterventionComparisonProps {
  paths: ComparedPath[];
  selected?: InterventionType;
  onSelect?: (type: InterventionType) => void;
}

const pathLabel: Record<string, string> = {
  "AI": "AI",
  "Deterministic Software": "Software",
  "Process Redesign": "Process",
  "Human Work": "Human",
  "Hybrid": "Hybrid",
  "No Action": "Not ready",
};

const pathColors: Record<string, string> = {
  "AI": "bg-purple-100 border-purple-300 text-purple-800",
  "Deterministic Software": "bg-blue-100 border-blue-300 text-blue-800",
  "Process Redesign": "bg-amber-100 border-amber-300 text-amber-800",
  "Human Work": "bg-gray-100 border-gray-300 text-gray-800",
  "Hybrid": "bg-green-100 border-green-300 text-green-800",
  "No Action": "bg-stone-100 border-stone-300 text-stone-600",
};

const badgeColor: Record<string, string> = {
  "High": "text-green-700 bg-green-50 border-green-200",
  "Medium": "text-amber-700 bg-amber-50 border-amber-200",
  "Low": "text-red-700 bg-red-50 border-red-200",
  "Unknown": "text-stone-500 bg-stone-50 border-stone-200",
  "Confirmed": "text-green-700 bg-green-50 border-green-200",
};

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value || value === "N/A") return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-stone flex-shrink-0 w-28 text-xs">{label}</span>
      <span className="text-ink text-xs">{value}</span>
    </div>
  );
}

export function InterventionComparison({ paths, selected, onSelect }: InterventionComparisonProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showTechnical, setShowTechnical] = useState(false);

  if (!paths || paths.length === 0) {
    return (
      <div className="text-sm text-stone p-4 text-center border border-dashed border-border rounded-lg">
        No comparison paths available for this opportunity.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-ink">Intervention paths</h3>
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="text-xs text-forest hover:text-leaf font-medium"
        >
          {showTechnical ? "Show business view" : "Show technical details"}
        </button>
      </div>

      {paths.map((path) => {
        const isSelected = path.intervention === selected;
        const isExpanded = expanded === path.intervention;

        return (
          <div
            key={path.intervention}
            className={`border rounded-lg transition-colors ${
              isSelected
                ? "border-forest bg-mist/30 ring-1 ring-forest"
                : "border-border hover:border-forest/30"
            }`}
          >
            <button
              onClick={() => {
                if (onSelect && path.intervention !== "No Action") onSelect(path.intervention);
                setExpanded(isExpanded ? null : path.intervention);
              }}
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${pathColors[path.intervention]}`}>
                  {pathLabel[path.intervention] || path.intervention}
                </span>
                <span className="text-sm text-ink truncate">{path.title}</span>
                {isSelected && (
                  <span className="text-[10px] text-forest font-medium bg-forest/10 px-1.5 py-0.5 rounded">Selected</span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded border ${badgeColor[path.confidence] || ""}`}>
                  {path.confidence}
                </span>
                <svg className={`w-4 h-4 text-stone transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-border/50 pt-3">
                <div className="grid grid-cols-1 gap-3 text-xs">
                  {path.summary && (
                    <div className="p-3 bg-mist/50 rounded-lg border border-border/50 mb-1">
                      <p className="text-ink text-xs leading-relaxed">{path.summary}</p>
                    </div>
                  )}

                  {showTechnical ? (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                      <DetailRow label="Eligibility" value={path.eligibility} />
                      <DetailRow label="Suitability" value={path.suitability} />
                      <DetailRow label="Expected outcome" value={path.expectedOutcome} />
                      {path.estimatedCost && <DetailRow label="Estimated cost" value={path.estimatedCost} />}
                      <DetailRow label="Implementation effort" value={path.effort} />
                      <DetailRow label="Time to value" value={path.timeToValue} />
                      <DetailRow label="Risk" value={path.risk} />
                      {path.dataReadiness && <DetailRow label="Data readiness" value={path.dataReadiness} />}
                      {path.processReadiness && <DetailRow label="Process readiness" value={path.processReadiness} />}
                      <DetailRow label="Human oversight" value={path.humanOversight} />
                      <DetailRow label="Confidence" value={path.confidence} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                      <DetailRow label="Eligibility" value={path.eligibility} />
                      <DetailRow label="Expected impact" value={path.expectedOutcome} />
                      {path.estimatedCost && <DetailRow label="Estimated cost" value={path.estimatedCost} />}
                      <DetailRow label="Effort" value={path.effort} />
                      <DetailRow label="Time to value" value={path.timeToValue} />
                      <DetailRow label="Risk level" value={path.risk} />
                      {path.dataReadiness && <DetailRow label="Data readiness" value={path.dataReadiness} />}
                      {path.processReadiness && <DetailRow label="Process readiness" value={path.processReadiness} />}
                      <DetailRow label="Human oversight" value={path.humanOversight} />
                      <DetailRow label="Confidence" value={path.confidence} />
                    </div>
                  )}
                </div>

                {path.disqualifiers && path.disqualifiers.length > 0 && (
                  <div className="mt-3 p-2.5 bg-red-50 border border-red-100 rounded text-xs text-red-700">
                    <span className="font-medium">Disqualifier: </span>
                    {path.disqualifiers}
                  </div>
                )}

                {path.reasonsRejected && path.reasonsRejected.length > 0 && (
                  <div className="mt-2 p-2.5 bg-orange-50 border border-orange-100 rounded text-xs text-orange-700">
                    <span className="font-medium">Reasons not selected: </span>
                    <ul className="mt-1 list-disc list-inside space-y-0.5">
                      {path.reasonsRejected.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!path.rejectionReason && isSelected && (
                  <div className="mt-3 p-2.5 bg-green-50 border border-green-100 rounded text-xs text-green-700">
                    <span className="font-medium">Selected path. </span>
                    {path.summary || "This path was chosen as the best fit for this specific business problem and workflow."}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
