"use client";

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

interface Props {
  comparables: ComparableEvidence[];
  negativeEvidence: NegativeEvidence[];
  alternatives: AlternativeConsidered[];
  assumptions: string[];
  confidence: { score: number; label: string; explanation: string };
}

const tierBadgeColors: Record<string, string> = {
  gold: "bg-yellow-400 text-yellow-900",
  silver: "bg-gray-300 text-gray-800",
  bronze: "bg-amber-600 text-white",
};

const statusColors: Record<string, string> = {
  successful: "text-green-700",
  partial: "text-amber-700",
  failed: "text-red-700",
  abandoned: "text-red-700",
  unknown: "text-stone",
};

export function EvidencePanel({ comparables, negativeEvidence, alternatives, assumptions, confidence }: Props) {
  const supporting = comparables.filter((c) => c.evidence_tier !== "rejected");
  const gold = comparables.filter((c) => c.evidence_tier === "gold");
  const silver = comparables.filter((c) => c.evidence_tier === "silver");
  const bronze = comparables.filter((c) => c.evidence_tier === "bronze");

  return (
    <div className="p-5 space-y-6 bg-cream/50">
      {/* Evidence Mix Summary */}
      <div>
        <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Evidence Composition</h4>
        <div className="flex gap-2">
          {gold.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-medium">
              {gold.length} Gold
            </span>
          )}
          {silver.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-medium">
              {silver.length} Silver
            </span>
          )}
          {bronze.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
              {bronze.length} Bronze
            </span>
          )}
          {supporting.length === 0 && (
            <span className="text-xs text-stone italic">No evidence records</span>
          )}
        </div>
      </div>

      {/* Supporting Evidence */}
      {supporting.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">
            Supporting Evidence ({supporting.length})
          </h4>
          <div className="space-y-2">
            {supporting.map((c, i) => (
              <div key={i} className="bg-white border border-border rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-sm font-medium text-ink">{c.organization}</span>
                    {c.intervention && (
                      <span className="text-xs text-stone ml-2">— {c.intervention}</span>
                    )}
                  </div>
                  <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", tierBadgeColors[c.evidence_tier] || "bg-gray-100")}>
                    {c.evidence_tier.toUpperCase()}
                  </span>
                </div>
                {c.outcome && (
                  <p className="text-xs text-ink mt-1">{c.outcome}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <span className={cn("text-xs", statusColors[c.status] || "text-stone")}>
                    {c.status}
                  </span>
                  {c.similarity_score > 0 && (
                    <span className="text-xs text-stone">Similarity: {c.similarity_score}%</span>
                  )}
                  {c.evidence_score > 0 && (
                    <span className="text-xs text-stone">Evidence: {c.evidence_score}/100</span>
                  )}
                </div>
                {c.supporting_passage && (
                  <p className="text-xs text-stone mt-1.5 italic border-l-2 border-border pl-2">
                    {c.supporting_passage.length > 200
                      ? c.supporting_passage.slice(0, 200) + "..."
                      : c.supporting_passage}
                  </p>
                )}
                {c.source_url && (
                  <a
                    href={c.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-forest hover:underline mt-1 block"
                  >
                    {c.source_title || c.source_url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negative Evidence */}
      {negativeEvidence.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-3">
            Negative Evidence / Failed Implementations
          </h4>
          <div className="space-y-2">
            {negativeEvidence.map((n, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800">{n.organization}</p>
                {n.intervention && (
                  <p className="text-xs text-red-700 mt-0.5">Intervention: {n.intervention}</p>
                )}
                {n.failure_reasons.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {n.failure_reasons.map((r, j) => (
                      <li key={j} className="text-xs text-red-600 flex items-start gap-1">
                        <span>&#8226;</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternatives Considered */}
      {alternatives.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">
            Alternatives Considered
          </h4>
          <div className="space-y-1.5">
            {alternatives.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-stone mt-0.5">&#8226;</span>
                <div>
                  <span className="text-ink font-medium">{a.family}</span>
                  {a.reason && <span className="text-stone ml-1">— {a.reason}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assumptions */}
      {assumptions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Assumptions</h4>
          <ul className="space-y-0.5">
            {assumptions.map((a, i) => (
              <li key={i} className="text-xs text-stone flex items-start gap-1">
                <span>&#8226;</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confidence Methodology */}
      <div className="bg-mist rounded p-3">
        <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-1">Confidence Methodology</h4>
        <p className="text-xs text-stone">{confidence.explanation}</p>
      </div>
    </div>
  );
}
