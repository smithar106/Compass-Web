# First Fully Verified Decision Brief — Manual Invoice Processing

**Date:** 2026-08-24
**Route:** `/verified-brief`
**Milestone:** 1 fully verified decision brief (not more UI).

## Acceptance criterion

> An independent reviewer can reconstruct the material evidence and calculations
> without relying on the AI's explanation alone.

Met: every figure is traced to a public primary source, the exact supporting
passage is quoted, and the brief states how to reconstruct it (open the source,
search the passage, confirm the figure). No claim depends on Compass's
interpretation.

## What "verified" means here (the bar)

A record is included only if all three hold:

1. **source_authentic** — a resolvable primary document on a trusted host
   (sec.gov).
2. **document_verified** — the document was retrieved and the passage located.
3. **claim_verified** — the exact supporting passage is present in the source
   and states the claim as characterized.

Verification was performed on 2026-08-24 by fetching each source URL and
locating the quoted passage verbatim. Records that did not meet the bar were
excluded — including every vendor case study.

## The verified set (7 implementations)

| Organization | Intervention | Verified metric(s) | Source |
|---|---|---|---|
| Direct Insite Corp. | Electronic invoice presentment & payment | 25M+ invoices/yr; $125B value | SEC 10-K FY2010 |
| CheckFree Corporation | Electronic billing & payment (E-Bill) | 5.2M consumers; 173 billers; ~500K e-bills/mo; 231M transactions | SEC 10-K FY2001 |
| CheckFree Corporation | Electronic Commerce scale-up | 316M transactions; +36% YoY; 10.8M e-bills; 6.6M consumers | SEC 10-K FY2002 |
| Heartland Payment Systems | Processing & servicing efficiency program | Expenses to record-low 43.6% of net revenue; operating margin 17.7% (from 12.3%) | SEC 8-K exhibit (Q3 2011) |
| Paybox Corp | Working-capital platform (O2C / P2P) | $160B+ annual transaction value; 375,000+ companies | SEC 10-K |
| Dover Corporation | Global supply chain initiative | 6–7% savings; consolidated spend | SEC 8-K exhibit |
| RPM International | MAP to Growth operating program | $320M annualized run-rate savings | SEC 8-K exhibit |

All source URLs are on `sec.gov` and are linked (clickable) in the brief.

## What the brief contains

1. **Recommendation** — automated invoice capture with exception-based review.
2. **Verified comparable implementations** — each with clickable source, the
   quoted supporting passage, and the three verification checks.
3. **Impact calculation** — a transparent table (metric → observed value →
   source record → method). No aggregation or modelling; each figure is the
   value stated in its source. Organization-specific savings are explicitly
   *not* projected (that needs the customer's volume and loaded labor cost).
4. **Assumptions & limitations** — observed ≠ projected; small deliberate
   verified set; source recency (2001–2022); org-specific inputs required.
5. **Reproducibility** — step-by-step instructions to reconstruct.

## Data

`src/data/prototype/verified-invoice.ts` — the curated verified set with full
provenance (source URL/title/date, quoted passages, verification flags,
selection reason).

## Integrity tests

`src/__tests__/verified-evidence.test.ts` (6 tests) enforces:
- ≥5 claim-verified records;
- every source is `https://` on a trusted host;
- every record is `claim_verified` with all three checks true;
- every metric carries a supporting passage (no unsourced numbers);
- every record documents why it was selected;
- no vendor-only or unsourced records.

## Honest caveats

- The verified set is **7 records, not 10,000+.** This is the deliberate,
  defensible foundation — not a claim about the whole corpus.
- This brief is for **one problem** (manual invoice processing). The other nine
  prototype problems still render exploratory/insufficient.
- The verified set must be **grown deliberately** (per category), never by
  lowering the bar or auto-promoting records.
