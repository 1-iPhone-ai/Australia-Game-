/**
 * Operation 111 / Agent 92 — headless runner for exported V9.4 self-test suites.
 *
 * Usage:
 *   npx vite-node scripts/run-v94-self-test-suite.mjs -- --quick
 *   npx vite-node scripts/run-v94-self-test-suite.mjs -- --full
 *   npx vite-node scripts/run-v94-self-test-suite.mjs -- --suite=reliability
 *   npx vite-node scripts/run-v94-self-test-suite.mjs -- --suite=memory,replay
 */
import {
  V95_EXISTING_SUITES,
  runV95ExistingSuite,
  v95WithIsolatedGlobals,
} from '../(V9.4) australia-game-with-ai.tsx';

const argv = process.argv.slice(2).filter((a) => a !== '--');

function parseArgs() {
  let mode = null;
  const suiteIds = [];
  for (const arg of argv) {
    if (arg === '--quick') mode = 'quick';
    else if (arg === '--full') mode = 'full';
    else if (arg.startsWith('--suite=')) {
      suiteIds.push(...arg.slice('--suite='.length).split(',').map((s) => s.trim()).filter(Boolean));
    } else if (arg === '--list') {
      return { list: true };
    } else if (arg === '--help' || arg === '-h') {
      return { help: true };
    }
  }
  if (suiteIds.length) return { suiteIds };
  if (mode) return { mode };
  return { mode: 'quick' };
}

function normalizeFailures(checks) {
  return checks.filter((c) => !c.passed).map((c) => ({
    id: c.id,
    name: c.name,
    detail: c.detail,
    severity: c.severity,
  }));
}

const parsed = parseArgs();

if (parsed.help) {
  console.log(`run-v94-self-test-suite.mjs
  --quick          Run V95_EXISTING_SUITES where tier=quick (default)
  --full           Run all registered suites
  --suite=id,...   Run specific suite id(s) from V95_EXISTING_SUITES
  --list           Print suite ids and labels`);
  process.exit(0);
}

if (parsed.list) {
  for (const s of V95_EXISTING_SUITES) {
    console.log(`${s.id}\t${s.tier}\t${s.label}`);
  }
  process.exit(0);
}

let specs = V95_EXISTING_SUITES;
if (parsed.suiteIds?.length) {
  const unknown = parsed.suiteIds.filter((id) => !specs.some((s) => s.id === id));
  if (unknown.length) {
    console.error(`Unknown suite id(s): ${unknown.join(', ')}`);
    process.exit(2);
  }
  specs = specs.filter((s) => parsed.suiteIds.includes(s.id));
} else if (parsed.mode === 'quick') {
  specs = specs.filter((s) => s.tier === 'quick');
} else if (parsed.mode === 'full') {
  specs = specs.filter(() => true);
}

const started = Date.now();
const suiteResults = [];

for (const spec of specs) {
  const t0 = Date.now();
  const checks = v95WithIsolatedGlobals(() => runV95ExistingSuite(spec));
  const failed = normalizeFailures(checks);
  suiteResults.push({
    id: spec.id,
    label: spec.label,
    tier: spec.tier,
    passed: failed.length === 0,
    durationMs: Date.now() - t0,
    failures: failed,
  });
  const mark = failed.length ? 'FAIL' : 'ok';
  console.log(`[${mark}] ${spec.id} (${spec.label}) — ${Date.now() - t0}ms`);
}

const failedSuites = suiteResults.filter((s) => !s.passed);
const summary = {
  mode: parsed.suiteIds?.length ? `suite:${parsed.suiteIds.join(',')}` : parsed.mode || 'quick',
  suitesRun: suiteResults.length,
  suitesPassed: suiteResults.length - failedSuites.length,
  suitesFailed: failedSuites.length,
  durationMs: Date.now() - started,
  failedSuites: failedSuites.map((s) => ({
    id: s.id,
    failures: s.failures,
  })),
};

console.log(JSON.stringify(summary, null, 2));
process.exit(failedSuites.length ? 1 : 0);
