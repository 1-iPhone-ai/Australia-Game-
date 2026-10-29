import { TurnTimeSnapshot, TurnPhase } from './types.js';
import { sortObligationsForTurn } from './scheduled-obligations.js';
import { sortEventsForDispatch } from './event-scheduling-queue.js';

export type PlannedEffectKind = 'obligation' | 'event' | 'construction_complete';

export interface PlannedEffect {
  turnIndex: number;
  dayIndex?: number;
  phase?: TurnPhase;
  kind: PlannedEffectKind;
  id: string;
  priority: number;
}

export function planEffectsThroughTurn(snapshot: TurnTimeSnapshot, throughTurn: number): PlannedEffect[] {
  const end = Math.floor(throughTurn);
  if (!Number.isFinite(end) || end < 1) {
    throw new Error('planEffectsThroughTurn: invalid throughTurn');
  }

  const planned: PlannedEffect[] = [];

  for (let turn = snapshot.clock.turnIndex; turn <= end; turn += 1) {
    const clockView = { ...snapshot.clock, turnIndex: turn };

    const obligations = sortObligationsForTurn(
      snapshot.obligations.filter((o) => o.status === 'pending' && o.dueTurn === turn),
    );
    for (const o of obligations) {
      planned.push({
        turnIndex: turn,
        dayIndex: o.dueDay,
        phase: 'main',
        kind: 'obligation',
        id: o.id,
        priority: o.priority,
      });
    }

    const events = sortEventsForDispatch(
      snapshot.events.filter((e) => e.status === 'queued' && e.dueTurn === turn),
    );
    for (const e of events) {
      planned.push({
        turnIndex: turn,
        dayIndex: e.dueDay,
        phase: e.duePhase ?? 'main',
        kind: 'event',
        id: e.id,
        priority: e.priority,
      });
    }

    for (const p of snapshot.projects) {
      if (p.status !== 'under_construction') continue;
      if (p.completionTurn === turn) {
        planned.push({
          turnIndex: turn,
          phase: 'end',
          kind: 'construction_complete',
          id: p.id,
          priority: 500,
        });
      }
    }
  }

  return planned.sort((a, b) => {
    if (a.turnIndex !== b.turnIndex) return a.turnIndex - b.turnIndex;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.id.localeCompare(b.id);
  });
}

export function countPlannedThrough(planned: PlannedEffect[], throughTurn: number): number {
  return planned.filter((p) => p.turnIndex <= throughTurn).length;
}
