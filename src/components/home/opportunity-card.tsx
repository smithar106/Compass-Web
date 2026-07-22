"use client";

import { useState } from "react";
import type { Opportunity } from "@/types";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const confidenceColors: Record<string, string> = {
  High: "bg-forest text-white",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-red-400 text-white",
};

const evidenceBadgeColors: Record<string, string> = {
  User: "bg-blue-100 text-blue-800",
  Research: "bg-mist text-forest",
  Inference: "bg-amber-100 text-amber-800",
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const opp = opportunity;

  return (
    <div className="border border-border rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 hover:bg-cream/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center text-sm font-medium">
              {opp.rank}
            </span>
            <div>
              <p className="text-xs text-stone font-medium uppercase tracking-wider">{opp.department}</p>
              <h3 className="text-lg font-semibold text-ink mt-0.5">{opp.name}</h3>
            </div>
          </div>
          <span
            className={cn(
              "flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium",
              confidenceColors[opp.confidence]
            )}
          >
            {opp.confidence}
          </span>
        </div>
        <p className="mt-2 text-sm text-stone ml-12">{opp.description}</p>
      </button>

      {expanded && (
        <div className="border-t border-border px-6 py-5 space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">Evidence Classification</h4>
            <div className="space-y-2">
              {opp.evidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span
                    className={cn(
                      "flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium",
                      evidenceBadgeColors[ev.type]
                    )}
                  >
                    [{ev.type}]
                  </span>
                  <span className="text-ink">{ev.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">KPIs</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {opp.kpis.map((kpi, i) => (
                <div key={i} className="border border-border rounded p-3">
                  <p className="text-xs text-stone">{kpi.metric}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-stone">{kpi.current}</span>
                    <span className="text-sm font-medium text-ink">→ {kpi.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">Implementation Phases</h4>
            <div className="space-y-3">
              {opp.phases.map((phase, i) => (
                <div key={i} className="border border-border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-ink">
                      Phase {i + 1}: {phase.phase}
                    </h5>
                    <span className="text-xs text-stone">{phase.duration}</span>
                  </div>
                  <ul className="space-y-1">
                    {phase.steps.map((step, j) => (
                      <li key={j} className="text-sm text-stone flex items-start gap-2">
                        <span className="text-forest mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                  {phase.dependencies.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-xs text-stone">Depends on: </span>
                      <span className="text-xs text-ink">{phase.dependencies.join(", ")}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-mist/50 rounded p-3">
            <span className="text-xs font-semibold text-stone uppercase">Tradeoff: </span>
            <span className="text-sm text-ink">{opp.tradeoff}</span>
          </div>
        </div>
      )}
    </div>
  );
}
