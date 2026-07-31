"use client";

import { useState } from "react";
import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Anatomy() {
  const a = marketing.anatomy;
  const [activeId, setActiveId] = useState(a.questions[0].id);
  const [showTechnical, setShowTechnical] = useState(false);

  const active = a.questions.find((q) => q.id === activeId)!;

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={a.label} number={a.number} headline={a.headline} subtitle={a.subtitle} />
        </div>

        <Reveal delay={140}>
          <div className="mt-12 overflow-hidden border border-line bg-surface">
            {/* report header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper/60 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink font-mono text-[10px] font-bold text-paper">
                  R
                </span>
                <span className="text-[12px] font-semibold tracking-wide text-ink">{a.reportNote}</span>
              </div>
              <span className="font-mono text-[11px] text-faint">{a.reportProblem}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
              {/* question nav */}
              <div className="border-b border-line lg:border-b-0 lg:border-r">
                <ol className="no-scrollbar flex gap-2 overflow-x-auto p-4 lg:flex-col lg:gap-0 lg:overflow-visible lg:p-0">
                  {a.questions.map((q, i) => {
                    const isActive = q.id === activeId;
                    return (
                      <li key={q.id} className="lg:border-b lg:border-line/60 lg:last:border-b-0">
                        <button
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => {
                            setActiveId(q.id);
                            setShowTechnical(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors lg:px-5",
                            isActive ? "bg-paper" : "hover:bg-paper/60"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center font-mono text-[10px] font-bold",
                              isActive ? "bg-accent-deep text-paper" : "bg-line text-muted"
                            )}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "whitespace-nowrap text-[13px] font-medium leading-snug lg:whitespace-normal",
                              isActive ? "text-ink" : "text-muted"
                            )}
                          >
                            {q.question}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* answer panel */}
              <div className="p-5 sm:p-7">
                <div key={activeId} className="animate-fade-in">
                  <h3 className="text-[17px] font-semibold tracking-tight text-ink">{active.question}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{active.answer}</p>

                  <div className="mt-6 border-t border-line pt-5">
                    <button
                      type="button"
                      onClick={() => setShowTechnical((v) => !v)}
                      aria-expanded={showTechnical}
                      className="group inline-flex items-center gap-2 text-[12.5px] font-semibold text-accent-deep"
                    >
                      <svg
                        className={cn("h-3.5 w-3.5 transition-transform", showTechnical && "rotate-90")}
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {showTechnical ? "Hide technical detail" : "Technical detail"}
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-[max-height,opacity] duration-500 ease-out",
                        showTechnical ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="mt-3 border-l-2 border-line bg-paper px-4 py-3.5">
                        <p className="font-mono text-[11px] leading-relaxed text-muted">{active.technical}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
