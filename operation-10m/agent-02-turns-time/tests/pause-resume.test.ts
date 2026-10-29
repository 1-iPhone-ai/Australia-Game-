import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  traceAdvanceBlocks,
  traceEventDispatches,
  traceObligationFirings,
} from '../src/index.js';

describe('pause/resume diagnostics', () => {
  it('blocks turn advance while paused and records advance_blocked', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'ev-1', dueTurn: 1, kind: 'tick' });
    engine.setPaused('modal_open');

    const blocked = engine.stepFullTurn();
    assert.equal(blocked.blockedByPause, true);
    assert.equal(blocked.clockBefore.turnIndex, blocked.clockAfter.turnIndex);
    assert.equal(engine.getPauseDiagnostics().blockedAdvanceCount, 1);
    assert.equal(traceEventDispatches(engine.consumeTrace()).length, 0);

    engine.clearPaused();
    const step = engine.stepFullTurn();
    assert.equal(step.blockedByPause, false);
    assert.equal(step.clockAfter.turnIndex, 2);
    assert.deepEqual(step.dispatchedEventIds, ['ev-1']);
    assert.ok(engine.validate().ok);
  });

  it('does not skip obligations queued before pause after resume', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'loan-due', dueTurn: 1, kind: 'payment' });
    engine.setPaused('trade_overlay');
    engine.stepFullTurn();
    engine.stepFullTurn();
    assert.equal(engine.snapshot().obligations[0]?.status, 'pending');

    engine.clearPaused();
    engine.stepFullTurn();
    assert.equal(engine.snapshot().obligations[0]?.status, 'fired');
    assert.deepEqual(traceObligationFirings(engine.consumeTrace()), ['loan-due']);
  });

  it('increments resumeGeneration on each resume', () => {
    const engine = new TurnTimeEngine();
    engine.setPaused('a');
    engine.clearPaused();
    engine.setPaused('b');
    engine.clearPaused();
    assert.equal(engine.getPauseDiagnostics().resumeGeneration, 2);
  });

  it('counts multiple blocked advances while paused', () => {
    const engine = new TurnTimeEngine();
    engine.setPaused('debug');
    engine.stepFullTurn();
    engine.stepFullTurn();
    engine.stepFullTurn();
    assert.equal(engine.getPauseDiagnostics().blockedAdvanceCount, 3);
    assert.equal(traceAdvanceBlocks(engine.consumeTrace()), 3);
  });
});
