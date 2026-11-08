// Runs the in-browser self-test harness against the Vite dev server.
//   node tools/selftest/run.mjs [index|baseline] [outfile.json]
// Requires `npx vite` to be serving the repo root on port 5173.
import fs from 'node:fs';
import { createRequire } from 'node:module';
// Playwright is resolved via Node's global path (pre-installed in the cloud image), not from node_modules.
const { chromium } = createRequire(import.meta.url)('playwright');

const page = process.argv[2] || 'index';
const outFile = process.argv[3] || `/tmp/selftest-${page}.json`;
const url = `http://127.0.0.1:5173/tools/selftest/${page}.html`;

const browser = await chromium.launch();
const ctx = await browser.newContext();
const p = await ctx.newPage();
const consoleErrors = [];
p.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 500)); });
p.on('pageerror', e => consoleErrors.push(`pageerror: ${String(e).slice(0, 500)}`));
await p.goto(url, { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => Boolean(window.__selfTestReport), null, { timeout: 900000 });
const report = await p.evaluate(() => window.__selfTestReport);
report.consoleErrors = consoleErrors;
fs.writeFileSync(outFile, JSON.stringify(report, null, 1));
const rel = report.release?.report;
console.log(`${page}: total=${report.total} passed=${report.passed} failed=${report.failed} harnessErrors=${report.errors.length} consoleErrors=${consoleErrors.length}`);
if (rel) console.log(`release(full): status=${rel.status} checks=${rel.totals.checks} passed=${rel.totals.passed} failed=${rel.totals.failed} gate=${(rel.gateReasons || []).join(' | ')}`);
report.failures.forEach(f => console.log(`  FAIL ${f.suite} ${f.id}: ${f.name} — ${f.detail.slice(0, 200)}`));
report.errors.forEach(e => console.log(`  ERROR ${e.slice(0, 300)}`));
await browser.close();
