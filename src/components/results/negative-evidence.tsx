"use client";

interface NegativeEvidence {
  organization: string;
  intervention: string;
  failure_reasons: string[];
  similarity_score: number;
}

interface Props {
  negativeEvidence: NegativeEvidence[];
}

export function NegativeEvidencePanel({ negativeEvidence }: Props) {
  if (!negativeEvidence.length) return null;

  return (
    <div>
      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Where Similar Implementations Struggled</h3>
      <div className="space-y-3">
        {negativeEvidence.map((n, i) => (
          <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-sm font-semibold text-amber-900">{n.organization}</span>
                {n.intervention && (
                  <span className="text-xs text-amber-700 ml-2">— {n.intervention}</span>
                )}
              </div>
              {n.similarity_score > 0 && (
                <span className="text-xs text-amber-600 font-mono shrink-0">{Math.round(n.similarity_score)}% similar</span>
              )}
            </div>

            {n.failure_reasons.length > 0 && (
              <div className="mb-2">
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block mb-1">Failure Reason</span>
                <ul className="space-y-0.5">
                  {n.failure_reasons.map((r, j) => (
                    <li key={j} className="text-xs text-amber-800 flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5">&#8226;</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block mb-1">How Compass Accounted for This</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                This implementation was weighted lower in the recommendation score. The confidence reflects reduced certainty due to these failure patterns.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
