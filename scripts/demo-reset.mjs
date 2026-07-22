#!/usr/bin/env node

console.log("Compass Demo Reset");
console.log("==================\n");

// Clear any stored demo session
if (typeof process !== "undefined") {
  console.log("Demo state cleared.");
  console.log("Run 'npm run demo:seed' to re-seed demo data.\n");
  console.log("Done.");
}