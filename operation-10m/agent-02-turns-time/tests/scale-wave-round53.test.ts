import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  verifyBatchNationalTickSessionWave50IntegrationReplayParity,
  WAVE53_INTEGRATION_BASELINE_SHA,
  WAVE53_PROJECTED_LOC,
  WAVE53_ROUND,
  WAVE53_TICKET,
  sealBatchNationalTickSessionWave53Integration,
  exportBatchNationalTickSessionWave53Integration,
  compareBatchNationalTickSessionWave53IntegrationExports,
  verifyBatchNationalTickSessionWave53IntegrationReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('round 53 wave 51 wave50 integration replay parity smoke', () => {
  it('matches wave 50 integration seal replay before O10-232 latch', () => {
    const parity = verifyBatchNationalTickSessionWave50IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});

describe('round 53 wave 51 O10-237 integration seal', () => {
  it('pins 51039c5e / 2,887,600 and exports a hex seal digest', () => {
    const exp = exportBatchNationalTickSessionWave53Integration(
      sealBatchNationalTickSessionWave53Integration(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.equal(exp.baselineSha, WAVE53_INTEGRATION_BASELINE_SHA);
    assert.equal(exp.baselineSha, '51039c5e');
    assert.equal(exp.projectedLoc, WAVE53_PROJECTED_LOC);
    assert.equal(exp.projectedLoc, 2_979_928);
    assert.equal(exp.wave, WAVE53_ROUND);
    assert.equal(exp.ticket, WAVE53_TICKET);
    assert.match(exp.sealDigest, /^[0-9a-f]{16}$/);
    assert.match(exp.commitDigest, /^[0-9a-f]{16}$/);
  });
});

describe('round 53 wave 51 twin seal export compare', () => {
  it('matches twin integration-seal exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWave53Integration(
        sealBatchNationalTickSessionWave53Integration(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(compareBatchNationalTickSessionWave53IntegrationExports(mk(), mk()).ok, true);
  });
});

describe('round 53 wave 51 integration seal replay parity', () => {
  it('matches seal digest on replay from the same snapshot', () => {
    const parity = verifyBatchNationalTickSessionWave53IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
