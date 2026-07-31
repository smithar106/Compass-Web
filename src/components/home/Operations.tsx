"use client";

import { useState } from "react";
import Link from "next/link";
import { marketing } from "@/content/marketing";
import { SectionHeader } from "./primitives";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Operations() {
  const o = marketing.operations;
  const [active, setActive] = useState(0);
  const current = o.scenarios[active];

  return (
    <section id="for-operations-leaders" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={o.label} number={o.number} headline={o.headline} subtitle={o.subtitle} />
          <Reveal delay={120} className="lg:pb-1">
            <div className="max-w-xs">
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-faint">Who it&apos;s for</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {o.audiences.map((a) => (
                  <li key={a} className="border border-line bg-surface px-2 py-1 text-[11px] font-medium text-muted">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Desktop interactive split */}
        <div className="mt-14 hidden grid-cols-2 gap-12 lg:grid">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div key={active} className="animate-fade-in border-t-2 border-ink pt-6">
                <p className="font-mono text-[12px] font-bold text-accent-deep">
                  {String(active + 1).padStart(2, "0")}
                  <span className="text-faint"> / {String(o.scenarios.length).padStart(2, "0")}</span>
                </p>
                <h3 className="mt-4 text-[26px] font-semibold leading-tight tracking-tight text-ink">
                  {current.title}
                </h3>
                <p className="mt-3 text-lead leading-relaxed text-muted">{current.body}</p>
                <Link
                  href="/assessment"
                  className="mt-7 inline-flex items-center gap-2 text-[14px] font-semibold text-accent-deep transition-colors hover:text-ink"
                >
                  Bring Compass a problem
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>

          <div>
            <ol>
              {o.scenarios.map((s, i) => {
                const isActive = i === active;
                return (
                  <li key={s.title} className="border-b border-line last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={isActive}
                      className={cn(
                        "group flex w-full items-center gap-5 px-2 py-5 text-left transition-colors",
                        isActive ? "bg-surface" : "hover:bg-surface/60"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[11px] font-bold",
                          isActive ? "text-accent-deep" : "text-faint"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-[15px] font-medium leading-snug transition-colors",
                          isActive ? "text-ink" : "text-muted"
                        )}
                      >
                        {s.title}
                      </span>
                      <svg
                        className={cn(
                          "ml-auto h-4 w-4 shrink-0 transition-all",
                          isActive ? "text-ink" : "text-faint opacity-0 group-hover:opacity-100"
                        )}
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Mobile stacked list */}
        <div className="mt-12 lg:hidden">
          <ol>
            {o.scenarios.map((s, i) => (
              <li key={s.title} className="border-t border-line py-5 first:border-t-0">
                <p className="font-mono text-[11px] font-bold text-accent-deep">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-[17px] font-semibold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
