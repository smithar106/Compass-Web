"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RecommendationDetail, type ExampleRecommendation } from "./RecommendationDetail";

export function RecommendationCard({ example, open, onToggle }: { example: ExampleRecommendation; open: boolean; onToggle: () => void }) {
  const e = example;
  return (
    <article className="border border-line bg-surface transition-colors hover:border-ink/40">
      {/* case-study header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full px-5 pb-4 pt-4 text-left"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight text-ink">{e.problem}</h3>
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

        {/* decision flow */}
        <div className="mt-4">
          <FlowRow label="Decision" value={e.intervention} />
          <FlowConnector />
          <FlowRow
            label="Evidence"
            value={`${e.evidence.tier} \u00b7 ${e.evidence.comparables} comparable implementations \u00b7 ${e.evidence.validated} independently validated`}
          />
          <FlowConnector />
          <FlowRow label="Outcome" value={`${e.impact.range} \u00b7 ${e.roi.range} / yr \u00b7 payback ${e.roi.payback}`} />
          <FlowConnector />
          <FlowRow label="Partner" value={e.partner} />
          <FlowConnector />
          <FlowRow label="Owner" value={`${e.ownership.owner} \u00b7 review ${e.ownership.review}`} />
          <FlowConnector />
          <FlowRow label="Lessons learned" value={e.learning} />
        </div>
      </button>

      {open && (
        <div className="border-t border-line">
          <RecommendationDetail example={e} />
        </div>
      )}
    </article>
  );
}

function FlowRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line/60 py-2 last:border-b-0">
      <span className="shrink-0 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-faint">
        {label}
      </span>
      <span className="text-right text-[13px] font-medium leading-snug text-ink">{value}</span>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex justify-center py-0.5" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-faint">
        <path d="M8 2v11M3.5 9 8 13.5 12.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
