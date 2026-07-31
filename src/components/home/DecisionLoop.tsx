"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView, usePrefersReducedMotion } from "./Reveal";

export interface DecisionStep {
  text: string;
  tone: "start" | "step" | "end";
}

export function DecisionLoop({ steps }: { steps: DecisionStep[] }) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (reduced) {
      setRevealed(steps.length);
      return;
    }
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < steps.length; i++) {
      timers.push(setTimeout(() => setRevealed(i + 1), 150 + i * 240));
    }
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced, steps.length]);

  const active = Math.max(0, revealed - 1);

  return (
    <div ref={ref} className="mt-6">
      <div className="flex flex-wrap items-center gap-y-3">
        {steps.map((step, i) => {
          const shown = reduced || i < revealed;
          const isActive = reduced ? i === steps.length - 1 : i === active;
          return (
            <div key={`${step.text}-${i}`} className="flex items-center">
              <div
                className={cn(
                  "border px-3 py-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                  step.tone === "start" && "border-ink bg-ink text-paper",
                  step.tone === "step" && "border-lineDark bg-paper-dark/40 text-paper/80",
                  step.tone === "end" && "border-accent bg-accent text-accent-ink",
                  isActive && step.tone !== "end" && "ring-1 ring-accent/60"
                )}
              >
                <span className="whitespace-nowrap text-[12.5px] font-semibold">{step.text}</span>
              </div>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-1.5 flex items-center text-faint transition-opacity duration-300",
                    shown ? "opacity-100" : "opacity-0"
                  )}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/40">
        Decision #17 &rarr; #18 &rarr; #19 &middot; each one measurably better
      </p>
    </div>
  );
}
