import { type ExternalDayPlanMergeResult } from './external-day-plan.js';
import { type BatchAdvanceResult } from './batch-advance.js';

export interface ExternalDayPlanBatchGateResult {
  steppedTurns: number[];
  mergeResults: ExternalDayPlanMergeResult[];
  failingTurns: number[];
  ok: boolean;
}

/**
 * XS-02 batch gate: each stepped turn's narrative ids must match events dispatched during that step.
 */
export function gateExternalDayPlanForBatch(
  batch: BatchAdvanceResult,
  externalByTurn: Readonly<Record<number, readonly string[]>>,
): ExternalDayPlanBatchGateResult {
  const steppedTurns: number[] = [];
  const mergeResults: ExternalDayPlanMergeResult[] = [];
  const failingTurns: number[] = [];

  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    const turn = step.clockBefore.turnIndex;
    steppedTurns.push(turn);
    const externalSorted = [...new Set(externalByTurn[turn] ?? [])].sort((a, b) => a.localeCompare(b));
    const dispatchedSorted = [...step.dispatchedEventIds].sort((a, b) => a.localeCompare(b));
    const externalSet = new Set(externalSorted);
    const dispatchedSet = new Set(dispatchedSorted);
    const externalOnly = externalSorted.filter((id) => !dispatchedSet.has(id));
    const scheduledOnly = dispatchedSorted.filter((id) => !externalSet.has(id));
    const ok = externalOnly.length === 0 && scheduledOnly.length === 0;
    mergeResults.push({
      turnIndex: turn,
      scheduledDueIds: dispatchedSorted,
      externalEventIds: externalSorted,
      externalOnly,
      scheduledOnly,
      ok,
    });
    if (!ok) failingTurns.push(turn);
  }

  return {
    steppedTurns,
    mergeResults,
    failingTurns,
    ok: failingTurns.length === 0,
  };
}
