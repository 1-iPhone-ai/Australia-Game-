import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  computePipelineStageCoverageDelta,
  gateExternalDayPlanWindow,
  stepTurnsWithBudgetObservability,
} from '../src/index.js';

describe('pipeline stage coverage delta', () => {
  it('lists newly observed stages after a full turn', () => {
    const engine = new TurnTimeEngine();
    const before = engine.snapshot();
    engine.registerObligation({ id: 'd1', dueTurn: 1, kind: 'k' });
    engine.stepFullTurn();
    const delta = computePipelineStageCoverageDelta(before, engine.snapshot());
    assert.ok(delta.newlyObservedStageIds.includes('ag02:phase.end'));
    assert.ok((delta.hitCountDelta['ag02:effects.obligations'] ?? 0) >= 1);
  });
});

describe('external day plan window gate (XS-02)', () => {
  it('passes when merge aligns before the turn advances', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'xs', dueTurn: 1, kind: 'n' });
    const gate = engine.gateExternalDayPlanWindow(1, 1, { 1: ['xs'] });
    assert.equal(gate.merge.ok, true);
    assert.equal(gate.pipelineReady, true);
    assert.equal(gate.ok, true);
  });

  it('surfaces incomplete pipeline turns from the active snapshot', () => {
    const engine = new TurnTimeEngine();
    engine.stepFullTurn({ phases: ['start', 'main'] });
    const gate = gateExternalDayPlanWindow(engine.snapshot(), 1, 1, { 1: [] });
    assert.ok(gate.incompletePipelineTurns.includes(1));
    assert.equal(gate.pipelineReady, true);
  });

  it('fails merge portion when external ids drift', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'real', dueTurn: 1, kind: 'n' });
    engine.stepFullTurn();
    const gate = gateExternalDayPlanWindow(engine.snapshot(), 1, 1, { 1: ['ghost'] });
    assert.equal(gate.merge.ok, false);
    assert.equal(gate.ok, false);
  });
});

describe('batch advance observability rollup', () => {
  it('aggregates pipeline, horizon, and per-step rows', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'a', dueTurn: 1, kind: 'k' });
    engine.registerObligation({ id: 'b', dueTurn: 2, kind: 'k' });
    const budget = createTurnAdvanceBudget(4);
    const { batch, rollup } = stepTurnsWithBudgetObservability(engine, 2, budget);
    assert.equal(batch.completed, 2);
    assert.equal(rollup.stepRows.length, 2);
    assert.equal(rollup.horizon.ok, true);
    assert.equal(rollup.pipeline.stepsCompleted, 2);
    assert.ok(rollup.finalCoverageDelta.newlyObservedStageIds.length >= 1);
    assert.equal(rollup.ok, true);
  });

  it('exposes step pipeline digests distinct per turn', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 's1', dueTurn: 1, kind: 'k' });
    engine.registerObligation({ id: 's2', dueTurn: 2, kind: 'k' });
    const before = engine.snapshot();
    const batch = engine.stepTurnsWithBudget(2, createTurnAdvanceBudget(3));
    const rows = engine.buildBatchStepPipelineReports(before, batch);
    assert.equal(rows.length, 2);
    assert.notEqual(rows[0]?.report.pipelineDigest, rows[1]?.report.pipelineDigest);
  });
});

describe('batch horizon reconcile report', () => {
  it('matches per-step flags with range reconcile', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'hr', dueTurn: 1, kind: 'k' });
    const before = engine.snapshot();
    const batch = engine.stepTurnsWithBudget(1, createTurnAdvanceBudget(2));
    const report = engine.buildBatchHorizonReconcileReport(before, batch);
    assert.equal(report.stepHorizonOk.length, 1);
    assert.equal(report.stepHorizonOk[0], true);
    assert.equal(report.ok, true);
  });
});
