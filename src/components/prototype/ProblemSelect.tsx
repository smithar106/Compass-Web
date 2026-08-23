"use client";

import Link from "next/link";
import { PROBLEM_LIBRARY } from "@/data/prototype/problems";
import { FREE_FORM_ROUTE } from "@/data/prototype/problems";
import { ArrowIcon } from "@/components/home/primitives";
import { cn } from "@/lib/utils";

/**
 * Screen 1 — problem selection. Shows the same 10 problems as the homepage
 * grid. Clicking a card moves to Screen 2 (optional context).
 */
export function ProblemSelect({
  onSelect,
  selectedId,
}: {
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">
        Compass Decision Prototype
      </p>
      <h1 className="mt-4 text-hero font-semibold tracking-tight text-ink">
        What operational problem are you trying to solve?
      </h1>
      <p className="mt-4 max-w-2xl text-lead leading-relaxed text-muted">
        Choose the problem closest to what your organization is experiencing.
        Compass evaluates it and returns an evidence-backed decision.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {PROBLEM_LIBRARY.map((problem) => {
          const active = selectedId === problem.id;
          return (
            <button
              key={problem.id}
              type="button"
              onClick={() => onSelect(problem.id)}
              aria-pressed={active}
              className={cn(
                "group flex items-start gap-4 border bg-surface px-5 py-5 text-left transition-colors",
                active
                  ? "border-ink bg-accent-soft"
                  : "border-line hover:border-ink/40"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  {problem.category}
                </p>
                <h2 className="mt-1.5 text-[16px] font-semibold leading-snug tracking-tight text-ink">
                  {problem.name}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  {problem.description}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-line bg-paper text-muted transition-colors group-hover:border-ink group-hover:text-ink"
              >
                <ArrowIcon className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <Link
          href={FREE_FORM_ROUTE}
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink transition-colors hover:text-muted"
        >
          Something else
          <ArrowIcon className="h-3.5 w-3.5" />
          <span className="ml-1 hidden text-[12.5px] font-normal text-muted sm:inline">
            Describe your own problem for the full analysis
          </span>
        </Link>
      </div>
    </div>
  );
}
