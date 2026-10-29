#!/usr/bin/env node
/**
 * Operation 111 Agent 96 — headless economic correctness self-tests.
 */
import { runO111EconomicCorrectnessSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runO111EconomicCorrectnessSelfTests();
const failed = results.filter((r) => !r.passed);
for (const r of results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.id} — ${r.name}${r.passed ? '' : `: ${r.detail}`}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
