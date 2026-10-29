import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  verifyBatchNationalTickSessionWave50IntegrationReplayParity,
  WAVE55_INTEGRATION_BASELINE_SHA,
  WAVE55_PROJECTED_LOC,
  WAVE55_ROUND,
  WAVE55_TICKET,
  sealBatchNationalTickSessionWave55Integration,
  exportBatchNationalTickSessionWave55Integration,
  compareBatchNationalTickSessionWave55IntegrationExports,
  verifyBatchNationalTickSessionWave55IntegrationReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('round 55 wave 51 wave50 integration replay parity smoke', () => {
  it('matches wave 50 integration seal replay before O10-232 latch', () => {
    const parity = verifyBatchNationalTickSessionWave50IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});

describe('round 55 wave 51 O10-247 integration seal', () => {
  it('pins c4bbec67 / 2,887,600 and exports a hex seal digest', () => {
    const exp = exportBatchNationalTickSessionWave55Integration(
      sealBatchNationalTickSessionWave55Integration(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.equal(exp.baselineSha, WAVE55_INTEGRATION_BASELINE_SHA);
    assert.equal(exp.baselineSha, 'c4bbec67');
    assert.equal(exp.projectedLoc, WAVE55_PROJECTED_LOC);
    assert.equal(exp.projectedLoc, 3_054_213);
    assert.equal(exp.wave, WAVE55_ROUND);
    assert.equal(exp.ticket, WAVE55_TICKET);
    assert.match(exp.sealDigest, /^[0-9a-f]{16}$/);
    assert.match(exp.commitDigest, /^[0-9a-f]{16}$/);
  });
});

describe('round 55 wave 51 twin seal export compare', () => {
  it('matches twin integration-seal exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWave55Integration(
        sealBatchNationalTickSessionWave55Integration(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(compareBatchNationalTickSessionWave55IntegrationExports(mk(), mk()).ok, true);
  });
});

describe('round 55 wave 51 integration seal replay parity', () => {
  it('matches seal digest on replay from the same snapshot', () => {
    const parity = verifyBatchNationalTickSessionWave55IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
