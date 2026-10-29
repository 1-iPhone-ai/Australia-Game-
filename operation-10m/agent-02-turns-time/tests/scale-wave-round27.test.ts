import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExports,
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParity,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('closure gate export (round 27 wave 27)', () => {
  it('flattens latch fields', () => {
    const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(exp.ok, true);
    assert.match(exp.latchDigest, /^[0-9a-f]{16}$/);
  });
});

describe('closure gate export compare (round 27)', () => {
  it('matches twin gate exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
        gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExports(mk(), mk()).ok,
      true,
    );
  });
});

describe('closure gate replay parity (round 27 wave 27)', () => {
  it('matches latch digest on replay', () => {
    const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParity(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(parity.parityOk, true);
  });
});
