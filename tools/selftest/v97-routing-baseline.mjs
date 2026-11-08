// Prints the V9.7 routing replay script result for V9.6 and for V9.7 with the routing flag off and on
// (dev server on :5173).
//   node tools/selftest/v97-routing-baseline.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const p = await browser.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
await p.goto('http://127.0.0.1:5173/tools/selftest/v97-routing-baseline.html', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => Boolean(window.__v97RoutingBaseline), null, { timeout: 600000 });
console.log(JSON.stringify(await p.evaluate(() => window.__v97RoutingBaseline), null, 1));
if (errs.length) console.log('page errors:', errs);
await browser.close();
