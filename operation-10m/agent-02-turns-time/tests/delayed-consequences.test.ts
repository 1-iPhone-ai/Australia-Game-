import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TurnTimeEngine, fastForwardTo } from '../src/index.js';

describe('delayed consequence chains', () => {
  it('schedules follow-up obligation after parent fires', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'parent-loan', dueTurn: 1, kind: 'loan_due' });
    engine.registerFollowUp({
      id: 'rule-1',
      triggerRefId: 'parent-loan',
      trigger: 'obligation_fired',
      dueTurnOffset: 2,
      spawnKind: 'obligation',
      spawnId: 'child-default',
      spawnKindLabel: 'default_notice',
    });

    engine.stepFullTurn();
    assert.equal(engine.snapshot().obligations.find((o) => o.id === 'child-default')?.dueTurn, 3);

    fastForwardTo(engine, { targetTurn: 4 });
    assert.equal(engine.snapshot().obligations.find((o) => o.id === 'child-default')?.status, 'fired');
    assert.ok(engine.validate().ok);
  });

  it('consumes follow-up rule once', () => {
    const engine = new TurnTimeEngine();
    engine.registerFollowUp({
      id: 'rule-once',
      triggerRefId: 'ev-parent',
      trigger: 'event_dispatched',
      dueTurnOffset: 1,
      spawnKind: 'event',
      spawnId: 'ev-child',
      spawnKindLabel: 'aftershock',
    });
    engine.scheduleEvent({ id: 'ev-parent', dueTurn: 1, kind: 'quake' });
    engine.stepFullTurn();
    assert.equal(engine.snapshot().followUpRules[0]?.status, 'consumed');
  });
});
