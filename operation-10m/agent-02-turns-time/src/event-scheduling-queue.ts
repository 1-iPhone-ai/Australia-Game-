import { ScheduleEventInput, ScheduledEvent, TurnClock, TurnPhase } from './types.js';

export function sortEventsForDispatch(events: ScheduledEvent[]): ScheduledEvent[] {
  return [...events].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.id.localeCompare(b.id);
  });
}

export function enqueueScheduledEvent(
  events: ScheduledEvent[],
  clock: TurnClock,
  input: ScheduleEventInput,
): ScheduledEvent[] {
  if (!input.id) throw new Error('enqueueScheduledEvent: id is required');
  if (events.some((e) => e.id === input.id)) {
    throw new Error(`enqueueScheduledEvent: duplicate id ${input.id}`);
  }
  const dueTurn = Math.floor(input.dueTurn);
  if (!Number.isFinite(dueTurn) || dueTurn < 1) {
    throw new Error(`enqueueScheduledEvent: invalid dueTurn for ${input.id}`);
  }
  const entry: ScheduledEvent = {
    id: input.id,
    dueTurn,
    dueDay: input.dueDay !== undefined ? Math.floor(input.dueDay) : undefined,
    duePhase: input.duePhase ?? 'main',
    priority: input.priority ?? 100,
    kind: input.kind,
    payload: input.payload,
    status: 'queued',
    enqueuedAtTurn: clock.turnIndex,
    enqueuedAtSequence: clock.effectSequence,
  };
  return [...events, entry];
}

export function cancelScheduledEvent(events: ScheduledEvent[], id: string): ScheduledEvent[] {
  return events.map((e) => (e.id === id && e.status === 'queued' ? { ...e, status: 'cancelled' } : e));
}

export function eventsDueForDispatch(
  events: ScheduledEvent[],
  clock: TurnClock,
  phase: TurnPhase,
): ScheduledEvent[] {
  const due = events.filter((e) => {
    if (e.status !== 'queued') return false;
    if (e.dueTurn !== clock.turnIndex) return false;
    if (e.dueDay !== undefined && e.dueDay !== clock.dayIndex) return false;
    const duePhase = e.duePhase ?? 'main';
    if (duePhase !== phase) return false;
    return true;
  });
  return sortEventsForDispatch(due);
}

export interface DispatchEventResult {
  events: ScheduledEvent[];
  dispatched: ScheduledEvent | null;
  sequence: number;
}

export function dispatchScheduledEventOnce(
  events: ScheduledEvent[],
  id: string,
  clock: TurnClock,
  sequence: number,
): DispatchEventResult {
  let dispatched: ScheduledEvent | null = null;
  const next = events.map((e) => {
    if (e.id !== id) return e;
    if (e.status !== 'queued') return e;
    dispatched = {
      ...e,
      status: 'dispatched',
      dispatchedAtTurn: clock.turnIndex,
      dispatchedAtSequence: sequence,
    };
    return dispatched;
  });
  return { events: next, dispatched, sequence };
}

export function queuedEventsBeforeTurn(events: ScheduledEvent[], turnIndex: number): ScheduledEvent[] {
  return events.filter((e) => e.status === 'queued' && e.dueTurn < turnIndex);
}

export function dispatchedEventIds(events: ScheduledEvent[]): string[] {
  return events.filter((e) => e.status === 'dispatched').map((e) => e.id);
}
