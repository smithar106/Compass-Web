import { describe, it, expect } from "vitest";
import {
  VERIFIED_INVOICE_EVIDENCE,
  VERIFIED_INVOICE_SUMMARY,
} from "@/data/prototype/verified-invoice";

const TRUSTED_HOSTS = ["sec.gov", "gao.gov", "gov.uk", "doi.org", "arxiv.org"];
const VALID_COMPARABILITY = ["direct_implementation", "indirect_contextual", "not_relevant"];

describe("Verified evidence set — source verification", () => {
  it("has at least 5 records", () => {
    expect(VERIFIED_INVOICE_EVIDENCE.length).toBeGreaterThanOrEqual(5);
  });

  it("every record has a resolvable primary source on a trusted host", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      expect(e.source.url).toMatch(/^https:\/\//);
      expect(TRUSTED_HOSTS.some((h) => e.source.url.includes(h))).toBe(true);
      expect(e.source.title.length).toBeGreaterThan(5);
    }
  });

  it("every record is claim_verified with all three source checks true", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      expect(e.verification.status).toBe("claim_verified");
      expect(e.verification.sourceAuthentic).toBe(true);
      expect(e.verification.documentRetrieved).toBe(true);
      expect(e.verification.passageMatched).toBe(true);
      expect(e.verification.verifiedAt).toBeTruthy();
    }
  });

  it("every metric carries a supporting passage (no unsourced numbers)", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      expect(e.metrics.length).toBeGreaterThanOrEqual(1);
      for (const m of e.metrics) {
        expect(m.label.length).toBeGreaterThan(3);
        expect(m.value.length).toBeGreaterThan(0);
        expect(m.passage.length).toBeGreaterThan(20);
      }
    }
  });
});

describe("Verified evidence set — comparability (separate dimension)", () => {
  it("every record has a valid comparability classification", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      expect(VALID_COMPARABILITY).toContain(e.comparability.classification);
      expect(typeof e.comparability.documentsImplementation).toBe("boolean");
      expect(typeof e.comparability.establishesInterventionOutcome).toBe("boolean");
      expect(e.whatItEstablishes.length).toBeGreaterThan(10);
    }
  });

  it("never claims an intervention→outcome link unless it is direct implementation evidence", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      if (e.comparability.establishesInterventionOutcome) {
        expect(e.comparability.classification).toBe("direct_implementation");
      }
    }
  });

  it("does not present indirect/not-relevant records as implementation evidence", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      if (e.comparability.classification !== "direct_implementation") {
        expect(e.comparability.documentsImplementation).toBe(false);
        expect(e.comparability.establishesInterventionOutcome).toBe(false);
      }
    }
  });

  it("the summary counts match the records", () => {
    const direct = VERIFIED_INVOICE_EVIDENCE.filter(
      (e) => e.comparability.classification === "direct_implementation"
    ).length;
    const indirect = VERIFIED_INVOICE_EVIDENCE.filter(
      (e) => e.comparability.classification === "indirect_contextual"
    ).length;
    const notRelevant = VERIFIED_INVOICE_EVIDENCE.filter(
      (e) => e.comparability.classification === "not_relevant"
    ).length;
    expect(VERIFIED_INVOICE_SUMMARY.directImplementation).toBe(direct);
    expect(VERIFIED_INVOICE_SUMMARY.indirectContextual).toBe(indirect);
    expect(VERIFIED_INVOICE_SUMMARY.notRelevant).toBe(notRelevant);
    expect(direct + indirect + notRelevant).toBe(VERIFIED_INVOICE_EVIDENCE.length);
  });

  it("does not include vendor-only or unsourced records", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      expect(e.source.type).not.toMatch(/vendor/i);
      expect(e.source.url).not.toMatch(/uipath|zendesk|salesforce|automationanywhere/i);
    }
  });
});
