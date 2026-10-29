/**
 * Operation 111 / Agent 80 — headless runner for player-experience contract self-tests.
 * Usage: npm run test:player-experience
 */
import { runO111PlayerExperienceContractSelfTests } from '../(V9.4) australia-game-with-ai.tsx';

const results = runO111PlayerExperienceContractSelfTests();
const failed = results.filter((r) => !r.passed);
const summary = {
  total: results.length,
  passed: results.length - failed.length,
  failedCount: failed.length,
  failed: failed.map((f) => ({ id: f.id, name: f.name, detail: f.detail }))
};

console.log(JSON.stringify(summary, null, 2));
process.exit(failed.length ? 1 : 0);
