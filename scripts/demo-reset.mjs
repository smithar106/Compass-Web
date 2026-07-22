#!/usr/bin/env node

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  console.error("Ensure your .env.local is loaded or pass them inline.");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_SESSION_ID = "demo-session-001";
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const { error: deleteAnswersError } = await supabase
  .from("assessment_answers")
  .delete()
  .eq("session_id", DEMO_SESSION_ID);

if (deleteAnswersError) {
  console.error("Failed to delete demo answers:", deleteAnswersError.message);
  process.exit(1);
}

const { error: deleteSessionError } = await supabase
  .from("assessment_sessions")
  .delete()
  .eq("id", DEMO_SESSION_ID);

if (deleteSessionError) {
  console.error("Failed to delete demo session:", deleteSessionError.message);
  process.exit(1);
}

console.log("Demo state cleared.");
console.log("  Session removed:", DEMO_SESSION_ID);
console.log("  Answers removed for session.");
console.log("\nRun 'npm run demo:seed' to re-seed demo data.\n");
console.log("Done.");
