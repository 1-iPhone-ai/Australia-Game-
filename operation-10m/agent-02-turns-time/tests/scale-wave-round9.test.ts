import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateExternalStabilizationForBatch,
  buildBatchStabilizationReconcileReport,
  computeBatchStabilizationDigest,
  inferFullAgent02StabilizationSignals,
  queueDepthFromSnapshot,
  stepTurnsWithBudgetCompositeReadinessGate,
} from '../src/index.js';

describe('agent02 stabilization inference', () => {
  it('marks post-queue calm when no backlog and no step activity', () => {
    const engine = new TurnTimeEngine();
    const before = engine.snapshot();
    const step = engine.stepFullTurn();
    const after = engine.snapshot();
    const inferred = inferFullAgent02StabilizationSignals(
      step,
      queueDepthFromSnapshot(before),
      queueDepthFromSnapshot(after),
    );
    assert.equal(inferred.postQueueCalm, true);
    assert.equal(inferred.pendingStabilizationWave, false);
  });

  it('detects stabilization wave when backlog drains with activity', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'drain', dueTurn: 1, kind: 'n' });
    const before = engine.snapshot();
    const step = engine.stepFullTurn();
    const after = engine.snapshot();
    const inferred = inferFullAgent02StabilizationSignals(
      step,
      queueDepthFromSnapshot(before),
      queueDepthFromSnapshot(after),
    );
    assert.equal(inferred.pendingStabilizationWave, true);
    assert.equal(inferred.postQueueCalm, true);
  });
});

describe('external stabilization batch gate', () => {
  it('passes when Agent 05 calm flags match inferred idle step', () => {
    const engine = new TurnTimeEngine();
    const batch = engine.stepTurnsWithBudget(1, createTurnAdvanceBudget(2));
    const gate = gateExternalStabilizationForBatch(batch, {
      1: { postQueueCalm: true, pendingStabilizationWave: false },
    });
    assert.equal(gate.ok, true);
    assert.deepEqual(gate.failingTurns, []);
  });

  it('flags drift when external claims calm but backlog remains', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'later', dueTurn: 2, kind: 'k' });
    const batch = engine.stepTurnsWithBudget(1, createTurnAdvanceBudget(2));
    const gate = gateExternalStabilizationForBatch(
      batch,
      { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
      {
        queueAfterByTurn: { 1: { pendingEventDueCount: 0, pendingObligationDueCount: 1 } },
      },
    );
    assert.equal(gate.ok, false);
    assert.deepEqual(gate.failingTurns, [1]);
  });

  it('aligns wave flag when queue depth snapshots provided', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'w', dueTurn: 1, kind: 'n' });
    const before = engine.snapshot();
    const batch = engine.stepTurnsWithBudget(1, createTurnAdvanceBudget(2));
    const after = engine.snapshot();
    const gate = gateExternalStabilizationForBatch(
      batch,
      { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
      {
        queueBeforeByTurn: { 1: queueDepthFromSnapshot(before) },
        queueAfterByTurn: { 1: queueDepthFromSnapshot(after) },
      },
    );
    assert.equal(gate.ok, true);
  });
});

describe('batch stabilization reconcile report', () => {
  it('aggregates calm and wave counts', () => {
    const engine = new TurnTimeEngine();
    const batch = engine.stepTurnsWithBudget(1, createTurnAdvanceBudget(2));
    const report = buildBatchStabilizationReconcileReport(batch, {
      1: { postQueueCalm: true, pendingStabilizationWave: false },
    });
    assert.equal(report.externalCalmTurns, 1);
    assert.equal(report.alignedTurns, 1);
    assert.equal(report.ok, true);
    assert.match(computeBatchStabilizationDigest(report), /^[0-9a-f]{16}$/);
  });
});

describe('composite readiness gate (round 9)', () => {
  it('combines XS-02 narrative batch plan and stabilization lattice', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'xs', dueTurn: 1, kind: 'xs' });
    const run = stepTurnsWithBudgetCompositeReadinessGate(engine, 1, createTurnAdvanceBudget(2), {
      externalByTurn: { 1: ['xs'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
      stabilization: {
        queueBeforeByTurn: { 1: { pendingEventDueCount: 1, pendingObligationDueCount: 0 } },
        queueAfterByTurn: { 1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 } },
      },
    });
    assert.equal(run.readiness.ok, true);
    assert.equal(run.readiness.externalBatchOk, true);
    assert.equal(run.readiness.stabilizationBatchOk, true);
    assert.ok(run.readiness.stabilizationDigest?.length === 16);
  });

  it('fails composite readiness when stabilization drifts', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'later', dueTurn: 2, kind: 'k' });
    const run = stepTurnsWithBudgetCompositeReadinessGate(engine, 1, createTurnAdvanceBudget(2), {
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
      stabilization: {
        queueAfterByTurn: { 1: { pendingEventDueCount: 0, pendingObligationDueCount: 1 } },
      },
    });
    assert.equal(run.readiness.stabilizationBatchOk, false);
    assert.equal(run.readiness.ok, false);
  });
});
