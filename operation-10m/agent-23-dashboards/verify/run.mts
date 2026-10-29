#!/usr/bin/env npx tsx
import { runAgent23SelfTests, summarizeAgent23Tests } from '../tests/agent23-self-tests.ts';

const results = runAgent23SelfTests();
const summary = summarizeAgent23Tests(results);

console.log('\n=== Agent 23 dashboards / maps self-tests ===');
results.forEach(t => {
  console.log(`${t.passed ? 'PASS' : 'FAIL'} ${t.id}: ${t.name}${t.detail && t.detail !== 'ok' ? ` — ${t.detail}` : ''}`);
});
console.log(`\nBranch: ${summary.passed}/${summary.total} passed`);

async function runCanonicalSmoke(): Promise<void> {
  if (process.env.CANONICAL_SMOKE === '0') {
    console.log('\nCanonical V9.4 Agent 23 smoke skipped (CANONICAL_SMOKE=0)');
    return;
  }
  console.log('\n=== Canonical V9.4 Agent 23 smoke (if exported) ===');
  try {
    const mod = await import('../../../(V9.4) australia-game-with-ai.tsx');
    const run = mod.runAgent23NationalRegionalDashboardSelfTests as () => Array<{ id: string; passed: boolean; detail: string }>;
    if (typeof run !== 'function') {
      console.log('runAgent23NationalRegionalDashboardSelfTests not in canonical yet — branch tests only');
      return;
    }
    const all = run();
    all.forEach(t => console.log(`${t.passed ? 'PASS' : 'FAIL'} ${t.id}${t.detail ? ` — ${t.detail}` : ''}`));
    const failed = all.filter(t => !t.passed);
    console.log(`Canonical: ${all.length - failed.length}/${all.length} passed`);
    if (failed.length) process.exit(1);
  } catch (err) {
    console.log('Canonical module not loaded (expected pre-merge):', (err as Error).message);
  }
}

await runCanonicalSmoke();

if (summary.failed.length) {
  process.exit(1);
}

console.log('\nAgent 23 verification OK');
