import { cn } from "@/lib/utils";

export function DecisionModel({ steps }: { steps: string[] }) {
  return (
    <div className="mt-5">
      {/* desktop: horizontal flow */}
      <ol className="hidden items-stretch md:flex">
        {steps.map((step, i) => {
          const isFinal = i === steps.length - 1;
          return (
            <li key={step} className="flex flex-1 items-center">
              <div
                className={cn(
                  "flex flex-1 flex-col items-center gap-2 border px-3 py-4 text-center",
                  isFinal ? "border-ink bg-ink" : "border-line bg-surface"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold",
                    isFinal ? "text-accent" : "text-faint"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-[13px] font-semibold leading-snug",
                    isFinal ? "text-paper" : "text-ink"
                  )}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="mx-1.5 flex h-8 items-center text-faint">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {/* mobile: vertical flow */}
      <ol className="md:hidden">
        {steps.map((step, i) => {
          const isFinal = i === steps.length - 1;
          return (
            <li key={step}>
              <div
                className={cn(
                  "flex items-center gap-3 border px-4 py-3",
                  isFinal ? "border-ink bg-ink" : "border-line bg-surface"
                )}
              >
                <span className={cn("font-mono text-[10px] font-bold", isFinal ? "text-accent" : "text-faint")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("text-[14px] font-semibold", isFinal ? "text-paper" : "text-ink")}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-faint">
                    <path d="M8 2v11M3.5 9 8 13.5 12.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
