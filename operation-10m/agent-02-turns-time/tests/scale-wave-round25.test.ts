import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateReplayParity,
  closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('integration audit gate replay parity (round 25)', () => {
  it('matches gate digest on replay from snapshot', () => {
    const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
    assert.equal(parity.baseline.gateDigest, parity.replay.gateDigest);
  });
});

describe('integration audit closure (round 25)', () => {
  it('produces closure export when gate passes', () => {
    const closure = closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(closure);
    assert.equal(exp.ok, true);
    assert.match(exp.closureDigest, /^[0-9a-f]{16}$/);
  });
});
