import { describe, it, expect } from "vitest";
import {
  filterForRecommendationRetrieval,
  governedMetadataCounts,
  type PublicationStatus,
  type VerificationStatus,
  type OutcomeClassification,
} from "@/lib/governance";

describe("Governance Migration Semantics", () => {
  const legacy = (id: string) => ({
    id,
    publication_status: "published" as PublicationStatus,
    verification_status: "legacy" as VerificationStatus,
  });
  const verified = (id: string) => ({
    id,
    publication_status: "published" as PublicationStatus,
    verification_status: "claim_verified" as VerificationStatus,
  });
  const staged = (id: string) => ({
    id,
    publication_status: "staging" as PublicationStatus,
    verification_status: "claim_verified" as VerificationStatus,
  });
  const quarantined = (id: string) => ({
    id,
    publication_status: "quarantined" as PublicationStatus,
    verification_status: "rejected" as VerificationStatus,
  });
  const rejected = (id: string) => ({
    id,
    publication_status: "rejected" as PublicationStatus,
    verification_status: "rejected" as VerificationStatus,
  });

  it("preserves legacy published + claim-verified published in recommendation retrieval", () => {
    const eligible = filterForRecommendationRetrieval([
      legacy("a"), verified("b"), staged("c"), quarantined("d"), rejected("e"),
    ]);
    expect(eligible.map((r) => r.id).sort()).toEqual(["a", "b"]);
  });

  it("excludes staging, quarantined, and rejected from retrieval", () => {
    const eligible = filterForRecommendationRetrieval([staged("c"), quarantined("d"), rejected("e")]);
    expect(eligible).toHaveLength(0);
  });

  it("reports truthful governed metadata counts", () => {
    const counts = governedMetadataCounts([
      legacy("a"), legacy("b"), verified("c"), staged("d"), quarantined("e"), rejected("f"),
    ]);
    expect(counts.total_intervention_records).toBe(6);
    expect(counts.published_records).toBe(3);
    expect(counts.legacy_published_records).toBe(2);
    expect(counts.verified_published_records).toBe(1);
    expect(counts.staging_records).toBe(1);
    expect(counts.quarantined_records).toBe(1);
    expect(counts.rejected_records).toBe(1);
  });

  it("models a post-migration legacy-only corpus (54,266 legacy published, 0 verified)", () => {
    const legacyOnly = Array.from({ length: 3 }, (_, i) => legacy(`r${i}`));
    const counts = governedMetadataCounts(legacyOnly);
    expect(counts.legacy_published_records).toBe(3);
    expect(counts.verified_published_records).toBe(0);
    expect(counts.staging_records).toBe(0);
  });

  it("supports observed vs projected outcome classification as distinct value types", () => {
    const observed: OutcomeClassification = "observed";
    const projected: OutcomeClassification = "projected";
    expect(observed).not.toBe(projected);
  });
});
