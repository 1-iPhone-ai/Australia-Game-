/**
 * Headless runner for Operation 111 Agent 81 state-invariant self-tests.
 * Usage: npm run test:state-invariants
 */
import { runO111Agent81StateInvariantSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runO111Agent81StateInvariantSelfTests();
const failed = results.filter(r => !r.passed);
for (const r of results) {
  const mark = r.passed ? 'PASS' : 'FAIL';
  console.log(`${mark} ${r.id}: ${r.name}${r.passed ? '' : ` — ${r.detail}`}`);
}
if (failed.length) {
  console.error(`\n${failed.length}/${results.length} Agent 81 checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} Agent 81 state-invariant checks passed.`);
