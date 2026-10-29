import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21HorizonVolatilitySelfChecks } from '../forecast-horizon-volatility.ts';
import { runAg21LeverAttributionSelfChecks } from '../forecast-lever-attribution.ts';
import { runAg21SurfacingScorecardSelfChecks } from '../forecast-surfacing-scorecard.ts';

test('horizon volatility self-checks', () => {
  const failed = runAg21HorizonVolatilitySelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('lever attribution self-checks', () => {
  const failed = runAg21LeverAttributionSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('surfacing scorecard self-checks', () => {
  const failed = runAg21SurfacingScorecardSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
