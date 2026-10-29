import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21PolicyRegretSelfChecks } from '../forecast-policy-regret.ts';
import { runAg21ReliabilityGatesSelfChecks } from '../forecast-reliability-gates.ts';
import { runAg21ResidualBacktestSelfChecks } from '../forecast-residual-backtest.ts';

test('residual backtest self-checks', () => {
  const failed = runAg21ResidualBacktestSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('policy regret self-checks', () => {
  const failed = runAg21PolicyRegretSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});

test('reliability gates self-checks', () => {
  const failed = runAg21ReliabilityGatesSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => f.id).join(', '));
});
