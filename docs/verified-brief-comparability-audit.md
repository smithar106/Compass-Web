# Verified Brief — Comparability & Causal-Relevance Audit

**Date:** 2026-08-24
**Scope:** the 7 records in `/verified-brief` (manual invoice processing)
**Status:** audit complete — **brief must be revised** (see §4). No source-verification
statuses are changed by this audit.

---

## 1. Why this audit

A verified **source** does not make a record a verified **comparable**. Three
dimensions must be assessed separately:

| Dimension | Question |
|---|---|
| **Source verification** | Is the document authentic, and does it contain the cited claim? |
| **Comparability** | Does the record document an implementation of *this* intervention (automated invoice capture with exception-based review)? |
| **Causal relevance** | Does the source support attributing the reported outcome to that intervention? |

Source verification was confirmed previously (passage located verbatim). This
audit assesses **comparability** and **causal relevance** against the source
text. Source-verification status is preserved; comparability is a separate field.

## 2. Method

For each record the source document was re-fetched (sec.gov) and the passage
read **in context** to determine what the source actually establishes.

## 3. Findings

| # | Organization | What the source actually establishes | Documents an invoice-automation implementation? | Establishes intervention → outcome? | Classification |
|---|---|---|---|---|---|
| 1 | **Direct Insite Corp.** | The vendor's own platform scale: "Direct Insite processes more than 25 million invoices annually…" | **No** — it is the provider's volume, not a customer implementation | **No** | Indirect contextual |
| 2 | **CheckFree Corp. (FY2001)** | The provider's own operating metrics (5.2M consumers, 231M transactions) | **No** — provider scale | **No** | Indirect contextual |
| 3 | **CheckFree Corp. (FY2002)** | The provider's own growth (316M transactions, +36%) | **No** — provider scale | **No** | Indirect contextual |
| 4 | **Heartland Payment Systems** | Card-payment processing efficiency ("processing and servicing expenses… record-low 43.6%"); attributes to "efficiency improvements" / "productivity enhancements" broadly | **No** — card-payment processing, not invoice processing; no invoice automation | **No** — not attributed to invoice automation | Not relevant to this decision |
| 5 | **Paybox Corp** | The provider's own SaaS platform scale ($160B, 375,000 companies) | **No** — provider scale | **No** | Indirect contextual |
| 6 | **Dover Corporation** | Dover's own Global Supply Chain Initiative: "6%–7% savings… reduced supplier count, consolidated spend" | **No** — procurement / supplier consolidation, not invoice automation | Partial — attributed to a supply-chain program, not invoice automation | Indirect contextual (adjacent) |
| 7 | **RPM International** | RPM's own broad MAP to Growth program: "$320M annualized run-rate"; drivers listed as "center-led manufacturing, procurement, administration" | **No** — multi-domain operational program | **No** — cannot be attributed to invoice automation | Not relevant to this decision |

### Summary

- **Direct implementation evidence: 0**
- **Indirect contextual evidence: 5** (Direct Insite, CheckFree ×2, Paybox, Dover)
- **Not relevant to this decision: 2** (Heartland, RPM)

**No record documents an implementation of "automated invoice capture with
exception-based review," and none establishes that this intervention produced
the reported outcome.**

## 4. Required brief changes

Per the standing rule (*if no direct implementation evidence remains, the brief
must not claim its recommendation is supported by verified implementation
outcomes*):

1. **Do not present these as verified implementation outcomes** supporting the
   recommendation. They are **verified contextual facts** (platform scale,
   market adoption), not comparable implementation results.
2. **Reclassify each record** as `indirect_contextual` or `not_relevant`
   (comparability field), while preserving `claim_verified` (source field).
3. **State the evidence gap explicitly**: no direct implementation evidence was
   found for this intervention; the recommendation is **not** supported by
   verified implementation outcomes.
4. **Downgrade the recommendation status** from "Verified evidence" to an honest
   label (e.g. *Directionally supported — no direct verified implementation
   evidence*), or mark it "Needs more evidence."
5. **Remove the "7 claim-verified implementations" framing** as support for the
   recommendation; if retained, label them as contextual.
6. **Do not aggregate or imply causality** from these figures.

## 5. What survives

The source verification is real and useful: these are **verified, citable facts**
about e-invoicing/e-billing adoption and adjacent cost programs. They are
legitimate **context** for a decision — but they are not evidence that the
recommended intervention works.

## 6. Implication for the milestone

The "first fully verified decision brief" is, on this audit, a **verified
context brief**, not a **verified comparable-implementation brief**. To produce
the latter, Compass needs records that document *actual invoice-automation
implementations with attributable outcomes* — which the current corpus does not
contain at the verified bar.

This is the correct, honest position, and it sets the real requirement for the
next evidence-acquisition effort.
