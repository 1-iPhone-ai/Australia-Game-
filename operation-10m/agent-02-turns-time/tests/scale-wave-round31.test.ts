import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('closure gate assembly gate audit export (round 31 wave 31)', () => {
  it('flattens audit digest fields', () => {
    const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
      auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.match(exp.auditDigest, /^[0-9a-f]{16}$/);
  });
});

describe('closure gate assembly gate audit export compare (round 31)', () => {
  it('matches twin audit exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
        auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExports(
        mk(),
        mk(),
      ).ok,
      true,
    );
  });
});

describe('closure gate assembly gate audit replay parity (round 31 wave 31)', () => {
  it('matches audit digest on replay', () => {
    const parity =
      verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParity(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      );
    assert.equal(parity.parityOk, true);
  });
});
