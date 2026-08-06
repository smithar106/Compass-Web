import { cn } from "@/lib/utils";

const FLOW = [
  {
    name: "Understand the problem",
    detail: "Free-text description, workflow, policy, targeted follow-ups, and organization context converge on a confirmed problem definition.",
  },
  {
    name: "Normalize the context",
    detail: "The input becomes a structured decision model — workflow, symptom, root cause, outcome, volume, constraints, readiness — so differently worded problems can be compared consistently.",
  },
  {
    name: "Retrieve relevant implementations",
    detail: "Compass searches the published evidence graph for structured implementation records, not just documents, grouped by the role each record plays in the decision.",
  },
  {
    name: "Compare eligible interventions",
    detail: "Every intervention family — AI, deterministic software, workflow automation, process redesign, human-led change, hybrid, or no action — is scored on the same criteria. AI is not automatically preferred.",
  },
  {
    name: "Test Decision Defensibility",
    detail: "Eight questions decide whether the recommendation can be defended. When evidence is insufficient, Compass defers judgment instead of inventing an answer.",
  },
  {
    name: "Produce the Executive Recommendation",
    detail: "The winning intervention, why it won, why each alternative lost, the evidence behind it, the risks, and the measurement plan — in one defensible brief.",
  },
];

export function AnalyzeFlow({ className }: { className?: string }) {
  return (
    <ol className={cn("space-y-0", className)}>
      {FLOW.map((step, i) => {
        const isLast = i === FLOW.length - 1;
        return (
          <li key={step.name} className="relative pl-14">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-10 bottom-[-4px] w-px bg-line"
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-0 flex h-[31px] w-[31px] items-center justify-center rounded-full border font-mono text-[11px] font-bold",
                isLast ? "border-transparent bg-ink text-accent" : "border-line bg-surface text-faint"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className={cn("pb-8", isLast && "pb-0")}>
              <h3 className="text-[15px] font-semibold tracking-tight text-ink">{step.name}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{step.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
