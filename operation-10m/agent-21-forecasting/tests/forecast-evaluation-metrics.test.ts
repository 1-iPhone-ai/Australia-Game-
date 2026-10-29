import assert from 'node:assert/strict';
import test from 'node:test';
import {
  compareAg21Scenarios,
  evaluateAg21ForecastRun,
  runAg21ForecastEvaluationSelfChecks
} from '../forecast-evaluation-metrics.ts';
import { lookupAg21Scenario } from '../scenario-catalog.ts';

test('forecast evaluation self-check battery', () => {
  const failed = runAg21ForecastEvaluationSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('evaluateAg21ForecastRun marks non-authoritative', () => {
  const left = lookupAg21Scenario('ag21_sc_000');
  const right = lookupAg21Scenario('ag21_sc_001');
  assert.ok(left && right);
  const metrics = evaluateAg21ForecastRun({
    scenarioIds: [left!.id, right!.id],
    scenarios: [left!, right!],
    experimentCount: 4,
    overallUncertainty: 'moderate',
    authoritativeMutationDetected: false,
    isolatedCopyVerifiedRatio: 1
  });
  assert.equal(metrics.authoritative, false);
  assert.ok(metrics.compositeScore > 0.5);
});

test('compareAg21Scenarios returns recommendation', () => {
  const left = lookupAg21Scenario('ag21_sc_006');
  const right = lookupAg21Scenario('ag21_sc_007');
  assert.ok(left && right);
  const row = compareAg21Scenarios(left!, right!);
  assert.equal(row.sameDomain, true);
  assert.ok(['comparable', 'caution', 'incompatible'].includes(row.recommendation));
});
