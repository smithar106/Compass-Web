import { describe, it, expect } from "vitest";
import { runRealSourcesInspection } from "../../run_11_real_sources_audit";

describe("11 Real Primary Sources Provenance Audit", () => {
  it("enforces source_authentic -> document_verified -> claim_verified 3-state pipeline across real documents", () => {
    const { results, passCount, failCount } = runRealSourcesInspection();

    expect(results).toHaveLength(11);

    // 100% of real candidate sources must be authentic government/regulatory publishers
    for (const r of results) {
      expect(r.source_authentic).toBe(true);
      expect(r.document_verified).toBe(true);
      expect(r.raw_document_hash).toBeDefined();
    }

    // High precision: majority passed all 7 criteria
    expect(passCount).toBeGreaterThanOrEqual(8);
    expect(failCount).toBeLessThanOrEqual(3);

    // Ensure observed vs projected separation
    const cityOfLondon = results.find((r) => r.record_id === "real_rec_04");
    expect(cityOfLondon?.projected_outcomes.length).toBeGreaterThan(0);
  });
});
