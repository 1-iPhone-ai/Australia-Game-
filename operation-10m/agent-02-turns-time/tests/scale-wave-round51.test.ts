import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  verifyBatchNationalTickSessionWave50IntegrationReplayParity,
  WAVE51_INTEGRATION_BASELINE_SHA,
  WAVE51_PROJECTED_LOC,
  WAVE51_ROUND,
  WAVE51_TICKET,
  sealBatchNationalTickSessionWave51Integration,
  exportBatchNationalTickSessionWave51Integration,
  compareBatchNationalTickSessionWave51IntegrationExports,
  verifyBatchNationalTickSessionWave51IntegrationReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('round 51 wave 51 wave50 integration replay parity smoke', () => {
  it('matches wave 50 integration seal replay before O10-232 latch', () => {
    const parity = verifyBatchNationalTickSessionWave50IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});

describe('round 51 wave 51 O10-233 integration seal', () => {
  it('pins a32b2b15 / 2,887,600 and exports a hex seal digest', () => {
    const exp = exportBatchNationalTickSessionWave51Integration(
      sealBatchNationalTickSessionWave51Integration(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.equal(exp.baselineSha, WAVE51_INTEGRATION_BASELINE_SHA);
    assert.equal(exp.baselineSha, 'a32b2b15');
    assert.equal(exp.projectedLoc, WAVE51_PROJECTED_LOC);
    assert.equal(exp.projectedLoc, 2_887_600);
    assert.equal(exp.wave, WAVE51_ROUND);
    assert.equal(exp.ticket, WAVE51_TICKET);
    assert.match(exp.sealDigest, /^[0-9a-f]{16}$/);
    assert.match(exp.commitDigest, /^[0-9a-f]{16}$/);
  });
});

describe('round 51 wave 51 twin seal export compare', () => {
  it('matches twin integration-seal exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWave51Integration(
        sealBatchNationalTickSessionWave51Integration(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(compareBatchNationalTickSessionWave51IntegrationExports(mk(), mk()).ok, true);
  });
});

describe('round 51 wave 51 integration seal replay parity', () => {
  it('matches seal digest on replay from the same snapshot', () => {
    const parity = verifyBatchNationalTickSessionWave51IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
