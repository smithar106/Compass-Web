"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RecommendationDetail, type ExampleRecommendation } from "./RecommendationDetail";

export function RecommendationCard({ example, open, onToggle }: { example: ExampleRecommendation; open: boolean; onToggle: () => void }) {
  const e = example;
  return (
    <article className="border border-line bg-surface transition-colors hover:border-ink/40">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full px-5 py-4 text-left"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">{e.problem}</h3>
          <span className="flex items-center gap-2">
            <span className="border border-line bg-paper px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-faint">
              Illustrative
            </span>
            <svg
              className={cn("h-3.5 w-3.5 text-muted transition-transform", open && "rotate-90")}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <p className="mt-0.5 text-[13px] text-muted">{e.intervention}</p>

        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line/70 pt-3 sm:grid-cols-4">
          <MetaItem label="Confidence" value={`${e.confidence.label} · ${Math.round(e.confidence.score * 100)}%`} />
          <MetaItem label="Evidence" value={`${e.evidence.tier} · ${e.evidence.comparables} comparable`} />
          <MetaItem label="Effort" value={e.effort} />
          <MetaItem label="Impact" value={e.impact.range} />
          <MetaItem label="Partner" value={e.partner} />
          <MetaItem label="Learning" value={e.learning} />
        </dl>
      </button>

      {open && (
        <div className="border-t border-line">
          <RecommendationDetail example={e} />
        </div>
      )}
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-faint">{label}</dt>
      <dd className="mt-0.5 truncate text-[12.5px] font-medium text-ink">{value}</dd>
    </div>
  );
}
