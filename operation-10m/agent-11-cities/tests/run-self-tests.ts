import { assertOP10M_A11_SelfTests, runOP10M_A11_SelfTests } from '../src/self-tests.ts';

const results = runOP10M_A11_SelfTests();
let exitCode = 0;

for (const r of results) {
  const mark = r.passed ? 'PASS' : 'FAIL';
  console.log(`${mark} ${r.id} — ${r.detail}`);
  if (!r.passed) exitCode = 1;
}

const summary = assertOP10M_A11_SelfTests();
console.log(`\nAgent 11 cities/regions: ${summary.ok ? 'ALL PASSED' : `${summary.failed.length} FAILED`}`);

process.exit(exitCode);
