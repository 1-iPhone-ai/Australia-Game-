import { TurnTimeSnapshot } from './types.js';
import { mergeExternalDayPlan, type ExternalDayPlanMergeResult } from './external-day-plan.js';

export interface ExternalDayPlanWindowMergeResult {
  fromTurn: number;
  toTurn: number;
  turnResults: ExternalDayPlanMergeResult[];
  ok: boolean;
  failingTurns: number[];
}

function normalizeTurnWindow(fromTurn: number, toTurn: number): { from: number; to: number } {
  const from = Math.max(1, Math.floor(fromTurn));
  const to = Math.max(from, Math.floor(toTurn));
  return { from, to };
}

/**
 * XS-02 extension: reconcile Agent 05 narrative ids across a turn window.
 */
export function mergeExternalDayPlanWindow(
  snapshot: TurnTimeSnapshot,
  fromTurn: number,
  toTurn: number,
  externalByTurn: Readonly<Record<number, readonly string[]>>,
  strict = true,
): ExternalDayPlanWindowMergeResult {
  const { from, to } = normalizeTurnWindow(fromTurn, toTurn);
  const turnResults: ExternalDayPlanMergeResult[] = [];
  const failingTurns: number[] = [];

  for (let turn = from; turn <= to; turn += 1) {
    const externalEventIds = externalByTurn[turn] ?? [];
    const row = mergeExternalDayPlan(snapshot, turn, [...externalEventIds], strict);
    turnResults.push(row);
    if (!row.ok) failingTurns.push(turn);
  }

  return {
    fromTurn: from,
    toTurn: to,
    turnResults,
    ok: failingTurns.length === 0,
    failingTurns,
  };
}
