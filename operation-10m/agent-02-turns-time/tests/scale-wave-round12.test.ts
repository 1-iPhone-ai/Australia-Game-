import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  computeBatchStabilizationAlignmentScore,
  gateBatchAdvancePostStabilization,
  stepTurnsWithBudgetOrchestratedAdvance,
  stepTurnsWithBudgetStabilizationCapture,
} from '../src/index.js';

describe('batch stabilization alignment score', () => {
  it('returns perfect ratio when reconcile is fully aligned', () => {
    const engine = new TurnTimeEngine();
    const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, 1, createTurnAdvanceBudget(2));
    const reconcile = engine.buildBatchStabilizationReconcileReport(batch, {
      1: { postQueueCalm: true, pendingStabilizationWave: false },
    }, capture);
    const score = computeBatchStabilizationAlignmentScore(reconcile);
    assert.equal(score.ratio, 1);
    assert.equal(score.ok, true);
  });
});

describe('batch advance post stabilization gate', () => {
  it('validates last stepped turn against final queue snapshot', () => {
    const engine = new TurnTimeEngine();
    const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, 1, createTurnAdvanceBudget(2));
    const post = gateBatchAdvancePostStabilization(
      engine.snapshot(),
      batch,
      capture,
      { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    );
    assert.equal(post.ok, true);
    assert.equal(post.lastSteppedTurn, 1);
  });
});

describe('orchestrated advance (round 12)', () => {
  it('blocks stepping when unified pre-gate fails', () => {
    const engine = new TurnTimeEngine();
    const run = stepTurnsWithBudgetOrchestratedAdvance(engine, 2, createTurnAdvanceBudget(3), {
      preGate: {
        fromTurn: 1,
        toTurn: 1,
        stabilizationByTurn: { 1: { postQueueCalm: false, pendingStabilizationWave: true } },
      },
    });
    assert.equal(run.report.preGate?.ok, false);
    assert.equal(run.report.batch.completed, 0);
    assert.equal(run.report.ok, false);
    assert.match(run.orchestratedDigest, /^[0-9a-f]{16}$/);
  });

  it('passes orchestrated path with aligned event drain', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'o12', dueTurn: 1, kind: 'n' });
    const run = stepTurnsWithBudgetOrchestratedAdvance(engine, 1, createTurnAdvanceBudget(2), {
      externalByTurn: { 1: ['o12'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
    });
    assert.equal(run.report.ok, true);
    assert.equal(run.report.alignment.ratio, 1);
    assert.equal(run.report.postStabilization?.ok, true);
  });
});
