import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditReplayParity,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate,
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('audit-gate audit gate audit export compare (round 36 wave 36)', () => {
  it('matches twin audit exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
        auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExports(
        mk(),
        mk(),
      ).ok,
      true,
    );
  });
});

describe('audit-gate audit gate audit replay parity (round 36)', () => {
  it('matches audit digest on replay', () => {
    const parity =
      verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditReplayParity(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      );
    assert.equal(parity.parityOk, true);
  });
});

describe('audit-gate audit gate audit gate export (round 36 wave 36)', () => {
  it('flattens audit gate latch fields', () => {
    const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.match(exp.latchDigest, /^[0-9a-f]{16}$/);
  });
});
