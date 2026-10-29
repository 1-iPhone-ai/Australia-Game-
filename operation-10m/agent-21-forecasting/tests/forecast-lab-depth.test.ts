import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildAg21MultiHorizonProjection,
  runAg21CounterfactualStressLadder,
  runAg21ForecastLabDepthSelfChecks,
  runAg21ScenarioBatchComparison,
  summarizeAg21ForecastBundleDepth
} from '../forecast-lab-depth.ts';
import { ag21FingerprintSnapshot, ag21LabelUncertainty } from '../isolation-core.ts';
import type { Ag21ForecastBundle } from '../strategic-forecast-policy-lab.tsx';

test('forecast lab depth self-check battery', () => {
  const failed = runAg21ForecastLabDepthSelfChecks().filter(r => !r.passed);
  assert.equal(failed.length, 0, failed.map(f => `${f.id}: ${f.detail}`).join('; '));
});

test('multi-horizon projection is deterministic for fixed seed', () => {
  const ctx = { turn: 3, seed: 99, actorCash: 800, actorDebt: 50, regionsControlled: 1 };
  const a = buildAg21MultiHorizonProjection(ctx);
  const b = buildAg21MultiHorizonProjection(ctx);
  assert.deepEqual(a.steps, b.steps);
});

test('batch comparison resolves domain counts', () => {
  const batch = runAg21ScenarioBatchComparison(['ag21_sc_000', 'ag21_sc_001']);
  assert.ok(batch.domainCounts.balance >= 2);
  assert.equal(batch.pairwise.length, 1);
});

test('bundle depth summary flags isolation', () => {
  const bundle: Ag21ForecastBundle = {
    generatedAtTurn: 2,
    authoritativeMutationDetected: true,
    overallUncertainty: ag21LabelUncertainty('high'),
    experiments: []
  };
  const summary = summarizeAg21ForecastBundleDepth(bundle);
  assert.equal(summary.isolationOk, false);
  assert.equal(summary.authoritative, false);
});

test('stress ladder preserves context fingerprint', () => {
  const ctx = { turn: 4, seed: 5, actorCash: 500, actorDebt: 10, regionsControlled: 0 };
  const before = ag21FingerprintSnapshot(ctx);
  runAg21CounterfactualStressLadder(ctx);
  assert.equal(ag21FingerprintSnapshot(ctx), before);
});
