/**
 * Operation 111 — headless Game Intelligence self-test runner (Agent 43).
 * Imports only exported GI suites from the V9.4 monolith.
 */
import {
  isolateLabSelfTestRun,
  runGameIntelligence2SelfTests,
  runGameIntelligence21SelfTests,
  runGameIntelligence3SelfTests,
} from '../(V9.4) australia-game-with-ai.tsx';

const suites = [
  { name: 'GI 2.0', run: () => runGameIntelligence2SelfTests() },
  { name: 'GI 2.1', run: () => runGameIntelligence21SelfTests() },
  { name: 'GI 3.0', run: () => runGameIntelligence3SelfTests() },
];

let failed = 0;
let passed = 0;

for (const suite of suites) {
  const results = isolateLabSelfTestRun(suite.run);
  for (const r of results) {
    if (r.passed) passed++;
    else {
      failed++;
      console.error(`FAIL [${suite.name}] ${r.id}: ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
    }
  }
  const suiteFailed = results.filter((r) => !r.passed).length;
  console.log(`${suite.name}: ${results.length - suiteFailed}/${results.length} passed`);
}

console.log(`Total: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
