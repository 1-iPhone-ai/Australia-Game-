import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createInitialClock,
  enqueueScheduledEvent,
  dispatchScheduledEventOnce,
  eventsDueForDispatch,
  traceEventDispatches,
  validateTurnTimeIntegrity,
} from '../src/index.js';

describe('event scheduling queue', () => {
  it('dispatches due events in priority order on the configured phase', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'ev-b', dueTurn: 1, priority: 200, kind: 'storm' });
    engine.scheduleEvent({ id: 'ev-a', dueTurn: 1, priority: 50, kind: 'market' });
    engine.scheduleEvent({ id: 'ev-end', dueTurn: 1, duePhase: 'end', kind: 'cleanup' });

    const step = engine.stepFullTurn();
    assert.deepEqual(step.dispatchedEventIds, ['ev-a', 'ev-b', 'ev-end']);
    assert.ok(engine.validate().ok);
  });

  it('does not duplicate dispatch when handler retried', () => {
    let events = enqueueScheduledEvent([], createInitialClock(2, 2), {
      id: 'ev-once',
      dueTurn: 2,
      kind: 'raid',
    });
    const clock = createInitialClock(2, 2);
    const first = dispatchScheduledEventOnce(events, 'ev-once', clock, 1);
    events = first.events;
    const second = dispatchScheduledEventOnce(events, 'ev-once', clock, 2);
    assert.ok(first.dispatched);
    assert.equal(second.dispatched, null);
    assert.equal(events.filter((e) => e.status === 'dispatched').length, 1);
  });

  it('flags skipped queued events in integrity validation', () => {
    const clock = createInitialClock(8, 8);
    const events = enqueueScheduledEvent([], clock, { id: 'missed', dueTurn: 3, kind: 'deadline' });
    const report = validateTurnTimeIntegrity(clock, [], [], events);
    assert.equal(report.ok, false);
    assert.deepEqual(report.skippedDueEvents, ['missed']);
  });

  it('eventsDueForDispatch respects dueDay filter', () => {
    const clock = createInitialClock(4, 10);
    let events = enqueueScheduledEvent([], clock, { id: 'wrong-day', dueTurn: 4, dueDay: 9, kind: 'x' });
    events = enqueueScheduledEvent(events, clock, { id: 'right-day', dueTurn: 4, dueDay: 10, kind: 'y' });
    const due = eventsDueForDispatch(events, clock, 'main');
    assert.deepEqual(due.map((e) => e.id), ['right-day']);
  });
});
