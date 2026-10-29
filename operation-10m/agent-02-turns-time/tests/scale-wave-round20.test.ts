import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  runNationalTickSessionWaveAssembly,
  exportBatchNationalTickSessionWaveAssembly,
  compareBatchNationalTickSessionWaveAssemblyExports,
  runNationalTickSessionWaveAssemblyBatch,
  exportBatchNationalTickSessionWaveAssemblyBatch,
} from '../src/index.js';

const calmTick = {
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
} as const;

describe('assembly export compare (round 20)', () => {
  it('matches twin assembly exports on fresh engines', () => {
    const ticks = [calmTick] as const;
    const a = exportBatchNationalTickSessionWaveAssembly(
      runNationalTickSessionWaveAssembly(new TurnTimeEngine(), createTurnAdvanceBudget(2), ticks),
    );
    const b = exportBatchNationalTickSessionWaveAssembly(
      runNationalTickSessionWaveAssembly(new TurnTimeEngine(), createTurnAdvanceBudget(2), ticks),
    );
    const cmp = compareBatchNationalTickSessionWaveAssemblyExports(a, b);
    assert.equal(cmp.ok, true);
    assert.equal(cmp.assemblyDigestMatch, true);
  });
});

describe('assembly batch (round 20)', () => {
  it('chains two assembly runs with batch digest', () => {
    const engine = new TurnTimeEngine();
    const budget = createTurnAdvanceBudget(4);
    const batch = runNationalTickSessionWaveAssemblyBatch(engine, budget, [
      [calmTick],
      [
        {
          maxSteps: 1,
          input: { stabilizationByTurn: { 3: { postQueueCalm: true, pendingStabilizationWave: false } } },
        },
      ],
    ]);
    assert.equal(batch.runs.length, 2);
    assert.equal(batch.allOk, true);
    assert.match(batch.batchDigest, /^[0-9a-f]{16}$/);
    const exp = exportBatchNationalTickSessionWaveAssemblyBatch(batch);
    assert.equal(exp.runCount, 2);
    assert.equal(exp.allOk, true);
  });
});
