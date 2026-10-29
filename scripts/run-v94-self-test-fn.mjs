/**
 * Operation 111 / Agent 92 — run a single exported self-test function by name.
 *
 * Usage:
 *   npx vite-node scripts/run-v94-self-test-fn.mjs -- runReliabilityUpgradeSelfTests
 */
import * as game from '../(V9.4) australia-game-with-ai.tsx';

const fnName = process.argv.slice(2).find((a) => a !== '--');
if (!fnName) {
  console.error('Usage: vite-node scripts/run-v94-self-test-fn.mjs -- <exportName>');
  process.exit(2);
}

const fn = game[fnName];
if (typeof fn !== 'function') {
  console.error(`Not an exported function: ${fnName}`);
  process.exit(2);
}

const raw = fn();
const rows = Array.isArray(raw)
  ? raw
  : raw?.results || raw?.tests || [];

const normalized = rows.map((t) => ({
  id: String(t?.id ?? t?.name ?? 'test'),
  name: String(t?.name ?? t?.id ?? 'test'),
  passed: t?.passed === true || t?.pass === true,
  detail: String(t?.detail ?? t?.message ?? ''),
}));

const failed = normalized.filter((r) => !r.passed);
console.log(
  JSON.stringify(
    {
      fn: fnName,
      total: normalized.length,
      passed: normalized.length - failed.length,
      failed: failed.length,
      failures: failed.slice(0, 25),
    },
    null,
    2,
  ),
);
process.exit(failed.length ? 1 : 0);
