"use client";

import { useState } from "react";
import type { EvidenceItem, AssumptionItem } from "@/types";

interface EvidenceDisplayProps {
  evidence: EvidenceItem[];
  assumptions: AssumptionItem[];
  whyChose?: string;
  whyRejected?: string;
  alternativesConsidered?: string;
  whatCouldChange?: string;
  howSuccessMeasured?: string;
  whenTechnicalHelpRequired?: string;
}

const evidenceConfig: Record<string, { label: string; icon: string; note: string }> = {
  "user-provided": {
    label: "User-provided evidence",
    icon: "\u270D\ufe0F",
    note: "Stated by the organization during investigation",
  },
  "deterministic-analysis": {
    label: "Deterministic analysis",
    icon: "\u2699\uFE0F",
    note: "Computed from available data with verifiable logic",
  },
  "external-research": {
    label: "External research",
    icon: "\uD83D\uDCD6",
    note: "Published benchmark or third-party study",
  },
  "ai-inference": {
    label: "AI inference",
    icon: "\uD83E\uDD16",
    note: "Pattern matched across similar organizations \u2014 not certainty",
  },
  "hypothesis": {
    label: "Hypothesis",
    icon: "\uD83D\uDCA1",
    note: "Informed assumption based on general best practices",
  },
  "missing": {
    label: "Missing information",
    icon: "\u2753",
    note: "No data available to assess this factor",
  },
};

const confidenceStyles: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700 border-green-200",
  High: "bg-blue-100 text-blue-700 border-blue-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-red-100 text-red-700 border-red-200",
  Unknown: "bg-gray-100 text-gray-500 border-gray-200",
};

function SectionHeading({ label }: { label: string }) {
  return (
    <h4 className="text-sm font-semibold text-ink mb-3">{label}</h4>
  );
}

export function EvidenceDisplay({
  evidence,
  assumptions,
  whyChose,
  whyRejected,
  alternativesConsidered,
  whatCouldChange,
  howSuccessMeasured,
  whenTechnicalHelpRequired,
}: EvidenceDisplayProps) {
  const [showAllEvidence, setShowAllEvidence] = useState(false);

  const displayedEvidence = showAllEvidence ? evidence : evidence.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Why Compass chose this */}
      {whyChose && (
        <div>
          <SectionHeading label="Why Compass chose this" />
          <div className="p-3 bg-forest/5 border border-forest/10 rounded-lg">
            <p className="text-xs text-stone leading-relaxed">{whyChose}</p>
          </div>
        </div>
      )}

      {/* Evidence */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeading label="Evidence" />
          {evidence.length > 4 && (
            <button
              onClick={() => setShowAllEvidence(!showAllEvidence)}
              className="text-xs text-forest hover:text-leaf font-medium"
            >
              {showAllEvidence ? "Show less" : `Show all (${evidence.length})`}
            </button>
          )}
        </div>
        <div className="space-y-2">
          {displayedEvidence.map((item, i) => {
            const cfg = evidenceConfig[item.type] || { label: item.type, icon: "\u2022", note: "" };
            return (
              <div
                key={i}
                className={`border rounded-lg p-3 text-xs ${
                  item.type === "missing" ? "bg-stone-50 border-dashed border-stone-300" :
                  item.type === "hypothesis" ? "bg-amber-50/40 border-amber-200" :
                  item.type === "ai-inference" ? "bg-purple-50/40 border-purple-200" :
                  "bg-white border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <span className="text-xs">{cfg.icon}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                      confidenceStyles[item.confidence || "Unknown"]
                    }`}>
                      {item.confidence || "Unknown"}
                    </span>
                    <span className="text-stone font-medium">{cfg.label}</span>
                    {cfg.note && (
                      <span className="text-stone/60 text-[10px] italic hidden sm:inline">&mdash; {cfg.note}</span>
                    )}
                  </div>
                  {item.timestamp && (
                    <span className="text-stone/60 flex-shrink-0 text-[10px]">{new Date(item.timestamp).toLocaleDateString()}</span>
                  )}
                </div>
                <p className="text-ink mt-1">{item.detail}</p>
                {item.source && (
                  <p className="text-stone/70 mt-0.5 text-[10px]">
                    <span className="font-medium">Source: </span>{item.source}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Assumptions */}
      <div>
        <SectionHeading label="Assumptions" />
        <p className="text-xs text-stone/70 mb-2 italic">These are not facts. If any assumption is wrong, the recommendation may change.</p>
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

      {/* Alternatives considered */}
      {alternativesConsidered && (
        <div>
          <SectionHeading label="Alternatives considered" />
          <p className="text-xs text-stone leading-relaxed">{alternativesConsidered}</p>
        </div>
      )}

      {/* Why alternatives were rejected */}
      {whyRejected && (
        <div>
          <SectionHeading label="Why alternatives were rejected" />
          <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg">
            <p className="text-xs text-stone leading-relaxed">{whyRejected}</p>
          </div>
        </div>
      )}

      {/* What could change this recommendation */}
      <div>
        <SectionHeading label="What could change this recommendation" />
        <div className="p-3 bg-amber-50/40 border border-amber-200 rounded-lg">
          <p className="text-xs text-stone leading-relaxed">
            {whatCouldChange || "New user-provided information, changing business conditions, or availability of new data could alter this recommendation. The recommendation is based on the current state of the organization."}
          </p>
        </div>
      </div>

      {/* How success will be measured */}
      <div>
        <SectionHeading label="How success will be measured" />
        <div className="p-3 bg-blue-50/40 border border-blue-200 rounded-lg">
          <p className="text-xs text-stone leading-relaxed">
            {howSuccessMeasured || "Success metrics should be defined with the team before implementation begins. Baseline measurements are needed to quantify improvement."}
          </p>
        </div>
      </div>

      {/* When technical help is required */}
      <div>
        <SectionHeading label="When technical help is required" />
        <div className="p-3 bg-mist border border-border rounded-lg">
          <p className="text-xs text-stone leading-relaxed">
            {whenTechnicalHelpRequired || "Technical requirements vary by intervention. Review the Implementation Blueprint for detailed system, API, and data requirements."}
          </p>
        </div>
      </div>
    </div>
  );
}
