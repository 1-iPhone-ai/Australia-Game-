import { ScheduledEvent, ScheduledObligation } from './types.js';

export function deferObligationDueTurn(
  obligations: ScheduledObligation[],
  id: string,
  newDueTurn: number,
): ScheduledObligation[] {
  const due = Math.floor(newDueTurn);
  if (!Number.isFinite(due) || due < 1) {
    throw new Error(`deferObligationDueTurn: invalid dueTurn for ${id}`);
  }
  return obligations.map((o) => {
    if (o.id !== id) return o;
    if (o.status !== 'pending') return o;
    return { ...o, dueTurn: due };
  });
}

export function deferEventDueTurn(events: ScheduledEvent[], id: string, newDueTurn: number): ScheduledEvent[] {
  const due = Math.floor(newDueTurn);
  if (!Number.isFinite(due) || due < 1) {
    throw new Error(`deferEventDueTurn: invalid dueTurn for ${id}`);
  }
  return events.map((e) => {
    if (e.id !== id) return e;
    if (e.status !== 'queued') return e;
    return { ...e, dueTurn: due };
  });
}

export function obligationsDueThroughTurn(obligations: ScheduledObligation[], throughTurn: number): ScheduledObligation[] {
  return obligations.filter((o) => o.status === 'pending' && o.dueTurn <= throughTurn);
}

export function eventsDueThroughTurn(events: ScheduledEvent[], throughTurn: number): ScheduledEvent[] {
  return events.filter((e) => e.status === 'queued' && e.dueTurn <= throughTurn);
}
