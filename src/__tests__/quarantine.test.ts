import { describe, it, expect } from "vitest";
import { quarantineBatch, verifyRawSourceExcerpt } from "@/lib/quarantine";

describe("Quarantine & Provenance Verification Gate", () => {
  it("quarantines unverified batches and resets active published count", () => {
    const result = quarantineBatch("batch_sec_20260813_001", 1000, "Failed independent URL and raw source verification.");
    expect(result.status).toBe("quarantined");
    expect(result.record_count).toBe(1000);
    expect(result.reason).toContain("Failed independent URL");
  });

  it("verifies excerpt existence against raw source text successfully", () => {
    const rawDoc = "Acme Corp announced today that it deployed automated invoice matching which reduced processing cycle time by 41% during Q3.";
    const excerpt = "deployed automated invoice matching which reduced processing cycle time by 41%";
    expect(verifyRawSourceExcerpt(rawDoc, excerpt)).toBe(true);
  });

  it("fails closed when excerpt is not present in raw source text", () => {
    const rawDoc = "Acme Corp announced quarterly earnings.";
    const excerpt = "reduced processing cycle time by 41%";
    expect(verifyRawSourceExcerpt(rawDoc, excerpt)).toBe(false);
  });
});
