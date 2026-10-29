/**
 * Operation 111 / Agent 106 — headless World Reaction (causal history) self-tests.
 * Usage: npx vite-node scripts/run-causal-history-self-tests.mjs
 */
import { runStrategicWorldReactionSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runStrategicWorldReactionSelfTests();
const failed = results.filter((r) => !r.passed);
const summary = {
  suite: 'runStrategicWorldReactionSelfTests',
  total: results.length,
  passed: results.length - failed.length,
  failedCount: failed.length,
  failed: failed.map((f) => ({ id: f.id, name: f.name, detail: f.detail })),
};

console.log(JSON.stringify(summary, null, 2));
process.exit(failed.length ? 1 : 0);
