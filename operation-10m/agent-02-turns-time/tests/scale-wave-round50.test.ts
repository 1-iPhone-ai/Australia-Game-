import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  WAVE50_INTEGRATION_BASELINE_SHA,
  WAVE50_PROJECTED_LOC,
  WAVE50_ROUND,
  WAVE50_TICKET,
  sealBatchNationalTickSessionWave50Integration,
  exportBatchNationalTickSessionWave50Integration,
  compareBatchNationalTickSessionWave50IntegrationExports,
  verifyBatchNationalTickSessionWave50IntegrationReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('round 50 wave 50 O10-230 integration seal', () => {
  it('pins 8aaaf700 / 2,771,207 and exports a hex seal digest', () => {
    const exp = exportBatchNationalTickSessionWave50Integration(
      sealBatchNationalTickSessionWave50Integration(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.equal(exp.baselineSha, WAVE50_INTEGRATION_BASELINE_SHA);
    assert.equal(exp.baselineSha, '8aaaf700');
    assert.equal(exp.projectedLoc, WAVE50_PROJECTED_LOC);
    assert.equal(exp.projectedLoc, 2_771_207);
    assert.equal(exp.wave, WAVE50_ROUND);
    assert.equal(exp.ticket, WAVE50_TICKET);
    assert.match(exp.sealDigest, /^[0-9a-f]{16}$/);
    assert.match(exp.commitDigest, /^[0-9a-f]{16}$/);
  });
});

describe('round 50 wave 50 twin seal export compare', () => {
  it('matches twin integration-seal exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWave50Integration(
        sealBatchNationalTickSessionWave50Integration(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(compareBatchNationalTickSessionWave50IntegrationExports(mk(), mk()).ok, true);
  });
});

describe('round 50 wave 50 integration seal replay parity', () => {
  it('matches seal digest on replay from the same snapshot', () => {
    const parity = verifyBatchNationalTickSessionWave50IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
