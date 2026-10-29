import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAudit,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParity,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate,
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('audit-gate audit gate audit gate audit export compare (round 38 wave 38)', () => {
  it('matches twin audit exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAudit(
        auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExports(
        mk(),
        mk(),
      ).ok,
      true,
    );
  });
});

describe('audit-gate audit gate audit gate audit replay parity (round 38)', () => {
  it('matches audit digest on replay', () => {
    const parity =
      verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParity(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      );
    assert.equal(parity.parityOk, true);
  });
});

describe('audit-gate audit gate audit gate audit gate export (round 38 wave 38)', () => {
  it('flattens audit gate latch fields', () => {
    const exp =
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
        gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(exp.ok, true);
    assert.match(exp.latchDigest, /^[0-9a-f]{16}$/);
  });
});
