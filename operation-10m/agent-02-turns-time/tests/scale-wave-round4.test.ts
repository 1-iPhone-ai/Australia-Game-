import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  fastForwardToWithBudget,
  listRegisteredPipelineStageIds,
  tryConsumeTurnAdvanceBudget,
} from '../src/index.js';

describe('OP10M pipeline stage registry', () => {
  it('registers stable stage ids for Agent 25 visibility', () => {
    const ids = listRegisteredPipelineStageIds();
    assert.ok(ids.includes('ag02:phase.main'));
    assert.ok(ids.includes('ag02:effects.obligations'));
    assert.equal(ids.length, 8);
  });

  it('derives phase and effect hits from a full turn step', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'due', dueTurn: 1, kind: 'k' });
    engine.scheduleEvent({ id: 'ev', dueTurn: 1, kind: 'tick' });
    engine.startConstruction({ id: 'site', laborTurnsRequired: 1 });
    const before = engine.snapshot();
    engine.stepFullTurn();
    const hits = engine.getPipelineStageHits();
    assert.ok(hits.some((h) => h.stageId === 'ag02:phase.start' && h.turnIndex === 1));
    assert.ok(hits.some((h) => h.stageId === 'ag02:effects.obligations'));
    assert.ok(hits.some((h) => h.stageId === 'ag02:effects.events'));
    assert.ok(hits.some((h) => h.stageId === 'ag02:effects.construction'));
    const summaries = engine.getPipelineTurnSummaries();
    assert.equal(summaries[0]?.turnIndex, 1);
    assert.equal(summaries[0]?.rolled, true);
    assert.deepEqual(engine.getIncompletePipelineTurns(), []);
    const reconcile = engine.reconcileLastStepHorizon(before);
    assert.equal(reconcile.ok, true, JSON.stringify(reconcile));
  });

  it('marks blocked turns without requiring roll stages', () => {
    const engine = new TurnTimeEngine();
    engine.setPaused('overlay');
    engine.stepFullTurn();
    assert.deepEqual(engine.getIncompletePipelineTurns(), []);
    assert.ok(engine.getPipelineStageHits().some((h) => h.stageId === 'ag02:advance.blocked'));
  });
});

describe('turn advance budget', () => {
  it('refuses fast-forward when budget is insufficient', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'a', dueTurn: 5, kind: 'x' });
    const budget = createTurnAdvanceBudget(2);
    const { result, budget: after } = fastForwardToWithBudget(engine, { targetTurn: 5 }, budget);
    assert.equal(result.parityOk, false);
    assert.match(result.parityDetail ?? '', /budget/i);
    assert.equal(after.consumed, 0);
    assert.equal(engine.snapshot().clock.turnIndex, 1);
  });

  it('consumes budget when fast-forward is allowed', () => {
    const engine = new TurnTimeEngine();
    const budget = createTurnAdvanceBudget(3);
    const { result, budget: after } = fastForwardToWithBudget(engine, { targetTurn: 3 }, budget);
    assert.equal(result.parityOk, true);
    assert.equal(after.consumed, 2);
    assert.equal(engine.snapshot().clock.turnIndex, 3);
    const denied = tryConsumeTurnAdvanceBudget(after, 2);
    assert.equal(denied.allowed, false);
  });
});
