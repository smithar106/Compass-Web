// Controlled Publication Script — Phase 10 (Manifest-Driven)
// DO NOT EXECUTE WITHOUT EXPLICIT FOUNDER AUTHORIZATION.
// Publishes exclusively the records listed in scripts/publication_manifest.json.
// Optimistic concurrency: current production state must EXACTLY match the manifest's
// expected_pre_publication_state. Any divergence aborts and requires re-audit.

import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { REAL_CANDIDATE_SOURCES } from "../run_11_real_sources_audit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIN_PRODUCTION_DB_BYTES = 100 * 1024 * 1024;
const SQLITE_HEADER = "SQLite format 3\x00";

// Load the approved manifest (carries expected pre-publication state + record set)
const manifestPath = path.join(__dirname, "publication_manifest.json");
if (!fs.existsSync(manifestPath)) {
  throw new Error(`FATAL: Publication manifest not found at ${manifestPath}. Aborting.`);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

const dbPath = process.env.COLLECTOR_DATABASE_URL
  ? process.env.COLLECTOR_DATABASE_URL.replace("sqlite:///", "")
  : path.join(process.cwd(), "data", "collector_v3.db");

function countTable(db, tableName) {
  try {
    return Number(db.prepare(`SELECT COUNT(*) as c FROM "${tableName}"`).get().c);
  } catch {
    return -1;
  }
}

function verifyTargetDatabase() {
  const failures = [];
  const expected = manifest.expected_pre_publication_state;

  // 1. Manifest must not be stale
  const manifestAgeDays = (Date.now() - Date.parse(manifest.created_at)) / 86400000;
  if (manifestAgeDays > 7) {
    throw new Error(`FATAL: Manifest is ${manifestAgeDays.toFixed(1)} days old. Requires re-audit. Aborting.`);
  }

  // 2. Path must resolve to configured production path
  if (!dbPath) failures.push("No production database path configured.");

  // 3. File must exist (never silently create a new target)
  if (!fs.existsSync(dbPath)) {
    throw new Error(`FATAL: Authoritative production database does not exist at ${dbPath}. Aborting.`);
  }

  // 4. Minimum size
  const stat = fs.statSync(dbPath);
  if (stat.size < MIN_PRODUCTION_DB_BYTES) {
    throw new Error(`FATAL: Target database size (${(stat.size / 1024 / 1024).toFixed(1)} MB) below 100 MB threshold. Aborting.`);
  }

  // 5. SQLite header validity
  const header = fs.readFileSync(dbPath).subarray(0, 16).toString("utf-8");
  if (header !== SQLITE_HEADER) {
    throw new Error("FATAL: Target database does not have a valid SQLite format 3 header. Aborting.");
  }

  const db = new DatabaseSync(dbPath);
  try {
    const integrity = db.prepare("PRAGMA integrity_check").get();
    if (integrity.integrity_check !== "ok") {
      throw new Error(`FATAL: Target failed integrity_check: ${JSON.stringify(integrity)}. Aborting.`);
    }

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((r) => r.name);
    const coreTables = ["intervention_records", "documents", "metric_records", "passage_records"];
    for (const t of coreTables) {
      if (!tables.includes(t)) {
        throw new Error(`FATAL: Expected core table "${t}" is missing. Aborting.`);
      }
    }

    // 6. OPTIMISTIC CONCURRENCY — exact manifest state
    const actual = {
      intervention_records: countTable(db, "intervention_records"),
      documents: countTable(db, "documents"),
      metric_records: countTable(db, "metric_records"),
      passage_records: countTable(db, "passage_records"),
    };
    for (const k of Object.keys(expected)) {
      if (actual[k] !== expected[k]) {
        failures.push(`Count mismatch for ${k}: manifest expected ${expected[k]}, actual ${actual[k]}. REQUIRES RE-AUDIT.`);
      }
    }

    if (failures.length > 0) {
      db.close();
      throw new Error("FATAL: " + failures.join(" ") + " Aborting publication.");
    }
  } catch (err) {
    db.close();
    throw err;
  }

  return db;
}

export function executeControlledPublication() {
  console.log(`=== EXECUTING CONTROLLED PUBLICATION: ${manifest.manifest_id} ===`);
  console.log(`Target: ${dbPath}`);
  console.log(`Expected pre-publication state: ${JSON.stringify(manifest.expected_pre_publication_state)}`);

  const db = verifyTargetDatabase();
  db.exec("PRAGMA foreign_keys = ON;");

  const now = new Date().toISOString();
  const batchId = manifest.manifest_id;

  const recordsToPublish = REAL_CANDIDATE_SOURCES.filter((c) => manifest.record_ids.includes(c.record_id));
  if (recordsToPublish.length !== manifest.record_ids.length) {
    db.close();
    throw new Error("FATAL: Manifest record set does not match available candidates. Aborting.");
  }

  db.prepare(`
    INSERT INTO ingestion_batches (
      id, source_family, started_at, completed_at, status,
      documents_discovered, documents_fetched, candidate_interventions,
      interventions_published, parser_version, validator_version, notes
    ) VALUES (
      ?, 'government_regulatory_audits', ?, ?, 'completed',
      11, 11, ?, ?, '2.1.0', '2.1.0', 'Manifest-driven controlled publication'
    )
  `).run(batchId, now, now, recordsToPublish.length, recordsToPublish.length);

  for (const c of recordsToPublish) {
    const docId = `doc_${c.record_id}`;
    db.prepare(`
      INSERT OR IGNORE INTO documents (
        id, url, title, publisher, content_hash, cleaned_text, document_type, crawl_status
      ) VALUES (?, ?, ?, ?, ?, ?, 'government_case_study', 'success')
    `).run(docId, c.direct_document_url, c.actual_document_title, c.organization, "hash_" + c.record_id, c.raw_document_text);

    db.prepare(`
      INSERT INTO intervention_records (
        id, document_id, ingestion_batch_id, organization_name, workflow,
        intervention_title, publication_status, verification_status, outcome_classification
      ) VALUES (?, ?, ?, ?, ?, ?, 'published', 'claim_verified', 'operational_efficiency')
    `).run(c.record_id, docId, batchId, c.organization, c.workflow, c.intervention);

    db.prepare(`
      INSERT INTO passage_records (
        id, intervention_id, document_id, passage_text, supports_fields, extraction_confidence
      ) VALUES (?, ?, ?, ?, 'organization,intervention,outcome', 1.0)
    `).run(`pas_${c.record_id}`, c.record_id, docId, c.exact_supporting_passage);
  }

  console.log(`Publication executed for ${recordsToPublish.length} records.`);
  db.close();
}

if (process.argv.includes("--execute")) {
  executeControlledPublication();
} else {
  console.log("DRY RUN ONLY. To execute after founder authorization, run with --execute.");
}
