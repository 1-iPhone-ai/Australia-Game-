import assert from 'node:assert/strict';
import { runSimulationPerformanceBaselineContract } from './baseline-contract.mjs';

const r = runSimulationPerformanceBaselineContract();
if (!r.passed) {
  console.error('Simulation performance baseline contract FAILED:');
  for (const f of r.failed) console.error(' -', f.label, f.detail);
  process.exit(1);
}
console.log(`Simulation performance baseline contract: ${r.total}/${r.total} markers OK`);
assert.equal(r.passed, true);
