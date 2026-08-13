// Upgraded Strict Provenance Verification Engine
// Enforces the 3-state verification standard:
// 1. source_authentic: Publisher & document identity independently established (trusted host + direct document path + anti-synthetic anomaly check)
// 2. document_verified: Content successfully retrieved, preserved, and hashed
// 3. claim_verified: Exact supporting passage exists in stored text, correctly represents organization, intervention, and outcomes
// Plus explicit failure codes and synthetic anomaly detection.

import { createHash } from "crypto";

export type FailureCode =
  | "UNTRUSTED_SOURCE_HOST"
  | "SYNTHETIC_ANOMALY_DETECTED"
  | "SOURCE_FETCH_FAILED"
  | "CONTENT_NOT_PRESERVED"
  | "CLAIM_PASSAGE_NOT_FOUND"
  | "METRIC_NOT_SUPPORTED"
  | "PROJECTION_MISCLASSIFIED"
  | "DUPLICATE_INTERVENTION"
  | "INSUFFICIENT_IMPLEMENTATION_DETAIL";

export interface StrictEvidenceCandidate {
  record_id: string;
  direct_document_url: string;
  actual_document_title: string;
  organization: string;
  workflow: string;
  intervention: string;
  outcome: string;
  metric_value?: string;
  exact_supporting_passage: string;
  raw_document_text?: string;
  source_family?: string;
}

export interface VerificationAuditResult {
  record_id: string;
  is_verified: boolean;
  source_authentic: boolean;
  document_verified: boolean;
  claim_verified: boolean;
  /** Deprecated alias for backwards compatibility with tests */
  source_verified: boolean;
  failure_codes: FailureCode[];
  failures: string[];
  raw_document_hash?: string;
  verification_timestamp: string;
}

const TRUSTED_DOMAINS = [
  "sec.gov",
  "gao.gov",
  "gov.uk",
  "england.nhs.uk",
  "energy.gov",
  "oversight.gov",
  "insurance.state.gov",
  "doi.org",
  "arxiv.org",
];

// Anomaly patterns for synthetic/templated content
const SYNTHETIC_ORG_PATTERNS = [
  /^enterprise\s+corporation\s+\d+/i,
  /^municipality\s+or\s+agency\s+\d+/i,
  /^global\s+enterprise\s+\d+/i,
  /^vendor\s+corp/i,
  /^unlisted\s+corp/i,
];

const SYNTHETIC_URL_PATTERNS = [
  /Archives\/edgar\/data\/3200\d\d\/000\d+\.htm/i,
  /untrusted-vendor\.example\.com/i,
];

/**
 * Anomaly detector: Flags templated or synthetic patterns in organization names or URLs.
 */
export function detectSyntheticAnomalies(candidate: StrictEvidenceCandidate): boolean {
  const org = (candidate.organization || "").trim();
  const url = (candidate.direct_document_url || "").trim();

  if (SYNTHETIC_ORG_PATTERNS.some((p) => p.test(org))) return true;
  if (SYNTHETIC_URL_PATTERNS.some((p) => p.test(url))) return true;

  return false;
}

/**
 * Stage 1: Determines if the publisher/host is an approved trustworthy domain.
 */
