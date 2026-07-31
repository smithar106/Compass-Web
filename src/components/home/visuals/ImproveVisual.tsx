import { cn } from "@/lib/utils";
import { StatusTag, ULabel, VisualShell } from "./VisualShell";

interface ReviewPoint {
  month: string;
  expected: number;
  actual: number;
  confidence: number;
  lesson: string;
}

const REVIEWS: ReviewPoint[] = [
  { month: "3 mo", expected: 22, actual: 18, confidence: 0.61, lesson: "Routing rules held up in pilot" },
  { month: "6 mo", expected: 30, actual: 31, confidence: 0.74, lesson: "Exception rate lower than assumed" },
  { month: "9 mo", expected: 35, actual: 33, confidence: 0.81, lesson: "Volume seasonality needs care" },
  { month: "12 mo", expected: 40, actual: 38, confidence: 0.87, lesson: "Next: apply to refund handling" },
];

export function ImproveVisual() {
  return (
    <VisualShell
      title="Outcome review"
      meta="learning loop · feeds Decide"
      footnote="Structured reviews after 3, 6, 9, and 12 months compare projected with actual outcomes, capture lessons, and improve confidence in the next recommendation."
    >
      {/* timeline */}
      <div className="relative mb-6">
        <div className="absolute left-0 right-0 top-[5px] h-px bg-line" aria-hidden="true" />
        <div className="grid grid-cols-4 gap-2">
          {REVIEWS.map((r, i) => (
            <div key={r.month} className="relative flex flex-col items-center text-center">
              <span
                className={cn(
                  "relative z-10 h-[11px] w-[11px] rounded-full border-2 border-paper",
                  i === REVIEWS.length - 1 ? "bg-accent-deep" : "bg-ink"
                )}
                aria-hidden="true"
              />
              <div className="mt-2 flex h-9 items-end gap-[3px]" aria-hidden="true">
                <div
                  className="w-3 rounded-t-sm border border-line bg-paper"
                  style={{ height: `${r.expected}px` }}
                  title="Expected"
                />
                <div
                  className="w-3 rounded-t-sm bg-ink/75"
                  style={{ height: `${r.actual}px` }}
                  title="Actual"
                />
              </div>
              <span className="mt-1.5 font-mono text-[9px] text-faint">{r.month}</span>
              <span className="mt-0.5 font-mono text-[9px] font-bold text-ink">{r.actual}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* legend */}
      <div className="mb-4 flex items-center gap-4 text-[9px] text-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-t-sm border border-line bg-paper" /> projected
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-t-sm bg-ink/75" /> actual
        </span>
      </div>

      {/* lessons + confidence */}
      <div className="grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-2">
        <div>
          <ULabel className="mb-2">Lessons captured</ULabel>
          <ul className="space-y-1.5">
            {REVIEWS.map((r) => (
              <li key={r.month} className="flex items-start gap-2 text-[11px] leading-snug text-ink">
                <span aria-hidden="true" className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />
                <span>
                  <span className="font-mono text-faint">{r.month}·</span>
                  {r.lesson}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <ULabel>Recommendation confidence</ULabel>
            <StatusTag tone="ok">improving</StatusTag>
          </div>
          <ul className="mt-2 space-y-2">
            {REVIEWS.map((r, idx) => (
              <li key={r.month} className="flex items-center gap-3">
                <span className="w-9 shrink-0 font-mono text-[9px] text-faint">{r.month}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-accent-deep"
                    style={{
                      width: `${Math.round(r.confidence * 100)}%`,
                      transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                      transitionDelay: `${idx * 90}ms`,
                    }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-[9px] font-bold text-ink">
                  {r.confidence.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </VisualShell>
  );
}
