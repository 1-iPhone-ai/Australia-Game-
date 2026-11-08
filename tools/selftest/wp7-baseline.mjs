// Prints the 50-action script result for V9.5 and V9.6 (dev server on :5173).
//   node tools/selftest/wp7-baseline.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const p = await browser.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
await p.goto('http://127.0.0.1:5173/tools/selftest/wp7-baseline.html', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => Boolean(window.__wp7Baseline), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => window.__wp7Baseline), null, 1));
if (errs.length) console.log('page errors:', errs);
await browser.close();
