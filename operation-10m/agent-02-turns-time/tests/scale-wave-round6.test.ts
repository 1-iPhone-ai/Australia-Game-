import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  mergeExternalDayPlanWindow,
  stepTurnsWithBudgetPipelineReport,
  reconcileHorizonThroughTurns,
} from '../src/index.js';

describe('external day plan window (XS-02)', () => {
  it('merges each turn in range and flags failing turns', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'ev-t1', dueTurn: 1, kind: 'n' });
    engine.scheduleEvent({ id: 'ev-t2', dueTurn: 2, kind: 'n' });
    const window = engine.mergeExternalDayPlanWindow(1, 2, {
      1: ['ev-t1'],
      2: ['ev-t2', 'ghost'],
    });
    assert.equal(window.ok, false);
    assert.deepEqual(window.failingTurns, [2]);
    assert.equal(window.turnResults[0]?.ok, true);
    assert.deepEqual(window.turnResults[1]?.externalOnly, ['ghost']);
  });

  it('passes aligned multi-turn narrative plans', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'a', dueTurn: 1, kind: 'x' });
    engine.scheduleEvent({ id: 'b', dueTurn: 2, kind: 'x' });
    const merge = mergeExternalDayPlanWindow(engine.snapshot(), 1, 2, { 1: ['a'], 2: ['b'] });
    assert.equal(merge.ok, true);
    assert.equal(merge.turnResults.length, 2);
  });
});

describe('pipeline stage coverage', () => {
  it('lists missing stages before any turns and fills hits after activity', () => {
    const engine = new TurnTimeEngine();
    const empty = engine.getPipelineStageCoverage();
    assert.equal(empty.registeredStageCount, 9);
    assert.ok(empty.missingStageIds.includes('ag02:effects.follow_ups'));

    engine.registerObligation({ id: 'cov', dueTurn: 1, kind: 'k' });
    engine.stepFullTurn();
    const after = engine.getPipelineStageCoverage();
    assert.ok(after.observedStageIds.includes('ag02:phase.end'));
    assert.ok(after.hitCounts['ag02:effects.obligations'] >= 1);
  });
});

describe('batch advance pipeline report', () => {
  it('records horizon reconcile per stepped turn and final digest', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'b1', dueTurn: 1, kind: 'k' });
    engine.registerObligation({ id: 'b2', dueTurn: 2, kind: 'k' });
    const budget = createTurnAdvanceBudget(3);
    const { batch, report } = stepTurnsWithBudgetPipelineReport(engine, 2, budget);
    assert.equal(batch.completed, 2);
    assert.equal(report.stepsCompleted, 2);
    assert.equal(report.horizonReconcileOk.length, 2);
    assert.equal(report.allHorizonReconcileOk, true);
    assert.ok(report.finalPipelineDigest.length >= 8);
    assert.equal(report.newStageIdsByStep.length, 2);
    assert.equal(engine.snapshot().clock.turnIndex, 3);
  });

  it('skips horizon reconcile rows for pause-blocked steps', () => {
    const engine = new TurnTimeEngine();
    engine.setPaused('hold');
    const budget = createTurnAdvanceBudget(4);
    const { batch, report } = engine.stepTurnsWithBudgetPipelineReport(2, budget);
    assert.equal(batch.completed, 1);
    assert.equal(batch.stoppedReason, 'paused');
    assert.deepEqual(report.horizonReconcileOk, []);
    assert.equal(report.allHorizonReconcileOk, true);
  });
});

describe('horizon reconcile through turns', () => {
  it('validates each turn in range after a single obligation step', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'solo', dueTurn: 1, kind: 'solo' });
    const before = engine.snapshot();
    engine.stepFullTurn();
    const after = engine.snapshot();
    const report = engine.reconcileLastStepHorizon(before);
    assert.equal(report.ok, true);
    const multi = reconcileHorizonThroughTurns(before, after, 1, 1);
    assert.equal(multi.ok, true);
    assert.equal(multi.rows.length, 1);
  });
});
