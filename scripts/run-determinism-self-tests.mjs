/**
 * Operation 111 / Agent 83 — headless determinism regression slice.
 * Usage: npx vite-node scripts/run-determinism-self-tests.mjs
 */
import {
  isolateLabSelfTestRun,
  runReliabilityUpgradeSelfTests,
  runV95ReleaseReadinessSelfTests,
  runReplayStudioSelfTests,
} from '../(V9.4) australia-game-with-ai.tsx';

const V95_DETERMINISM_IDS = new Set([
  'd_stress_repeatable',
  'd_isolation',
  'd_rng_resume',
  's_rng_counters_restored',
  's_rng_corrupt_dropped',
  'r_clean',
  'r_bad_draw',
  'r_div_identical',
  'r_div_rng',
  'r_div_config',
]);

const RELIABILITY_DETERMINISM_IDS = new Set(['ru_rng_null_state', 'ru_infra_deterministic_ids']);

function collect() {
  const rows = [];

  const v95 = isolateLabSelfTestRun(() =>
    runV95ReleaseReadinessSelfTests({ stressTurns: 24 })
  ).filter((r) => V95_DETERMINISM_IDS.has(r.id));
  rows.push(...v95.map((r) => ({ suite: 'v95-release', ...r })));

  const reliability = isolateLabSelfTestRun(() => runReliabilityUpgradeSelfTests()).filter((r) =>
    RELIABILITY_DETERMINISM_IDS.has(r.id)
  );
  rows.push(...reliability.map((r) => ({ suite: 'reliability-21b', ...r })));

  const replayRaw = isolateLabSelfTestRun(() => runReplayStudioSelfTests());
  const replayRows = Array.isArray(replayRaw) ? replayRaw : replayRaw.results || [];
  rows.push(
    ...replayRows.map((r, i) => ({
      suite: 'replay-studio',
      id: r.id || `replay:${i}`,
      name: r.name,
      passed: r.passed,
      detail: r.detail,
    }))
  );

  return rows;
}

const results = collect();
const failed = results.filter((r) => !r.passed);
const summary = {
  total: results.length,
  passed: results.length - failed.length,
  failedCount: failed.length,
  failed: failed.map((f) => ({
    suite: f.suite,
    id: f.id,
    name: f.name,
    detail: f.detail,
  })),
};

console.log(JSON.stringify(summary, null, 2));
process.exit(failed.length ? 1 : 0);
