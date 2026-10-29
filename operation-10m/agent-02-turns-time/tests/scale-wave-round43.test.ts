import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity,
  auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('round 43 wave 43 gate export compare', () => {
  it('matches twin gate exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
        gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExports(
        mk(),
        mk(),
      ).ok,
      true,
    );
  });
});

describe('round 43 gate replay parity', () => {
  it('matches latch digest on replay', () => {
    const parity =
      verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      );
    assert.equal(parity.parityOk, true);
  });
});

describe('round 43 gate audit export', () => {
  it('passes export compare and replay parity', () => {
    const exp =
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
        auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(exp.ok, true);
    assert.match(exp.auditDigest, /^[0-9a-f]{16}$/);
  });
});
