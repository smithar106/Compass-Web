# Live Decision Provider — intended interface (not yet implemented)

This document defines the contract the Compass-Web prototype will consume when
the deterministic prototype layer is replaced by the live engine. **Nothing in
this document is implemented yet** — it is the agreed target interface so the
two codebases can be wired without rework.

## Current state

- `/prototype` renders from `src/data/prototype/*` + `src/lib/prototype/recommendation.ts`
  (`resolveDecision(problemId, answers)`). Pure, deterministic, zero engine calls.
- The engine (`Compass-Engine`) serves `/api/recommendations` and now retrieves
  evidence through the taxonomy-normalized matcher (`workflow_relations.py`).
- The retrieval fix is validated for **7 of 10** prototype problems. Three are
  genuinely thin (`late-escalations`, `sales-handoff-rework`,
  `hard-to-find-information`) and must render "Needs more evidence".

## Target flow

```
prototype problemId ("manual-invoice-processing")
    ↓
structured problem definition (src/lib/prototype/problem-definitions.ts)
    canonical workflow: "invoice_processing"
    problem concepts: ["invoice", "accounts payable", "processing"]
    outcome objective: "cost"
    optional industry / company size (from context answers)
    ↓
ImplementationQuery (engine)
    ↓
normalized workflow taxonomy (workflow_relations.py)
    ↓
retrieval → ranked comparable implementations
    ↓
recommendation engine → ranked interventions
    ↓
mapper: engine payload → PrototypeDecision-compatible payload
    ↓
existing CompassDecision UI (unchanged)
```

## Mapper contract

The `liveDecisionProvider` must return a `PrototypeDecision` (see
`src/types/prototype.ts`) so the UI does not change. Mapping rules:

| PrototypeDecision field | Engine source |
|---|---|
| `problem`, `category` | problem definition (stable) |
| `recommendation` | `recommendations[0].title` |
| `strategy` | `recommendations[0].specific_action` or `why_ranked_first.summary` |
| `decisionStatus` | `defensible` if `confidence.score >= 0.6`; `directionally_supported` if `>= 0.4`; else `needs_more_evidence` |
| `expectedImpact` | `impact_summary` headline or `outcome_ranges` median |
| `comparableExamples` | `comparable_implementations` → declarative sentence per record (org + intervention + observed_outcome) |
| `whyThis` | `why_ranked_first.supporting_reasons` |
| `alternatives` | `alternatives_considered` → name + reason |
| `implementationPlan` | `next_validation_step` + `recommendations[0].impact.implementation_timeline` |
| `risks` | `recommendations[0].risks` |
| `measurement` | `next_validation_step` (success criteria → validation points) |
| `whatWouldChangeThis` | `information_gaps` + `assumptions_detail` |

## Key rules

1. **The UX label is never the retrieval query.** Each prototype problem
   resolves to a structured problem definition (canonical workflow + concepts),
   keeping UI vocabulary separate from evidence taxonomy.
2. **Thin problems render honestly.** If the engine returns fewer than N
   citable comparables (threshold TBD after recalibration), the brief shows
   `Needs more evidence` with the engine's actual `information_gaps` and
   `next_validation_step` — never fabricated comparables.
3. **No provenance leakage into the brief.** The board-presentation UI must not
   show "N comparable implementations", "evidence tier", or provenance tags.
   The engine's numbers stay internal (or in a developer view).
4. **Deterministic fallback.** Until threshold recalibration + thin-problem
   guards land, the prototype may keep serving curated data; the provider is a
   drop-in behind the same `resolveDecision` signature.

## Prerequisites before implementation

- [ ] Recalibrate retrieval threshold and tighten `score_problem_similarity`
      (see `Compass-Engine/docs/retrieval_normalization_report.md` §7).
- [ ] Engine coverage endpoint per workflow (e.g.
      `/api/coverage?workflow=invoice_processing`) so the provider can
      pre-check evidence depth before rendering.
- [ ] Smoke test hitting the live engine (non-empty recommendations for covered
      workflows; graceful `needs_more_evidence` for thin ones).
