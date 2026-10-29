#!/usr/bin/env npx tsx
/**
 * Agent 03 verification entrypoint:
 * 1) Branch self-tests (productivity + commercialization + unlocks)
 * 2) Optional canonical V10.5 smoke (imports monolith — slow, skipped if CANONICAL_SMOKE=0)
 */

import { runAgent03SelfTests, summarizeAgent03Tests } from '../tests/agent03-self-tests.ts';

const branch = runAgent03SelfTests();
const branchSummary = summarizeAgent03Tests(branch);

console.log('\n=== Agent 03 branch self-tests ===');
branch.forEach(t => {
  console.log(`${t.passed ? 'PASS' : 'FAIL'} ${t.id}: ${t.name}${t.detail ? ` — ${t.detail}` : ''}`);
});
console.log(`\nBranch: ${branchSummary.passed}/${branchSummary.total} passed`);

async function runCanonicalSmoke(): Promise<void> {
  if (process.env.CANONICAL_SMOKE === '0') {
    console.log('\nCanonical V10.5 smoke skipped (CANONICAL_SMOKE=0)');
    return;
  }
  console.log('\n=== Canonical V9.4 V10.5 smoke (subset) ===');
  try {
    const mod = await import('../../../(V9.4) australia-game-with-ai.tsx');
    const run = mod.runV105InnovationCapabilitiesSelfTests as () => Array<{ id: string; passed: boolean; detail: string }>;
    if (typeof run !== 'function') {
      console.error('runV105InnovationCapabilitiesSelfTests not exported');
      process.exit(1);
    }
    const all = run();
    const productivityIds = new Set(['ic17', 'ic18', 'ic19', 'ic4', 'ic6']);
    const subset = all.filter(t => productivityIds.has(t.id));
    subset.forEach(t => console.log(`${t.passed ? 'PASS' : 'FAIL'} ${t.id}${t.detail ? ` — ${t.detail}` : ''}`));
    const failed = subset.filter(t => !t.passed);
    console.log(`Canonical subset: ${subset.length - failed.length}/${subset.length} passed`);
    if (failed.length) process.exit(1);
  } catch (err) {
    console.error('Canonical smoke failed to load:', err);
    process.exit(1);
  }
}

await runCanonicalSmoke();

if (branchSummary.failed.length) {
  process.exit(1);
}

console.log('\nAgent 03 verification OK');
