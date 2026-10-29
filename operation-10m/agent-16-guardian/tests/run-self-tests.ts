#!/usr/bin/env npx tsx
import { runAgent16GuardianCoPilotSelfTests, summarizeAgent16SelfTests } from '../self-tests.ts';

const results = runAgent16GuardianCoPilotSelfTests();
const summary = summarizeAgent16SelfTests(results);

for (const r of results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.id} — ${r.name}${r.passed ? '' : `: ${r.detail}`}`);
}
console.log(`\nAgent 16: ${summary.passed}/${results.length} passed`);
process.exit(summary.ok ? 0 : 1);
