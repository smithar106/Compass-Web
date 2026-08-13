import { describe, it, expect } from "vitest";
import { run100CandidateAcquisitionBatch } from "../../run_100_candidate_run";

describe("100-Candidate Bounded Acquisition Run", () => {
  it("executes the 100-source acquisition funnel and maintains production publishing isolation", () => {
    const { report, stagingPackage } = run100CandidateAcquisitionBatch();

    expect(report.funnel.discovered).toBe(100);
    expect(report.funnel.staging_eligible).toBeGreaterThan(0);
    expect(report.funnel.quarantined_or_rejected).toBeGreaterThan(0);
    expect(report.production_publishing_enabled).toBe(false);
    expect(stagingPackage).toHaveLength(report.funnel.staging_eligible);
  });
});
