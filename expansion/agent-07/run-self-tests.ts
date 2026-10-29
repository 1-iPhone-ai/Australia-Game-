#!/usr/bin/env npx tsx
import { runV1014FiscalOutcomesSelfTests } from './v10-14-fiscal-outcomes/self-tests';

const res = runV1014FiscalOutcomesSelfTests();
for (const r of res.results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.id} — ${r.name} (${r.detail})`);
}
console.log(`\n${res.passed}/${res.total} passed`);
process.exit(res.allPassed ? 0 : 1);
