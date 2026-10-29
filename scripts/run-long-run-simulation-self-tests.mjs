/**
 * Operation 111 / Agent 99 — headless long-running simulation self-tests.
 * Usage: npm run test:long-run-simulation
 *
 * Env:
 *   O111_LONG_RUN_TURNS — turn count (default 60; use 120+ for release soak)
 *   O111_LONG_RUN_MAX_TURN_MS — per-turn budget (default 30000)
 */
import { runO111LongRunSimulationSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const stressTurns = Number(process.env.O111_LONG_RUN_TURNS || 60);
const maxTurnMsBudget = Number(process.env.O111_LONG_RUN_MAX_TURN_MS || 30_000);

const results = runO111LongRunSimulationSelfTests({ stressTurns, maxTurnMsBudget });
const failed = results.filter((r) => !r.passed);
const summary = {
  stressTurns,
  maxTurnMsBudget,
  total: results.length,
  passed: results.length - failed.length,
  failedCount: failed.length,
  failed: failed.map((f) => ({ id: f.id, name: f.name, detail: f.detail }))
};

console.log(JSON.stringify(summary, null, 2));
process.exit(failed.length ? 1 : 0);
