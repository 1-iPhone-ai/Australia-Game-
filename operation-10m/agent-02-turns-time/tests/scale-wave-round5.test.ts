import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  stepTurnsWithBudget,
  mergeExternalDayPlan,
} from '../src/index.js';

describe('OP10M follow-up pipeline stage', () => {
  it('records ag02:effects.follow_ups when follow-ups schedule', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'parent', dueTurn: 1, kind: 'seed' });
    engine.registerFollowUp({
      id: 'fu',
      triggerRefId: 'parent',
      trigger: 'obligation_fired',
      dueTurnOffset: 0,
      spawnKind: 'event',
      spawnId: 'child-ev',
      spawnKindLabel: 'ripple',
    });
    engine.stepFullTurn();
    assert.ok(
      engine.getPipelineStageHits().some((h) => h.stageId === 'ag02:effects.follow_ups'),
    );
  });
});

describe('external day plan merge (XS-02)', () => {
  it('flags orphan external ids when not scheduled on engine', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'ev-a', dueTurn: 2, kind: 'narrative' });
    const merge = engine.mergeExternalDayPlan(2, ['ev-a', 'ev-ghost']);
    assert.equal(merge.ok, false);
    assert.deepEqual(merge.externalOnly, ['ev-ghost']);
    assert.deepEqual(merge.scheduledOnly, []);
  });

  it('passes strict merge when plans align', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'ev-a', dueTurn: 3, kind: 'n' });
    engine.scheduleEvent({ id: 'ev-b', dueTurn: 3, kind: 'n' });
    const merge = mergeExternalDayPlan(engine.snapshot(), 3, ['ev-b', 'ev-a']);
    assert.equal(merge.ok, true);
  });
});

describe('turn pipeline report', () => {
  it('includes digest and reconcile after a stepped turn', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'r5', dueTurn: 1, kind: 'k' });
    const before = engine.snapshot();
    engine.stepFullTurn();
    const report = engine.buildTurnPipelineReport(before);
    assert.equal(report.registeredStageCount, 9);
    assert.equal(report.reconcileOk, true);
    assert.ok(report.pipelineDigest.length >= 8);
    assert.deepEqual(report.incompleteTurns, []);
  });
});

describe('batch advance with budget', () => {
  it('stops on budget exhaustion mid-batch', () => {
    const engine = new TurnTimeEngine();
    const budget = createTurnAdvanceBudget(2);
    const batch = stepTurnsWithBudget(engine, 5, budget);
    assert.equal(batch.completed, 2);
    assert.equal(batch.budget.consumed, 2);
    assert.match(batch.stoppedReason ?? '', /budget/i);
    assert.equal(engine.snapshot().clock.turnIndex, 3);
  });

  it('stops when pause blocks without consuming extra budget steps', () => {
    const engine = new TurnTimeEngine();
    engine.setPaused('hold');
    const budget = createTurnAdvanceBudget(5);
    const batch = stepTurnsWithBudget(engine, 3, budget);
    assert.equal(batch.completed, 1);
    assert.equal(batch.steps[0]?.blockedByPause, true);
    assert.equal(batch.stoppedReason, 'paused');
  });
});
