import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParity,
  auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('closure gate assembly gate export compare (round 30 wave 30)', () => {
  it('matches twin assembly gate exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
        gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExports(
        mk(),
        mk(),
      ).ok,
      true,
    );
  });
});

describe('closure gate assembly gate replay parity (round 30)', () => {
  it('matches latch digest on replay', () => {
    const parity =
      verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParity(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      );
    assert.equal(parity.parityOk, true);
  });
});

describe('closure gate assembly gate audit (round 30 wave 30)', () => {
  it('passes export compare and replay parity', () => {
    const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(audit.ok, true);
    assert.match(audit.auditDigest, /^[0-9a-f]{16}$/);
  });
});
