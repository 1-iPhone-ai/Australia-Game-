import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  verifyBatchNationalTickSessionWave50IntegrationReplayParity,
  WAVE54_INTEGRATION_BASELINE_SHA,
  WAVE54_PROJECTED_LOC,
  WAVE54_ROUND,
  WAVE54_TICKET,
  sealBatchNationalTickSessionWave54Integration,
  exportBatchNationalTickSessionWave54Integration,
  compareBatchNationalTickSessionWave54IntegrationExports,
  verifyBatchNationalTickSessionWave54IntegrationReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('round 54 wave 51 wave50 integration replay parity smoke', () => {
  it('matches wave 50 integration seal replay before O10-232 latch', () => {
    const parity = verifyBatchNationalTickSessionWave50IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});

describe('round 54 wave 51 O10-240 integration seal', () => {
  it('pins 5bd043ad / 2,887,600 and exports a hex seal digest', () => {
    const exp = exportBatchNationalTickSessionWave54Integration(
      sealBatchNationalTickSessionWave54Integration(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.equal(exp.baselineSha, WAVE54_INTEGRATION_BASELINE_SHA);
    assert.equal(exp.baselineSha, '5bd043ad');
    assert.equal(exp.projectedLoc, WAVE54_PROJECTED_LOC);
    assert.equal(exp.projectedLoc, 3_022_056);
    assert.equal(exp.wave, WAVE54_ROUND);
    assert.equal(exp.ticket, WAVE54_TICKET);
    assert.match(exp.sealDigest, /^[0-9a-f]{16}$/);
    assert.match(exp.commitDigest, /^[0-9a-f]{16}$/);
  });
});

describe('round 54 wave 51 twin seal export compare', () => {
  it('matches twin integration-seal exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWave54Integration(
        sealBatchNationalTickSessionWave54Integration(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(compareBatchNationalTickSessionWave54IntegrationExports(mk(), mk()).ok, true);
  });
});

describe('round 54 wave 51 integration seal replay parity', () => {
  it('matches seal digest on replay from the same snapshot', () => {
    const parity = verifyBatchNationalTickSessionWave54IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
