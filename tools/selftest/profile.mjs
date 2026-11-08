// Dev-only render profiler (not part of the game file). Installs a minimal React DevTools hook before the
// app loads so React runs in profiling mode, then plays a short scripted scenario and reports commits,
// render time and the heaviest components per phase.
//   node tools/selftest/profile.mjs [url] [out.json]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const URL = process.argv[2] || 'http://127.0.0.1:5173/';
const OUT = process.argv[3] || null;

const HOOK = () => {
  const stats = { commits: 0, total: 0, game: 0, gameRenders: 0, byName: {}, phase: 'boot', phases: {} };
  const nameOf = f => { const t = f.type; if (!t) return null; if (typeof t === 'function') return t.displayName || t.name || null; if (typeof t === 'object' && t !== null) { const inner = t.type || t.render; return (t.displayName || (inner && (inner.displayName || inner.name))) || null; } return null; };
  const phaseStats = () => (stats.phases[stats.phase] ||= { commits: 0, total: 0, gameRenders: 0, game: 0, byName: {} });
  window.__wp7Profile = stats;
  window.__wp7SetPhase = p => { stats.phase = p; phaseStats(); };
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true, renderers: new Map(), isDisabled: false,
    inject(r) { const id = this.renderers.size + 1; this.renderers.set(id, r); return id; },
    checkDCE() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, setStrictMode() {},
    onCommitFiberRoot(_id, root) {
      const ps = phaseStats();
      stats.commits++; ps.commits++;
      const cur = root.current;
      const dur = cur.actualDuration || 0; stats.total += dur; ps.total += dur;
      // Walk the tree: a fiber "rendered" in this commit when its alternate differs and it did work.
      const stack = [cur];
      let visited = 0;
      while (stack.length && visited < 200000) {
        const f = stack.pop(); visited++;
        const n = nameOf(f);
        if (n && f.alternate !== null && f.actualDuration > 0 && (f.memoizedProps !== (f.alternate && f.alternate.memoizedProps) || f.memoizedState !== (f.alternate && f.alternate.memoizedState))) {
          const self = f.selfBaseDuration || 0;
          const rec = (ps.byName[n] ||= { renders: 0, self: 0 }); rec.renders++; rec.self += self;
          if (n === 'AustraliaGame') { stats.gameRenders++; ps.gameRenders++; ps.game += f.actualDuration; stats.game += f.actualDuration; }
        }
        if (f.sibling) stack.push(f.sibling);
        if (f.child) stack.push(f.child);
      }
    }
  };
};

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.addInitScript(HOOK);
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  // A returning player: skip the WP8 guided first run (fresh browser profiles start in it).
  await page.addInitScript(() => { try { localStorage.setItem('aussie-adventure.v96.first-run', JSON.stringify({ version: 1, status: 'returning', at: 0 })); } catch { /* storage blocked */ } });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForSelector('[data-testid="experience-mode-chooser"], button:has-text("AI Opponent Mode")', { timeout: 120000 });
  const phase = p => page.evaluate(x => window.__wp7SetPhase(x), p);
  await phase('start-match');
  await page.click('button:has-text("AI Opponent Mode")'); await page.click('button:has-text("Medium")');
  await page.waitForSelector('[data-testid="v9-play-hud"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  await phase('idle-5s'); await page.waitForTimeout(5000);
  await phase('open-close-challenges');
  for (let i = 0; i < 3; i++) { await page.keyboard.press('c'); await page.waitForTimeout(400); await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
  await phase('end-3-turns');
  for (let i = 0; i < 3; i++) {
    const end = page.locator('[data-testid="v9-header-end-turn"]');
    for (let w = 0; w < 40 && !(await end.count()); w++) await page.waitForTimeout(250);
    await end.click().catch(() => {});
    for (let w = 0; w < 80; w++) { await page.waitForTimeout(250); if ((await end.count()) && !(await end.isDisabled().catch(() => true))) break; }
  }
  await phase('idle-after');
  await page.waitForTimeout(2000);
  const stats = await page.evaluate(() => window.__wp7Profile);
  await b.close();
  const top = byName => Object.entries(byName).sort((a, b) => b[1].self - a[1].self).slice(0, 12).map(([n, r]) => `${n}×${r.renders} ${r.self.toFixed(1)}ms`).join(', ');
  const report = { totalCommits: stats.commits, totalMs: +stats.total.toFixed(1), gameRenders: stats.gameRenders, gameMs: +stats.game.toFixed(1), phases: {} };
  for (const [p, s] of Object.entries(stats.phases)) {
    report.phases[p] = { commits: s.commits, ms: +s.total.toFixed(1), gameRenders: s.gameRenders, gameMs: +s.game.toFixed(1), top: top(s.byName) };
  }
  console.log(JSON.stringify(report, null, 2));
  if (errs.length) console.log('page errors:', errs.slice(0, 5));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
})();
