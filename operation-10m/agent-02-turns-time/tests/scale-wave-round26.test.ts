import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParity,
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('integration audit closure export compare (round 26)', () => {
  it('matches twin closure exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
        closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExports(mk(), mk()).ok,
      true,
    );
  });
});

describe('integration audit closure replay parity (round 26)', () => {
  it('matches closure digest on replay', () => {
    const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});

describe('integration audit closure gate (round 26 wave 26)', () => {
  it('passes latch when closure and parity align', () => {
    const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(gate.ok, true);
    assert.match(gate.latchDigest, /^[0-9a-f]{16}$/);
  });
});
