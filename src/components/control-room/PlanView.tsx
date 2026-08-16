import { SectionHeading } from "./ControlRoomShell";

const PLAN = [
  { phase: "1 · Foundation", items: ["Baseline invoice volume and exception classes", "Map current intake + exception workflow", "Define success metrics and review cadence"] },
  { phase: "2 · Automate intake", items: ["Deploy AI/automation for invoice intake", "Redesign exception routing and escalation", "Instrument end-to-end measurement"] },
  { phase: "3 · Scale & harden", items: ["Roll out to full exception portfolio", "Tune hybrid handling on complex cases", "Compare actual vs expected outcomes"] },
];

const RISKS = [
  { risk: "Autonomous handling of complex cases", mitigation: "Hybrid model keeps humans on edge cases" },
  { risk: "Vendor lock-in on intake platform", mitigation: "Contract for portability + data export" },
  { risk: "Measurement lag", mitigation: "Instrument KPIs before go-live" },
];

export function PlanView() {
  return (
    <div>
      <SectionHeading
        kicker="Plan"
        title="Implementation plan"
        sub="Steps, owners, cost, timeline, and risk."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PLAN.map((p) => (
          <div key={p.phase} className="border border-line bg-surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">{p.phase}</p>
            <ul className="mt-3 space-y-2">
              {p.items.map((it) => (
                <li key={it} className="flex gap-2 text-[13px] leading-snug text-ink">
                  <span aria-hidden="true" className="text-muted">·</span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Risks & mitigations</p>
      <div className="mt-3 space-y-2">
        {RISKS.map((r) => (
          <div key={r.risk} className="grid gap-1 border border-line bg-surface px-5 py-3.5 sm:grid-cols-2">
            <p className="text-[13px] font-semibold text-ink">{r.risk}</p>
            <p className="text-[13px] text-muted">{r.mitigation}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-line bg-surface p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Estimate</p>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { v: "9–12 mo", l: "Payback" },
            { v: "3 phases", l: "Rollout" },
            { v: "Ops + IT", l: "Owners" },
            { v: "$0.5–0.9M", l: "CapEx range" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-[18px] font-semibold text-ink">{s.v}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
