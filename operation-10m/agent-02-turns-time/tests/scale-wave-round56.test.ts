import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  verifyBatchNationalTickSessionWave50IntegrationReplayParity,
  WAVE56_INTEGRATION_BASELINE_SHA,
  WAVE56_PROJECTED_LOC,
  WAVE56_ROUND,
  WAVE56_TICKET,
  sealBatchNationalTickSessionWave56Integration,
  exportBatchNationalTickSessionWave56Integration,
  compareBatchNationalTickSessionWave56IntegrationExports,
  verifyBatchNationalTickSessionWave56IntegrationReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('round 56 wave 51 wave50 integration replay parity smoke', () => {
  it('matches wave 50 integration seal replay before O10-232 latch', () => {
    const parity = verifyBatchNationalTickSessionWave50IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});

describe('round 56 wave 51 O10-254 integration seal', () => {
  it('pins 8e2366bb / 2,887,600 and exports a hex seal digest', () => {
    const exp = exportBatchNationalTickSessionWave56Integration(
      sealBatchNationalTickSessionWave56Integration(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.equal(exp.baselineSha, WAVE56_INTEGRATION_BASELINE_SHA);
    assert.equal(exp.baselineSha, '8e2366bb');
    assert.equal(exp.projectedLoc, WAVE56_PROJECTED_LOC);
    assert.equal(exp.projectedLoc, 3_084_921);
    assert.equal(exp.wave, WAVE56_ROUND);
    assert.equal(exp.ticket, WAVE56_TICKET);
    assert.match(exp.sealDigest, /^[0-9a-f]{16}$/);
    assert.match(exp.commitDigest, /^[0-9a-f]{16}$/);
  });
});

describe('round 56 wave 51 twin seal export compare', () => {
  it('matches twin integration-seal exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWave56Integration(
        sealBatchNationalTickSessionWave56Integration(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(compareBatchNationalTickSessionWave56IntegrationExports(mk(), mk()).ok, true);
  });
});

describe('round 56 wave 51 integration seal replay parity', () => {
  it('matches seal digest on replay from the same snapshot', () => {
    const parity = verifyBatchNationalTickSessionWave56IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
