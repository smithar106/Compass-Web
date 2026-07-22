"use client";

import { useState } from "react";
import type { ComparedPath, InterventionType } from "@/types";

interface InterventionComparisonProps {
  paths: ComparedPath[];
  selected?: InterventionType;
  onSelect?: (type: InterventionType) => void;
}

const interventionColors: Record<InterventionType, string> = {
  "AI": "bg-purple-100 border-purple-300 text-purple-800",
  "Deterministic Software": "bg-blue-100 border-blue-300 text-blue-800",
  "Process Redesign": "bg-amber-100 border-amber-300 text-amber-800",
  "Human Work": "bg-gray-100 border-gray-300 text-gray-800",
  "Hybrid": "bg-green-100 border-green-300 text-green-800",
  "No Action": "bg-stone-100 border-stone-300 text-stone-600",
};

const confidenceColors: Record<string, string> = {
  "High": "text-green-600 bg-green-50",
  "Medium": "text-amber-600 bg-amber-50",
  "Low": "text-red-600 bg-red-50",
  "Unknown": "text-stone-400 bg-stone-50",
};

export function InterventionComparison({ paths, selected, onSelect }: InterventionComparisonProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-ink mb-3">Compare intervention paths</h3>
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
                <span className={`px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${interventionColors[path.intervention]}`}>
                  {path.intervention}
                </span>
                <span className="text-sm text-ink truncate">{path.title}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded ${confidenceColors[path.confidence]}`}>
                  {path.confidence}
                </span>
                <svg className={`w-4 h-4 text-stone transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-border/50 pt-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="block text-stone mb-1">Eligibility</span>
                    <span className="text-ink">{path.eligibility}</span>
                  </div>
                  <div>
                    <span className="block text-stone mb-1">Suitability</span>
                    <span className="text-ink">{path.suitability}</span>
                  </div>
                  <div>
                    <span className="block text-stone mb-1">Expected outcome</span>
                    <span className="text-ink">{path.expectedOutcome}</span>
                  </div>
                  <div>
                    <span className="block text-stone mb-1">Effort</span>
                    <span className="text-ink">{path.effort}</span>
                  </div>
                  <div>
                    <span className="block text-stone mb-1">Risk</span>
                    <span className="text-ink">{path.risk}</span>
                  </div>
                  <div>
                    <span className="block text-stone mb-1">Time to value</span>
                    <span className="text-ink">{path.timeToValue}</span>
                  </div>
                  <div>
                    <span className="block text-stone mb-1">Human oversight</span>
                    <span className="text-ink">{path.humanOversight}</span>
                  </div>
                  <div>
                    <span className="block text-stone mb-1">Confidence</span>
                    <span className={`font-medium ${confidenceColors[path.confidence].split(" ")[0]}`}>{path.confidence}</span>
                  </div>
                </div>
                {path.rejectionReason && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700">
                    <span className="font-medium">Why not recommended: </span>
                    {path.rejectionReason}
                  </div>
                )}
                {!path.rejectionReason && isSelected && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded text-xs text-green-700">
                    <span className="font-medium">Selected path. </span>
                    This intervention was chosen as the best fit for this specific workflow.
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