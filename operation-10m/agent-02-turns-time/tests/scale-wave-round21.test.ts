import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  runNationalTickSessionWaveAssemblyBatch,
  exportBatchNationalTickSessionWaveAssemblyBatch,
  compareBatchNationalTickSessionWaveAssemblyBatchExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchReplayParity,
  gateBatchNationalTickSessionWaveAssemblyBatch,
} from '../src/index.js';

const calmTurn1 = {
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
} as const;

describe('assembly batch export compare (round 21)', () => {
  it('matches twin batch exports on fresh engines', () => {
    const batches = [[calmTurn1]] as const;
    const a = exportBatchNationalTickSessionWaveAssemblyBatch(
      runNationalTickSessionWaveAssemblyBatch(new TurnTimeEngine(), createTurnAdvanceBudget(2), batches),
    );
    const b = exportBatchNationalTickSessionWaveAssemblyBatch(
      runNationalTickSessionWaveAssemblyBatch(new TurnTimeEngine(), createTurnAdvanceBudget(2), batches),
    );
    assert.equal(compareBatchNationalTickSessionWaveAssemblyBatchExports(a, b).ok, true);
  });
});

describe('assembly batch replay parity (round 21)', () => {
  it('matches batch digest on replay from snapshot', () => {
    const parity = verifyBatchNationalTickSessionWaveAssemblyBatchReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(4),
      [
        [calmTurn1],
        [
          {
            maxSteps: 1,
            input: { stabilizationByTurn: { 3: { postQueueCalm: true, pendingStabilizationWave: false } } },
          },
        ],
      ],
    );
    assert.equal(parity.parityOk, true);
    assert.equal(parity.baseline.batchDigest, parity.replay.batchDigest);
  });
});

describe('assembly batch gate (round 21)', () => {
  it('passes when export and parity align', () => {
    const gate = gateBatchNationalTickSessionWaveAssemblyBatch(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      [[calmTurn1]],
    );
    assert.equal(gate.ok, true);
    assert.equal(gate.exportAllOk, true);
    assert.match(gate.export.batchDigest, /^[0-9a-f]{16}$/);
  });
});
