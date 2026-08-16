"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DecisionView } from "./DecisionView";
import { EvidenceView } from "./EvidenceView";
import { PlanView } from "./PlanView";
import { MonitorView } from "./MonitorView";

const TABS = [
  { key: "decision", label: "DECISION" },
  { key: "evidence", label: "EVIDENCE" },
  { key: "plan", label: "PLAN" },
  { key: "monitor", label: "MONITOR" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

export function ControlRoomShell() {
  const [tab, setTab] = useState<TabKey>("decision");

  return (
    <div>
      {/* tab bar */}
      <nav aria-label="Control room sections" className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-stretch gap-0 px-5 sm:px-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "border-b-2 px-5 py-3.5 text-[12.5px] font-bold uppercase tracking-[0.12em] transition-colors",
                tab === t.key
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        {tab === "decision" && <DecisionView />}
        {tab === "evidence" && <EvidenceView />}
        {tab === "plan" && <PlanView />}
        {tab === "monitor" && <MonitorView />}
      </div>
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">{kicker}</p>
      <h2 className="mt-1.5 text-[28px] font-semibold tracking-tight text-ink sm:text-[32px]">{title}</h2>
      {sub && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

export function ReviewCta() {
  return (
    <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
      <Link
        href="/assessment"
        className="inline-flex items-center gap-1.5 bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-ink2"
      >
        Review decision
        <span aria-hidden="true">→</span>
      </Link>
      <Link
        href="/assessment"
        className="inline-flex items-center gap-1.5 border border-line px-5 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40"
      >
        View implementation plan
      </Link>
    </div>
  );
}
