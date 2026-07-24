"use client";

import { useState } from "react";
import type { RecommendationData } from "./compass-choice";

interface Props {
  alternatives: RecommendationData[];
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    gold: "bg-yellow-50 text-yellow-800 border-yellow-300",
    silver: "bg-gray-100 text-gray-600 border-gray-300",
    bronze: "bg-orange-50 text-orange-800 border-orange-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${colors[tier] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
      {tier}
    </span>
  );
}

function ConfScore({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <span className="font-mono text-sm font-semibold text-ink">{pct}%</span>
  );
}

export function AlternativeCards({ alternatives }: Props) {
  if (!alternatives.length) return null;

  return (
    <div>
      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Alternative Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alternatives.map((rec) => (
          <AlternativeCard key={rec.rank} rec={rec} />
        ))}
      </div>
    </div>
  );
}

function AlternativeCard({ rec }: { rec: RecommendationData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Alternative</span>
          <h4 className="text-base font-semibold text-ink mt-0.5">{rec.title}</h4>
        </div>
        <TierBadge tier={rec.evidence_summary.overall_tier} />
      </div>

      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{rec.summary}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
        <span>Confidence <ConfScore score={rec.confidence.score} /></span>
        {rec.timeline.low_weeks && rec.timeline.high_weeks && (
          <span>{rec.timeline.low_weeks}–{rec.timeline.high_weeks} weeks</span>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-medium text-lime-600 hover:text-lime-700 transition-colors"
      >
        {expanded ? "Hide" : "Why not first?"}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 animate-fadeIn">
          {rec.why_it_ranked.map((reason, i) => (
            <p key={i} className="text-xs text-gray-500 flex items-start gap-2">
              <span className="text-gray-300 mt-0.5 shrink-0">&#8226;</span>
              {reason}
            </p>
          ))}
          {rec.alternatives_considered
            .filter((a) => a.family === rec.intervention_category)
            .map((a, i) => (
              <p key={i} className="text-xs text-gray-500 flex items-start gap-2">
                <span className="text-gray-300 mt-0.5 shrink-0">&#8226;</span>
                {a.reason}
              </p>
            ))}
          {!rec.why_it_ranked.length && (
            <p className="text-xs text-gray-400 italic">No specific differentiation factors available.</p>
          )}
        </div>
      )}
    </div>
  );
}
