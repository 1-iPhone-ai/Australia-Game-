/**
 * Runs Agent 13 modular self-tests (supplements + core SECTION 20AL suite).
 * Usage: npx tsx operation-10m/agent-13-energy/tests/run-self-tests.mts
 */
import { runAgent13SupplementTests } from './supplement-tests.mts';
import { runV1014IndustrialEnergyEnvironmentalSelfTests } from '../modules/industrial-energy-environmental.tsx';

async function main() {
  const sup = runAgent13SupplementTests();
  console.log(`Supplements: ${sup.passed}/${sup.total} passed (${sup.failed} failed)`);

  const core = runV1014IndustrialEnergyEnvironmentalSelfTests();
  console.log(`Core V10.14: ${core.passed}/${core.total} passed (${core.failed} failed)`);
  if (core.failed) {
    for (const r of core.results.filter(x => !x.passed)) {
      console.error(`  FAIL ${r.name}: ${r.detail}`);
    }
  }

  const failed = sup.failed + core.failed;
  process.exit(failed ? 1 : 0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
