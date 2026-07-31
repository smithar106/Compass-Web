"use client";

import { useState } from "react";
import { marketing } from "@/content/marketing";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { DecideVisual } from "./visuals/DecideVisual";
import { ImplementVisual } from "./visuals/ImplementVisual";
import { MonitorVisual } from "./visuals/MonitorVisual";
import { ImproveVisual } from "./visuals/ImproveVisual";

const VISUALS: Record<string, () => React.ReactNode> = {
  decide: DecideVisual,
  implement: ImplementVisual,
  monitor: MonitorVisual,
  improve: ImproveVisual,
};

const STAGE_COLORS: Record<string, string> = {
  decide: "bg-ink",
  implement: "bg-ink",
  monitor: "bg-ink",
  improve: "bg-accent-deep",
};

export function Lifecycle() {
  const lc = marketing.lifecycle;
  const [active, setActive] = useState("decide");

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow={lc.label}
            number={lc.number}
            headline={lc.headline}
            subtitle={lc.subtitle}
          />
          <Reveal delay={120} className="lg:pb-1">
            <p className="max-w-xs border-l-2 border-accent-deep pl-4 text-[13px] leading-relaxed text-muted">
              {lc.note}
            </p>
          </Reveal>
        </div>

        {/* Desktop: rail + panel */}
        <div className="mt-14 hidden grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-12 lg:grid">
          {/* rail */}
          <div>
            <ol className="relative">
              <span aria-hidden="true" className="absolute left-[15px] top-3 bottom-3 w-px bg-line" />
              {lc.stages.map((stage) => {
                const isActive = active === stage.id;
                return (
                  <li key={stage.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setActive(stage.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "group mb-3 w-full pl-[42px] text-left transition-colors",
                        isActive ? "" : "hover:opacity-80"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute left-0 top-1 flex h-[31px] w-[31px] items-center justify-center rounded-full border text-[11px] font-bold transition-colors",
                          isActive
                            ? cn("border-transparent text-paper", STAGE_COLORS[stage.id])
                            : "border-line bg-surface text-muted"
                        )}
                      >
                        {stage.index}
                      </span>
                      <div className="flex items-center gap-3">
                        <h3
                          className={cn(
                            "text-[16px] font-semibold tracking-tight transition-colors",
                            isActive ? "text-ink" : "text-muted"
                          )}
                        >
                          {stage.name}
                        </h3>
                        <span
                          className={cn(
                            "text-[11px] font-medium",
                            isActive ? "text-accent-deep" : "text-faint"
                          )}
                        >
                          {stage.status}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "mt-0.5 text-[12.5px] leading-snug transition-colors",
                          isActive ? "text-ink" : "text-faint"
                        )}
                      >
                        {stage.question}
                      </p>

                      {/* capabilities expand inline for the active stage */}
                      <div
                        className={cn(
                          "overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isActive ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <p className="mt-3 text-[13px] leading-relaxed text-muted">
                          {stage.capabilityLead}
                        </p>
                        <ul className="mt-3 space-y-2 border-l border-line pl-4">
                          {stage.capabilities.map((cap) => (
                            <li key={cap} className="flex items-start gap-2 text-[12.5px] leading-snug text-muted">
                              <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />
                              {cap}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-faint">
                            Output
                          </span>
                          <span className="text-[12.5px] font-medium text-ink">{stage.output}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* loop close */}
            <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent-deep">
                <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-[12.5px] leading-snug text-muted">
                Improve feeds verified results back into Decide. The system is a loop, not a pipeline.
              </p>
            </div>
          </div>

          {/* active visual */}
          <div key={active} className="animate-fade-in self-start">
            <div className="lg:sticky lg:top-28">
              {(() => {
                const Visual = VISUALS[active];
                return <Visual />;
              })()}
            </div>
          </div>
        </div>

        {/* Mobile: vertical journey */}
        <div className="mt-12 space-y-0 lg:hidden">
          <ol className="relative">
            <span aria-hidden="true" className="absolute bottom-6 left-[15px] top-2 w-px bg-line" />
            {lc.stages.map((stage) => {
              const isActive = active === stage.id;
              const Visual = VISUALS[stage.id];
              return (
                <li key={stage.id} className="relative pb-2 pl-[42px]">
                  <button
                    type="button"
                    onClick={() => setActive(stage.id)}
                    aria-expanded={isActive}
                    aria-controls={`stage-${stage.id}`}
                    className="w-full text-left"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-0 top-1 flex h-[31px] w-[31px] items-center justify-center rounded-full border text-[11px] font-bold",
                        isActive
                          ? cn("border-transparent text-paper", STAGE_COLORS[stage.id])
                          : "border-line bg-surface text-muted"
                      )}
                    >
                      {stage.index}
                    </span>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className={cn("text-[16px] font-semibold tracking-tight", isActive ? "text-ink" : "text-muted")}>
                        {stage.name}
                      </h3>
                      <span className={cn("text-[11px] font-medium", isActive ? "text-accent-deep" : "text-faint")}>
                        {stage.status}
                      </span>
                    </div>
                    <p className={cn("mt-0.5 text-[12.5px]", isActive ? "text-ink" : "text-faint")}>
                      {stage.question}
                    </p>
                  </button>

                  {isActive && (
                    <div id={`stage-${stage.id}`} className="animate-fade-in pb-6">
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">{stage.capabilityLead}</p>
                      <ul className="mt-3 space-y-2">
                        {stage.capabilities.map((cap) => (
                          <li key={cap} className="flex items-start gap-2 text-[12.5px] leading-snug text-muted">
                            <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />
                            {cap}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-faint">
                        Output
                      </p>
                      <p className="mt-0.5 text-[13px] font-medium text-ink">{stage.output}</p>
                      <div className="mt-4">
                        <Visual />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="flex items-start gap-3 border-t border-line pt-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 text-accent-deep">
              <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[12.5px] leading-snug text-muted">
              Improve feeds verified results back into Decide. The system is a loop, not a pipeline.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
