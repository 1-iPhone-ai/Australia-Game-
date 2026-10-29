import { ScheduledObligation, RegisterObligationInput, TurnClock } from './types.js';

export function sortObligationsForTurn(obligations: ScheduledObligation[]): ScheduledObligation[] {
  return [...obligations].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.id.localeCompare(b.id);
  });
}

export function registerObligation(
  obligations: ScheduledObligation[],
  input: RegisterObligationInput,
): ScheduledObligation[] {
  if (!input.id) {
    throw new Error('registerObligation: id is required');
  }
  if (obligations.some((o) => o.id === input.id)) {
    throw new Error(`registerObligation: duplicate id ${input.id}`);
  }
  const dueTurn = Math.floor(input.dueTurn);
  if (!Number.isFinite(dueTurn) || dueTurn < 1) {
    throw new Error(`registerObligation: invalid dueTurn for ${input.id}`);
  }
  const entry: ScheduledObligation = {
    id: input.id,
    dueTurn,
    dueDay: input.dueDay !== undefined ? Math.floor(input.dueDay) : undefined,
    priority: input.priority ?? 100,
    kind: input.kind,
    payload: input.payload,
    status: 'pending',
  };
  return [...obligations, entry];
}

export function cancelObligation(
  obligations: ScheduledObligation[],
  id: string,
): ScheduledObligation[] {
  return obligations.map((o) => (o.id === id && o.status === 'pending' ? { ...o, status: 'cancelled' } : o));
}

export function obligationsDueOnTurn(
  obligations: ScheduledObligation[],
  clock: TurnClock,
): ScheduledObligation[] {
  const pending = obligations.filter((o) => {
    if (o.status !== 'pending') return false;
    if (o.dueTurn !== clock.turnIndex) return false;
    if (o.dueDay !== undefined && o.dueDay !== clock.dayIndex) return false;
    return true;
  });
  return sortObligationsForTurn(pending);
}

export interface FireObligationResult {
  obligations: ScheduledObligation[];
  fired: ScheduledObligation | null;
  sequence: number;
}

/**
 * Marks a single pending obligation as fired. No-op if not pending.
 */
export function fireObligationOnce(
  obligations: ScheduledObligation[],
  id: string,
  clock: TurnClock,
  sequence: number,
): FireObligationResult {
  let fired: ScheduledObligation | null = null;
  const next = obligations.map((o) => {
    if (o.id !== id) return o;
    if (o.status !== 'pending') return o;
    fired = {
      ...o,
      status: 'fired',
      firedAtTurn: clock.turnIndex,
      firedAtSequence: sequence,
    };
    return fired;
  });
  return { obligations: next, fired, sequence };
}

export function pendingBeforeTurn(obligations: ScheduledObligation[], turnIndex: number): ScheduledObligation[] {
  return obligations.filter((o) => o.status === 'pending' && o.dueTurn < turnIndex);
}

export function firedIds(obligations: ScheduledObligation[]): string[] {
  return obligations.filter((o) => o.status === 'fired').map((o) => o.id);
}
