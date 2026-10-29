#!/usr/bin/env npx tsx
import { runAgent06AllSelfTests } from './v10-14-macro-economy/self-tests.ts';

const res = runAgent06AllSelfTests();
for (const r of res.results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} ${r.id} — ${r.name} (${r.detail})`);
}
console.log(`\n${res.passed}/${res.total} passed`);
process.exit(res.allPassed ? 0 : 1);