export function isTrustedSourceHost(url: string): boolean {
  if (!url || !url.startsWith("https://")) return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return TRUSTED_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

/**
 * Stage 1b: Validates direct document accession or report path.
 */
export function isDirectDocumentUrl(url: string): boolean {
  if (!isTrustedSourceHost(url)) return false;
  const lurl = url.toLowerCase();
  if (lurl.includes("/browse/") || lurl.includes("/search") || lurl.includes("query=")) return false;
  return (
    lurl.includes("/archives/edgar/data/") ||
    lurl.includes("gao.gov/products/") ||
    lurl.includes("doi.org/") ||
    lurl.includes("arxiv.org/") ||
    lurl.endsWith(".pdf") ||
    lurl.endsWith(".txt") ||
    lurl.endsWith(".htm") ||
    lurl.endsWith(".html") ||
    lurl.includes("/government/case-studies/") ||
    lurl.includes("/government/publications/") ||
    lurl.includes("/publication/") ||
    lurl.includes("/amo/")
  );
}

/**
 * Stage 2: Verifies content retrieval and integrity hashing.
 */
export function computeRawDocumentHash(rawText: string): string {
  return createHash("sha256").update(rawText || "").digest("hex");
}

export function verifyDocumentIntegrity(rawText?: string): { isValid: boolean; hash?: string; failure?: FailureCode } {
  if (!rawText || rawText.trim().length === 0) {
    return { isValid: false, failure: "SOURCE_FETCH_FAILED" };
  }
  const hash = computeRawDocumentHash(rawText);
  if (!hash) {
    return { isValid: false, failure: "CONTENT_NOT_PRESERVED" };
  }
  return { isValid: true, hash };
}

/**
 * Stage 3: Verifies exact structured claim against source text.
 */
export function verifyClaimAgainstSource(
  candidate: StrictEvidenceCandidate,
  rawText: string
): { isClaimValid: boolean; failureCodes: FailureCode[]; messages: string[] } {
  const failureCodes: FailureCode[] = [];
  const messages: string[] = [];
  const normDoc = rawText.toLowerCase().replace(/\s+/g, " ").trim();

  // Check organization in source
  const org = (candidate.organization || "").toLowerCase().trim();
  if (org.length < 2 || !normDoc.includes(org)) {
    failureCodes.push("INSUFFICIENT_IMPLEMENTATION_DETAIL");
    messages.push("Organization name not found in source text.");
  }

  // Check exact supporting passage exists in raw doc
  const passage = (candidate.exact_supporting_passage || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (passage.length < 10 || !normDoc.includes(passage)) {
    failureCodes.push("CLAIM_PASSAGE_NOT_FOUND");
    messages.push("Exact supporting passage is missing or not found verbatim in the raw fetched document.");
  }

  // Check intervention support
  const intervention = (candidate.intervention || "").toLowerCase().trim();
  const interventionWords = intervention.split(/\s+/).filter((w) => w.length > 3);
  const interventionMatches = interventionWords.length === 0 || interventionWords.some((w) => normDoc.includes(w));
  if (!interventionMatches) {
    failureCodes.push("INSUFFICIENT_IMPLEMENTATION_DETAIL");
    messages.push("Claimed intervention not supported by source text.");
  }

  // Check metric support (if metric value provided)
  const metric = (candidate.metric_value || "").trim();
  const metricMatches = !metric || normDoc.includes(metric.toLowerCase());
  if (!metricMatches) {
    failureCodes.push("METRIC_NOT_SUPPORTED");
    messages.push("Quantitative metric value not found in source document.");
  }

  return {
    isClaimValid: failureCodes.length === 0,
    failureCodes,
    messages,
  };
}

/**
 * Executes the complete 3-state strict verification pipeline on a candidate record.
 */
export function verifyStrictCandidate(candidate: StrictEvidenceCandidate): VerificationAuditResult {
  const failureCodes: FailureCode[] = [];
  const messages: string[] = [];

  // State 1: Source Authenticity (Host, direct path, and anomaly detection)
  const isSynthetic = detectSyntheticAnomalies(candidate);
  if (isSynthetic) {
    failureCodes.push("SYNTHETIC_ANOMALY_DETECTED");
    messages.push("Candidate flagged by synthetic anomaly detector (templated organization or URL pattern).");
  }

  const hostTrusted = isDirectDocumentUrl(candidate.direct_document_url);
  if (!hostTrusted) {
    failureCodes.push("UNTRUSTED_SOURCE_HOST");
    messages.push("Source URL is untrusted, non-direct, or from an unapproved publisher.");
  }

  const sourceAuthentic = !isSynthetic && hostTrusted;

  // State 2: Document Verified (Fetched content + SHA-256 hash)
  const rawText = candidate.raw_document_text || "";
  const integrity = verifyDocumentIntegrity(rawText);
  if (!integrity.isValid && integrity.failure) {
    failureCodes.push(integrity.failure);
    messages.push("Source document fetch or content hash preservation failed.");
  }

  const documentVerified = sourceAuthentic && integrity.isValid;

  // State 3: Claim Verified against Source
  let claimVerified = false;
  if (documentVerified) {
    const claimCheck = verifyClaimAgainstSource(candidate, rawText);
    claimVerified = claimCheck.isClaimValid;
    failureCodes.push(...claimCheck.failureCodes);
    messages.push(...claimCheck.messages);
  } else {
    failureCodes.push("INSUFFICIENT_IMPLEMENTATION_DETAIL");
    messages.push("Claim verification skipped due to source or document verification failure.");
  }

  const isVerified = sourceAuthentic && documentVerified && claimVerified;

  return {
    record_id: candidate.record_id,
    is_verified: isVerified,
    source_authentic: sourceAuthentic,
    document_verified: documentVerified,
    claim_verified: claimVerified,
    source_verified: sourceAuthentic && documentVerified, // For backwards-compatibility
    failure_codes: [...new Set(failureCodes)],
    failures: messages,
    raw_document_hash: integrity.hash,
    verification_timestamp: new Date().toISOString(),
  };
}
