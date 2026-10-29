import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TurnTimeEngine, planEffectsThroughTurn, fastForwardTo } from '../src/index.js';

describe('turn horizon planner', () => {
  it('orders planned effects deterministically through a horizon', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'ob-b', dueTurn: 2, priority: 200, kind: 'x' });
    engine.registerObligation({ id: 'ob-a', dueTurn: 2, priority: 100, kind: 'x' });
    engine.scheduleEvent({ id: 'ev-1', dueTurn: 2, duePhase: 'end', kind: 'y' });
    engine.startConstruction({ id: 'build', laborTurnsRequired: 2 });

    const plan = engine.planThroughTurn(3);
    const turn2 = plan.filter((p) => p.turnIndex === 2);
    assert.deepEqual(
      turn2.map((p) => p.id),
      [...turn2].sort((a, b) => a.id.localeCompare(b.id)).map((p) => p.id),
    );
    assert.equal(turn2.length, 3);
    assert.ok(plan.some((p) => p.kind === 'construction_complete' && p.id === 'build'));
    assert.deepEqual(planEffectsThroughTurn(engine.snapshot(), 3), plan);
  });
});

describe('construction pause slip', () => {
  it('extends completion turn for each blocked advance while paused', () => {
    const engine = new TurnTimeEngine();
    engine.startConstruction({ id: 'site', laborTurnsRequired: 2 });
    const baseCompletion = engine.snapshot().projects[0]?.completionTurn ?? 0;
    engine.setPaused('overlay');
    engine.stepFullTurn();
    engine.stepFullTurn();
    assert.equal(engine.snapshot().projects[0]?.completionTurn, baseCompletion + 2);
    engine.clearPaused();
    engine.stepFullTurn();
    engine.stepFullTurn();
    assert.equal(engine.snapshot().projects[0]?.status, 'completed');
    assert.ok(engine.validate().ok);
  });
});

describe('cancel cascade', () => {
  it('cancels armed follow-ups when parent obligation cancelled', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'parent', dueTurn: 2, kind: 'p' });
    engine.registerFollowUp({
      id: 'rule',
      triggerRefId: 'parent',
      trigger: 'obligation_fired',
      dueTurnOffset: 1,
      spawnKind: 'obligation',
      spawnId: 'child',
      spawnKindLabel: 'c',
    });
    engine.cancelObligation('parent');
    assert.equal(engine.snapshot().followUpRules[0]?.status, 'cancelled');
    assert.ok(engine.validate().ok);
  });
});

describe('replay compare', () => {
  it('detects digest and audit changes after stepping', () => {
    const engine = new TurnTimeEngine();
    const before = engine.snapshot();
    engine.registerObligation({ id: 'x', dueTurn: 1, kind: 'k' });
    engine.stepFullTurn();
    const report = engine.compareToSnapshot(before);
    assert.equal(report.digestMatch, false);
    assert.ok(report.auditDelta.firedObligations);
  });
});

describe('fast-forward while paused', () => {
  it('returns parityOk false without spinning', () => {
    const engine = new TurnTimeEngine();
    engine.setPaused('hold');
    const result = fastForwardTo(engine, { targetTurn: 5 });
    assert.equal(result.parityOk, false);
    assert.match(result.parityDetail ?? '', /paused/i);
  });
});
