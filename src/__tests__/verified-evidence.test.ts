import { describe, it, expect } from "vitest";
import { VERIFIED_INVOICE_EVIDENCE } from "@/data/prototype/verified-invoice";

const TRUSTED_HOSTS = ["sec.gov", "gao.gov", "gov.uk", "doi.org", "arxiv.org"];

describe("Verified evidence set — integrity", () => {
  it("has at least 5 claim-verified implementations", () => {
    expect(VERIFIED_INVOICE_EVIDENCE.length).toBeGreaterThanOrEqual(5);
  });

  it("every record has a resolvable primary source on a trusted host", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      expect(e.source.url).toMatch(/^https:\/\//);
      expect(TRUSTED_HOSTS.some((h) => e.source.url.includes(h))).toBe(true);
      expect(e.source.title.length).toBeGreaterThan(5);
    }
  });

  it("every record is claim_verified with all three checks true", () => {
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

  it("every record documents why it was selected", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      expect(e.selectionReason.length).toBeGreaterThan(10);
    }
  });

  it("does not include vendor-only or unsourced records", () => {
    for (const e of VERIFIED_INVOICE_EVIDENCE) {
      expect(e.source.type).not.toMatch(/vendor/i);
      expect(e.source.url).not.toMatch(/uipath|zendesk|salesforce|automationanywhere/i);
    }
  });
});
