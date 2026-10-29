import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateStabilizationLatticeSequence,
  mergeExternalStabilizationWindow,
  gateExternalStabilizationWindow,
  stepTurnsWithBudgetStabilizationCapture,
  batchStabilizationGateOptionsFromCapture,
  gateExternalStabilizationForBatch,
  stepTurnsWithBudgetInstrumentedCompositeGate,
  computeBatchCompositeReadinessDigest,
} from '../src/index.js';

describe('stabilization lattice sequence gate', () => {
  it('rejects wave without post-queue calm on the same turn', () => {
    const gate = gateStabilizationLatticeSequence({
      1: { postQueueCalm: false, pendingStabilizationWave: true },
    });
    assert.equal(gate.ok, false);
    assert.equal(gate.violations[0]?.code, 'wave_without_calm');
  });

  it('rejects consecutive stabilization waves', () => {
    const gate = gateStabilizationLatticeSequence({
      1: { postQueueCalm: true, pendingStabilizationWave: true },
      2: { postQueueCalm: true, pendingStabilizationWave: true },
    });
    assert.equal(gate.ok, false);
    assert.equal(gate.violations.some((v) => v.code === 'double_wave_without_backlog'), true);
  });
});

describe('external stabilization window', () => {
  it('merges a valid multi-turn Agent 05 plan', () => {
    const merge = mergeExternalStabilizationWindow(1, 2, {
      1: { postQueueCalm: true, pendingStabilizationWave: true },
      2: { postQueueCalm: true, pendingStabilizationWave: false },
    });
    assert.equal(merge.ok, true);
    assert.equal(merge.rows.length, 2);
  });

  it('flags missing turns in the window', () => {
    const merge = mergeExternalStabilizationWindow(1, 2, {
      1: { postQueueCalm: true, pendingStabilizationWave: false },
    });
    assert.equal(merge.ok, false);
    assert.deepEqual(merge.missingTurns, [2]);
  });

  it('combines lattice check with pipeline readiness on snapshot', () => {
    const engine = new TurnTimeEngine();
    const gate = gateExternalStabilizationWindow(engine.snapshot(), 1, 1, {
      1: { postQueueCalm: true, pendingStabilizationWave: false },
    });
    assert.equal(gate.merge.ok, true);
    assert.equal(gate.pipelineReady, true);
    assert.equal(gate.ok, true);
  });
});

describe('batch stabilization queue capture', () => {
  it('records before/after queue depth per stepped turn', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'cap', dueTurn: 1, kind: 'n' });
    const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, 1, createTurnAdvanceBudget(2));
    assert.equal(batch.completed, 1);
    assert.ok(capture.queueBeforeByTurn[1]);
    assert.ok(capture.queueAfterByTurn[1]);
    const gate = gateExternalStabilizationForBatch(
      batch,
      { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
      batchStabilizationGateOptionsFromCapture(capture),
    );
    assert.equal(gate.ok, true);
  });
});

describe('instrumented composite gate (round 10)', () => {
  it('auto-captures queue depth and passes composite readiness', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'xs', dueTurn: 1, kind: 'xs' });
    const run = stepTurnsWithBudgetInstrumentedCompositeGate(engine, 1, createTurnAdvanceBudget(2), {
      externalByTurn: { 1: ['xs'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
    });
    assert.equal(run.readiness.ok, true);
    assert.equal(run.readiness.latticeSequenceOk, true);
    assert.equal(run.readiness.stabilizationBatchOk, true);
    assert.match(run.readiness.compositeDigest ?? '', /^[0-9a-f]{16}$/);
    assert.equal(
      computeBatchCompositeReadinessDigest(run.readiness),
      run.readiness.compositeDigest,
    );
  });

  it('fails lattice when Agent 05 plan violates wave/calm coupling', () => {
    const engine = new TurnTimeEngine();
    const run = stepTurnsWithBudgetInstrumentedCompositeGate(engine, 1, createTurnAdvanceBudget(2), {
      stabilizationByTurn: { 1: { postQueueCalm: false, pendingStabilizationWave: true } },
    });
    assert.equal(run.readiness.latticeSequenceOk, false);
    assert.equal(run.readiness.ok, false);
  });
});
