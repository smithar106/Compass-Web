import { cn } from "@/lib/utils";

type Level = "Strong" | "Moderate" | "Limited" | "Insufficient";

interface Factor {
  label: string;
  level: Level;
}

// Illustrative factors. Real values derive per decision from the engine.
const FACTORS: Factor[] = [
  { label: "Problem match", level: "Strong" },
  { label: "Evidence strength", level: "Strong" },
  { label: "Implementation evidence", level: "Moderate" },
  { label: "Outcome evidence", level: "Moderate" },
  { label: "Risk coverage", level: "Limited" },
  { label: "Evidence diversity", level: "Moderate" },
  { label: "Missing information", level: "Limited" },
  { label: "Alternative margin", level: "Moderate" },
];

const LEVEL_WIDTH: Record<Level, string> = {
  Strong: "w-[86%]",
  Moderate: "w-[62%]",
  Limited: "w-[38%]",
  Insufficient: "w-[18%]",
};

const LEVEL_TONE: Record<Level, string> = {
  Strong: "bg-[#1E7B4C]",
  Moderate: "bg-accent-deep",
  Limited: "bg-[#B45309]",
  Insufficient: "bg-faint",
};

const LEVEL_TEXT: Record<Level, string> = {
  Strong: "text-[#1E7B4C]",
  Moderate: "text-accent-deep",
  Limited: "text-[#B45309]",
  Insufficient: "text-faint",
};

export function QualityFactors({ className }: { className?: string }) {
  return (
    <div id="quality" className={cn("scroll-mt-28 border border-line bg-surface shadow-panel", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/60 px-5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
          Recommendation quality factors
        </p>
        <span className="text-[10.5px] text-faint">Illustrative levels</span>
      </div>
      <div className="px-5 py-4">
        <ul className="space-y-3.5">
          {FACTORS.map((f) => (
            <li key={f.label}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12.5px] font-medium text-ink">{f.label}</span>
                <span className={cn("text-[10.5px] font-bold uppercase tracking-wide", LEVEL_TEXT[f.level])}>
                  {f.level}
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line"
                role="img"
                aria-label={`${f.label}: ${f.level}`}
              >
                <div className={cn("h-full rounded-full", LEVEL_WIDTH[f.level], LEVEL_TONE[f.level])} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-line pt-3 text-[11.5px] leading-relaxed text-muted">
          Conceptual framework — not an exact public formula. Compass reports
          factor levels rather than a single false-precision percentage.
        </p>
      </div>
    </div>
  );
}
