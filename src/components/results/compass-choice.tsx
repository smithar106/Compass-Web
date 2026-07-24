"use client";

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

export interface RecommendationData {
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
  recommendation: RecommendationData;
  onViewEvidence: () => void;
  onBlueprint: () => void;
  onCompare: () => void;
  showEvidence: boolean;
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    gold: "bg-yellow-50 text-yellow-800 border-yellow-300",
    silver: "bg-gray-100 text-gray-600 border-gray-300",
    bronze: "bg-orange-50 text-orange-800 border-orange-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${colors[tier] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tier === "gold" ? "bg-yellow-400" : tier === "silver" ? "bg-gray-400" : tier === "bronze" ? "bg-orange-500" : "bg-gray-300"}`} />
      {tier}
    </span>
  );
}

function ConfMeter({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 70 ? "bg-lime-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-mono font-medium text-ink w-10 text-right">{pct}%</span>
    </div>
  );
}

function Label({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wider">{name}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

export function CompassChoice({ recommendation: rec, onViewEvidence, onBlueprint, onCompare, showEvidence }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-lime-50 text-lime-700 border border-lime-200 rounded-lg text-xs font-bold uppercase tracking-wider">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Compass&apos; Choice
            </span>
          </div>
          <TierBadge tier={rec.evidence_summary.overall_tier} />
        </div>

        <h2 className="text-2xl font-bold text-ink mb-2">{rec.title}</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-2xl">{rec.summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Confidence</span>
              <ConfMeter score={rec.confidence.score} />
              <p className="text-xs text-gray-400 mt-1">{rec.confidence.label} &mdash; {rec.confidence.explanation}</p>
            </div>
            {rec.timeline.low_weeks && rec.timeline.high_weeks && (
              <Label name="Timeline" value={`${rec.timeline.low_weeks}–${rec.timeline.high_weeks} weeks`} />
            )}
          </div>
          <div>
            {rec.projected_impact.is_sufficiently_supported ? (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Projected Impact</span>
                <p className="text-sm font-semibold text-ink">{rec.projected_impact.label}</p>
                {rec.projected_impact.methodology && (
                  <p className="text-xs text-gray-400 mt-0.5">{rec.projected_impact.methodology}</p>
                )}
              </div>
            ) : rec.evidence_summary.total_comparables > 0 ? (
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <span className="text-xs text-amber-700 font-medium block">
                  Not enough evidence exists to estimate business impact reliably.
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onViewEvidence}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showEvidence
                ? "bg-lime-500 text-white border-lime-500"
                : "bg-white text-ink border-gray-300 hover:border-gray-400"
            }`}
          >
            {showEvidence ? "Hide Evidence" : "View Evidence"}
          </button>
          <button
            onClick={onBlueprint}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-lime-500 text-white border border-lime-500 hover:bg-lime-600 transition-colors"
          >
            Implementation Blueprint
          </button>
          <button
            onClick={onCompare}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-ink border border-gray-300 hover:border-gray-400 transition-colors"
          >
            Compare Alternatives
          </button>
        </div>
      </div>
    </div>
  );
}
