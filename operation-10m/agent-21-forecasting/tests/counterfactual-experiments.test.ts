import assert from 'node:assert/strict';
import test from 'node:test';
import { runAg21CounterfactualSelfChecks } from '../counterfactual-experiments.ts';

test('counterfactual self-check battery', () => {
  const results = runAg21CounterfactualSelfChecks();
  const failed = results.filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => `${f.id}: ${f.detail}`).join('; '));
});
