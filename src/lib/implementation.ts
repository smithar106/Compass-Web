/**
 * Implementation Command Center — data model, storage, and business logic.
 *
 * Persists implementation records client-side via localStorage, following the
 * same pattern as the workspace decision registry (src/lib/workspace.ts).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PhaseStatus = "not_started" | "in_progress" | "blocked" | "complete";
export type Health = "on_track" | "at_risk" | "blocked" | "complete";
export type PartnerType = "internal" | "external" | "not_selected";

export interface ImplementationPhase {
  name: string;
  timeline: string;
  detail: string;
  team: string;
  status: PhaseStatus;
  completedAt?: string;
  notes?: string;
}

export interface TrackedOutcome {
  label: string;
  target: string;
  actual?: string;
  unit: string;
  updatedAt?: string;
}

export interface ImplementationRisk {
  id: string;
  description: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface Implementation {
  implementationId: string;
  decisionId: string;
  title: string;
  status: "active" | "completed" | "archived";
  health: Health;
  currentPhase: number; // 1-indexed
  createdAt: string;
  approvedAt: string;
  targetCompletionDate?: string;
  completedAt?: string;
  owner?: string;
  executiveSponsor?: string;
  partnerType: PartnerType;
  partnerName?: string;
  partnerContact?: string;
  approvedDecisionSnapshot: Record<string, unknown>;
  expectedOutcomes: TrackedOutcome[];
  actualOutcomes: TrackedOutcome[];
  phases: ImplementationPhase[];
  risks: ImplementationRisk[];
  blockers: ImplementationRisk[];
  notes?: string;
  lastUpdated: string;
}

// ---------------------------------------------------------------------------
// Registry (localStorage)
// ---------------------------------------------------------------------------

const REGISTRY_KEY = "compass-implementation-registry";

export interface ImplementationRegistryEntry {
  implementationId: string;
  decisionId: string;
  title: string;
  status: Implementation["status"];
  health: Health;
  currentPhase: number;
  totalPhases: number;
  createdAt: string;
}

function loadRegistry(): ImplementationRegistryEntry[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegistry(entries: ImplementationRegistryEntry[]): void {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(entries.slice(0, 100)));
  } catch { /* quota exceeded — silently drop oldest */ }
}

