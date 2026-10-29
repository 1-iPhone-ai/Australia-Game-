import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateBatchStabilizationPlanCoverage,
  buildBatchOrchestratedScorecard,
  verifyBatchOrchestratedReplayParity,
  stepNationalTickOrchestratedBatch,
  stepTurnsWithBudgetStabilizationCapture,
} from '../src/index.js';

describe('batch stabilization plan coverage gate', () => {
  it('requires stabilization export for every stepped turn', () => {
    const engine = new TurnTimeEngine();
    const { batch } = stepTurnsWithBudgetStabilizationCapture(engine, 2, createTurnAdvanceBudget(3));
    const gate = gateBatchStabilizationPlanCoverage(batch, {
      1: { postQueueCalm: true, pendingStabilizationWave: false },
    });
    assert.equal(gate.ok, false);
    assert.deepEqual(gate.missingTurns, [2]);
  });
});

describe('batch orchestrated scorecard', () => {
  it('aggregates gate outcomes', () => {
    const engine = new TurnTimeEngine();
    const run = stepNationalTickOrchestratedBatch(engine, 1, createTurnAdvanceBudget(2), {
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    });
    assert.equal(run.scorecard.planCoverageOk, true);
    assert.equal(run.scorecard.ok, run.report.ok);
  });
});

describe('batch orchestrated replay parity', () => {
  it('matches audit digests on replay from snapshot', () => {
    const engine = new TurnTimeEngine();
    const parity = verifyBatchOrchestratedReplayParity(engine, 1, createTurnAdvanceBudget(2), {
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    });
    assert.equal(parity.parityOk, true);
    assert.equal(parity.baseline.auditDigest, parity.replay.auditDigest);
  });
});

describe('national tick orchestrator (round 14)', () => {
  it('returns scorecard and national tick digest', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'nt', dueTurn: 1, kind: 'n' });
    const run = stepNationalTickOrchestratedBatch(engine, 1, createTurnAdvanceBudget(2), {
      externalByTurn: { 1: ['nt'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
    });
    assert.equal(run.scorecard.ok, true);
    assert.match(run.nationalTickDigest, /^[0-9a-f]{16}$/);
  });

  it('fails scorecard when stabilization plan omits a stepped turn', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'a', dueTurn: 1, kind: 'k' });
    engine.registerObligation({ id: 'b', dueTurn: 2, kind: 'k' });
    const run = stepNationalTickOrchestratedBatch(engine, 2, createTurnAdvanceBudget(3), {
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    });
    assert.equal(run.planCoverage?.ok, false);
    assert.equal(run.scorecard.ok, false);
  });
});
