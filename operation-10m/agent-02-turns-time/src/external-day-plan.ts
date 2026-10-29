import { TurnTimeSnapshot } from './types.js';

export interface ExternalDayPlanMergeResult {
  turnIndex: number;
  scheduledDueIds: string[];
  externalEventIds: string[];
  /** In Agent 05 plan but not scheduled on Agent 02 engine for this turn. */
  externalOnly: string[];
  /** Scheduled due on turn but absent from external narrative plan. */
  scheduledOnly: string[];
  ok: boolean;
}

function scheduledEventIdsDueOnTurn(snapshot: TurnTimeSnapshot, turnIndex: number): string[] {
  return snapshot.events
    .filter((e) => e.status === 'queued' && e.dueTurn === turnIndex)
    .map((e) => e.id)
    .sort((a, b) => a.localeCompare(b));
}

/**
 * XS-02 prep: reconcile Agent 05 narrative event ids with Agent 02 scheduled queue for one turn.
 * When `strict` is true, both orphan lists must be empty for `ok`.
 */
export function mergeExternalDayPlan(
  snapshot: TurnTimeSnapshot,
  turnIndex: number,
  externalEventIds: string[],
  strict = true,
): ExternalDayPlanMergeResult {
  const scheduledDueIds = scheduledEventIdsDueOnTurn(snapshot, turnIndex);
  const externalSorted = [...new Set(externalEventIds)].sort((a, b) => a.localeCompare(b));
  const scheduledSet = new Set(scheduledDueIds);
  const externalSet = new Set(externalSorted);
  const externalOnly = externalSorted.filter((id) => !scheduledSet.has(id));
  const scheduledOnly = scheduledDueIds.filter((id) => !externalSet.has(id));
  const ok = strict ? externalOnly.length === 0 && scheduledOnly.length === 0 : externalOnly.length === 0;
  return {
    turnIndex,
    scheduledDueIds,
    externalEventIds: externalSorted,
    externalOnly,
    scheduledOnly,
    ok,
  };
}
