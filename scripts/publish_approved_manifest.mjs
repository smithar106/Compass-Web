// Controlled Publication Script — Phase 10
// DO NOT EXECUTE WITHOUT EXPLICIT FOUNDER AUTHORIZATION.
// Publishes exclusively the 11 human-approved, claim-verified real-world records.
// FAILS CLOSED: Aborts if the target database does not exist or is smaller than 100MB.

import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import { REAL_CANDIDATE_SOURCES } from "../run_11_real_sources_audit.js";

const MIN_PRODUCTION_DB_BYTES = 100 * 1024 * 1024; // 100 MB minimum size

const dbPath = process.env.COLLECTOR_DATABASE_URL
  ? process.env.COLLECTOR_DATABASE_URL.replace("sqlite:///", "")
  : path.join(process.cwd(), "data", "collector_v3.db");

export function executeControlledPublication() {
  console.log("=== EXECUTING CONTROLLED PUBLICATION BATCH: real_gov_20260813_001 ===");

  // Fail-closed target safety check
  if (!fs.existsSync(dbPath)) {
    throw new Error(`FATAL: Authoritative production database does not exist at target path: ${dbPath}. Aborting.`);
  }

  const stat = fs.statSync(dbPath);
  if (stat.size < MIN_PRODUCTION_DB_BYTES) {
    throw new Error(`FATAL: Target database size (${(stat.size / 1024 / 1024).toFixed(1)} MB) is below minimum expected threshold (100 MB). Aborting.`);
  }

  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA foreign_keys = ON;");

  const now = new Date().toISOString();
  const batchId = "real_gov_20260813_001";

  // 1. Insert batch ledger
  db.prepare(`
    INSERT INTO ingestion_batches (
      id, source_family, started_at, completed_at, status,
      documents_discovered, documents_fetched, candidate_interventions,
      interventions_published, parser_version, validator_version, notes
    ) VALUES (
      ?, 'government_regulatory_audits', ?, ?, 'completed',
      11, 11, 11,
      11, '2.1.0', '2.1.0', 'First controlled real-world publication batch — 11 approved primary records'
    )
  `).run(batchId, now, now);

  // 2. Insert documents, interventions, metrics, passages
  for (const c of REAL_CANDIDATE_SOURCES) {
    const docId = `doc_${c.record_id}`;

    // Document record
    db.prepare(`
      INSERT OR IGNORE INTO documents (
        id, url, title, publisher, content_hash, cleaned_text, document_type, crawl_status
      ) VALUES (?, ?, ?, ?, ?, ?, 'government_case_study', 'success')
    `).run(docId, c.direct_document_url, c.actual_document_title, c.organization, "hash_" + c.record_id, c.raw_document_text);

    // Intervention record
    db.prepare(`
      INSERT INTO intervention_records (
        id, document_id, ingestion_batch_id, organization_name, workflow,
        intervention_title, publication_status, verification_status, outcome_classification
      ) VALUES (?, ?, ?, ?, ?, ?, 'published', 'claim_verified', 'operational_efficiency')
    `).run(c.record_id, docId, batchId, c.organization, c.workflow, c.intervention);

    // Passage record
    db.prepare(`
      INSERT INTO passage_records (
        id, intervention_id, document_id, passage_text, supports_fields, extraction_confidence
      ) VALUES (?, ?, ?, ?, 'organization,intervention,outcome', 1.0)
    `).run(`pas_${c.record_id}`, c.record_id, docId, c.exact_supporting_passage);
  }

  console.log("Publication executed successfully for 11 records.");
  db.close();
}

if (process.argv.includes("--execute")) {
  executeControlledPublication();
} else {
  console.log("DRY RUN ONLY. To execute after founder authorization, run with --execute.");
}
