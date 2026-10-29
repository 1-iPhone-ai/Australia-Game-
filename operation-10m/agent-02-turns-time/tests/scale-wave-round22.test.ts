import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateBatchNationalTickSessionWaveAssemblyBatch,
  exportBatchNationalTickSessionWaveAssemblyBatchGate,
  compareBatchNationalTickSessionWaveAssemblyBatchGateExports,
  auditBatchNationalTickSessionWaveAssemblyBatchIntegration,
} from '../src/index.js';

const calmBatch = [[{
  maxSteps: 1,
  input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
}]] as const;

describe('assembly batch gate export (round 22)', () => {
  it('flattens gate with digest', () => {
    const gate = gateBatchNationalTickSessionWaveAssemblyBatch(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    const exp = exportBatchNationalTickSessionWaveAssemblyBatchGate(gate);
    assert.equal(exp.ok, true);
    assert.match(exp.gateDigest, /^[0-9a-f]{16}$/);
  });
});

describe('assembly batch gate export compare (round 22)', () => {
  it('matches twin gate exports', () => {
    const a = exportBatchNationalTickSessionWaveAssemblyBatchGate(
      gateBatchNationalTickSessionWaveAssemblyBatch(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    const b = exportBatchNationalTickSessionWaveAssemblyBatchGate(
      gateBatchNationalTickSessionWaveAssemblyBatch(
        new TurnTimeEngine(),
        createTurnAdvanceBudget(2),
        calmBatch,
      ),
    );
    assert.equal(compareBatchNationalTickSessionWaveAssemblyBatchGateExports(a, b).ok, true);
  });
});

describe('assembly batch integration audit (round 22)', () => {
  it('passes audit digest for calm batch', () => {
    const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
      new TurnTimeEngine(),
      createTurnAdvanceBudget(2),
      calmBatch,
    );
    assert.equal(audit.ok, true);
    assert.match(audit.integrationDigest, /^[0-9a-f]{16}$/);
  });
});
