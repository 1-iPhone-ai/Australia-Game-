// Dev-only CPU profiler (not part of the game file): samples the JS CPU while the challenge modal is opened
// and closed (each open/close re-renders the game) and prints the functions with the most self time.
//   node tools/selftest/cpu-profile.mjs [url] [out.json]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:5173/';
const OUT = process.argv[3] && process.argv[3] !== '-' ? process.argv[3] : null;
const SCENARIO = process.argv[4] || 'modal';   // 'modal' (open/close challenges ×4) or 'turns' (end 3 turns incl. AI turns)

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  // A returning player: skip the WP8 guided first run (fresh browser profiles start in it).
  await page.addInitScript(() => { try { localStorage.setItem('aussie-adventure.v96.first-run', JSON.stringify({ version: 1, status: 'returning', at: 0 })); } catch { /* storage blocked */ } });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForSelector('button:has-text("AI Opponent Mode")', { timeout: 120000 });
  await page.click('button:has-text("AI Opponent Mode")'); await page.click('button:has-text("Medium")');
  await page.waitForSelector('[data-testid="v9-play-hud"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
  await cdp.send('Profiler.start');
  if (SCENARIO === 'turns') {
    for (let i = 0; i < 3; i++) {
      const end = page.locator('[data-testid="v9-header-end-turn"]');
      for (let w = 0; w < 40 && !(await end.count()); w++) await page.waitForTimeout(250);
      await end.click().catch(() => {});
      for (let w = 0; w < 80; w++) { await page.waitForTimeout(250); if ((await end.count()) && !(await end.isDisabled().catch(() => true))) break; }
    }
  } else {
    for (let i = 0; i < 4; i++) { await page.keyboard.press('c'); await page.waitForTimeout(500); await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
  }
  const { profile } = await cdp.send('Profiler.stop');
  await b.close();
  const byId = new Map(profile.nodes.map(n => [n.id, n]));
  const self = new Map();
  const counts = new Map();
  (profile.samples || []).forEach(id => counts.set(id, (counts.get(id) || 0) + 1));
  const dt = (profile.endTime - profile.startTime) / Math.max(1, (profile.samples || []).length) / 1000;
  for (const [id, c] of counts) {
    const n = byId.get(id); const cf = n.callFrame;
    const key = `${cf.functionName || '(anon)'} ${cf.url.split('/').pop().slice(0, 40)}:${cf.lineNumber + 1}`;
    self.set(key, (self.get(key) || 0) + c * dt);
  }
  const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 45);
  const total = [...self.values()].reduce((s, v) => s + v, 0);
  const idle = [...self.entries()].filter(([k]) => k.startsWith('(idle)')).reduce((t, [, v]) => t + v, 0);
  console.log(`scenario ${SCENARIO}: sampled ${total.toFixed(0)}ms, busy ${(total - idle).toFixed(0)}ms`);
  top.forEach(([k, v]) => console.log(`${v.toFixed(1).padStart(8)}ms  ${k}`));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(profile));
})();
