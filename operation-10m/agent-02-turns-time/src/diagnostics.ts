import {
  EffectTraceEntry,
  IntegrityReport,
  ScheduledObligation,
  ScheduledEvent,
  FollowUpRule,
  ConstructionProject,
  TurnClock,
  TurnPhase,
} from './types.js';
import { pendingBeforeTurn, firedIds } from './scheduled-obligations.js';
import { queuedEventsBeforeTurn, dispatchedEventIds } from './event-scheduling-queue.js';
import { constructionDueForCompletion } from './multi-turn-construction.js';

export function appendTrace(trace: EffectTraceEntry[], entry: Omit<EffectTraceEntry, 'sequence'> & { sequence: number }): EffectTraceEntry[] {
  return [...trace, entry];
}

export function validateTurnTimeIntegrity(
  clock: TurnClock,
  obligations: ScheduledObligation[],
  projects: ConstructionProject[],
  events: ScheduledEvent[] = [],
  followUpRules: FollowUpRule[] = [],
): IntegrityReport {
  const duplicateFired: string[] = [];
  const seenFired = new Map<string, number>();
  for (const o of obligations) {
    if (o.status !== 'fired') continue;
    const count = (seenFired.get(o.id) ?? 0) + 1;
    seenFired.set(o.id, count);
    if (count > 1) duplicateFired.push(o.id);
  }

  const skippedDue: string[] = [];
  const orphanPastPending: string[] = [];
  for (const o of obligations) {
    if (o.status !== 'pending') continue;
    if (o.dueTurn < clock.turnIndex) {
      orphanPastPending.push(o.id);
      skippedDue.push(o.id);
    }
  }

  const constructionOverLabor: string[] = [];
  for (const p of projects) {
    if (p.laborTurnsCompleted > p.laborTurnsRequired) {
      constructionOverLabor.push(p.id);
    }
    if (p.status === 'under_construction' && p.completionTurn < clock.turnIndex && p.laborTurnsCompleted < p.laborTurnsRequired) {
      skippedDue.push(`construction:${p.id}`);
    }
  }

  const duplicateDispatchedEvents: string[] = [];
  const seenDispatched = new Map<string, number>();
  for (const e of events) {
    if (e.status !== 'dispatched') continue;
    const count = (seenDispatched.get(e.id) ?? 0) + 1;
    seenDispatched.set(e.id, count);
    if (count > 1) duplicateDispatchedEvents.push(e.id);
  }

  const skippedDueEvents: string[] = [];
  for (const e of queuedEventsBeforeTurn(events, clock.turnIndex)) {
    skippedDueEvents.push(e.id);
    skippedDue.push(`event:${e.id}`);
  }

  const staleArmedFollowUps: string[] = [];
  for (const rule of followUpRules) {
    if (rule.status !== 'armed') continue;
    if (rule.trigger === 'obligation_fired') {
      const parent = obligations.find((o) => o.id === rule.triggerRefId);
      if (!parent || parent.status === 'cancelled') {
        staleArmedFollowUps.push(rule.id);
      } else if (parent.status === 'fired') {
        staleArmedFollowUps.push(rule.id);
      }
    } else {
      const parent = events.find((e) => e.id === rule.triggerRefId);
      if (!parent || parent.status === 'cancelled') {
        staleArmedFollowUps.push(rule.id);
      } else if (parent.status === 'dispatched') {
        staleArmedFollowUps.push(rule.id);
      }
    }
  }
  for (const id of staleArmedFollowUps) {
    skippedDue.push(`follow_up:${id}`);
  }

  const messages: string[] = [];
  if (duplicateFired.length) messages.push(`Duplicate fired obligations: ${duplicateFired.join(', ')}`);
  if (duplicateDispatchedEvents.length) {
    messages.push(`Duplicate dispatched events: ${duplicateDispatchedEvents.join(', ')}`);
  }
  if (skippedDue.length) messages.push(`Skipped due effects: ${skippedDue.join(', ')}`);
  if (skippedDueEvents.length) messages.push(`Skipped due events: ${skippedDueEvents.join(', ')}`);
  if (orphanPastPending.length) messages.push(`Past-due pending: ${orphanPastPending.join(', ')}`);
  if (constructionOverLabor.length) messages.push(`Construction over-labor: ${constructionOverLabor.join(', ')}`);
  if (staleArmedFollowUps.length) messages.push(`Stale armed follow-ups: ${staleArmedFollowUps.join(', ')}`);

  const ok =
    duplicateFired.length === 0 &&
    duplicateDispatchedEvents.length === 0 &&
    skippedDue.length === 0 &&
    orphanPastPending.length === 0 &&
    constructionOverLabor.length === 0 &&
    staleArmedFollowUps.length === 0;

  return {
    ok,
    duplicateFired,
    skippedDue,
    orphanPastPending,
    constructionOverLabor,
    duplicateDispatchedEvents,
    skippedDueEvents,
    staleArmedFollowUps,
    messages,
  };
}

export function diffFiredSets(before: string[], after: string[]): string[] {
  const b = new Set(before);
  return after.filter((id) => !b.has(id));
}

export function summarizeTrace(trace: EffectTraceEntry[]): Record<TurnPhase | 'total', number> {
  const summary: Record<TurnPhase | 'total', number> = {
    start: 0,
    main: 0,
    end: 0,
    total: trace.length,
  };
  for (const entry of trace) {
    summary[entry.phase] += 1;
  }
  return summary;
}

export function obligationsScheduledThroughTurn(
  obligations: ScheduledObligation[],
  throughTurn: number,
): ScheduledObligation[] {
  return obligations.filter((o) => o.dueTurn <= throughTurn && o.status !== 'cancelled');
}

export function countPendingDueThroughTurn(obligations: ScheduledObligation[], throughTurn: number): number {
  return obligations.filter((o) => o.status === 'pending' && o.dueTurn <= throughTurn).length;
}

export function assertNoPastPending(clock: TurnClock, obligations: ScheduledObligation[]): void {
  const past = pendingBeforeTurn(obligations, clock.turnIndex);
  if (past.length) {
    throw new Error(`Past pending obligations at turn ${clock.turnIndex}: ${past.map((p) => p.id).join(', ')}`);
  }
}

export function traceObligationFirings(trace: EffectTraceEntry[]): string[] {
  return trace.filter((t) => t.kind === 'obligation_fired').map((t) => t.refId ?? '');
}

export function traceEventDispatches(trace: EffectTraceEntry[]): string[] {
  return trace.filter((t) => t.kind === 'event_dispatched').map((t) => t.refId ?? '');
}

export function traceAdvanceBlocks(trace: EffectTraceEntry[]): number {
  return trace.filter((t) => t.kind === 'advance_blocked').length;
}

export function stableFiredIdList(obligations: ScheduledObligation[]): string[] {
  return firedIds(obligations).sort((a, b) => a.localeCompare(b));
}

export function stableDispatchedEventIds(events: ScheduledEvent[]): string[] {
  return dispatchedEventIds(events).sort((a, b) => a.localeCompare(b));
}

export function projectsBehindSchedule(projects: ConstructionProject[], clock: TurnClock): ConstructionProject[] {
  return constructionDueForCompletion(projects, clock.turnIndex);
}
