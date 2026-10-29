import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGate,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExports,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('integration audit gate (round 24)', () => {
  it('passes when audit export and parity align', () => {
    const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(gate.ok, true);
    assert.match(gate.gateDigest, /^[0-9a-f]{16}$/);
  });
});

describe('integration audit gate export compare (round 24)', () => {
  it('matches twin gate exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGate(
        gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExports(mk(), mk()).ok,
      true,
    );
  });
});
