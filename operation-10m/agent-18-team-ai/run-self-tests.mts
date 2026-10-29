#!/usr/bin/env node
import { runAgent18TeamMultiAgentSelfTests, summarizeAgent18SelfTests } from './src/self-tests.ts';

const results = runAgent18TeamMultiAgentSelfTests();
const summary = summarizeAgent18SelfTests(results);

for (const r of results) {
  const mark = r.passed ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${r.id}  ${r.name}${r.passed ? '' : `\n       ${r.detail}`}`);
}

console.log(`\nAgent 18 self-tests: ${summary.passed}/${summary.total} passed`);

if (summary.failed > 0) {
  process.exit(1);
}
