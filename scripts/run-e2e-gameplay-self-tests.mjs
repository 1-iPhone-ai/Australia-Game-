/**
 * Operation 111 / Agent 97 — headless runner for end-to-end gameplay smoke tests.
 * Usage: npm run test:e2e-gameplay
 */
import { runO111EndToEndGameplaySelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runO111EndToEndGameplaySelfTests();
const failed = results.filter((r) => !r.passed);
const summary = {
  suite: 'o111-e2e-gameplay',
  total: results.length,
  passed: results.length - failed.length,
  failedCount: failed.length,
  results: results.map((r) => ({ id: r.id, name: r.name, passed: r.passed, detail: r.detail })),
  failed: failed.map((f) => ({ id: f.id, name: f.name, detail: f.detail }))
};

console.log(JSON.stringify(summary, null, 2));
process.exit(failed.length ? 1 : 0);
