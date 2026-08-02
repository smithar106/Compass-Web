import { cn } from "@/lib/utils";

export const DEFENSIBILITY_QUESTIONS = [
  "Why this problem?",
  "Why this intervention?",
  "Who else solved it?",
  "How did they implement it?",
  "What outcomes did they achieve?",
  "What risks should we expect?",
  "How will we measure success?",
  "What would change this recommendation?",
] as const;

type Classification = "Defensible" | "Partially supported" | "Not yet supported";

const CLASS_TONE: Record<Classification, string> = {
  Defensible: "bg-[#E5F3EA] text-[#14532d]",
  "Partially supported": "bg-[#FBF0E0] text-[#7a3b06]",
  "Not yet supported": "bg-[#FAE9E7] text-[#7a1f1a]",
};

// Illustrative example states. A real decision derives these from its evidence.
const EXAMPLE: Classification[] = [
  "Defensible",
  "Defensible",
  "Defensible",
  "Partially supported",
  "Partially supported",
  "Partially supported",
  "Partially supported",
  "Not yet supported",
];

export function DefensibilityChecklist({ className }: { className?: string }) {
  return (
    <div id="defensibility" className={cn("scroll-mt-28 border border-line bg-surface shadow-panel", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/60 px-5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
          The eight questions
        </p>
        <span className="text-[10.5px] text-faint">Illustrative classification</span>
      </div>
      <ol className="divide-y divide-line">
        {DEFENSIBILITY_QUESTIONS.map((q, i) => (
          <li key={q} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13.5px] font-medium text-ink">{q}</span>
            </div>
            <span
              className={cn(
                "shrink-0 px-2 py-0.5 text-[10px] font-bold",
                CLASS_TONE[EXAMPLE[i]]
              )}
            >
              {EXAMPLE[i]}
            </span>
          </li>
        ))}
      </ol>
      <div className="border-t border-line bg-paper/60 px-5 py-3">
        <p className="text-[12px] leading-relaxed text-muted">
          Each answer is classified — Defensible, Partially supported, or Not yet
          supported. If the evidence cannot carry a question, the decision is flagged,
          not fudged.
        </p>
      </div>
    </div>
  );
}
