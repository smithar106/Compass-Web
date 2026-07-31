"use client";

import { useState } from "react";
import { EvidencePanel } from "./evidence-panel";
import { cn } from "@/lib/utils";

interface ComparableEvidence {
  organization: string;
  industry: string;
  workflow: string;
  intervention: string;
  outcome: string;
  status: string;
  similarity_score: number;
  evidence_score: number;
  evidence_tier: string;
  supporting_passage: string;
  source_title: string;
  source_url: string;
}

interface NegativeEvidence {
  organization: string;
  intervention: string;
  failure_reasons: string[];
  similarity_score: number;
}

interface AlternativeConsidered {
  family: string;
  reason: string;
}

interface Recommendation {
  rank: number;
  is_compass_choice: boolean;
  title: string;
  summary: string;
  intervention_category: string;
  fit_score: number;
  confidence: { score: number; label: string; explanation: string };
  evidence_summary: {
    overall_tier: string;
    total_comparables: number;
    gold_count: number;
    silver_count: number;
    bronze_count: number;
    failed_comparables: number;
    average_evidence_score: number;
  };
  projected_impact: {
    label: string;
    low: number | null;
    high: number | null;
    unit: string;
    methodology: string;
    is_sufficiently_supported: boolean;
  };
  timeline: { low_weeks: number | null; high_weeks: number | null };
  why_it_ranked: string[];
  comparables: ComparableEvidence[];
  negative_evidence: NegativeEvidence[];
  alternatives_considered: AlternativeConsidered[];
  assumptions: string[];
  risks: string[];
}

interface Props {
  recommendation: Recommendation;
}

const tierColors: Record<string, string> = {
  gold: "bg-yellow-400 text-yellow-900",
  silver: "bg-gray-300 text-gray-800",
  bronze: "bg-amber-600 text-white",
};

const confColors: Record<string, string> = {
  strong: "bg-forest text-white",
  moderate: "bg-amber-500 text-white",
  limited: "bg-gray-400 text-white",
};

const statusColors: Record<string, string> = {
  successful: "text-green-700 bg-green-50 border-green-200",
  partial: "text-amber-700 bg-amber-50 border-amber-200",
  failed: "text-red-700 bg-red-50 border-red-200",
  abandoned: "text-red-700 bg-red-50 border-red-200",
};

export function RecommendationCard({ recommendation }: Props) {
  const [showEvidence, setShowEvidence] = useState(false);
  const rec = recommendation;

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden bg-white",
      rec.is_compass_choice ? "border-forest ring-1 ring-forest/30" : "border-border"
    )}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {rec.is_compass_choice ? (
                <span className="text-xs font-bold text-forest bg-mist px-2 py-0.5 rounded uppercase tracking-wider">
                  Compass&rsquo; Choice
                </span>
              ) : (
                <span className="text-xs font-medium text-stone bg-gray-100 px-2 py-0.5 rounded">
                  Recommendation #{rec.rank}
                </span>
              )}
              <span className={cn("text-xs px-2 py-0.5 rounded font-medium", tierColors[rec.evidence_summary.overall_tier] || "bg-gray-100")}>
                {rec.evidence_summary.overall_tier.toUpperCase()}
              </span>
              <span className={cn("text-xs px-2 py-0.5 rounded font-medium", confColors[rec.confidence.label] || "bg-gray-100")}>
                {rec.confidence.label}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-ink">{rec.title}</h3>
          </div>
        </div>

        <p className="text-sm text-stone mb-4">{rec.summary}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {rec.evidence_summary.total_comparables > 0 && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {rec.evidence_summary.total_comparables} comparable implementations
            </span>
          )}
          {rec.evidence_summary.gold_count + rec.evidence_summary.silver_count + rec.evidence_summary.bronze_count > 0 && (
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
              {rec.evidence_summary.gold_count}G · {rec.evidence_summary.silver_count}S · {rec.evidence_summary.bronze_count}B
            </span>
          )}
          {rec.timeline.low_weeks && rec.timeline.high_weeks && (
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
              {rec.timeline.low_weeks}–{rec.timeline.high_weeks} weeks
            </span>
          )}
        </div>

        {rec.projected_impact.is_sufficiently_supported ? (
          <div className="bg-mist rounded p-3 mb-4">
            <span className="text-xs font-semibold text-stone uppercase tracking-wider">Projected Impact</span>
            <p className="text-sm font-medium text-ink mt-1">{rec.projected_impact.label}</p>
            <p className="text-xs text-stone mt-0.5">{rec.projected_impact.methodology}</p>
          </div>
        ) : rec.evidence_summary.total_comparables > 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            <p className="text-xs text-amber-700 italic">
              Not enough evidence to estimate impact reliably.
            </p>
          </div>
        ) : null}

        <div className="space-y-1 mb-4">
          {rec.why_it_ranked.map((reason, i) => (
            <p key={i} className="text-xs text-stone flex items-start gap-2">
              <span className="text-forest mt-0.5">&#8226;</span>
              {reason}
            </p>
          ))}
        </div>

        {rec.risks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {rec.risks.map((risk, i) => (
              <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                {risk}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="text-sm text-forest font-medium hover:text-leaf transition-colors"
        >
          {showEvidence ? "Hide Evidence" : "View Evidence"}
        </button>
      </div>

      {showEvidence && (
        <div className="border-t border-border">
          <EvidencePanel
            comparables={rec.comparables}
            negativeEvidence={rec.negative_evidence}
            alternatives={rec.alternatives_considered}
            assumptions={rec.assumptions}
            confidence={rec.confidence}
          />
        </div>
      )}
    </div>
  );
}
