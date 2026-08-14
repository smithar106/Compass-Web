// Evidence Governance & Provenance Enforcement Layer
// Enforces strict ingestion validation, immutable audit fields, and fail-closed publication gates.

export interface EvidenceRecordInput {
  organization?: string;
  workflow?: string;
  intervention?: string;
  source_type?: string;
  source_url?: string;
  source_document_title?: string;
  source_date?: string;
  source_excerpt?: string;
  outcome_classification?: string;
  ingestion_batch_id?: string;
  status?: "staging" | "published" | "rejected";
  audit_metadata?: {
    batch_id?: string;
    source_url?: string;
    source_document_id?: string;
    source_excerpt?: string;
    extraction_timestamp?: string;
    extractor_version?: string;
    validation_version?: string;
    source_hash?: string;
  };
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const CURRENT_VALIDATION_VERSION = "2.1.0";

/**
 * Validates an evidence record against strict provenance standards.
 * Fails closed if any mandatory provenance or audit field is missing or synthetic.
 */
export function validateEvidenceProvenance(record: EvidenceRecordInput): ValidationResult {
  const errors: string[] = [];

  // Mandatory fields
  if (!record.organization || record.organization.trim().length < 2) {
    errors.push("Missing or invalid organization name.");
  }
  if (!record.workflow || record.workflow.trim().length < 2) {
    errors.push("Missing or invalid workflow identifier.");
  }
  if (!record.intervention || record.intervention.trim().length < 2) {
    errors.push("Missing or invalid intervention description.");
  }
  if (!record.source_type || record.source_type.trim().length < 2) {
    errors.push("Missing or invalid source type.");
  }
  if (!record.source_url || !record.source_url.startsWith("https://")) {
    errors.push("Missing or invalid secure source URL (must start with https://).");
  }
  if (!record.source_document_title || record.source_document_title.trim().length < 2) {
    errors.push("Missing source document title.");
  }
  if (!record.source_date) {
    errors.push("Missing source document publication date.");
  }
  if (!record.source_excerpt || record.source_excerpt.trim().length < 10) {
    errors.push("Missing or insufficient source evidence excerpt / passage.");
  }
  if (!record.outcome_classification) {
    errors.push("Missing outcome classification.");
  }
  if (!record.ingestion_batch_id) {
    errors.push("Missing ingestion batch ID.");
  }

  // Audit metadata checks
  const audit = record.audit_metadata;
  if (!audit) {
    errors.push("Missing mandatory audit_metadata object.");
  } else {
    if (!audit.batch_id) errors.push("Audit metadata missing batch_id.");
    if (!audit.source_url) errors.push("Audit metadata missing source_url.");
    if (!audit.source_document_id) errors.push("Audit metadata missing source_document_id.");
    if (!audit.source_excerpt) errors.push("Audit metadata missing source_excerpt.");
    if (!audit.extraction_timestamp) errors.push("Audit metadata missing extraction_timestamp.");
    if (!audit.extractor_version) errors.push("Audit metadata missing extractor_version.");
    if (!audit.validation_version) errors.push("Audit metadata missing validation_version.");
    if (!audit.source_hash) errors.push("Audit metadata missing source_hash.");
  }

  // Anti-synthetic check: reject if excerpt or intervention contains hallucination markers
  const textToCheck = `${record.intervention} ${record.source_excerpt}`.toLowerCase();
  if (textToCheck.includes("synthetic") || textToCheck.includes("placeholder") || textToCheck.includes("mock data")) {
    errors.push("Record flagged as synthetic or placeholder content; prohibited from production publication.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Filters an array of records to include ONLY those eligible for decision retrieval (status === "published").
 * Enforces fail-closed isolation between staging and production.
 */
export function filterPublishedRecords<T extends { status?: string }>(records: T[]): T[] {
  return records.filter((r) => r.status === "published");
}

export type PublicationStatus = "staging" | "published" | "quarantined" | "rejected";
export type VerificationStatus = "legacy" | "source_authentic" | "document_verified" | "claim_verified" | "rejected";

/**
 * Recommendation retrieval gate: only publication_status === "published" is eligible.
 * Legacy published (verification_status=legacy) and claim-verified published both pass.
 * Staging, quarantined, and rejected are strictly excluded.
 */
export function filterForRecommendationRetrieval<T extends { publication_status?: string }>(records: T[]): T[] {
  return records.filter((r) => r.publication_status === "published");
}

/**
 * Truthful governed metadata counts derived from a record set.
 */
export function governedMetadataCounts<T extends { publication_status?: string; verification_status?: string }>(records: T[]) {
  const total = records.length;
  const published = records.filter((r) => r.publication_status === "published").length;
  const legacyPublished = records.filter(
    (r) => r.publication_status === "published" && r.verification_status === "legacy"
  ).length;
  const verifiedPublished = records.filter(
    (r) => r.publication_status === "published" && r.verification_status === "claim_verified"
  ).length;
  const staging = records.filter((r) => r.publication_status === "staging").length;
  const quarantined = records.filter((r) => r.publication_status === "quarantined").length;
  const rejected = records.filter((r) => r.publication_status === "rejected").length;

  return {
    total_intervention_records: total,
    published_records: published,
    legacy_published_records: legacyPublished,
    verified_published_records: verifiedPublished,
    staging_records: staging,
    quarantined_records: quarantined,
    rejected_records: rejected,
  };
}

/**
 * Outcome classification (lives on metric/value records, not the intervention):
 * observed vs projected/estimated/potential/target/unknown.
 */
export type OutcomeClassification =
  | "observed"
  | "projected"
  | "estimated"
  | "potential"
  | "target"
  | "unknown";

export interface BatchIngestionLedger {
  batch_id: string;
  sources_fetched: number;
  candidate_records: number;
  rejected_schema: number;
  rejected_provenance: number;
  rejected_duplicates: number;
  published_records: number;
  production_before: number;
  production_after: number;
  verified_delta: number;
  source_urls_present_pct: number;
  source_excerpts_present_pct: number;
  synthetic_records: number;
}

export function generateBatchLedger(
  batchId: string,
  candidates: EvidenceRecordInput[],
  productionBefore: number
): { ledger: BatchIngestionLedger; publishedRecords: EvidenceRecordInput[] } {
  let rejectedSchema = 0;
  let rejectedProvenance = 0;
  let syntheticCount = 0;
  const publishedRecords: EvidenceRecordInput[] = [];

  for (const c of candidates) {
    const res = validateEvidenceProvenance(c);
    if (!res.isValid) {
      if (res.errors.some((e) => e.includes("synthetic"))) {
        syntheticCount++;
      } else if (res.errors.some((e) => e.includes("audit"))) {
        rejectedSchema++;
      } else {
        rejectedProvenance++;
      }
    } else {
      publishedRecords.push({ ...c, status: "published" });
      if (textContainsSynthetic(`${c.intervention} ${c.source_excerpt}`)) {
        syntheticCount++;
      }
    }
  }

  const publishedCount = publishedRecords.length;
  const productionAfter = productionBefore + publishedCount;

  const ledger: BatchIngestionLedger = {
    batch_id: batchId,
    sources_fetched: candidates.length,
    candidate_records: candidates.length,
    rejected_schema: rejectedSchema,
    rejected_provenance: rejectedProvenance,
    rejected_duplicates: 0,
    published_records: publishedCount,
    production_before: productionBefore,
    production_after: productionAfter,
    verified_delta: publishedCount,
    source_urls_present_pct: candidates.length ? Math.round((candidates.filter(c => c.source_url).length / candidates.length) * 100) : 0,
    source_excerpts_present_pct: candidates.length ? Math.round((candidates.filter(c => c.source_excerpt).length / candidates.length) * 100) : 0,
    synthetic_records: syntheticCount,
  };

  return { ledger, publishedRecords };
}

function textContainsSynthetic(text: string): boolean {
  const t = text.toLowerCase();
  return t.includes("synthetic") || t.includes("placeholder") || t.includes("mock data");
}
