import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  verifyBatchNationalTickSessionWave50IntegrationReplayParity,
  WAVE52_INTEGRATION_BASELINE_SHA,
  WAVE52_PROJECTED_LOC,
  WAVE52_ROUND,
  WAVE52_TICKET,
  sealBatchNationalTickSessionWave52Integration,
  exportBatchNationalTickSessionWave52Integration,
  compareBatchNationalTickSessionWave52IntegrationExports,
  verifyBatchNationalTickSessionWave52IntegrationReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('round 52 wave 51 wave50 integration replay parity smoke', () => {
  it('matches wave 50 integration seal replay before O10-232 latch', () => {
    const parity = verifyBatchNationalTickSessionWave50IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});

describe('round 52 wave 51 O10-235 integration seal', () => {
  it('pins ba97bdce / 2,887,600 and exports a hex seal digest', () => {
    const exp = exportBatchNationalTickSessionWave52Integration(
      sealBatchNationalTickSessionWave52Integration(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.equal(exp.baselineSha, WAVE52_INTEGRATION_BASELINE_SHA);
    assert.equal(exp.baselineSha, 'ba97bdce');
    assert.equal(exp.projectedLoc, WAVE52_PROJECTED_LOC);
    assert.equal(exp.projectedLoc, 2_932_752);
    assert.equal(exp.wave, WAVE52_ROUND);
    assert.equal(exp.ticket, WAVE52_TICKET);
    assert.match(exp.sealDigest, /^[0-9a-f]{16}$/);
    assert.match(exp.commitDigest, /^[0-9a-f]{16}$/);
  });
});

describe('round 52 wave 51 twin seal export compare', () => {
  it('matches twin integration-seal exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWave52Integration(
        sealBatchNationalTickSessionWave52Integration(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(compareBatchNationalTickSessionWave52IntegrationExports(mk(), mk()).ok, true);
  });
});

describe('round 52 wave 51 integration seal replay parity', () => {
  it('matches seal digest on replay from the same snapshot', () => {
    const parity = verifyBatchNationalTickSessionWave52IntegrationReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
