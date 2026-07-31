"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./Reveal";

interface BuildStep {
  label: string;
  value?: string;
}

const STEPS: BuildStep[] = [
  { label: "Finding similar organizations", value: "…" },
  { label: "Comparing interventions", value: "6" },
  { label: "Evaluating evidence", value: "184 claims" },
  { label: "Ranking implementation paths" },
];

export function ConfidenceBuild({
  comparables,
  onDone,
}: {
  comparables: number;
  onDone: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const steps = STEPS.map((s, i) => (i === 0 ? { ...s, value: String(comparables) } : s));

  useEffect(() => {
    if (reduced) {
      setRevealed(STEPS.length);
      setDone(true);
      const t = setTimeout(() => onDoneRef.current(), 500);
      return () => clearTimeout(t);
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed(i + 1), 450 + i * 700));
    });
    timers.push(setTimeout(() => {
      setDone(true);
      onDoneRef.current();
    }, 450 + STEPS.length * 700 + 450));
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  return (
    <div className="border border-line bg-ink px-5 py-6 sm:px-6" role="status" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/60">
          Building the decision
        </p>
        {!done && (
          <span aria-hidden="true" className="h-3 w-3 animate-spin rounded-full border-2 border-paper/25 border-t-accent" />
        )}
      </div>

      <ul className="mt-5 space-y-3.5">
        {steps.map((step, i) => {
          const shown = reduced || i < revealed;
          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center justify-between gap-4 transition-all duration-300",
                shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
            >
              <span className={cn("flex items-center gap-3 text-[13.5px] font-medium", shown ? "text-paper" : "text-paper/40")}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                    shown ? "bg-accent text-accent-ink" : "border border-paper/25 text-transparent"
                  )}
                >
                  ✓
                </span>
                {step.label}
              </span>
              {step.value && (
                <span className="shrink-0 font-mono text-[12px] font-bold text-accent">{step.value}</span>
              )}
            </li>
          );
        })}
      </ul>

      <div
        className={cn(
          "mt-5 flex items-center gap-3 border-t border-paper/15 pt-4 transition-opacity duration-300",
          done ? "opacity-100" : "opacity-0"
        )}
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
        <span className="text-[13.5px] font-semibold text-accent">Decision ready.</span>
      </div>
    </div>
  );
}
