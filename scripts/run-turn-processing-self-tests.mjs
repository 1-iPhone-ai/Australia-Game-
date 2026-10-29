/**
 * Operation 111 / Agent 13 — headless runner for turn-processing self-tests.
 * Usage: npx vite-node scripts/run-turn-processing-self-tests.mjs
 */
import { runTurnProcessingSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runTurnProcessingSelfTests();
const failed = results.filter((r) => !r.passed);
const summary = {
  total: results.length,
  passed: results.length - failed.length,
  failedCount: failed.length,
  failed: failed.map((f) => ({ id: f.id, name: f.name, detail: f.detail }))
};

console.log(JSON.stringify(summary, null, 2));
process.exit(failed.length ? 1 : 0);
