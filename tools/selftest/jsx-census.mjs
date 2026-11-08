// Dev-only JSX census (not part of the game file): serves the dev-transformed game module with jsxDEV wrapped
// in a counter keyed by the enclosing source region, then reports how many elements one render creates.
//   node tools/selftest/jsx-census.mjs [url]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:5173/';

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.route(/australia-game-with-ai\.tsx/, async route => {
    const res = await route.fetch();
    let body = await res.text();
    const m = body.match(/const jsxDEV = (__vite__cjsImport\d+_react_jsxDevRuntime)\["jsxDEV"\]/);
    if (m) {
      body = body.replace(m[0], `const __jsxDEV0 = ${m[1]}["jsxDEV"]; const jsxDEV = (t, p, k, s, src, self) => { const c = (window.__jsx ||= { n: 0, byLine: {} }); c.n++; const ln = src && src.lineNumber ? Math.floor(src.lineNumber / 500) * 500 : -1; c.byLine[ln] = (c.byLine[ln] || 0) + 1; return __jsxDEV0(t, p, k, s, src, self); }`);
    } else { console.log('jsxDEV binding not found'); }
    await route.fulfill({ response: res, body });
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForSelector('button:has-text("AI Opponent Mode")', { timeout: 120000 });
  await page.click('button:has-text("AI Opponent Mode")'); await page.click('button:has-text("Medium")');
  await page.waitForSelector('[data-testid="v9-play-hud"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  const before = await page.evaluate(() => { const c = window.__jsx || { n: 0, byLine: {} }; window.__jsx = { n: 0, byLine: {} }; return c.n; });
  // One re-render: open the challenge list, then close it (two renders) and measure the closed-state render only.
  await page.keyboard.press('c'); await page.waitForTimeout(600);
  await page.evaluate(() => { window.__jsx = { n: 0, byLine: {} }; });
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  const r = await page.evaluate(() => window.__jsx);
  console.log(`elements created before measuring: ${before}; one close render: ${r.n}`);
  Object.entries(r.byLine).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log(String(v).padStart(7), `source lines ${k}–${Number(k) + 499}`));
  await b.close();
})();
