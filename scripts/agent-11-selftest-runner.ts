import {
  runV1014CityRegionalIntercitySelfTests,
  runV1014FixtureSweep,
} from '../expansion/o6k/agent-11-division-c-v1014-city-regional-intercity.tsx';

const tests = runV1014CityRegionalIntercitySelfTests();
const passed = tests.filter(t => t.passed).length;
const failed = tests.filter(t => !t.passed);
console.log(`V10.14 self-tests: ${passed}/${tests.length} passed`);
if (failed.length) {
  failed.slice(0, 8).forEach(t => console.error(`  FAIL ${t.id}: ${t.detail}`));
  process.exit(1);
}
const sweep = runV1014FixtureSweep();
console.log(`Fixture sweep: ${sweep.passed}/${sweep.total}`);
if (sweep.passed !== sweep.total) process.exit(1);
