"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { marketing } from "@/content/marketing";
import { SectionHeader, ArrowIcon } from "./primitives";
import { Reveal } from "./Reveal";
import { RecommendationCard } from "./RecommendationCard";
import type { ExampleRecommendation } from "./RecommendationDetail";

export function SearchRecommendations() {
  const c = marketing.catalog;
  const examples = marketing.examples as ExampleRecommendation[];
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return examples;
    return examples.filter((e) =>
      [e.problem, e.intervention, e.category, e.impact.headline, e.effort, e.partner, e.confidence.label]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, examples]);

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={c.label} number={c.number} headline={c.headline} subtitle={c.subtitle} />
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={c.searchPlaceholder}
                aria-label="Search operational problems"
                className="w-full border border-line bg-surface py-3 pl-10 pr-4 text-[14px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent-deep/20"
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-8 space-y-3">
          {filtered.map((ex, i) => (
            <Reveal key={ex.id} delay={i * 50}>
              <RecommendationCard
                example={ex}
                open={openId === ex.id}
                onToggle={() => setOpenId((cur) => (cur === ex.id ? null : ex.id))}
              />
            </Reveal>
          ))}
          {filtered.length === 0 && (
            <div className="border border-dashed border-line bg-surface px-6 py-10 text-center">
              <p className="text-[15px] font-medium text-ink">{c.noResults}</p>
              <Link
                href="/assessment"
                className="group mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-accent-deep transition-colors hover:text-ink"
              >
                Analyze your own problem
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>

        <Reveal delay={120}>
          <p className="mt-6 text-[11.5px] leading-relaxed text-muted">
            Illustrative decisions for demonstration. Run your own analysis for one specific to your operations.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
