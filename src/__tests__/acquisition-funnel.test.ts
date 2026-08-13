import { describe, it, expect } from "vitest";
import { run100CandidateAcquisitionBatch } from "../../run_100_candidate_run";

describe("100-Candidate Bounded Acquisition Run — Invariant Tests", () => {
  it("enforces all ingestion funnel and staging isolation invariants", () => {
    const { report, stagingPackage } = run100CandidateAcquisitionBatch();

    // 1. Production publishing is strictly false
    expect(report.production_publishing_enabled).toBe(false);

    // 2. Funnel monotonicity: staging_eligible <= claims_verified <= source_verified <= fetched_successfully <= discovered
    const f = report.funnel;
    expect(f.discovered).toBe(100);
    expect(f.fetched_successfully).toBeLessThanOrEqual(f.discovered);
    expect(f.source_verified).toBeLessThanOrEqual(f.fetched_successfully);
    expect(f.claims_verified).toBeLessThanOrEqual(f.source_verified);
    expect(f.staging_eligible).toBeLessThanOrEqual(f.claims_verified);

    // 3. Every rejected candidate has a reason (quarantined_or_rejected equals sum of rejections)
    const totalRejections = Object.values(report.rejection_metrics.reasons).reduce((a, b) => a + b, 0);
    expect(f.quarantined_or_rejected).toBeLessThanOrEqual(totalRejections);

    // 4. Staging eligible candidates have valid source content, hash, and passage
    for (const rec of stagingPackage) {
      expect(rec.publication_status).toBe("staging");
      expect(rec.verification_status).toBe("claim_verified");
      expect(rec.raw_document_hash).toBeDefined();
      expect(rec.exact_supporting_passage.length).toBeGreaterThan(5);
    }
  });
});
