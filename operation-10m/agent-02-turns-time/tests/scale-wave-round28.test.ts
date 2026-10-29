import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate,
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly,
  compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExports,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('closure gate assembly (round 28 wave 28)', () => {
  it('assembles gate export and parity', () => {
    const assembly = assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(assembly.ok, true);
    assert.match(assembly.assemblyDigest, /^[0-9a-f]{16}$/);
  });
});

describe('closure gate assembly export compare (round 28)', () => {
  it('matches twin assembly exports', () => {
    const mk = () =>
      exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
        assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
          new TurnTimeEngine(),
          createTurnAdvanceBudget(2),
          calmBatch,
        ),
      );
    assert.equal(
      compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExports(
        mk(),
        mk(),
      ).ok,
      true,
    );
  });
});
