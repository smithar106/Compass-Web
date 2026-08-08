"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getImplementation,
  updatePhase,
  addOutcome,
  addRisk,
  resolveRisk,
  generateExecutiveBrief,
  type Implementation,
  type TrackedOutcome,
  type PhaseStatus,
} from "@/lib/implementation";

const STATUS_CLASS: Record<PhaseStatus, string> = {
  not_started: "text-[#8C8776] bg-[#f5f2ea] border-[#E4DBC7]",
  in_progress: "text-[#0E7C8C] bg-[rgba(14,124,140,0.09)] border-[rgba(14,124,140,0.32)]",
  blocked: "text-[#B45309] bg-[#FBF0E0] border-[#B45309]",
  complete: "text-[#1E7B4C] bg-[#E5F3EA] border-[#1E7B4C]",
};

const HEALTH_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  on_track: { label: "On Track", color: "#1E7B4C", bg: "#E5F3EA" },
  at_risk: { label: "At Risk", color: "#B45309", bg: "#FBF0E0" },
  blocked: { label: "Blocked", color: "#C4382C", bg: "#FAE9E7" },
  complete: { label: "Complete", color: "#0E7C8C", bg: "rgba(14,124,140,0.09)" },
};

function KpiCard({ label, value, subtitle }: { label: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-[10px] border border-[#E4DBC7] bg-[#FCFAF3] px-6 py-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5A6072]">{label}</p>
      <p className="mt-2 text-[clamp(1.6rem,3vw,2.2rem)] font-light leading-none tracking-[-0.02em] text-[#14203A] tabular-nums">
        {value}
      </p>
      {subtitle && <p className="mt-1.5 text-[12px] leading-snug text-[#5A6072]">{subtitle}</p>}
    </div>
  );
}

export default function ImplementationCommandCenter() {
  const params = useParams<{ implementation_id: string }>();
  const router = useRouter();
  const [impl, setImpl] = useState<Implementation | null>(null);
  const [loading, setLoading] = useState(true);
  const [brief, setBrief] = useState("");
  const [newOutcome, setNewOutcome] = useState({ label: "", target: "", actual: "", unit: "%" });
  const [newRisk, setNewRisk] = useState("");
  const [newBlocker, setNewBlocker] = useState("");
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);

  const loadImpl = useCallback(() => {
    const data = getImplementation(params.implementation_id);
    setImpl(data);
    if (data) setBrief(generateExecutiveBrief(data));
    setLoading(false);
  }, [params.implementation_id]);

  useEffect(() => {
    loadImpl();
  }, [loadImpl]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-10 text-center text-muted">
        Loading implementation…
      </div>
    );
  }

  if (!impl) {
    return (
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-eyebrow text-accent-deep">
          Implementation Command Center
        </p>
        <h1 className="mt-3 text-2xl font-bold text-ink">Implementation not found</h1>
        <p className="mt-3 text-sm text-muted">
          This implementation does not exist or has been removed.
        </p>
        <Link
          href="/workspace"
          className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink2"
        >
          Return to Workspace
        </Link>
      </div>
    );
  }

  const handlePhaseStatus = (phaseIndex: number, status: PhaseStatus) => {
    const updated = updatePhase(impl, phaseIndex, { status });
    setImpl(updated);
    setBrief(generateExecutiveBrief(updated));
  };

  const handleAddOutcome = () => {
    if (!newOutcome.label || !newOutcome.actual) return;
    const updated = addOutcome(impl, {
      label: newOutcome.label,
      target: newOutcome.target,
      actual: newOutcome.actual,
      unit: newOutcome.unit,
      updatedAt: new Date().toISOString(),
    });
    setImpl(updated);
    setBrief(generateExecutiveBrief(updated));
    setNewOutcome({ label: "", target: "", actual: "", unit: "%" });
    setShowOutcomeForm(false);
  };

  const health = HEALTH_LABEL[impl.health] || HEALTH_LABEL.on_track;

  return (
    <div className="mx-auto max-w-5xl px-5 pt-28 pb-20 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent-deep">
            Implementation Command Center
          </p>
          <h1 className="mt-1.5 text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.02em] text-[#14203A]">
            {impl.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[#5A6072]">
            <span>Phase {impl.currentPhase} of {impl.phases.length}</span>
            <span aria-hidden="true">·</span>
            <span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold"
                style={{ color: health.color, borderColor: health.color, backgroundColor: health.bg }}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: health.color }} />
                {health.label}
              </span>
            </span>
          </div>
        </div>
        <Link
          href={`/decisions/${impl.decisionId}`}
          className="text-[13px] font-semibold text-accent-deep transition-colors hover:text-ink"
        >
          ← Back to Decision
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Implementation Phase" value={`${impl.currentPhase} of ${impl.phases.length}`} subtitle={impl.phases[impl.currentPhase - 1]?.name} />
        <KpiCard label="Partner" value={impl.partnerType === "internal" ? "Internal Team" : impl.partnerName || "Not Selected"} />
        <KpiCard label="Owner" value={impl.owner || "Unassigned"} />
        <KpiCard label="Approved" value={new Date(impl.approvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
      </div>

      {/* Impact / Outcomes */}
      {impl.expectedOutcomes.length > 0 && (
        <div className="mt-8">
          <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em] text-[#14203A]">Expected Impact</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {impl.expectedOutcomes.map((o) => {
              const actual = impl.actualOutcomes.find((a) => a.label === o.label);
              return (
                <div key={o.label} className="rounded-[10px] border border-[#E4DBC7] bg-[#FCFAF3] px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5A6072]">{o.label}</p>
                  <p className="mt-2 text-[1.4rem] font-light leading-none text-[#14203A] tabular-nums">
                    {actual?.actual || "—"}
                    <span className="ml-1 text-[0.8rem] text-[#5A6072]">{o.unit}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#5A6072]">
                    Target: {o.target}{o.unit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phases + Brief side by side */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Phases */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em] text-[#14203A]">Implementation Phases</h2>
          <div className="mt-4 space-y-0">
            {impl.phases.map((phase, i) => (
              <div
                key={phase.name}
                className="grid grid-cols-[36px_1fr] gap-x-4 gap-y-1 py-5"
                style={{ borderTop: i > 0 ? "1px solid #E4DBC7" : "none" }}
              >
                <span className="pt-0.5 font-mono text-[12px] font-semibold text-[#0E7C8C]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#14203A]">{phase.name}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_CLASS[phase.status]}`}
                    >
                      {phase.status.replace("_", " ")}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#5A6072]">{phase.timeline}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-[#5A6072]">
                    Team: <span className="font-medium text-[#14203A]">{phase.team}</span>
                  </p>
                  <p className="mt-1 text-[12px] leading-[1.5] text-[#5A6072]">{phase.detail}</p>

                  {/* Phase action buttons */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {phase.status !== "complete" && (
                      <button
                        onClick={() => handlePhaseStatus(i, "complete")}
                        className="rounded border border-[#1E7B4C] px-2.5 py-1 text-[11px] font-semibold text-[#1E7B4C] hover:bg-[#E5F3EA]"
                      >
                        Mark Complete
                      </button>
                    )}
                    {phase.status !== "in_progress" && phase.status !== "complete" && (
                      <button
                        onClick={() => handlePhaseStatus(i, "in_progress")}
                        className="rounded border border-[#0E7C8C] px-2.5 py-1 text-[11px] font-semibold text-[#0E7C8C] hover:bg-[rgba(14,124,140,0.09)]"
                      >
                        Start Phase
                      </button>
                    )}
                    {phase.status !== "blocked" && phase.status !== "complete" && (
                      <button
                        onClick={() => handlePhaseStatus(i, "blocked")}
                        className="rounded border border-[#B45309] px-2.5 py-1 text-[11px] font-semibold text-[#B45309] hover:bg-[#FBF0E0]"
                      >
                        Block
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Brief + Risks sidebar */}
        <div className="space-y-6">
          {/* Executive Implementation Brief */}
          <div className="rounded-[10px] border border-[#E4DBC7] bg-[#FCFAF3] p-5">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0E7C8C]">
              Compass Implementation Brief
            </h3>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-[12.5px] leading-[1.55] text-[#14203A]">
              {brief}
            </pre>
          </div>

          {/* Risks & Blockers */}
          <div className="space-y-4">
            <div>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A6072]">
                Risks ({impl.risks.filter((r) => !r.resolved).length} open)
              </h3>
              {impl.risks.filter((r) => !r.resolved).length === 0 && (
                <p className="mt-1 text-[12px] text-[#8C8776]">No open risks.</p>
              )}
              {impl.risks.filter((r) => !r.resolved).map((r) => (
                <div key={r.id} className="mt-2 flex items-start justify-between gap-2 text-[12px] text-[#5A6072]">
                  <span>{r.description}</span>
                  <button
                    onClick={() => { const u = resolveRisk(impl, r.id); setImpl(u); setBrief(generateExecutiveBrief(u)); }}
                    className="shrink-0 text-[11px] font-semibold text-[#1E7B4C] hover:underline"
                  >
                    Resolve
                  </button>
                </div>
              ))}
              <div className="mt-2 flex gap-2">
                <input
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value)}
                  placeholder="Add risk…"
                  className="flex-1 rounded border border-[#E4DBC7] px-2.5 py-1.5 text-[12px] text-[#14203A] outline-none focus:border-[#0E7C8C]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newRisk.trim()) {
                      const u = addRisk(impl, newRisk.trim());
                      setImpl(u); setBrief(generateExecutiveBrief(u)); setNewRisk("");
                    }
                  }}
                />
                <button
                  onClick={() => { if (newRisk.trim()) { const u = addRisk(impl, newRisk.trim()); setImpl(u); setBrief(generateExecutiveBrief(u)); setNewRisk(""); } }}
                  className="rounded border border-[#E4DBC7] px-3 py-1.5 text-[11px] font-semibold text-[#5A6072] hover:bg-[#FCFAF3]"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#B45309]">
                Blockers ({impl.blockers.filter((r) => !r.resolved).length} open)
              </h3>
              {impl.blockers.filter((r) => !r.resolved).length === 0 && (
                <p className="mt-1 text-[12px] text-[#8C8776]">No open blockers.</p>
              )}
              {impl.blockers.filter((r) => !r.resolved).map((r) => (
                <div key={r.id} className="mt-2 flex items-start justify-between gap-2 text-[12px] text-[#B45309]">
                  <span>{r.description}</span>
                  <button
                    onClick={() => { const u = resolveRisk(impl, r.id); setImpl(u); setBrief(generateExecutiveBrief(u)); }}
                    className="shrink-0 text-[11px] font-semibold text-[#1E7B4C] hover:underline"
                  >
                    Resolve
                  </button>
                </div>
              ))}
              <div className="mt-2 flex gap-2">
                <input
                  value={newBlocker}
                  onChange={(e) => setNewBlocker(e.target.value)}
                  placeholder="Add blocker…"
                  className="flex-1 rounded border border-[#E4DBC7] px-2.5 py-1.5 text-[12px] text-[#14203A] outline-none focus:border-[#B45309]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newBlocker.trim()) {
                      const u = addRisk(impl, newBlocker.trim(), true);
                      setImpl(u); setBrief(generateExecutiveBrief(u)); setNewBlocker("");
                    }
                  }}
                />
                <button
                  onClick={() => { if (newBlocker.trim()) { const u = addRisk(impl, newBlocker.trim(), true); setImpl(u); setBrief(generateExecutiveBrief(u)); setNewBlocker(""); } }}
                  className="rounded border border-[#E4DBC7] px-3 py-1.5 text-[11px] font-semibold text-[#B45309] hover:bg-[#FBF0E0]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Outcome entry */}
          <div>
            <button
              onClick={() => setShowOutcomeForm(!showOutcomeForm)}
              className="text-[12px] font-semibold text-[#0E7C8C] hover:underline"
            >
              {showOutcomeForm ? "Cancel" : "+ Record Outcome"}
            </button>
            {showOutcomeForm && (
              <div className="mt-2 space-y-2 rounded-[10px] border border-[#E4DBC7] bg-[#FCFAF3] p-4">
                <input
                  value={newOutcome.label}
                  onChange={(e) => setNewOutcome({ ...newOutcome, label: e.target.value })}
                  placeholder="KPI label (e.g. Cost reduction)"
                  className="w-full rounded border border-[#E4DBC7] px-2.5 py-1.5 text-[12px] text-[#14203A] outline-none focus:border-[#0E7C8C]"
                />
                <div className="flex gap-2">
                  <input
                    value={newOutcome.target}
                    onChange={(e) => setNewOutcome({ ...newOutcome, target: e.target.value })}
                    placeholder="Target"
                    className="flex-1 rounded border border-[#E4DBC7] px-2.5 py-1.5 text-[12px] text-[#14203A] outline-none focus:border-[#0E7C8C]"
                  />
                  <input
                    value={newOutcome.actual}
                    onChange={(e) => setNewOutcome({ ...newOutcome, actual: e.target.value })}
                    placeholder="Actual"
                    className="flex-1 rounded border border-[#E4DBC7] px-2.5 py-1.5 text-[12px] text-[#14203A] outline-none focus:border-[#0E7C8C]"
                  />
                </div>
                <button
                  onClick={handleAddOutcome}
                  className="w-full rounded bg-[#0E7C8C] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#0A616E]"
                >
                  Record Outcome
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
