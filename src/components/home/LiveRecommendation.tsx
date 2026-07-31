"use client";

import { useState } from "react";
import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { RecommendationDetail, type ExampleRecommendation } from "./RecommendationDetail";
import { cn } from "@/lib/utils";

export function LiveRecommendation() {
  const lr = marketing.liveRecommendation;
  const examples = marketing.examples as ExampleRecommendation[];

  const byRanking = (label: string) => examples.find((e) => e.ranking === label);
  const [selectedLabel, setSelectedLabel] = useState(lr.rankings[0].label);
  const selected = byRanking(selectedLabel) ?? examples[0];

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionHeader eyebrow={lr.label} number={lr.number} headline={lr.headline} subtitle={lr.subtitle} />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-10">
          {/* ranking list */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">
              Rank the decisions you care about
            </p>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
              {lr.rankings.map((r) => {
                const ex = byRanking(r.label);
                if (!ex) return null;
                const isActive = selectedLabel === r.label;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedLabel(r.label)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex min-w-[210px] flex-col border px-4 py-3.5 text-left transition-colors lg:min-w-0 lg:border-b lg:border-line lg:px-4 lg:py-4 lg:last:border-b-0",
                      isActive ? "border-ink bg-surface" : "border-line bg-paper/40 hover:bg-surface"
                    )}
                  >
                    <span className={cn("text-[12px] font-semibold", isActive ? "text-ink" : "text-muted")}>
                      {r.label}
                    </span>
                    <span className="mt-1 truncate text-[13px] text-muted">{ex.problem}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 border-t border-line pt-4 text-[11.5px] leading-relaxed text-muted">
              {lr.illustrativeNote}
            </p>
          </div>

          {/* detail */}
          <Reveal delay={120}>
            <div key={selected.id} className="animate-fade-in">
              <RecommendationDetail example={selected} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
