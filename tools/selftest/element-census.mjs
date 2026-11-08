// Dev-only element census (not part of the game file): after starting a match, counts committed fibers
// under each element that carries an id or data-testid, so the heaviest render-tree sections stand out.
//   node tools/selftest/element-census.mjs [url]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:5173/';

const HOOK = () => {
  window.__wp7Roots = [];
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true, renderers: new Map(), isDisabled: false,
    inject(r) { const id = this.renderers.size + 1; this.renderers.set(id, r); return id; },
    checkDCE() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, setStrictMode() {},
    onCommitFiberRoot(_id, root) { if (!window.__wp7Roots.includes(root)) window.__wp7Roots.push(root); }
  };
};

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.addInitScript(HOOK);
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForSelector('button:has-text("AI Opponent Mode")', { timeout: 120000 });
  await page.click('button:has-text("AI Opponent Mode")'); await page.click('button:has-text("Medium")');
  await page.waitForSelector('[data-testid="v9-play-hud"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  const census = await page.evaluate(() => {
    const root = window.__wp7Roots[0].current;
    let game = null;
    const stack = [root];
    while (stack.length) { const f = stack.pop(); if (typeof f.type === 'function' && f.type.name === 'AustraliaGame') { game = f; break; } if (f.sibling) stack.push(f.sibling); if (f.child) stack.push(f.child); }
    // Count host + component fibers; attribute each to the nearest labelled ancestor (id / data-testid), depth ≤ 12.
    const counts = {}; let total = 0; let compTotal = 0;
    const walk = (f, label, depth) => {
      for (let c = f.child; c; c = c.sibling) {
        let l = label;
        const p = c.memoizedProps || {};
        if (typeof c.type === 'string' && depth < 14 && (p.id || p['data-testid'])) l = `${label} > ${p['data-testid'] || '#' + p.id}`.split(' > ').slice(-2).join(' > ');
        total++;
        if (typeof c.type === 'function') compTotal++;
        if (typeof c.type === 'string') counts[l] = (counts[l] || 0) + 1;
        walk(c, l, depth + 1);
      }
    };
    walk(game, 'game', 0);
    return { total, compTotal, top: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 30) };
  });
  console.log(`fibers under AustraliaGame: ${census.total} (components ${census.compTotal})`);
  census.top.forEach(([k, v]) => console.log(String(v).padStart(6), k));
  await b.close();
})();
