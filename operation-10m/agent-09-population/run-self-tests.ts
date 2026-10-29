#!/usr/bin/env npx tsx
import { runV1014LaborDemographicsSelfTests } from './v10-14-labor-demographics/self-tests';

const res = runV1014LaborDemographicsSelfTests();
for (const r of res.results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.id} — ${r.detail}`);
}
console.log(`\n${res.passed}/${res.total} passed`);
process.exit(res.allPassed ? 0 : 1);
