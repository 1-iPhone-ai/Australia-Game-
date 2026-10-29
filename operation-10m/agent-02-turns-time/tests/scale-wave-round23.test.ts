import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  auditBatchNationalTickSessionWaveAssemblyBatchIntegration,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('integration audit export (round 23)', () => {
  it('flattens audit fields', () => {
    const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(audit);
    assert.equal(exp.ok, true);
    assert.equal(exp.integrationDigest, audit.integrationDigest);
  });
});

describe('integration audit export compare (round 23)', () => {
  it('matches twin exports on fresh engines', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
        auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExports(mk(), mk()).ok, true);
  });
});

describe('integration audit replay parity (round 23)', () => {
  it('matches integration digest on replay', () => {
    const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
