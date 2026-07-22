"use client";

import { useState } from "react";
import type { EvidenceItem, AssumptionItem } from "@/types";

interface EvidenceDisplayProps {
  evidence: EvidenceItem[];
  assumptions: AssumptionItem[];
  whyChose?: string;
  whyRejected?: string;
  whatCouldChange?: string;
}

const evidenceTypeLabels: Record<string, string> = {
  "user-provided": "User-provided evidence",
  "deterministic-analysis": "Deterministic analysis",
  "ai-inference": "AI inference",
  "hypothesis": "Hypothesis",
  "missing": "Missing information",
};

const evidenceTypeIcons: Record<string, string> = {
  "user-provided": "\uD83D\uDCDD",
  "deterministic-analysis": "\u2699\uFE0F",
  "ai-inference": "\uD83E\uDD16",
  "hypothesis": "\uD83D\uDCA1",
  "missing": "\u2753",
};

const confidenceStyles: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700 border-green-200",
  High: "bg-blue-100 text-blue-700 border-blue-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-red-100 text-red-700 border-red-200",
  Unknown: "bg-gray-100 text-gray-500 border-gray-200",
};

export function EvidenceDisplay({ evidence, assumptions, whyChose, whyRejected, whatCouldChange }: EvidenceDisplayProps) {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className="space-y-6">
      {/* Evidence section */}
      <div>
        <h4 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Evidence
        </h4>
        <div className="space-y-2">
          {evidence.map((item, i) => (
            <div key={i} className={`border rounded-lg p-3 text-xs ${
              item.type === "missing" ? "bg-stone-50 border-dashed" : "bg-white"
            }`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs">{evidenceTypeIcons[item.type] || "\u2022"}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                    confidenceStyles[item.confidence || "Unknown"]
                  }`}>
                    {item.confidence || "Unknown"}
                  </span>
                  <span className="text-stone truncate">{evidenceTypeLabels[item.type] || item.type}</span>
                </div>
                {item.timestamp && (
                  <span className="text-stone flex-shrink-0">{new Date(item.timestamp).toLocaleDateString()}</span>
                )}
              </div>
              <p className="text-ink mt-1">{item.detail}</p>
              {item.source && (
                <p className="text-stone mt-0.5">
                  <span className="font-medium">Source: </span>{item.source}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions section */}
      <div>
        <h4 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Assumptions
        </h4>
        <div className="space-y-2">
          {assumptions.map((a, i) => (
            <div key={i} className="border border-amber-200 bg-amber-50/30 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-ink font-medium">{a.assumption}</p>
                  <p className="text-xs text-stone mt-0.5">
                    <span className="font-medium">Impact if wrong: </span>{a.impact}
                  </p>
                </div>
                <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                  confidenceStyles[a.confidence]
                }`}>
                  {a.confidence}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Compass chose this */}
      {whyChose && (
        <div>
          <h4 className="text-sm font-semibold text-ink mb-2">Why Compass chose this</h4>
          <p className="text-xs text-stone leading-relaxed">{whyChose}</p>
        </div>
      )}

      {/* Why Compass rejected alternatives */}
      {whyRejected && (
        <div>
          <h4 className="text-sm font-semibold text-ink mb-2">Why Compass rejected alternatives</h4>
          <p className="text-xs text-stone leading-relaxed">{whyRejected}</p>
        </div>
      )}

      {/* What could change */}
      {whatCouldChange && (
        <div>
          <h4 className="text-sm font-semibold text-ink mb-2">What could change this recommendation</h4>
          <p className="text-xs text-stone leading-relaxed">{whatCouldChange}</p>
        </div>
      )}
    </div>
  );
}