function registerImplementation(impl: Implementation): void {
  const entries = loadRegistry();
  const existing = entries.findIndex((e) => e.implementationId === impl.implementationId);
  const entry: ImplementationRegistryEntry = {
    implementationId: impl.implementationId,
    decisionId: impl.decisionId,
    title: impl.title,
    status: impl.status,
    health: impl.health,
    currentPhase: impl.currentPhase,
    totalPhases: impl.phases.length,
    createdAt: impl.createdAt,
  };
  if (existing >= 0) {
    entries[existing] = entry;
  } else {
    entries.unshift(entry);
  }
  saveRegistry(entries);
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

const IMPL_PREFIX = "compass-impl-";

function storageKey(implementationId: string): string {
  return `${IMPL_PREFIX}${implementationId}`;
}

export function getImplementation(implementationId: string): Implementation | null {
  try {
    const raw = localStorage.getItem(storageKey(implementationId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveImplementation(impl: Implementation): void {
  try {
    localStorage.setItem(storageKey(impl.implementationId), JSON.stringify(impl));
    registerImplementation(impl);
  } catch { /* ignore quota */ }
}

export function loadRegistryEntries(): ImplementationRegistryEntry[] {
  return loadRegistry();
}

// ---------------------------------------------------------------------------
// Command Center business logic
// ---------------------------------------------------------------------------

export function computeHealth(impl: Implementation): Health {
  if (impl.status === "completed") return "complete";
  if (impl.blockers.some((b) => !b.resolved)) return "blocked";

  const phases = impl.phases;
  // A phase is behind if it's incomplete but a later phase is complete
  let highestComplete = -1;
  let lowestIncomplete = -1;
  for (let i = 0; i < phases.length; i++) {
    if (phases[i].status === "complete") {
      highestComplete = Math.max(highestComplete, i);
    } else if (lowestIncomplete === -1) {
      lowestIncomplete = i;
    }
  }
  if (lowestIncomplete >= 0 && highestComplete > lowestIncomplete) {
    return "at_risk";
  }

  // KPI underperformance
  for (const o of impl.actualOutcomes) {
    if (o.actual) {
      const t = parseFloat(o.target);
      const a = parseFloat(o.actual);
      if (!isNaN(t) && !isNaN(a)) {
        if (o.label.toLowerCase().includes("savings") && a < t * 0.85) return "at_risk";
      }
    }
  }

  return "on_track";
}

export function createImplementation(params: {
  decisionId: string;
  title: string;
  approvedDecisionSnapshot: Record<string, unknown>;
  phases: ImplementationPhase[];
  expectedOutcomes: TrackedOutcome[];
  owner?: string;
  executiveSponsor?: string;
  partnerType?: PartnerType;
}): Implementation {
  const now = new Date().toISOString();
  const phasesWithStatus: ImplementationPhase[] = params.phases.map((p, i) => ({
    ...p,
    status: i === 0 ? "in_progress" : "not_started",
  }));

  const impl: Implementation = {
    implementationId: `impl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    decisionId: params.decisionId,
    title: params.title,
    status: "active",
    health: "on_track",
    currentPhase: 1,
    createdAt: now,
    approvedAt: now,
    owner: params.owner,
    executiveSponsor: params.executiveSponsor,
    partnerType: params.partnerType || "not_selected",
    approvedDecisionSnapshot: params.approvedDecisionSnapshot,
    expectedOutcomes: params.expectedOutcomes,
    actualOutcomes: [],
    phases: phasesWithStatus,
    risks: [],
    blockers: [],
    lastUpdated: now,
  };

  saveImplementation(impl);
  return impl;
}

export function updatePhase(
  impl: Implementation,
  phaseIndex: number,
  updates: Partial<ImplementationPhase>,
): Implementation {
  const updated = { ...impl, phases: [...impl.phases], lastUpdated: new Date().toISOString() };
  updated.phases[phaseIndex] = { ...updated.phases[phaseIndex], ...updates };

  // Advance current phase if this phase was just completed
  const nextIncomplete = updated.phases.findIndex((p) => p.status !== "complete");
  updated.currentPhase = nextIncomplete >= 0 ? nextIncomplete + 1 : impl.phases.length;

  // If all phases complete, mark as completed
  if (updated.phases.every((p) => p.status === "complete")) {
    updated.status = "completed";
    updated.completedAt = new Date().toISOString();
  }

  updated.health = computeHealth(updated);
  saveImplementation(updated);
  return updated;
}

export function addOutcome(
  impl: Implementation,
  outcome: TrackedOutcome,
): Implementation {
  const updated = { ...impl, lastUpdated: new Date().toISOString() };
  const existing = updated.actualOutcomes.findIndex((o) => o.label === outcome.label);
  if (existing >= 0) {
    updated.actualOutcomes = [...updated.actualOutcomes];
    updated.actualOutcomes[existing] = { ...outcome };
  } else {
    updated.actualOutcomes = [...updated.actualOutcomes, outcome];
  }
  updated.health = computeHealth(updated);
  saveImplementation(updated);
  return updated;
}

export function addRisk(impl: Implementation, description: string, isBlocker = false): Implementation {
  const risk: ImplementationRisk = {
    id: `risk_${Date.now()}`,
    description,
    resolved: false,
    createdAt: new Date().toISOString(),
  };
  const updated = { ...impl, lastUpdated: new Date().toISOString() };
  if (isBlocker) {
    updated.blockers = [...impl.blockers, risk];
  } else {
    updated.risks = [...impl.risks, risk];
  }
  updated.health = computeHealth(updated);
  saveImplementation(updated);
  return updated;
}

export function resolveRisk(impl: Implementation, riskId: string): Implementation {
  const updated = { ...impl, lastUpdated: new Date().toISOString() };
  updated.risks = updated.risks.map((r) =>
    r.id === riskId ? { ...r, resolved: true, resolvedAt: new Date().toISOString() } : r,
  );
  updated.blockers = updated.blockers.map((r) =>
    r.id === riskId ? { ...r, resolved: true, resolvedAt: new Date().toISOString() } : r,
  );
  updated.health = computeHealth(updated);
  saveImplementation(updated);
  return updated;
}

export function findImplementationByDecision(decisionId: string): Implementation | null {
  const entries = loadRegistry();
  const match = entries.find((e) => e.decisionId === decisionId);
  if (!match) return null;
  return getImplementation(match.implementationId);
}

/**
 * Generate an executive implementation brief from the current state.
 * Never invents causal explanations when data is insufficient.
 */
export function generateExecutiveBrief(impl: Implementation): string {
  const lines: string[] = [];

  // Status
  if (impl.health === "on_track") {
    lines.push("Status: On Track");
    lines.push(`The implementation is in Phase ${impl.currentPhase} of ${impl.phases.length} and progressing as planned.`);
  } else if (impl.health === "at_risk") {
    lines.push("Status: At Risk");
    const delayed = impl.phases.filter((p, i) => i + 1 < impl.currentPhase && p.status !== "complete");
    if (delayed.length > 0) {
      lines.push(`${delayed.length} phase${delayed.length > 1 ? "s" : ""} behind schedule.`);
    }
    // Check KPI underperformance
    for (const o of impl.actualOutcomes) {
      if (o.actual) {
        const t = parseFloat(o.target);
        const a = parseFloat(o.actual);
        if (!isNaN(t) && !isNaN(a) && o.label.toLowerCase().includes("savings") && a < t * 0.85) {
          lines.push(`${o.label} is at ${o.actual} — below the ${o.target} target.`);
        }
      }
    }
    lines.push("Recommended action: Review delayed phases and underperforming KPIs before advancing.");
  } else if (impl.health === "blocked") {
    lines.push("Status: Blocked");
    const activeBlockers = impl.blockers.filter((b) => !b.resolved);
    lines.push(`${activeBlockers.length} blocker${activeBlockers.length !== 1 ? "s" : ""} require resolution:`);
    activeBlockers.slice(0, 3).forEach((b) => lines.push(`  - ${b.description}`));
  } else if (impl.health === "complete") {
    lines.push("Status: Complete");
    lines.push("All phases have been completed. Final outcomes should be recorded.");
  }

  // What changed
  if (impl.actualOutcomes.length > 0) {
    lines.push("");
    lines.push("Measured outcomes:");
    impl.actualOutcomes.slice(0, 5).forEach((o) => {
      const status = o.actual ? `${o.actual} (target: ${o.target})` : "Not yet measured";
      lines.push(`  ${o.label}: ${status}`);
    });
  } else {
    lines.push("");
    lines.push("Current implementation data is insufficient to determine measured outcomes.");
  }

  return lines.join("\n");
}
