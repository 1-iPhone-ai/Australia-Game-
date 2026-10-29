#!/usr/bin/env npx tsx
import { runAgent14WellbeingSelfTests } from '../operation-10m/agent-14-wellbeing/self-tests.ts';

const suite = runAgent14WellbeingSelfTests();
for (const r of suite.results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.id} — ${r.detail}`);
}
console.log(`\n${suite.passed}/${suite.total} passed`);
process.exit(suite.failed ? 1 : 0);
