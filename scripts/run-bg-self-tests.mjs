/**
 * Agent 45 — run Background AI self-tests in isolation (no browser).
 */
import { runBackgroundAISelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runBackgroundAISelfTests();
const failed = results.filter((r) => !r.passed);
console.log(`Background AI self-tests: ${results.length - failed.length}/${results.length} passed`);
for (const r of failed) {
  console.error(`FAIL ${r.id}: ${r.name}\n  ${r.detail}`);
}
process.exit(failed.length ? 1 : 0);
