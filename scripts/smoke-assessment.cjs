#!/usr/bin/env node
/**
 * Controlled production smoke test for the standalone assessment journey.
 *
 * Journey: /assessment → 5 questions → Generate → /decisions/{id} → render →
 * PDF → permanent-link reload in a clean session.
 *
 * Run (playwright is resolved from the environment):
 *   NODE_PATH=$(npm root -g) node scripts/smoke-assessment.mjs
 *   # or point NODE_PATH at an npx-cached playwright:
 *   NODE_PATH=$HOME/.npm/_npx/<hash>/node_modules node scripts/smoke-assessment.mjs
 *
 * No screenshots are taken. Validation is via live request flow, response
 * payloads, DOM assertions, and the printed PDF.
 */
const { chromium } = require("playwright");

const BASE = process.env.SMOKE_BASE_URL || "https://compass-solutions.up.railway.app";

// Scenario → deployed question options (dept, situation, people, outcome, timeline)
const ANSWERS = [
  "Finance",
  "Our finance team manually reconciles invoices",
  "26–50", // scenario "25–50 employees"
  "Cost reduction",
  "1–3 months", // scenario "90 days"
];

const report = {
  scenario: ANSWERS,
  startedAt: new Date().toISOString(),
  apiCalls: [],
  consoleErrors: [],
  pageErrors: [],
  failedRequests: [],
  recommendationPostCount: 0,
  recommendationResponse: null,
  finalUrl: null,
  decisionId: null,
  decisionRender: null,
  cleanSessionRender: null,
};

async function collectErrors(page) {
  page.on("console", (m) => {
    if (m.type() === "error") report.consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => report.pageErrors.push(String(e)));
  page.on("requestfailed", (r) =>
    report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText ?? null })
  );
  page.on("response", async (r) => {
    const url = r.url();
    if (!url.includes("/api/")) return;
    report.apiCalls.push({
      method: r.request().method(),
      path: url.replace(BASE, ""),
      status: r.status(),
    });
    if (url.includes("/api/recommendations") && r.request().method() === "POST") {
      report.recommendationPostCount += 1;
      try {
        const body = await r.json();
        report.recommendationResponse = {
          recommendation_id: body.recommendation_id ?? null,
          has_analysis_id: "analysis_id" in body ? body.analysis_id : null,
          status: body.status ?? null,
          recommendation_count: Array.isArray(body.recommendations) ? body.recommendations.length : 0,
        };
      } catch {}
    }
  });
}

async function runJourney() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await collectErrors(page);

  // 1. Open /assessment
  await page.goto(`${BASE}/assessment`, { waitUntil: "domcontentloaded" });
  try {
    await page.waitForSelector('[data-testid="assessment-question-label"]', { timeout: 30000 });
  } catch {
    // Capture the failure state (e.g., auth gate) instead of dying silently.
    report.pageStateOnFailure = await page.evaluate(() =>
      document.body.innerText.slice(0, 500)
    );
    await browser.close();
    return;
  }

  // 2-6. Answer all five questions, submit once, wait for navigation.
  for (let i = 0; i < ANSWERS.length; i++) {
    const isLast = i === ANSWERS.length - 1;
    await page.click(`button:has-text("${ANSWERS[i]}")`);
    if (isLast) {
      await page.click('button:has-text("Generate Executive Recommendation")');
    } else {
      await page.click('button:has-text("Continue")');
      await page.waitForSelector(
        `[data-testid="assessment-question-label"]:has-text("Question ${i + 2} of 5")`,
        { timeout: 10000 }
      );
    }
  }

  await page.waitForURL(/\/decisions\//, { timeout: 90000 });
  report.finalUrl = page.url();
  report.decisionId = page.url().split("/decisions/")[1].split("?")[0];

  // 7-8. Decision render assertions.
  await page.waitForSelector('[data-testid="decision-title"]', { timeout: 60000 });
  report.decisionRender = await page.evaluate(() => {
    const allText = (sel) => Array.from(document.querySelectorAll(sel)).map((e) => e.textContent?.trim());
    const sectionLabels = allText("p");
    const partnerBtn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Select Your Implementation Partner")
    );
    return {
      title: document.querySelector('[data-testid="decision-title"]')?.textContent?.trim() ?? null,
      impactCards: document.querySelectorAll('[data-testid="impact-card"]').length,
      impactCardTexts: allText('[data-testid="impact-card"] p').slice(0, 6),
      evidence: sectionLabels.includes("Evidence"),
      strategyAndObjectives: sectionLabels.includes("Strategy and Objectives"),
      implementation: sectionLabels.includes("Implementation"),
      implementationSteps: document.querySelectorAll('[data-testid="implementation-step"]').length,
      implementationStepTexts: allText('[data-testid="implementation-step"] p').slice(0, 8),
      pdfButton: !!document.querySelector('[data-testid="download-pdf"]'),
      partnerButton: partnerBtn
        ? { disabled: partnerBtn.disabled, ariaDisabled: partnerBtn.getAttribute("aria-disabled") }
        : null,
      bodyHasPublicNav:
        ["Product", "How It Works", "Evidence", "About"].some((t) =>
          Array.from(document.querySelectorAll("a")).some((a) => a.textContent?.trim() === t)
        ),
    };
  });

  // 9. PDF: open overlay, trigger print clone, capture via page.pdf().
  try {
    await page.emulateMedia({ media: "print" });
    await page.click('[data-testid="download-pdf"]');
    await page.waitForSelector('[data-testid="print-download-pdf"]', { timeout: 10000 });
    await page.click('[data-testid="print-download-pdf"]');
    await page.waitForTimeout(1200); // allow clone + holder mount
    const holderReady = await page.evaluate(() => ({
      printingClass: document.body.classList.contains("printing-brief"),
      holderExists: !!document.getElementById("compass-brief-print-holder"),
    }));
    report.pdf = { ...holderReady };
    const pdfPath = "/tmp/compass-decision-smoke.pdf";
    await page.pdf({ path: pdfPath, format: "Letter", printBackground: true });
    report.pdf.path = pdfPath;
  } catch (e) {
    report.pdf = { error: String(e) };
  }

  // 10. Permanent decision URL in a clean session (no cookies/storage).
  const cleanContext = await browser.newContext();
  const cleanPage = await cleanContext.newPage();
  await collectErrors(cleanPage);
  try {
    await cleanPage.goto(report.finalUrl, { waitUntil: "domcontentloaded" });
    await cleanPage.waitForSelector('[data-testid="decision-title"]', { timeout: 60000 });
    report.cleanSessionRender = await cleanPage.evaluate(() => ({
      url: location.href,
      title: document.querySelector('[data-testid="decision-title"]')?.textContent?.trim() ?? null,
      impactCards: document.querySelectorAll('[data-testid="impact-card"]').length,
    }));
  } catch {
    report.cleanSessionRender = {
      error: "decision-title not found in clean session",
      pageText: await cleanPage.evaluate(() => document.body.innerText.slice(0, 300)),
    };
  }
  await cleanContext.close();

  await browser.close();
  report.completedAt = new Date().toISOString();
  return report;
}

runJourney().then((out) => {
  console.log(JSON.stringify(out, null, 2));
  if (out.decisionId) process.exit(0);
  process.exit(1);
}).catch((e) => { console.error(e); process.exit(2); });
